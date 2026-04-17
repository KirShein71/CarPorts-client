import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllProjectDetailForProject } from '../../http/projectDetailsApi';
import { getAllShipmentDetailForProject } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { getAllDeliveryDetailsForProject } from '../../http/deliveryDetailsApi';
import { getAllShipmentOrderForProject } from '../../http/shipmentOrderApi';
import { Link, useParams } from 'react-router-dom';
import CreateAntypical from '../ProductionList/modal/CreateAntypical';

import CreateColor from './modals/CreateColor';
import CreateAntypicalsQuantity from './modals/CreateAntypicalsQuantity';
import CreateOneProjectDetail from '../ProductionList/modal/CreateOneProjectDetail';
import UpdateProjectDetails from '../ProductionList/modal/UpdateProjectDetails';
import UpdateShipmentDetails from '../ShipmentList/modals/updateShipmentDetails';
import CreateOneShipmentDetail from '../ShipmentList/modals/createOneShipmentDetail';
import UpdateDeliveryDetail from '../DeliveryDetails/modals/updateDeliveryDetail';
import CreateOneDeliveryDetail from '../DeliveryDetails/modals/createOneDeliveryDetail';
import CreateAntypicalsDeliveryQuantity from './modals/CreateAntypicalsDeliveryQuantity';
import CreateAntypicalsShipmentQuantity from './modals/CreateAntypicalsShipmentQuantity';
import CreateColorDetails from './modals/CreateColorDetails';
import CreateProjectDetails from './modals/CreateProjectDetails';
import CreateAntypicalsWeldersQuantity from '../WeldersList/modals/CreateAntypicalsWeldersQuanity';
import CreateOneShipmentOrderDetail from './modals/CreateOneShipmentOrderDetail';
import UpdateShipmentOrderDetail from './modals/UpdateShipmentOrderDetail';
import ModalCreateOrder from './modals/ModalCreateOrder';
import ModalCreateNewShipmentOrder from './modals/ModalCreateNewShipmentOrder';
import CreateAntypicalShipmentOrder from './modals/CreateAntypicalShipmentOrder';
import ModalLink from './modals/ModalLink';
import ModalUpdateOrLook from './modals/ModalUpdateOrLook';

import './style.scss';

function ProductionProjectComponent() {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [deliveryDetails, setDeliveryDetails] = React.useState([]);
  const [shipmentOrders, setShipmentOrders] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [newColumnShipmentOrder, setNewColumnShipmentOrder] = React.useState(false);
  const [hoveredDetail, setHoveredDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Модальные окна
  const [openModalCreateAntypical, setOpenModalCreateAntypical] = React.useState(false);
  const [openModalCreateAntypicalColor, setOpenModalCreateAntypicalColor] = React.useState(false);
  const [openModalCreateAntypicalsQuantity, setOpenModalCreateAntypicalsQuantity] =
    React.useState(false);
  const [openModalCreateAntypicalsShipmentQuantity, setOpenModalCreateAntypicalsShipmentQuantity] =
    React.useState(false);
  const [openModalCreateAntypicalsDeliveryQuantity, setOpenModalCreateAntypicalsDeliveryQuantity] =
    React.useState(false);
  const [openModalCreateAntypicalsWeldersQuantity, setOpenModalCreateAntypicalsWeldersQuantity] =
    React.useState(false);
  const [openModalCreateDetailColor, setOpenModalCreateDetailColor] = React.useState(false);
  const [openModalCreateProjectDetails, setOpenModalCreateProjectDetails] = React.useState(false);
  const [modalCreateOneProjectDetails, setModalCreateOneProjectDetails] = React.useState(false);
  const [updateProjectDetailsModal, setUpdateProjectDetailsModal] = React.useState(false);
  const [modalUpdateShimpentDetails, setModalUpdateShimpentDetails] = React.useState(false);
  const [modalCreateOneShipmentDetails, setModalCreateOneShipmentDetails] = React.useState(false);
  const [modalUpdateDeliveryDetails, setModalUpdateDeliveryDetails] = React.useState(false);
  const [modalCreateOneDeliveryDetails, setModalCreateOneDeliveryDetails] = React.useState(false);
  const [modalCreateOneShipmentOrderDetail, setModalCreateOneShipmentOrderDetail] =
    React.useState(false);
  const [modalUpdateShipmentOrderDetail, setModalUpdateShipmentOrderDetail] = React.useState(false);
  const [modalCreateShipmentOrder, setModalCreateShipmentOrder] = React.useState(false);
  const [modalCreateNewShipmentOrder, setModalCreateNewShipmentOrder] = React.useState(false);
  const [modalCreateAntypicalShipmentOrder, setModalCreateAntypicalShipmentOrder] =
    React.useState(false);
  const [modalLink, setModalLink] = React.useState(false);
  const [modalUpdateOrLook, setModalUpdateOrLook] = React.useState(false);

  // Состояния для передачи в модалки
  const [antypicalId, setAntypicalId] = React.useState(null);
  const [antypicalsId, setAntypicalsId] = React.useState(null);
  const [projectDetail, setProjectDetail] = React.useState(null);
  const [detailId, setDetailId] = React.useState(null);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [deliveryDetail, setDeliveryDetail] = React.useState(null);
  const [oneShipmentOrderDetail, setOneShipmentOrderDetail] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [shipmentOrderDate, setShipmentOrderDate] = React.useState(null);
  const [detailColor, setDetailColor] = React.useState(null);
  const [antypicalName, setAntypicalName] = React.useState(null);
  const [antypicalImage, setAntypicalImage] = React.useState(null);
  const [flagShipmentOrder, setFlagShipmentOrder] = React.useState();
  const [existingDetailIds, setExistingDetailIds] = React.useState([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAllDetails(),
      getAllProjectDetailForProject(projectId),
      getAllShipmentDetailForProject(projectId),
      getAllDeliveryDetailsForProject(projectId),
      getAllShipmentOrderForProject(projectId),
    ])
      .then(
        ([
          detailsData,
          projectDetailsData,
          shipmentDetailsData,
          deliveryDetailsData,
          shipmentOrdersData,
        ]) => {
          setNameDetails(detailsData || []);
          setProjectDetails(projectDetailsData?.[0] || null);
          setShipmentDetails(shipmentDetailsData || []);
          setDeliveryDetails(deliveryDetailsData || []);
          setShipmentOrders(shipmentOrdersData || []);
        },
      )
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
        setNameDetails([]);
        setProjectDetails(null);
        setShipmentDetails([]);
        setDeliveryDetails([]);
        setShipmentOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, change]);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="production-project__loading">
        <div className="production-project__spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  const projects = projectDetails?.project || {};
  const projectProps = projectDetails?.props || [];
  const antypicalList = projectDetails?.antypical || [];
  const currentProjectId = projectDetails?.projectId || null;

  const projectShipmentOrders = shipmentOrders.filter(
    (order) => order?.projectId === currentProjectId,
  );

  const sortedShipmentOrders = [...projectShipmentOrders].sort(
    (a, b) => new Date(a?.shipment_date) - new Date(b?.shipment_date),
  );

  const existingDates = sortedShipmentOrders;
  const newColumn = newColumnShipmentOrder
    ? [
        {
          shipment_date: 'new',
          props: [],
          isNew: true,
        },
      ]
    : [];

  const datesCount = existingDates.length + newColumn.length;

  const getFilteredDetails = () => {
    const shipmentForProject = shipmentDetails.find(
      (shipDetail) => shipDetail?.projectId === currentProjectId,
    );
    const shipmentProps = shipmentForProject?.props || [];

    return nameDetails
      .filter((part) => {
        const inProject = projectProps.some((prop) => prop?.detailId === part?.id);
        const inShipment = shipmentProps.some((prop) => prop?.detailId === part?.id);
        return inProject || inShipment;
      })
      .sort((a, b) => (a?.number || 0) - (b?.number || 0));
  };

  const filteredDetails = getFilteredDetails();

  // Хендлеры - везде используем projectId из useParams
  const handleCreateAntypical = () => {
    setOpenModalCreateAntypical(true);
  };

  const handleOpenModalUpdateOrLook = (id, image) => {
    setAntypicalId(id);
    setAntypicalImage(image);
    setModalUpdateOrLook(true);
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

  const handleOpenModalCreateAntypicalsWeldersQuantity = (id) => {
    setAntypicalsId(id);
    setOpenModalCreateAntypicalsWeldersQuantity(true);
  };

  const handleCreateDetailColor = (id) => {
    setProjectDetail(id);
    setOpenModalCreateDetailColor(true);
  };

  const handleCreateProjectDetails = () => {
    const existingIds = projectProps.map((prop) => prop?.detailId).filter((id) => id);
    setExistingDetailIds(existingIds);
    setOpenModalCreateProjectDetails(true);
  };

  const handleOpenModalCreateOneProjectDetail = (detailId, projectIdParam) => {
    setDetailId(detailId);
    setModalCreateOneProjectDetails(true);
  };

  const handleUpdateProjectDetailClick = (id) => {
    setProjectDetail(id);
    setUpdateProjectDetailsModal(true);
  };

  const handleOpenModalUpdateShipmentDetails = (id) => {
    setShipmentDetail(id);
    setModalUpdateShimpentDetails(true);
  };

  const handleOpenModalCreateOneShipmentDetail = (detailId, projectIdParam, shipmentDateParam) => {
    setDetailId(detailId);
    setShipmentDate(shipmentDateParam);
    setModalCreateOneShipmentDetails(true);
  };

  const handleOpenModalUpdateShipmentOrderDetail = (id) => {
    setOneShipmentOrderDetail(id);
    setModalUpdateShipmentOrderDetail(true);
  };

  const handleOpenModalCreateOneShipmentOrderDetail = (
    detailIdParam,
    projectIdParam,
    shipment_date,
    detailColorParam,
  ) => {
    setDetailId(detailIdParam);
    setShipmentOrderDate(shipment_date);
    setDetailColor(detailColorParam);
    setModalCreateOneShipmentOrderDetail(true);
  };

  const handleOpenModalCreateAntypicalShipmentOrder = (
    name,
    projectIdParam,
    shipment_date,
    detailColorParam,
    image,
  ) => {
    setAntypicalName(name);
    setShipmentOrderDate(shipment_date);
    setDetailColor(detailColorParam);
    setAntypicalImage(image);
    setModalCreateAntypicalShipmentOrder(true);
  };

  const handleOpenModalUpdateDeliveryDetails = (id) => {
    setDeliveryDetail(id);
    setModalUpdateDeliveryDetails(true);
  };

  const handleOpenModalCreateOneDeliveryDetail = (detailIdParam, projectIdParam) => {
    setDetailId(detailIdParam);
    setModalCreateOneDeliveryDetails(true);
  };

  const handleOpenModalCreateShipmentOrder = (projectIdParam, flag) => {
    setFlagShipmentOrder(flag);
    setModalCreateShipmentOrder(true);
  };

  const handleOpenModalCreateNewShipmentOrder = () => {
    setModalCreateNewShipmentOrder(true);
  };

  const handleOpenModalLink = (projectIdParam, shipmentOrderDateParam) => {
    setShipmentOrderDate(shipmentOrderDateParam);
    setModalLink(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="production-project">
      {/* Модальные окна - везде передаем projectId вместо project */}
      <CreateAntypical
        show={openModalCreateAntypical}
        setShow={setOpenModalCreateAntypical}
        setChange={setChange}
        projectId={projectId}
        scrollPosition={scrollPosition}
      />
      <ModalUpdateOrLook
        show={modalUpdateOrLook}
        setShow={setModalUpdateOrLook}
        setChange={setChange}
        id={antypicalId}
        image={antypicalImage}
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
        projectId={projectId}
        show={openModalCreateProjectDetails}
        setShow={setOpenModalCreateProjectDetails}
        setChange={setChange}
        existingDetailIds={existingDetailIds}
      />
      <CreateOneProjectDetail
        detailId={detailId}
        projectId={projectId}
        show={modalCreateOneProjectDetails}
        setShow={setModalCreateOneProjectDetails}
        setChange={setChange}
      />
      <UpdateProjectDetails
        id={projectDetail}
        show={updateProjectDetailsModal}
        setShow={setUpdateProjectDetailsModal}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={projectId}
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
      <CreateOneShipmentOrderDetail
        detailId={detailId}
        projectId={projectId}
        show={modalCreateOneShipmentOrderDetail}
        setShow={setModalCreateOneShipmentOrderDetail}
        setChange={setChange}
        shipmentOrderDate={shipmentOrderDate}
        detailColor={detailColor}
        setNewColumnShipmentOrder={setNewColumnShipmentOrder}
      />
      <CreateAntypicalShipmentOrder
        antypicalName={antypicalName}
        image={antypicalImage}
        projectId={projectId}
        show={modalCreateAntypicalShipmentOrder}
        setShow={setModalCreateAntypicalShipmentOrder}
        setChange={setChange}
        shipmentOrderDate={shipmentOrderDate}
        detailColor={detailColor}
        setNewColumnShipmentOrder={setNewColumnShipmentOrder}
      />
      <UpdateShipmentOrderDetail
        id={oneShipmentOrderDetail}
        show={modalUpdateShipmentOrderDetail}
        setShow={setModalUpdateShipmentOrderDetail}
        setChange={setChange}
      />
      <CreateOneDeliveryDetail
        detailId={detailId}
        projectId={projectId}
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
      <CreateAntypicalsWeldersQuantity
        show={openModalCreateAntypicalsWeldersQuantity}
        setShow={setOpenModalCreateAntypicalsWeldersQuantity}
        id={antypicalsId}
        setChange={setChange}
      />
      <ModalCreateOrder
        show={modalCreateShipmentOrder}
        setShow={setModalCreateShipmentOrder}
        setChange={setChange}
        projectId={projectId}
        setNewColumnShipmentOrder={setNewColumnShipmentOrder}
        flag={flagShipmentOrder}
      />
      <ModalCreateNewShipmentOrder
        show={modalCreateNewShipmentOrder}
        setShow={setModalCreateNewShipmentOrder}
        setChange={setChange}
        projectId={projectId}
      />
      <ModalLink
        show={modalLink}
        setShow={setModalLink}
        projectId={projectId}
        date={shipmentOrderDate}
      />

      <div className="production-project__header">
        <Link to="/production-orders">
          <img className="production-project__header-icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="production-project__header-title">Подробная информация</h1>
      </div>

      <div className="production-project__table-container">
        <Table className="production-project__table" bordered>
          <thead>
            <tr>
              <th className="production-project__projectName" colSpan={4}>
                {projects.name || ''}
              </th>
              <th
                colSpan={2 + datesCount}
                onClick={handleCreateProjectDetails}
                style={{ backgroundColor: '#000000' }}
                className="production-project__added">
                Добавить
              </th>
            </tr>
            <tr>
              <th className="production-project__columnNumber">{projects.number || ''}</th>
              <th className="production-project__columnColor"></th>
              <th className="production-project__columnName">Заказ</th>
              <th className="production-project__columnName">Произведено</th>
              {projectShipmentOrders.length > 0 ? (
                <th
                  onClick={() => handleOpenModalCreateShipmentOrder(projectId, 'true')}
                  className="production-project__columnName"
                  colSpan={1 + datesCount}>
                  Покраска
                </th>
              ) : (
                <th
                  onClick={() => handleOpenModalCreateShipmentOrder(projectId, 'false')}
                  className="production-project__columnName"
                  colSpan={1 + datesCount}>
                  Покраска
                </th>
              )}
              <th className="production-project__columnName">Объект</th>
            </tr>
            {datesCount > 0 && (
              <tr>
                <th className="production-project__columnNumber"></th>
                <th className="production-project__columnColor"></th>
                <th className="production-project__columnName"></th>
                <th className="production-project__columnName"></th>
                <th className="production-project__columnName">общ</th>
                {existingDates.map((order) => {
                  if (order.shipment_date) {
                    return (
                      <th
                        key={order.shipment_date}
                        className="production-orders__columnName"
                        onClick={() => handleOpenModalLink(projectId, order.shipment_date)}>
                        {formatDate(order.shipment_date)}
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={order.shipment_date || 'new'}
                        className="production-orders__columnName"
                        onClick={() => handleOpenModalCreateNewShipmentOrder()}></th>
                    );
                  }
                })}
                {newColumn.map((order, index) => (
                  <th
                    key={`new-${index}`}
                    className="production-project__columnName"
                    onClick={() => handleOpenModalCreateNewShipmentOrder()}></th>
                ))}
                <th className="production-project__columnName"></th>
              </tr>
            )}
          </thead>
          <tbody className="production-project__body">
            {filteredDetails
              .sort((a, b) => {
                const detailA = projectProps.find((prop) => prop?.detailId === a?.id);
                const detailB = projectProps.find((prop) => prop?.detailId === b?.id);
                const detailIdA = detailA ? parseInt(detailA.detailId) : parseInt(a?.id);
                const detailIdB = detailB ? parseInt(detailB.detailId) : parseInt(b?.id);
                return detailIdA - detailIdB;
              })
              .map((part) => {
                const detailProject = projectProps.find((prop) => prop?.detailId === part?.id);
                const hasImage = part?.image && part.image.trim() !== '';
                const quantity = detailProject ? detailProject.quantity : '';
                const colorDetail = detailProject ? detailProject.color : '';

                const shipmentForProject = shipmentDetails.find(
                  (shipDetail) => shipDetail?.projectId === currentProjectId,
                );
                let quantityShipment = '';
                let detailShipment = null;
                if (shipmentForProject && shipmentForProject.props) {
                  detailShipment = shipmentForProject.props.find(
                    (prop) => prop?.detailId === part?.id,
                  );
                  quantityShipment = detailShipment ? detailShipment.shipment_quantity : '';
                }

                const deliveryForProject = deliveryDetails.find(
                  (del) => del?.projectId === currentProjectId,
                );
                let quantityDelivery = '';
                let detailDelivery = null;
                if (deliveryForProject && deliveryForProject.props) {
                  detailDelivery = deliveryForProject.props.find(
                    (prop) => prop?.detailId === part?.id,
                  );
                  quantityDelivery = detailDelivery ? detailDelivery.delivery_quantity : '';
                }

                return (
                  <tr key={`${currentProjectId}-${part?.id}`}>
                    <td
                      className="production-project__detailName"
                      style={{ position: 'relative', cursor: 'default' }}
                      onMouseEnter={() => hasImage && setHoveredDetail(part.id)}
                      onMouseLeave={() => setHoveredDetail(null)}>
                      {part?.name || ''}
                      {hoveredDetail === part?.id && hasImage && (
                        <div className="production-project__tooltip">
                          <img
                            src={`${process.env.REACT_APP_IMG_URL}${part.image}`}
                            alt={part.name}
                          />
                        </div>
                      )}
                    </td>
                    <td
                      className="production-project__detailColor"
                      onClick={() => handleCreateDetailColor(detailProject?.id)}>
                      {colorDetail ? (
                        colorDetail
                      ) : (
                        <div className="production-project__detailColor plus">+</div>
                      )}
                    </td>
                    <td
                      className="production-project__quantityDetail"
                      onClick={() => {
                        if (detailProject?.id) {
                          handleUpdateProjectDetailClick(detailProject?.id);
                        } else if (detailProject) {
                          handleOpenModalCreateOneProjectDetail(part.id, detailProject.projectId);
                        } else {
                          handleOpenModalCreateOneProjectDetail(part.id, projectId);
                        }
                      }}>
                      {quantity ? (
                        quantity
                      ) : (
                        <div className="production-project__quantityDetail plus">+</div>
                      )}
                    </td>
                    <td></td>

                    <td
                      className="production-project__quantityDetail"
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
                        <div className="production-project__quantityDetail plus">+</div>
                      )}
                    </td>

                    {existingDates.map((order) => {
                      const detail = order.props?.find((p) => p?.detailId === part?.id);
                      const qty = detail ? detail.shipment_quantity : '';
                      const detailIdFromOrder = detail ? detail.id : null;

                      return (
                        <td
                          key={order.shipment_date}
                          onClick={() => {
                            if (detailIdFromOrder) {
                              handleOpenModalUpdateShipmentOrderDetail(detailIdFromOrder);
                            } else {
                              handleOpenModalCreateOneShipmentOrderDetail(
                                part.id,
                                projectId,
                                order.shipment_date,
                                colorDetail,
                              );
                            }
                          }}
                          className="production-project__quantityDetail">
                          {qty ? (
                            qty
                          ) : (
                            <div className="production-project__quantityDetail plus">+</div>
                          )}
                        </td>
                      );
                    })}

                    {newColumn.map((order, index) => (
                      <td
                        key={`new-${index}`}
                        onClick={() => {
                          handleOpenModalCreateOneShipmentOrderDetail(part.id, projectId, null);
                        }}
                        className="production-project__quantityDetail">
                        <div className="production-project__quantityDetail plus">+</div>
                      </td>
                    ))}

                    <td
                      className="production-project__quantityDetail"
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
                        <div className="production-project__quantityDetail plus">+</div>
                      )}
                    </td>
                  </tr>
                );
              })}

            <tr>
              <td className="production-project__antypicalTitle" onClick={handleCreateAntypical}>
                Нетиповые
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              {existingDates.map((_, idx) => (
                <td key={`existing-${idx}`}></td>
              ))}
              {newColumn.map((_, idx) => (
                <td key={`new-${idx}`}></td>
              ))}
              <td></td>
            </tr>

            {antypicalList
              .sort((a, b) => (a?.id || 0) - (b?.id || 0))
              .map((antypDetails) => (
                <tr key={antypDetails.id}>
                  <td
                    className="production-project__antypicalName"
                    onClick={() =>
                      handleOpenModalUpdateOrLook(antypDetails.id, antypDetails.image)
                    }>
                    {antypDetails.name ? (
                      antypDetails.name
                    ) : (
                      <div className="production-project__antypicalName plus">+</div>
                    )}
                  </td>
                  <td
                    className="production-project__antypicalColor"
                    onClick={() => handleCreateAntypicalColor(antypDetails.id)}>
                    {antypDetails.color ? (
                      antypDetails.color
                    ) : (
                      <div className="production-project__antypicalColor plus">+</div>
                    )}
                  </td>
                  <td
                    className="production-project__quantityDetail"
                    onClick={() => handleCreateAntypicalsQuantity(antypDetails.id)}>
                    {antypDetails.antypicals_quantity !== null &&
                    antypDetails.antypicals_quantity !== undefined ? (
                      antypDetails.antypicals_quantity
                    ) : (
                      <div className="production-project__quantityDetail plus">+</div>
                    )}
                  </td>
                  <td
                    className="production-project__quantityDetail"
                    onClick={() => handleOpenModalCreateAntypicalsWeldersQuantity(antypDetails.id)}>
                    {antypDetails.antypicals_welders_quantity !== null &&
                    antypDetails.antypicals_welders_quantity !== undefined ? (
                      antypDetails.antypicals_welders_quantity
                    ) : (
                      <div className="production-project__quantityDetail plus">+</div>
                    )}
                  </td>
                  <td
                    className="production-project__quantityDetail"
                    onClick={() => handleCreateAntypicalsShipmentQuantity(antypDetails.id)}>
                    {antypDetails.antypicals_shipment_quantity !== null &&
                    antypDetails.antypicals_shipment_quantity !== undefined ? (
                      antypDetails.antypicals_shipment_quantity
                    ) : (
                      <div className="production-project__quantityDetail plus">+</div>
                    )}
                  </td>

                  {existingDates.map((order, idx) => {
                    const found = order.props?.find(
                      (p) => p?.antypical_name === antypDetails.name && p?.antypical_name !== null,
                    );
                    const qty = found ? found.shipment_quantity : '';
                    const detailIdFromOrder = found ? found.id : null;

                    return (
                      <td
                        key={`existing-${idx}`}
                        className="production-project__quantityDetail"
                        onClick={() => {
                          if (detailIdFromOrder) {
                            handleOpenModalUpdateShipmentOrderDetail(detailIdFromOrder);
                          } else {
                            handleOpenModalCreateAntypicalShipmentOrder(
                              antypDetails.name,
                              projectId,
                              order.shipment_date,
                              antypDetails.color,
                              antypDetails.image,
                            );
                          }
                        }}>
                        {qty ? qty : '+'}
                      </td>
                    );
                  })}

                  {newColumn.map((order, idx) => (
                    <td
                      onClick={() => {
                        handleOpenModalCreateAntypicalShipmentOrder(
                          antypDetails.name,
                          projectId,
                          order.shipment_date,
                          antypDetails.color,
                          antypDetails.image,
                        );
                      }}
                      key={`new-${idx}`}
                      className="production-project__quantityDetail">
                      +
                    </td>
                  ))}

                  <td
                    className="production-project__quantityDetail"
                    onClick={() => handleCreateAntypicalsDeliveryQuantity(antypDetails.id)}>
                    {antypDetails.antypicals_delivery_quantity !== null &&
                    antypDetails.antypicals_delivery_quantity !== undefined ? (
                      antypDetails.antypicals_delivery_quantity
                    ) : (
                      <div className="production-project__quantityDetail plus">+</div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ProductionProjectComponent;
