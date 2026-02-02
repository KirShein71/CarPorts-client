import React from 'react';
import Header from '../Header/Header';
import { Table, Modal, Button } from 'react-bootstrap';
import { fetchAllWarehouseAssortments } from '../../http/warehouseAssortmentApi';
import {
  fetchAllShipmentWarehouse,
  createShipmentWarehouse,
  deleteOneShipmentWarehouse,
} from '../../http/shipmentWarehouseApi';
import CreateWarehouseAssortmentProject from './modals/CreateWarehouseAssortmentProject';
import UpdateQuantityWarehouseDetail from './modals/UpdateQuantityWarehouseDetail';
import CreateNote from './modals/CreateNote';

import './style.scss';

const defaultValue = { done: '', warehouse_assortement: '' };
const defaultValid = {
  done: null,
  warehouse_assortement: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'done') result.done = value.done.trim() !== '';
    if (key === 'warehouse_assortement')
      result.warehouse_assortement = value.warehouse_assortement.trim() !== '';
  }
  return result;
};

function ShipmentWarehouseComponent() {
  const [warehouseAssortements, setWarehouseAssortements] = React.useState([]);
  const [shipmentWarehouses, setShipmentWarehouses] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [openModalCreateWarehouseModal, setOpenCreateWarehouseModal] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [existingWarehouseDetailIds, setExistingWarehouseDetailIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [shipmentWarehouseToDelete, setShipmentWarehouseToDelete] = React.useState(null);
  const [shipmentWarehouseId, setShipmentWarehouseId] = React.useState(null);
  const [modalUpdateQuantityWarehouseDetail, setModalQuantityWarehouseDetail] =
    React.useState(false);
  const [projectWarehouseId, setProjectWarehouseId] = React.useState(null);
  const [modalCreateNote, setModalCreateNote] = React.useState(false);

  React.useEffect(() => {
    Promise.all([fetchAllWarehouseAssortments(), fetchAllShipmentWarehouse()])
      .then(([warehouseData, projectData]) => {
        setWarehouseAssortements(warehouseData);
        setShipmentWarehouses(projectData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, [change]);

  React.useEffect(() => {
    const filteredProjects = shipmentWarehouses.filter((project) => {
      // Поиск ТОЛЬКО по названию проекта
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтрация по статусу проекта
      if (buttonActiveProject && buttonClosedProject) {
        // Если обе кнопки активны - показываем все проекты
        return matchesSearch;
      }

      if (buttonActiveProject) {
        return matchesSearch && project.project.finish === null;
      }

      if (buttonClosedProject) {
        return matchesSearch && project.project.finish === 'true';
      }

      return matchesSearch;
    });

    setFilteredProjects(filteredProjects);
  }, [shipmentWarehouses, buttonActiveProject, buttonClosedProject, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleActiveProjects = () => {
    setButtonActiveProject(true);
    setButtonClosedProject(false);
  };

  const handleToggleClosedProjects = () => {
    setButtonActiveProject(false);
    setButtonClosedProject(true);
  };

  const handleOpenCreateWarehouseProjectModal = (shipProject) => {
    const projectId = shipProject.projectId || shipProject.id;

    // Собираем массив ID деталей, которые уже есть в проекте
    // Проверяем как orders, так и shipments
    const existingIds = [];

    // Добавляем ID из orders
    if (shipProject.orders && shipProject.orders.length > 0) {
      shipProject.orders.forEach((order) => {
        if (order.warehouse_assortement_id) {
          existingIds.push(order.warehouse_assortement_id);
        }
      });
    }

    // Добавляем ID из shipments
    if (shipProject.shipments && shipProject.shipments.length > 0) {
      shipProject.shipments.forEach((shipment) => {
        if (shipment.warehouse_assortement_id) {
          existingIds.push(shipment.warehouse_assortement_id);
        }
      });
    }

    setProject(projectId);
    setExistingWarehouseDetailIds(existingIds);
    setOpenCreateWarehouseModal(true);
  };

  // Функция для получения складских ассортиментов с заказами для конкретного проекта
  const getWarehouseAssortmentsWithOrders = (project) => {
    if (!project || !project.orders || project.orders.length === 0) {
      return [];
    }

    // Создаем Set для быстрого поиска
    const orderWarehouseIds = new Set(
      project.orders.map((order) => order.warehouse_assortement_id),
    );

    // Фильтруем ассортименты, оставляем только те, у которых есть заказы
    return warehouseAssortements
      .filter((wareAssort) => orderWarehouseIds.has(wareAssort.id))
      .sort((a, b) => a.number - b.number); // Сортируем по номеру если нужно
  };

  const handleDoneShipmentWarehouse = (projectId, warehouse_assortement_id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('done', 'true');
    data.append('projectId', projectId);
    data.append('warehouse_assortement_id', warehouse_assortement_id);

    setIsLoading(true);
    createShipmentWarehouse(data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenModalUpdateQuantityWarehouseDetail = (id) => {
    setProjectWarehouseId(id);
    setModalQuantityWarehouseDetail(true);
  };

  const handleCreateNoteShipmentWarehouse = (id) => {
    setShipmentWarehouseId(id);
    setModalCreateNote(true);
  };

  const handleDeleteShipmentWarehouse = (id) => {
    setShipmentWarehouseToDelete(id);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (shipmentWarehouseToDelete) {
      deleteOneShipmentWarehouse(shipmentWarehouseToDelete)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setShipmentWarehouseToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setShipmentWarehouseToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setShipmentWarehouseToDelete(null);
  };

  return (
    <div className="shipment-warehouse">
      <Header title={'Отгрузка со склад'} />
      <CreateWarehouseAssortmentProject
        show={openModalCreateWarehouseModal}
        setShow={setOpenCreateWarehouseModal}
        projectId={project}
        setChange={setChange}
        existingWarehouseDetailIds={existingWarehouseDetailIds}
      />
      <UpdateQuantityWarehouseDetail
        show={modalUpdateQuantityWarehouseDetail}
        setShow={setModalQuantityWarehouseDetail}
        setChange={setChange}
        id={projectWarehouseId}
      />
      <CreateNote
        show={modalCreateNote}
        setShow={setModalCreateNote}
        id={shipmentWarehouseId}
        setChange={setChange}
      />
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение отмены</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите отменить отгрузку ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="shipment-warehouse__filter">
        <button
          onClick={handleToggleActiveProjects}
          className={`shipment-warehouse__button-active ${
            buttonActiveProject === true ? 'active' : 'inactive'
          }`}>
          Активные
        </button>
        <button
          onClick={handleToggleClosedProjects}
          className={`shipment-warehouse__button-noactive ${
            buttonClosedProject === true ? 'active' : 'inactive'
          }`}>
          Завершенные
        </button>
        <input
          className="shipment-warehouse__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="shipment-warehouse__content">
        {filteredProjects.map((shipProject) => {
          // Получаем ассортименты с заказами для текущего проекта
          const projectAssortments = getWarehouseAssortmentsWithOrders(shipProject);

          // Если у проекта нет заказов, не показываем таблицу
          if (projectAssortments.length === 0) {
            return null;
          }

          return (
            <div className="shipment-warehouse__container">
              <div key={shipProject.projectId}>
                <Table className="shipment-warehouse__table">
                  <thead>
                    <tr>
                      <th className="shipment-warehouse__table-th">
                        {shipProject.project.name} {shipProject.project.number}
                      </th>
                      <th className="shipment-warehouse__table-th quantity">Кол-во</th>
                      <th className="shipment-warehouse__table-th weigth">Вес</th>
                      <th className="shipment-warehouse__table-th done"></th>
                      <th className="shipment-warehouse__table-th note">Ком-ий</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectAssortments
                      .filter((wareName) => {
                        // Фильтруем сразу, а не внутри map
                        return shipProject.orders.some(
                          (order) => order.warehouse_assortement_id === wareName.id,
                        );
                      })
                      .map((wareName) => {
                        // Используем find один раз, сохраняем в переменные
                        const orderForWarehouse = shipProject.orders.find(
                          (order) => order.warehouse_assortement_id === wareName.id,
                        );
                        const shipmentForWarehouse = shipProject.shipments.find(
                          (shipment) => shipment.warehouse_assortement_id === wareName.id,
                        );

                        // Эти вычисления можно вынести или мемоизировать
                        const weight = orderForWarehouse
                          ? orderForWarehouse.quantity * wareName.weight
                          : 0;
                        const isDone = shipmentForWarehouse && shipmentForWarehouse.done;
                        const hasNote = shipmentForWarehouse && shipmentForWarehouse.note;

                        return (
                          <tr key={wareName.id}>
                            <td className="shipment-warehouse__table-td">{wareName.name}</td>
                            <td
                              onClick={() =>
                                handleOpenModalUpdateQuantityWarehouseDetail(orderForWarehouse.id)
                              }
                              className="shipment-warehouse__table-td quantity">
                              {orderForWarehouse.quantity}
                            </td>
                            <td className="shipment-warehouse__table-td weight">{weight}</td>
                            {isDone ? (
                              <td
                                className="shipment-warehouse__table-td done"
                                onClick={() =>
                                  handleDeleteShipmentWarehouse(shipmentForWarehouse.id)
                                }>
                                <img src="./img/done.png" alt="Отгружено" />
                              </td>
                            ) : (
                              <td
                                className="shipment-warehouse__table-td no-done"
                                onClick={() =>
                                  handleDoneShipmentWarehouse(
                                    shipProject.projectId,
                                    orderForWarehouse.warehouse_assortement_id,
                                  )
                                }
                              />
                            )}
                            <td
                              className="shipment-warehouse__table-td note"
                              onClick={() =>
                                handleCreateNoteShipmentWarehouse(shipmentForWarehouse.id)
                              }>
                              {hasNote ? shipmentForWarehouse.note : ''}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                <button
                  onClick={() => handleOpenCreateWarehouseProjectModal(shipProject)}
                  className="shipment-warehouse__button-added">
                  Добавить
                </button>
              </div>
              {shipProject.exceeded.length > 0 ? (
                <div className="shipment-warehouse__unloaded">
                  <div className="shipment-warehouse__unloaded-title">Неотгруженные</div>
                  <Table bordered className="shipment-warehouse__unloaded-table">
                    <thead>
                      <tr>
                        <th className="shipment-warehouse__unloaded-th">Деталь</th>
                        <th className="shipment-warehouse__unloaded-th quantity">Кол-во</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectAssortments.map((wareName) => {
                        // Находим заказ для этого ассортимента
                        const exceededForWarehouse = shipProject.exceeded.find(
                          (exceeded) => exceeded.warehouse_assortement_id === wareName.id,
                        );

                        if (!exceededForWarehouse) {
                          return null;
                        }
                        return (
                          <tr>
                            <td className="shipment-warehouse__unloaded-td">{wareName.name}</td>
                            <td className="shipment-warehouse__unloaded-td quantity">
                              {exceededForWarehouse.exceeded_quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShipmentWarehouseComponent;
