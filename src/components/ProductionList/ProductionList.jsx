import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, deleteProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllDeliveryDetails } from '../../http/deliveryDetailsApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import CreateOneProjectDetail from './modal/CreateOneProjectDetail';
import CreateAntypical from './modal/CreateAntypical';
import ImageModal from './modal/ImageModal';
import { AppContext } from '../../context/AppContext';
import UpdateShipmentDetails from '../ShipmentList/modals/updateShipmentDetails';
import CreateOneShipmentDetail from '../ShipmentList/modals/createOneShipmentDetail';
import UpdateDeliveryDetail from '../DeliveryDetails/modals/updateDeliveryDetail';
import CreateOneDeliveryDetail from '../DeliveryDetails/modals/createOneDeliveryDetail';

import './styles.scss';

function ProductionList() {
  const { user } = React.useContext(AppContext);
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [projectDetail, setProjectDetail] = React.useState(null);
  const [updateProjectDetailsModal, setUpdateProjectDetailsModal] = React.useState(false);
  const [createOneDetailModal, setCreateOneDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [createAntypical, setCreateAntypical] = React.useState(false);
  const [imageModal, setImageModal] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [deliveryDetails, setDeliveryDetails] = React.useState([]);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [buttonShippedProject, setButtonShippedProject] = React.useState(true);
  const [buttonNoShippedProject, setButtonNoShippedProject] = React.useState(true);
  const [buttonOrderedProject, setButtonOrderedProject] = React.useState(true);
  const [buttonNoOrderedProject, setButtonNoOrderedProject] = React.useState(true);
  const [modalUpdateShimpentDetails, setModalUpdateShimpentDetails] = React.useState(false);
  const [modalCreateOneShipmentDetails, setModalCreateOneShipmentDetails] = React.useState(false);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [modalUpdateDeliveryDetails, setModalUpdateDeliveryDetails] = React.useState(false);
  const [modalCreateOneDeliveryDetails, setModalCreateOneDeliveryDetails] = React.useState(false);
  const [deliveryDetail, setDeliveryDetail] = React.useState(null);
  const [hoveredColumn, setHoveredColumn] = React.useState(null);
  const [hoveredRowShipment, setHoveredRowShipment] = React.useState(null);
  const [hoveredRowDelivery, setHoveredRowDelivery] = React.useState(null);
  const [hoveredRowDetails, setHoveredRowDetails] = React.useState(null);

  React.useEffect(() => {
    fetchAllProjectDetails().then((data) => {
      setProjectDetails(data);
    });
    fetchAllShipmentDetails()
      .then((data) => setShipmentDetails(data))
      .finally(() => setFetching(false));
    fetchAllDeliveryDetails()
      .then((data) => setDeliveryDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
      isShipped: buttonShippedProject,
      isOrdered: buttonOrderedProject,
      isNoShipped: buttonNoShippedProject,
      isNoOrdered: buttonNoOrderedProject,
    };

    const filteredProjects = projectDetails.filter((project) => {
      // Условие для поиска по имени
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.project.finish === null
        : filters.isClosed
        ? project.project.finish === 'true'
        : true;

      // Функция для проверки реальных деталей (не null и не пустые значения)
      const hasRealDetails = () => {
        if (!project.props || !Array.isArray(project.props)) return false;

        return project.props.some(
          (prop) => prop.detailId !== null && prop.quantity !== null && prop.quantity !== 0,
        );
      };

      // Функция для удаления дубликатов props по detailId с проверкой на null
      const removeDuplicateProps = (propsArray) => {
        if (!propsArray || !Array.isArray(propsArray)) return [];

        const uniqueProps = [];
        const seenDetailIds = new Set();

        for (const prop of propsArray) {
          // Игнорируем записи с null значениями
          if (
            prop.detailId !== null &&
            prop.quantity !== null &&
            !seenDetailIds.has(prop.detailId)
          ) {
            seenDetailIds.add(prop.detailId);
            uniqueProps.push(prop);
          }
        }

        return uniqueProps;
      };

      // Новая логика проверки отгрузки с учетом деталей с quantity = 0
      const isShipped = () => {
        // Фильтруем props проекта, удаляя элементы с detailId = null или quantity = null и дубликаты
        const projectProps = removeDuplicateProps(
          (project.props || []).filter((prop) => prop.detailId !== null && prop.quantity !== null),
        );

        // Если нет деталей для проверки, считаем проект отгруженным
        if (projectProps.length === 0) return true;

        // Для каждой детали проекта проверяем статус отгрузки
        const allDetailsShipped = projectProps.every((projectProp) => {
          // Если количество в заказе = 0, считаем деталь автоматически отгруженной
          if (projectProp.quantity === 0) return true;

          // Ищем все отгрузки для этой детали
          const shipmentPropsForDetail = shipmentDetails
            .filter((shipment) => shipment.projectId === project.projectId)
            .flatMap((shipment) => shipment.props || [])
            .filter(
              (shipmentProp) =>
                shipmentProp.detailId === projectProp.detailId &&
                shipmentProp.shipment_quantity !== null,
            );

          // Суммируем количество отгруженных деталей
          const totalShipped = shipmentPropsForDetail.reduce(
            (sum, shipmentProp) => sum + (shipmentProp.shipment_quantity || 0),
            0,
          );

          // Проверяем, достаточно ли отгружено
          return totalShipped >= projectProp.quantity;
        });

        return allDetailsShipped;
      };

      // Фильтрация для отгрузки
      const matchesShippingFilter = () => {
        if (filters.isShipped && filters.isNoShipped) return true; // обе кнопки активны - показываем все
        if (filters.isShipped) return isShipped(); // только отгруженные
        if (filters.isNoShipped) return !isShipped(); // только не отгруженные
        return true; // ни одна кнопка не активна - показываем все
      };

      // Фильтрация для заказов
      const matchesOrderFilter = () => {
        if (filters.isOrdered && filters.isNoOrdered) return true; // обе кнопки активны - показываем все
        if (filters.isOrdered) return hasRealDetails(); // показываем только проекты с реальными деталями
        if (filters.isNoOrdered) return !hasRealDetails(); // только не заказанные (без реальных деталей)
        return true; // ни одна кнопка не активна - показываем все
      };

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        return matchesSearch && matchesShippingFilter() && matchesOrderFilter();
      }

      return matchesSearch && isActiveProject && matchesShippingFilter() && matchesOrderFilter();
    });

    // Сортируем проекты по приоритету отгрузки
    const sortedProjects = filteredProjects.sort((a, b) => {
      // Функция для определения статуса отгрузки проекта
      const getShippingStatus = (project) => {
        const projectDetails = (project.props || []).filter(
          (prop) => prop.detailId !== null && prop.quantity !== null && prop.quantity > 0, // Исключаем quantity = 0, так как они считаются отгруженными
        );

        if (projectDetails.length === 0) return 2; // нет деталей для отгрузки - нейтральный статус

        // Проверяем статус отгрузки для каждой детали
        const notShippedDetails = projectDetails.filter((projectProp) => {
          const shipmentPropsForDetail = shipmentDetails
            .filter((shipment) => shipment.projectId === project.projectId)
            .flatMap((shipment) => shipment.props || [])
            .filter(
              (shipmentProp) =>
                shipmentProp.detailId === projectProp.detailId &&
                shipmentProp.shipment_quantity !== null,
            );

          const totalShipped = shipmentPropsForDetail.reduce(
            (sum, shipmentProp) => sum + (shipmentProp.shipment_quantity || 0),
            0,
          );

          return totalShipped < projectProp.quantity;
        });

        if (notShippedDetails.length === projectDetails.length) {
          return 0; // не отгружено ни одной детали (высший приоритет)
        } else if (notShippedDetails.length > 0) {
          return 1; // отгружены не все детали (средний приоритет)
        } else {
          return 2; // все детали отгружены (низший приоритет)
        }
      };

      const aStatus = getShippingStatus(a);
      const bStatus = getShippingStatus(b);

      // Сортировка по приоритету: 0 > 1 > 2
      return aStatus - bStatus;
    });

    setFilteredProjects(sortedProjects);
  }, [
    projectDetails,
    buttonActiveProject,
    buttonClosedProject,
    buttonShippedProject,
    buttonOrderedProject,
    buttonNoShippedProject,
    buttonNoOrderedProject,
    searchQuery,
    shipmentDetails,
  ]);

  const handleUpdateProjectDetailClick = (id) => {
    setProjectDetail(id);
    setUpdateProjectDetailsModal(true);
  };

  const handleCreateOneDetail = (detailId, project) => {
    setDetailId(detailId);
    setProject(project);
    setCreateOneDetailModal(true);
  };

  const handleCreateAntypical = (project) => {
    setProject(project);
    setCreateAntypical(true);
  };

  const handleOpenImage = (projectId) => {
    setProject(projectId);

    setImageModal(true);
  };

  const handleButtonActiveProject = () => {
    const newButtonActiveProject = !buttonActiveProject;
    setButtonActiveProject(newButtonActiveProject);

    if (!newButtonActiveProject) {
      setButtonClosedProject(true);
    }
  };

  const handleButtonClosedProject = () => {
    const newButtonClosedProject = !buttonClosedProject;
    setButtonClosedProject(newButtonClosedProject);

    if (!newButtonClosedProject) {
      setButtonActiveProject(true);
    }
  };

  const handleButtonShippedProject = () => {
    setButtonShippedProject((prev) => !prev);
  };

  const handleButtonOrderedProject = () => {
    setButtonOrderedProject((prev) => !prev);
  };

  const handleButtonNoShippedProject = () => {
    setButtonNoShippedProject((prev) => !prev);
  };

  const handleButtonNoOrderedProject = () => {
    setButtonNoOrderedProject((prev) => !prev);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModalUpdateShipmentDetails = (id) => {
    setShipmentDetail(id);
    setModalUpdateShimpentDetails(true);
  };

  const handleOpenModalCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setModalCreateOneShipmentDetails(true);
  };

  const handleOpenModalUpdateDeliveryDetails = (id) => {
    setDeliveryDetail(id);
    setModalUpdateDeliveryDetails(true);
  };

  const handleOpenModalCreateOneDeliveryDetail = (detailId, project) => {
    setDetailId(detailId);
    setProject(project);

    setModalCreateOneDeliveryDetails(true);
  };

  const handleDeleteProjectDetails = (projectId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить?');
    if (confirmed) {
      deleteProjectDetails(projectId)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('строка удалена');
          }
        });
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionlist">
      <Header title={'Производство'} />

      <>
        <div className="production_filter">
          <Link to="/productionchange">
            <button className="button__production">Внести данные</button>
          </Link>
          <button
            className={`button__production-ordered ${
              buttonOrderedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonOrderedProject}>
            Заказанные
          </button>
          <button
            className={`button__production-ordered ${
              buttonNoOrderedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonNoOrderedProject}>
            Незаказанные
          </button>
          <button
            className={`button__production-shipped ${
              buttonShippedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonShippedProject}>
            Отгруженные
          </button>
          <button
            className={`button__production-shipped ${
              buttonNoShippedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonNoShippedProject}>
            Неотгруженные
          </button>
          <button
            className={`button__production-active ${
              buttonActiveProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonActiveProject}>
            Активные
          </button>
          <button
            className={`button__production-noactive ${
              buttonClosedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonClosedProject}>
            Завершенные
          </button>
          <input
            class="production__search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="production_filter-mobile">
          <button
            className={`button__production-orderedm ${
              buttonOrderedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonOrderedProject}>
            Заказанные
          </button>
          <button
            className={`button__production-orderedm ${
              buttonNoOrderedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonNoOrderedProject}>
            Незаказанные
          </button>
          <button
            className={`button__production-shippedm ${
              buttonShippedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonShippedProject}>
            Отгруженные
          </button>
          <button
            className={`button__production-shippedm ${
              buttonNoShippedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonNoShippedProject}>
            Неотгруженные
          </button>
        </div>
      </>
      <UpdateProjectDetails
        id={projectDetail}
        show={updateProjectDetailsModal}
        setShow={setUpdateProjectDetailsModal}
        setChange={setChange}
      />
      <CreateOneProjectDetail
        detailId={detailId}
        projectId={project}
        show={createOneDetailModal}
        setShow={setCreateOneDetailModal}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={project}
        shipmentDate={shipmentDate}
        show={modalCreateOneShipmentDetails}
        setShow={setModalCreateOneShipmentDetails}
        setChange={setChange}
      />
      <UpdateShipmentDetails
        id={shipmentDetail}
        show={modalUpdateShimpentDetails}
        setShow={setModalUpdateShimpentDetails}
        setChange={setChange}
      />
      <CreateOneDeliveryDetail
        detailId={detailId}
        projectId={project}
        show={modalCreateOneDeliveryDetails}
        setShow={setModalCreateOneDeliveryDetails}
        setChange={setChange}
      />
      <UpdateDeliveryDetail
        id={deliveryDetail}
        show={modalUpdateDeliveryDetails}
        setShow={setModalUpdateDeliveryDetails}
        setChange={setChange}
      />
      <CreateAntypical
        projectId={project}
        show={createAntypical}
        setShow={setCreateAntypical}
        setChange={setChange}
      />
      <ImageModal show={imageModal} setShow={setImageModal} id={project} />

      <div className="production-table-container">
        <div className="production-table-wrapper">
          <Table
            bordered
            size="md"
            className="production-table"
            style={{ border: '1px solid #dee2e6', borderCollapse: 'collapse' }}>
            <thead className="production-table__thead">
              <tr>
                <th className="production-th stat">Номер проекта</th>
                <th className="production-th mobile">Проект</th>
                {nameDetails
                  .sort((a, b) => a.number - b.number)
                  .map((part) => (
                    <th
                      className="production-th"
                      key={part.id}
                      onMouseEnter={() => setHoveredColumn(part.id)}
                      onMouseLeave={() => setHoveredColumn(null)}
                      style={{
                        backgroundColor: hoveredColumn === part.id ? '#d6d4d4' : '#ffffff',
                      }}>
                      {part.name}
                    </th>
                  ))}
                <th className="production-th stat">Нетиповые</th>
                <th className="production-th stat"></th>
              </tr>
            </thead>

            {filteredProjects.map((projectDetail, index) => {
              const correspondingShipment = shipmentDetails.find(
                (shipment) => shipment.projectId === projectDetail.projectId,
              );

              const correspondingDelivery = deliveryDetails.find(
                (delivery) => delivery.projectId === projectDetail.projectId,
              );

              return (
                <React.Fragment key={projectDetail.id}>
                  <tbody className="production-table__tbody">
                    <tr
                      className="production-table__row"
                      style={{
                        ...(correspondingDelivery ? { borderBottomColor: '#ffff' } : {}),
                        backgroundColor:
                          hoveredRowDetails === projectDetail.projectId ? '#d6d4d4' : 'transparent',
                      }}>
                      <td
                        style={{
                          color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                        }}>
                        {projectDetail.project ? projectDetail.project.number : ''}
                      </td>
                      <td
                        rowSpan={correspondingShipment ? 2 : 1}
                        style={{
                          color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                        }}
                        className="production__td mobile">
                        {projectDetail.project ? projectDetail.project.name : ''}
                      </td>

                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => {
                          const detailProject = projectDetail.props.find(
                            (prop) => prop.detailId === part.id,
                          );
                          const quantity = detailProject ? detailProject.quantity : '';

                          return (
                            <td
                              key={part.id}
                              className="production-detail"
                              onMouseEnter={() => {
                                setHoveredColumn(part.id);
                                setHoveredRowDetails(projectDetail.projectId);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumn(null);
                                setHoveredRowDetails(null);
                              }}
                              style={{
                                cursor: 'pointer',
                                color:
                                  projectDetail.project.finish === 'true' ? '#808080' : 'black',
                                backgroundColor:
                                  hoveredColumn === part.id ? '#d6d4d4' : 'transparent',
                              }}
                              onClick={() =>
                                quantity
                                  ? handleUpdateProjectDetailClick(detailProject.id)
                                  : handleCreateOneDetail(part.id, projectDetail.projectId)
                              }>
                              {quantity}
                            </td>
                          );
                        })}

                      <td className="production-actions">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div
                            onClick={() => handleCreateAntypical(projectDetail.projectId)}
                            style={{
                              cursor: 'pointer',
                              color: 'red',
                              fontWeight: 600,
                              paddingRight: '15px',
                            }}>
                            +
                          </div>
                          <div
                            onClick={() => handleOpenImage(projectDetail.projectId)}
                            className="production__eye">
                            {projectDetail.antypical.length > 0 ? (
                              <img src="./img/eye.png" alt="eye" />
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="production-delete">
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={() => handleDeleteProjectDetails(projectDetail.projectId)}>
                          Удалить
                        </Button>
                      </td>
                    </tr>

                    {correspondingShipment && (
                      <tr
                        className="production-table__row"
                        style={{
                          backgroundColor:
                            hoveredRowShipment === correspondingShipment.projectId
                              ? '#d6d4d4'
                              : 'transparent',
                        }}>
                        <td></td>
                        {nameDetails
                          .sort((a, b) => a.number - b.number)
                          .map((part) => {
                            const detail = correspondingShipment.props.find(
                              (el) => el.detailId === part.id,
                            );
                            const quantity = detail ? detail.shipment_quantity : '';
                            const detailProject = projectDetail.props.find(
                              (prop) => prop.detailId === part.id,
                            );
                            const quantityDetail = detailProject ? detailProject.quantity : '';

                            // Исправленное условие для окрашивания
                            const shouldHighlight =
                              quantityDetail > 0 && (quantity === 0 || quantity !== quantityDetail);

                            return (
                              <td
                                className="production-detailShipment"
                                onMouseEnter={() => {
                                  setHoveredColumn(part.id);
                                  setHoveredRowShipment(correspondingShipment.projectId);
                                }}
                                onMouseLeave={() => {
                                  setHoveredColumn(null);
                                  setHoveredRowShipment(null);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  color: '#808080',
                                  backgroundColor: shouldHighlight
                                    ? '#ffe6e6' // бледно-розовый если количества не совпадают
                                    : hoveredColumn === part.id
                                    ? '#d6d4d4'
                                    : 'transparent',
                                }}
                                key={part.id}
                                onClick={() =>
                                  quantity
                                    ? handleOpenModalUpdateShipmentDetails(detail.id)
                                    : handleOpenModalCreateOneShipmentDetail(
                                        part.id,
                                        correspondingShipment.projectId,
                                        correspondingShipment.shipment_date,
                                      )
                                }>
                                {quantity}
                              </td>
                            );
                          })}
                        <td></td>
                        <td></td>
                      </tr>
                    )}

                    {correspondingDelivery && (
                      <tr
                        className="production-table__row"
                        style={{
                          backgroundColor:
                            hoveredRowDelivery === correspondingDelivery.projectId
                              ? '#d6d4d4'
                              : 'transparent',
                        }}>
                        <td></td>
                        <td
                          style={{
                            color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                          }}
                          className="production__td mobile"></td>

                        {nameDetails
                          .sort((a, b) => a.number - b.number)
                          .map((part) => {
                            const detail = correspondingDelivery.props.find(
                              (el) => el.detailId === part.id,
                            );
                            const quantity = detail ? detail.delivery_quantity : '';

                            const detailProject = projectDetail.props.find(
                              (prop) => prop.detailId === part.id,
                            );
                            const quantityDetail = detailProject ? detailProject.quantity : '';

                            return (
                              <td
                                className="production-detailDelivery"
                                onMouseEnter={() => {
                                  setHoveredColumn(part.id);
                                  setHoveredRowDelivery(correspondingShipment.projectId);
                                }}
                                onMouseLeave={() => {
                                  setHoveredColumn(null);
                                  setHoveredRowDelivery(null);
                                }}
                                style={{
                                  color:
                                    projectDetail.project.finish === 'true'
                                      ? '#808080'
                                      : quantityDetail > quantity
                                      ? '#f12c4d'
                                      : '#000000',
                                  backgroundColor:
                                    hoveredColumn === part.id
                                      ? '#d6d4d4'
                                      : quantity
                                      ? quantityDetail > quantity
                                        ? '#ffc0cb'
                                        : 'transparent'
                                      : 'transparent',
                                }}
                                key={part.id}
                                onClick={() =>
                                  quantity
                                    ? handleOpenModalUpdateDeliveryDetails(detail.id)
                                    : handleOpenModalCreateOneDeliveryDetail(
                                        part.id,
                                        correspondingDelivery.projectId,
                                      )
                                }>
                                {quantity}
                              </td>
                            );
                          })}

                        <td></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                  <tbody style={{ borderColor: 'transparent' }}>
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                </React.Fragment>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductionList;
