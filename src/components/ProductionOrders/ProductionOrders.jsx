import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { fetchAllProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllDeliveryDetails } from '../../http/deliveryDetailsApi';
import CreateAntypical from '../ProductionList/modal/CreateAntypical';
import CreateName from './modals/CreateName';
import CreateColor from './modals/CreateColor';
import CreateAntypicalsQuantity from './modals/CreateAntypicalsQuantity';
import UpdateProjectDetails from '../ProductionList/modal/UpdateProjectDetails';
import UpdateShipmentDetails from '../ShipmentList/modals/updateShipmentDetails';
import CreateOneShipmentDetail from '../ShipmentList/modals/createOneShipmentDetail';
import UpdateDeliveryDetail from '../DeliveryDetails/modals/updateDeliveryDetail';
import CreateOneDeliveryDetail from '../DeliveryDetails/modals/createOneDeliveryDetail';
import CreateAntypicalsDeliveryQuantity from './modals/CreateAntypicalsDeliveryQuantity';
import CreateAntypicalsShipmentQuantity from './modals/CreateAntypicalsShipmentQuantity';
import CreateColorDetails from './modals/CreateColorDetails';
import CreateProjectDetails from './modals/CreateProjectDetails';

import './style.scss';

function ProductionOrders() {
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [openModalCreateAntypical, setOpenModalCreateAntypical] = React.useState(false);
  const [openModalCreateAntypicalColor, setOpenModalCreateAntypicalColor] = React.useState(false);
  const [openModalCreateAntypicalName, setOpenModalCreateAntypicalName] = React.useState(false);
  const [openModalCreateAntypicalsQuantity, setOpenModalCreateAntypicalsQuantity] =
    React.useState(false);
  const [project, setProject] = React.useState(null);
  const [antypicalId, setAntypicalId] = React.useState(null);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [projectDetail, setProjectDetail] = React.useState(null);
  const [updateProjectDetailsModal, setUpdateProjectDetailsModal] = React.useState(false);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [modalUpdateShimpentDetails, setModalUpdateShimpentDetails] = React.useState(false);
  const [modalCreateOneShipmentDetails, setModalCreateOneShipmentDetails] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [modalUpdateDeliveryDetails, setModalUpdateDeliveryDetails] = React.useState(false);
  const [modalCreateOneDeliveryDetails, setModalCreateOneDeliveryDetails] = React.useState(false);
  const [deliveryDetail, setDeliveryDetail] = React.useState(null);
  const [deliveryDetails, setDeliveryDetails] = React.useState([]);
  const [openModalCreateAntypicalsShipmentQuantity, setOpenModalCreateAntypicalsShipmentQuantity] =
    React.useState(false);
  const [openModalCreateAntypicalsDeliveryQuantity, setOpenModalCreateAntypicalsDeliveryQuantity] =
    React.useState(false);
  const [openModalCreateDetailColor, setOpenModalCreateDetailColor] = React.useState(false);
  const [openModalCreateProjectDetails, setOpenModalCreateProjectDetails] = React.useState(false);
  const [existingDetailIds, setExistingDetailIds] = React.useState([]);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projectDetails, nameDetails, shipmentDetails, deliveryDetails] = await Promise.all([
          fetchAllProjectDetails(),
          fetchAllDetails(),
          fetchAllShipmentDetails(),
          fetchAllDeliveryDetails(),
        ]);

        setProjectDetails(projectDetails);
        setShipmentDetails(shipmentDetails);
        setNameDetails(nameDetails);
        setDeliveryDetails(deliveryDetails);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
    };

    const filteredProjects = projectDetails.filter((project) => {
      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.project.finish === null
        : filters.isClosed
          ? project.project.finish === 'true'
          : true;

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        // Если обе кнопки активны - показываем все проекты
        return true;
      }

      return isActiveProject;
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
  }, [projectDetails, buttonActiveProject, buttonClosedProject, shipmentDetails]);

  // Фильтруем детали, которые есть в проектах или shipment
  const getFilteredDetails = React.useCallback(
    (projectId, projectProps) => {
      // Находим shipment для данного проекта
      const shipmentForProject = shipmentDetails.find(
        (shipDetail) => shipDetail.projectId === projectId,
      );
      const shipmentProps = shipmentForProject?.props || [];

      // Фильтруем детали, которые есть хотя бы в одном из источников
      return nameDetails
        .filter((part) => {
          // Проверяем, есть ли деталь в projectProps
          const inProject = projectProps.some((prop) => prop.detailId === part.id);

          // Проверяем, есть ли деталь в shipmentProps
          const inShipment = shipmentProps.some((prop) => prop.detailId === part.id);

          // Возвращаем true, если деталь есть хотя бы в одном из источников
          return inProject || inShipment;
        })
        .sort((a, b) => a.number - b.number); // Сортируем по номеру
    },
    [nameDetails, shipmentDetails],
  );

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCreateAntypical = (project) => {
    setProject(project);
    setOpenModalCreateAntypical(true);
  };

  const handleCreateAntypicalName = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalName(true);
  };

  const handleCreateAntypicalColor = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalColor(true);
  };

  const handleCreateAntypicalsQuantity = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalsQuantity(true);
  };

  const handleCreateAntypicalsShipmentQuantity = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalsShipmentQuantity(true);
  };

  const handleCreateAntypicalsDeliveryQuantity = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalsDeliveryQuantity(true);
  };

  const handleCreateDetailColor = (id) => {
    setProjectDetail(id);
    setOpenModalCreateDetailColor(true);
  };

  const handleCreateProjectDetails = (proDetail) => {
    const projectId = proDetail.id || proDetail.projectId;
    const projectProps = proDetail.props || [];

    // Собираем массив ID деталей, которые уже есть в проекте
    const existingIds = projectProps.map((prop) => prop.detailId).filter((id) => id);

    setProject(projectId);
    setExistingDetailIds(existingIds);
    setOpenModalCreateProjectDetails(true);
  };

  const handleUpdateProjectDetailClick = (id) => {
    setProjectDetail(id);
    setUpdateProjectDetailsModal(true);
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

  const handleButtonActiveProject = () => {
    setButtonActiveProject(true);
    setButtonClosedProject(false);
  };

  const handleButtonClosedProject = () => {
    setButtonActiveProject(false);
    setButtonClosedProject(true);
  };

  return (
    <div className="production-orders">
      <CreateAntypical
        show={openModalCreateAntypical}
        setShow={setOpenModalCreateAntypical}
        setChange={setChange}
        projectId={project}
        scrollPosition={scrollPosition}
      />
      <CreateName
        show={openModalCreateAntypicalName}
        setShow={setOpenModalCreateAntypicalName}
        setChange={setChange}
        id={antypicalId}
        scrollPosition={scrollPosition}
      />
      <CreateColor
        show={openModalCreateAntypicalColor}
        setShow={setOpenModalCreateAntypicalColor}
        setChange={setChange}
        id={antypicalId}
        scrollPosition={scrollPosition}
      />
      <CreateAntypicalsQuantity
        show={openModalCreateAntypicalsQuantity}
        setShow={setOpenModalCreateAntypicalsQuantity}
        setChange={setChange}
        id={antypicalId}
        scrollPosition={scrollPosition}
      />
      <CreateAntypicalsShipmentQuantity
        show={openModalCreateAntypicalsShipmentQuantity}
        setShow={setOpenModalCreateAntypicalsShipmentQuantity}
        setChange={setChange}
        id={antypicalId}
        scrollPosition={scrollPosition}
      />
      <CreateAntypicalsDeliveryQuantity
        show={openModalCreateAntypicalsDeliveryQuantity}
        setShow={setOpenModalCreateAntypicalsDeliveryQuantity}
        setChange={setChange}
        id={antypicalId}
        scrollPosition={scrollPosition}
      />
      <CreateColorDetails
        show={openModalCreateDetailColor}
        setShow={setOpenModalCreateDetailColor}
        setChange={setChange}
        id={projectDetail}
        scrollPosition={scrollPosition}
      />
      <CreateProjectDetails
        projectId={project}
        show={openModalCreateProjectDetails}
        setShow={setOpenModalCreateProjectDetails}
        setChange={setChange}
        existingDetailIds={existingDetailIds}
      />
      <UpdateProjectDetails
        id={projectDetail}
        show={updateProjectDetailsModal}
        setShow={setUpdateProjectDetailsModal}
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
      <Header title={'Заказы на производство'} />

      <>
        <div className="production-orders__filter">
          <button
            className={`production-orders__button-active ${
              buttonActiveProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonActiveProject}>
            Активные
          </button>
          <button
            className={`production-orders__button-noactive ${
              buttonClosedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonClosedProject}>
            Завершенные
          </button>
        </div>
        <div className="production-orders__table-container">
          {filteredProjects.map((proDetail) => {
            const project = proDetail.project || {};
            const projectProps = proDetail.props || [];
            const projectId = proDetail.id || proDetail.projectId;

            // Получаем отфильтрованные детали для этого проекта
            const filteredDetails = getFilteredDetails(projectId, projectProps);

            // Если нет деталей с данными - не показываем проект
            if (filteredDetails.length === 0) {
              return null;
            }

            return (
              <Table className="production-orders__table" bordered>
                <thead>
                  <tr>
                    <th className="production-orders__projectName" colSpan={4}>
                      {project.name || ''}
                    </th>
                    <th
                      colSpan={2}
                      onClick={() => handleCreateProjectDetails(proDetail)}
                      style={{ backgroundColor: '#000000' }}
                      className="production-orders__added">
                      Добавить
                    </th>
                  </tr>
                  <tr>
                    <th className="production-orders__columnNumber">{project.number || ''}</th>
                    <th className="production-orders__columnColor"></th>
                    <th className="production-orders__columnName">Заказ</th>
                    <th className="production-orders__columnName">Произведено</th>
                    <th className="production-orders__columnName">Покраска</th>
                    <th className="production-orders__columnName">На объекте</th>
                  </tr>
                </thead>
                <tbody className="production-orders__body">
                  <React.Fragment key={proDetail.id || proDetail.projectId}>
                    {/* Строки с деталями и количеством - ОТСОРТИРОВАННЫЕ */}
                    {filteredDetails
                      .sort((a, b) => {
                        // Находим detailProject для каждой детали
                        const detailA = projectProps.find((prop) => prop.detailId === a.id);
                        const detailB = projectProps.find((prop) => prop.detailId === b.id);

                        // Получаем ID деталей для сортировки
                        const detailIdA = detailA ? parseInt(detailA.detailId) : parseInt(a.id);
                        const detailIdB = detailB ? parseInt(detailB.detailId) : parseInt(b.id);

                        // Сортируем по возрастанию detail_id
                        return detailIdA - detailIdB;
                      })
                      .map((part) => {
                        const detailProject = projectProps.find(
                          (prop) => prop.detailId === part.id,
                        );
                        const quantity = detailProject ? detailProject.quantity : '';
                        const colorDetail = detailProject ? detailProject.color : '';

                        // Находим shipment для данного проекта
                        const shipmentForProject = shipmentDetails.find(
                          (shipDetail) => shipDetail.projectId === projectId,
                        );

                        // Получаем shipment_quantity и detailShipment
                        let quantityShipment = '';
                        let detailShipment = null;

                        if (shipmentForProject && shipmentForProject.props) {
                          detailShipment = shipmentForProject.props.find(
                            (prop) => prop.detailId === part.id,
                          );
                          quantityShipment = detailShipment ? detailShipment.shipment_quantity : '';
                        }

                        // Находим delivery для данного проекта
                        const deliveryForProject = deliveryDetails.find(
                          (delDetail) => delDetail.projectId === projectId,
                        );

                        // Получаем shipment_quantity и detailShipment
                        let quantityDelivery = '';
                        let detailDelivery = null;

                        if (deliveryForProject && deliveryForProject.props) {
                          detailDelivery = deliveryForProject.props.find(
                            (prop) => prop.detailId === part.id,
                          );
                          quantityDelivery = detailDelivery ? detailDelivery.delivery_quantity : '';
                        }

                        return (
                          <tr key={`${proDetail.id || proDetail.projectId}-${part.id}`}>
                            <td className="production-orders__detailName">{part.name}</td>
                            <td
                              className="production-orders__detailColor"
                              onClick={() => handleCreateDetailColor(detailProject?.id)}>
                              {colorDetail ? (
                                colorDetail
                              ) : (
                                <div className="production-orders__detailColor plus">+</div>
                              )}
                            </td>
                            <td
                              className="production-orders__quantityDetail"
                              onClick={() => handleUpdateProjectDetailClick(detailProject?.id)}>
                              {quantity ? (
                                quantity
                              ) : (
                                <div className="production-orders__quantityDetail plus">+</div>
                              )}
                            </td>
                            <td></td>
                            <td
                              className="production-orders__quantityDetail"
                              onClick={() => {
                                if (detailShipment?.id) {
                                  handleOpenModalUpdateShipmentDetails(detailShipment.id);
                                } else if (shipmentForProject) {
                                  handleOpenModalCreateOneShipmentDetail(
                                    part.id,
                                    shipmentForProject.projectId,
                                    shipmentForProject.shipment_date,
                                  );
                                } else {
                                  handleOpenModalCreateOneShipmentDetail(part.id, projectId);
                                }
                              }}>
                              {quantityShipment ? (
                                quantityShipment
                              ) : (
                                <div className="production-orders__quantityDetail plus">+</div>
                              )}
                            </td>
                            <td
                              className="production-orders__quantityDetail"
                              onClick={() => {
                                if (detailDelivery?.id) {
                                  handleOpenModalUpdateDeliveryDetails(detailDelivery.id);
                                } else if (deliveryForProject) {
                                  handleOpenModalCreateOneDeliveryDetail(
                                    part.id,
                                    deliveryForProject.projectId,
                                  );
                                } else {
                                  handleOpenModalCreateOneDeliveryDetail(part.id, projectId);
                                }
                              }}>
                              {quantityDelivery ? (
                                quantityDelivery
                              ) : (
                                <div className="production-orders__quantityDetail plus">+</div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                    <tr>
                      <td
                        className="production-orders__antypicalTitle"
                        onClick={() => handleCreateAntypical(proDetail.projectId)}>
                        Нетиповые
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {proDetail.antypical
                      .sort((a, b) => {
                        // Сортируем нетиповые по ID (чтобы новые были внизу)
                        return a.id - b.id;
                      })
                      .map((antypDetails) => (
                        <tr key={antypDetails.id}>
                          <td
                            className="production-orders__antypicalName"
                            onClick={() => handleCreateAntypicalName(antypDetails.id)}>
                            {antypDetails.name === '' || antypDetails.name === null ? (
                              <div className="production-orders__antypicalName plus">+</div>
                            ) : (
                              antypDetails.name
                            )}
                          </td>
                          <td
                            className="production-orders__antypicalColor"
                            onClick={() => handleCreateAntypicalColor(antypDetails.id)}>
                            {antypDetails.color === '' || antypDetails.color === null ? (
                              <div className="production-orders__antypicalColor plus">+</div>
                            ) : (
                              antypDetails.color
                            )}
                          </td>
                          <td
                            className="production-orders__quantityDetail"
                            onClick={() => handleCreateAntypicalsQuantity(antypDetails.id)}>
                            {antypDetails.antypicals_quantity === null ? (
                              <div className="production-orders__quantityDetail plus">+</div>
                            ) : (
                              antypDetails.antypicals_quantity
                            )}
                          </td>
                          <td className="production-orders__quantityDetail">
                            {antypDetails.antypicals_welders_quantity}
                          </td>
                          <td
                            className="production-orders__quantityDetail"
                            onClick={() => handleCreateAntypicalsShipmentQuantity(antypDetails.id)}>
                            {antypDetails.antypicals_shipment_quantity === null ? (
                              <div className="production-orders__quantityDetail plus">+</div>
                            ) : (
                              antypDetails.antypicals_shipment_quantity
                            )}
                          </td>
                          <td
                            className="production-orders__quantityDetail"
                            onClick={() => handleCreateAntypicalsDeliveryQuantity(antypDetails.id)}>
                            {antypDetails.antypicals_delivery_quantity === null ? (
                              <div className="production-orders__quantityDetail plus">+</div>
                            ) : (
                              antypDetails.antypicals_delivery_quantity
                            )}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                </tbody>
              </Table>
            );
          })}
        </div>
      </>
    </div>
  );
}

export default ProductionOrders;
