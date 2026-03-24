import React from 'react';
import { fetchAllWarehouseAssortments } from '../../http/warehouseAssortmentApi';
import {
  getShipmentWarehouseForProject,
  createShipmentWarehouse,
  deleteOneShipmentWarehouse,
} from '../../http/shipmentWarehouseApi';
import CreateWarehouseAssortmentProject from './modals/CreateWarehouseAssortmentProject';
import UpdateQuantityWarehouseDetail from './modals/UpdateQuantityWarehouseDetail';
import { Modal, Button, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

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

function WarehouseProjectComponent() {
  const { projectId } = useParams();
  const [warehouseAssortements, setWarehouseAssortements] = React.useState([]);
  const [shipmentWarehouses, setShipmentWarehouses] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [openModalCreateWarehouseModal, setOpenCreateWarehouseModal] = React.useState(false);
  const [existingWarehouseDetailIds, setExistingWarehouseDetailIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [shipmentWarehouseToDelete, setShipmentWarehouseToDelete] = React.useState(null);
  const [modalUpdateQuantityWarehouseDetail, setModalQuantityWarehouseDetail] =
    React.useState(false);
  const [projectWarehouseId, setProjectWarehouseId] = React.useState(null);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    Promise.all([fetchAllWarehouseAssortments(), getShipmentWarehouseForProject(projectId)])
      .then(([warehouseData, projectData]) => {
        setWarehouseAssortements(warehouseData);
        setShipmentWarehouses(projectData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, [projectId, change]);

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

  const formatNumber = (number) => {
    if (!number && number !== 0) return '0';
    // Округляем до целого
    const rounded = Math.round(number);
    // Разделяем разряды пробелом
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="warehouse-project">
      {' '}
      <div className="warehouse-project__header">
        <Link to="/shipment-warehouse">
          <img className="warehouse-project__header-icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="warehouse-project__header-title">Подробная информация</h1>
      </div>
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
      <div className="warehouse-project__info">
        <Table className="warehouse-project__table">
          <thead>
            <tr>
              {' '}
              {[shipmentWarehouses]?.map((projectName) => (
                <th key={projectName.id} className="warehouse-project__table-th project">
                  {projectName.project ? projectName.project.name : ''}{' '}
                  {projectName.project ? projectName.project.number : ''}
                </th>
              ))}
              <th className="warehouse-project__table-th quantity">Кол-во</th>
              <th className="warehouse-project__table-th weigth">Вес</th>
              <th className="warehouse-project__table-th done"></th>
              <th className="warehouse-project__table-th note">Ком-ий</th>
            </tr>
          </thead>
          <tbody>
            {[shipmentWarehouses]?.map((shipOneProject) => {
              // Получаем ассортименты с заказами для текущего проекта
              const projectAssortments = getWarehouseAssortmentsWithOrders(shipOneProject);

              // Если у проекта нет заказов, не показываем таблицу
              if (projectAssortments.length === 0) {
                return null;
              }

              // Filter assortments that have orders
              const filteredAssortments = projectAssortments.filter((wareName) => {
                return shipOneProject.orders.some(
                  (order) => order.warehouse_assortement_id === wareName.id,
                );
              });

              return filteredAssortments.map((wareName) => {
                const orderForWarehouse = shipOneProject.orders.find(
                  (order) => order.warehouse_assortement_id === wareName.id,
                );
                const shipmentForWarehouse = shipOneProject.shipments.find(
                  (shipment) => shipment.warehouse_assortement_id === wareName.id,
                );

                const weight = orderForWarehouse
                  ? Math.round(orderForWarehouse.quantity * wareName.weight)
                  : 0;
                const isDone = shipmentForWarehouse && shipmentForWarehouse.done;

                return (
                  <tr key={wareName.id}>
                    <td className="warehouse-project__table-td">{wareName.name}</td>
                    <td
                      onClick={() =>
                        handleOpenModalUpdateQuantityWarehouseDetail(orderForWarehouse.id)
                      }
                      className="warehouse-project__table-td quantity">
                      {orderForWarehouse.quantity}
                    </td>
                    <td className="warehouse-project__table-td weight">{weight}</td>
                    {isDone ? (
                      <td
                        className="warehouse-project__table-td done"
                        onClick={() => handleDeleteShipmentWarehouse(shipmentForWarehouse.id)}>
                        <img src="../img/done.png" alt="Отгружено" />
                      </td>
                    ) : (
                      <td
                        className="warehouse-project__table-td no-done"
                        onClick={() =>
                          handleDoneShipmentWarehouse(
                            shipOneProject.projectId,
                            orderForWarehouse.warehouse_assortement_id,
                          )
                        }
                      />
                    )}
                    <td className="warehouse-project__table-td note">{orderForWarehouse.note}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </Table>

        {[shipmentWarehouses]?.map((shipOneProject) => {
          // Получаем ассортименты с заказами для текущего проекта
          const projectAssortments = getWarehouseAssortmentsWithOrders(shipOneProject);

          return (
            <React.Fragment key={shipOneProject.id}>
              <button
                onClick={() => handleOpenCreateWarehouseProjectModal(shipOneProject)}
                className="warehouse-project__button-added">
                Добавить
              </button>
              <div className="warehouse-project__totalWeigth">
                Общий вес: {formatNumber(shipOneProject.totalWeight)} кг
              </div>
              <div className="warehouse-project__totalCost">
                Общая стоимость: {formatNumber(shipOneProject.totalCost)} руб
              </div>
              {shipOneProject.exceeded && shipOneProject.exceeded.length > 0 && (
                <div className="warehouse-project__unloaded">
                  <div className="warehouse-project__unloaded-title">Неотгруженные</div>
                  <Table bordered className="warehouse-project__unloaded-table">
                    <thead>
                      <tr>
                        <th className="warehouse-project__unloaded-th">Деталь</th>
                        <th className="warehouse-project__unloaded-th quantity">Кол-во</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectAssortments.map((wareName) => {
                        const exceededForWarehouse = shipOneProject.exceeded.find(
                          (exceeded) => exceeded.warehouse_assortement_id === wareName.id,
                        );

                        if (!exceededForWarehouse) {
                          return null;
                        }
                        return (
                          <tr key={wareName.id}>
                            <td className="warehouse-project__unloaded-td">{wareName.name}</td>
                            <td className="warehouse-project__unloaded-td quantity">
                              {exceededForWarehouse.exceeded_quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default WarehouseProjectComponent;
