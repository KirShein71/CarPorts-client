import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { fetchAllProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllDeliveryDetails } from '../../http/deliveryDetailsApi';
import { getAllShipmentOrder } from '../../http/shipmentOrderApi';
import CreateAntypical from '../ProductionList/modal/CreateAntypical';
import CreateName from './modals/CreateName';
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

import './style.scss';

function ProductionOrders() {
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
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
  const [modalCreateOneProjectDetails, setModalCreateOneProjectDetails] = React.useState(false);
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
  const [openModalCreateAntypicalsWeldersQuantity, setOpenModalCreateAntypicalsWeldersQuantity] =
    React.useState(false);
  const [antypicalsId, setAntypicalsId] = React.useState(null);
  const [shipmentOrders, setShipmentOrders] = React.useState([]);
  const [modalCreateOneShipmentOrderDetail, setModalCreateOneShipmentOrderDetail] =
    React.useState(false);
  const [modalUpdateShipmentOrderDetail, setModalUpdateShipmentOrderDetail] = React.useState(false);
  const [oneShipmentOrderDetail, setOneShipmentOrderDetail] = React.useState(null);
  const [shipmentOrderDate, setShipmentOrderDate] = React.useState(null);
  const [modalCreateShipmentOrder, setModalCreateShipmentOrder] = React.useState(false);
  const [newColumnShipmentOrder, setNewColumnShipmentOrder] = React.useState(false);
  const [modalCreateNewShipmentOrder, setModalCreateNewShipmentOrder] = React.useState(false);
  const [detailColor, setDetailColor] = React.useState(null);
  const [antypicalName, setAntypicalName] = React.useState(null);
  const [antypicalImage, setAntypicalImage] = React.useState(null);
  const [modalCreateAntypicalShipmentOrder, setModalCreateAntypicalShipmentOrder] =
    React.useState(false);
  const [modalLink, setModalLink] = React.useState(false);
  const [flagShipmentOrder, setFlagShipmentOrder] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projectDetails, nameDetails, shipmentDetails, deliveryDetails, shipmentOrders] =
          await Promise.all([
            fetchAllProjectDetails(),
            fetchAllDetails(),
            fetchAllShipmentDetails(),
            fetchAllDeliveryDetails(),
            getAllShipmentOrder(),
          ]);

        setProjectDetails(projectDetails);
        setShipmentDetails(shipmentDetails);
        setNameDetails(nameDetails);
        setDeliveryDetails(deliveryDetails);
        setShipmentOrders(shipmentOrders);
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
      searchQuery: searchQuery, // добавим поиск в фильтры
    };

    const filteredProjects = projectDetails.filter((project) => {
      // Проверяем поиск по названию проекта
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Если есть поисковый запрос и название не подходит - сразу исключаем
      if (searchQuery && !matchesSearch) {
        return false;
      }

      // Проверяем статус проекта (активный/завершенный)
      const isActiveProject = filters.isActive
        ? project.project.finish === null
        : filters.isClosed
          ? project.project.finish === 'true'
          : true;

      // Если обе кнопки активны - показываем все проекты
      if (filters.isActive && filters.isClosed) {
        return true;
      }

      return isActiveProject;
    });

    // Сортируем проекты по приоритету отгрузки
    const sortedProjects = filteredProjects.sort((a, b) => {
      // Функция для определения статуса отгрузки проекта
      const getShippingStatus = (project) => {
        const projectDetails = (project.props || []).filter(
          (prop) => prop.detailId !== null && prop.quantity !== null && prop.quantity > 0,
        );

        if (projectDetails.length === 0) return 2;

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
          return 0;
        } else if (notShippedDetails.length > 0) {
          return 1;
        } else {
          return 2;
        }
      };

      const aStatus = getShippingStatus(a);
      const bStatus = getShippingStatus(b);

      return aStatus - bStatus;
    });

    setFilteredProjects(sortedProjects);
  }, [projectDetails, buttonActiveProject, buttonClosedProject, shipmentDetails, searchQuery]); // добавили searchQuery в зависимости

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

  const handleOpenModalCreateAntypicalsWeldersQuantity = (id) => {
    setAntypicalsId(id);
    setOpenModalCreateAntypicalsWeldersQuantity(true);
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

  const handleOpenModalCreateOneProjectDetail = (detailId, project) => {
    setDetailId(detailId);
    setProject(project);
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

  const handleOpenModalCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setModalCreateOneShipmentDetails(true);
  };

  const handleOpenModalUpdateShipmentOrderDetail = (id) => {
    setOneShipmentOrderDetail(id);
    setModalUpdateShipmentOrderDetail(true);
  };

  const handleOpenModalCreateOneShipmentOrderDetail = (
    detailId,
    project,
    shipment_date,
    detailColor,
  ) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentOrderDate(shipment_date);
    setDetailColor(detailColor);
    setModalCreateOneShipmentOrderDetail(true);
  };

  const handleOpenModalCreateAntypicalShipmentOrder = (
    name,
    project,
    shipment_date,
    detailColor,
    image,
  ) => {
    setAntypicalName(name);
    setProject(project);
    setShipmentOrderDate(shipment_date);
    setDetailColor(detailColor);
    setAntypicalImage(image);
    setModalCreateAntypicalShipmentOrder(true);
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

  const handleOpenModalCreateShipmentOrder = (projectId, flag) => {
    setProject(projectId);
    setFlagShipmentOrder(flag);
    setModalCreateShipmentOrder(true);
  };

  const handleOpenModalCreateNewShipmentOrder = (projectId) => {
    setProject(projectId);
    setModalCreateNewShipmentOrder(true);
  };

  const handleOpenModalLink = (projectId, shipmentOrderDate) => {
    setProject(projectId);
    setShipmentOrderDate(shipmentOrderDate);
    setModalLink(true);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
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
      <CreateOneProjectDetail
        detailId={detailId}
        projectId={project}
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
      <CreateOneShipmentOrderDetail
        detailId={detailId}
        projectId={project}
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
        projectId={project}
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
        projectId={project}
        setNewColumnShipmentOrder={setNewColumnShipmentOrder}
        flag={flagShipmentOrder}
      />
      <ModalCreateNewShipmentOrder
        show={modalCreateNewShipmentOrder}
        setShow={setModalCreateNewShipmentOrder}
        setChange={setChange}
        projectId={project}
      />
      <ModalLink
        show={modalLink}
        setShow={setModalLink}
        projectId={project}
        date={shipmentOrderDate}
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
          <input
            class="production-orders__search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="production-orders__table-container">
          <div className="production-orders__table-container">
            {filteredProjects.map((proDetail) => {
              const project = proDetail.project || {};
              const projectProps = proDetail.props || [];
              const projectId = proDetail.id || proDetail.projectId;

              // Получаем все отгрузки для текущего проекта
              const projectShipmentOrders = shipmentOrders.filter(
                (order) => order.projectId === projectId,
              );

              // Сортируем по дате
              const sortedShipmentOrders = [...projectShipmentOrders].sort(
                (a, b) => new Date(a.shipment_date) - new Date(b.shipment_date),
              );

              // Отделяем существующие даты от новой колонки
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

              // Получаем отфильтрованные детали
              const filteredDetails = getFilteredDetails(projectId, projectProps);

              if (filteredDetails.length === 0) return null;

              return (
                <>
                  <Table className="production-orders__table" bordered>
                    <thead>
                      <tr>
                        <th className="production-orders__projectName" colSpan={4}>
                          {project.name || ''}
                        </th>
                        <th
                          colSpan={2 + datesCount}
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
                        {projectShipmentOrders.length > 0 ? (
                          <th
                            onClick={() => handleOpenModalCreateShipmentOrder(projectId, 'true')}
                            className="production-orders__columnName"
                            colSpan={1 + datesCount}>
                            Покраска
                          </th>
                        ) : (
                          <th
                            onClick={() => handleOpenModalCreateShipmentOrder(projectId, 'false')}
                            className="production-orders__columnName"
                            colSpan={1 + datesCount}>
                            Покраска
                          </th>
                        )}

                        <th className="production-orders__columnName">Объект</th>
                      </tr>
                      {datesCount > 0 && (
                        <tr>
                          <th className="production-orders__columnNumber"></th>
                          <th className="production-orders__columnColor"></th>
                          <th className="production-orders__columnName"></th>
                          <th className="production-orders__columnName"></th>
                          <th className="production-orders__columnName">общ</th>
                          {/* Сначала рендерим колонки с датами */}
                          {existingDates.map((order) => {
                            if (order.shipment_date) {
                              return (
                                <th
                                  key={order.shipment_date}
                                  className="production-orders__columnName"
                                  onClick={() =>
                                    handleOpenModalLink(projectId, order.shipment_date)
                                  }>
                                  {formatDate(order.shipment_date)}
                                </th>
                              );
                            } else {
                              return (
                                <th
                                  key={order.shipment_date || 'new'}
                                  className="production-orders__columnName"
                                  onClick={() =>
                                    handleOpenModalCreateNewShipmentOrder(projectId)
                                  }></th>
                              );
                            }
                          })}
                          {/* Потом рендерим новую колонку без даты */}
                          {newColumn.map((order, index) => (
                            <th
                              key={`new-${index}`}
                              className="production-orders__columnName"
                              onClick={() => handleOpenModalCreateNewShipmentOrder(projectId)}>
                              {/* Пустой заголовок для новой колонки */}
                            </th>
                          ))}
                          <th className="production-orders__columnName"></th>
                        </tr>
                      )}
                    </thead>
                    <tbody className="production-orders__body">
                      <React.Fragment key={proDetail.id || proDetail.projectId}>
                        {/* Типовые детали */}
                        {filteredDetails
                          .sort((a, b) => {
                            const detailA = projectProps.find((prop) => prop.detailId === a.id);
                            const detailB = projectProps.find((prop) => prop.detailId === b.id);
                            const detailIdA = detailA ? parseInt(detailA.detailId) : parseInt(a.id);
                            const detailIdB = detailB ? parseInt(detailB.detailId) : parseInt(b.id);
                            return detailIdA - detailIdB;
                          })
                          .map((part) => {
                            const detailProject = projectProps.find(
                              (prop) => prop.detailId === part.id,
                            );
                            const quantity = detailProject ? detailProject.quantity : '';
                            const colorDetail = detailProject ? detailProject.color : '';

                            // Данные из shipmentDetails (общая отгрузка - колонка "общ")
                            const shipmentForProject = shipmentDetails.find(
                              (shipDetail) => shipDetail.projectId === projectId,
                            );
                            let quantityShipment = '';
                            let detailShipment = null;
                            if (shipmentForProject && shipmentForProject.props) {
                              detailShipment = shipmentForProject.props.find(
                                (prop) => prop.detailId === part.id,
                              );
                              quantityShipment = detailShipment
                                ? detailShipment.shipment_quantity
                                : '';
                            }

                            // Данные доставки
                            const deliveryForProject = deliveryDetails.find(
                              (del) => del.projectId === projectId,
                            );
                            let quantityDelivery = '';
                            let detailDelivery = null;
                            if (deliveryForProject && deliveryForProject.props) {
                              detailDelivery = deliveryForProject.props.find(
                                (prop) => prop.detailId === part.id,
                              );
                              quantityDelivery = detailDelivery
                                ? detailDelivery.delivery_quantity
                                : '';
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
                                  onClick={() => {
                                    if (detailProject?.id) {
                                      handleUpdateProjectDetailClick(detailProject?.id);
                                    } else if (detailProject) {
                                      handleOpenModalCreateOneProjectDetail(
                                        part.id,
                                        detailProject.projectId,
                                      );
                                    } else {
                                      handleOpenModalCreateOneProjectDetail(part.id, projectId);
                                    }
                                  }}>
                                  {quantity ? (
                                    quantity
                                  ) : (
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  )}
                                </td>
                                <td></td>

                                {/* Колонка "общ" */}
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

                                {/* Ячейки для существующих дат */}
                                {existingDates.map((order) => {
                                  const detail = order.props?.find((p) => p.detailId === part.id);
                                  const qty = detail ? detail.shipment_quantity : '';
                                  const detailId = detail ? detail.id : null;

                                  return (
                                    <td
                                      key={order.shipment_date}
                                      onClick={() => {
                                        if (detailId) {
                                          handleOpenModalUpdateShipmentOrderDetail(detailId);
                                        } else {
                                          handleOpenModalCreateOneShipmentOrderDetail(
                                            part.id,
                                            projectId,
                                            order.shipment_date,
                                            colorDetail,
                                          );
                                        }
                                      }}
                                      className="production-orders__quantityDetail">
                                      {qty ? (
                                        qty
                                      ) : (
                                        <div className="production-orders__quantityDetail plus">
                                          +
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}

                                {/* Ячейка для новой колонки (без даты) */}
                                {newColumn.map((order, index) => (
                                  <td
                                    key={`new-${index}`}
                                    onClick={() => {
                                      handleOpenModalCreateOneShipmentOrderDetail(
                                        part.id,
                                        projectId,
                                        null,
                                      );
                                    }}
                                    className="production-orders__quantityDetail">
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  </td>
                                ))}

                                {/* Колонка "На объекте" */}
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

                        {/* Строка "Нетиповые" */}
                        <tr>
                          <td
                            className="production-orders__antypicalTitle"
                            onClick={() => handleCreateAntypical(proDetail.projectId)}>
                            Нетиповые
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td> {/* общ */}
                          {existingDates.map((_, idx) => (
                            <td key={`existing-${idx}`}></td>
                          ))}
                          {newColumn.map((_, idx) => (
                            <td key={`new-${idx}`}></td>
                          ))}
                          <td></td> {/* на объекте */}
                        </tr>

                        {/* Нетиповые детали */}
                        {proDetail.antypical
                          .sort((a, b) => a.id - b.id)
                          .map((antypDetails) => {
                            return (
                              <tr key={antypDetails.id}>
                                <td
                                  className="production-orders__antypicalName"
                                  onClick={() => handleCreateAntypicalName(antypDetails.id)}>
                                  {antypDetails.name ? (
                                    antypDetails.name
                                  ) : (
                                    <div className="production-orders__antypicalName plus">+</div>
                                  )}
                                </td>
                                <td
                                  className="production-orders__antypicalColor"
                                  onClick={() => handleCreateAntypicalColor(antypDetails.id)}>
                                  {antypDetails.color ? (
                                    antypDetails.color
                                  ) : (
                                    <div className="production-orders__antypicalColor plus">+</div>
                                  )}
                                </td>
                                <td
                                  className="production-orders__quantityDetail"
                                  onClick={() => handleCreateAntypicalsQuantity(antypDetails.id)}>
                                  {antypDetails.antypicals_quantity !== null ? (
                                    antypDetails.antypicals_quantity
                                  ) : (
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  )}
                                </td>
                                <td
                                  className="production-orders__quantityDetail"
                                  onClick={() =>
                                    handleOpenModalCreateAntypicalsWeldersQuantity(antypDetails.id)
                                  }>
                                  {antypDetails.antypicals_welders_quantity !== null ? (
                                    antypDetails.antypicals_welders_quantity
                                  ) : (
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  )}
                                </td>
                                <td
                                  className="production-orders__quantityDetail"
                                  onClick={() =>
                                    handleCreateAntypicalsShipmentQuantity(antypDetails.id)
                                  }>
                                  {antypDetails.antypicals_shipment_quantity !== null ? (
                                    antypDetails.antypicals_shipment_quantity
                                  ) : (
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  )}
                                </td>

                                {/* Ячейки для существующих дат - отображаем shipment_quantity из shipmentOrders */}
                                {existingDates.map((order, idx) => {
                                  const found = order.props?.find(
                                    (p) =>
                                      p.antypical_name === antypDetails.name &&
                                      p.antypical_name !== null,
                                  );
                                  const qty = found ? found.shipment_quantity : '';
                                  const detailId = found ? found.id : null;

                                  return (
                                    <td
                                      key={`existing-${idx}`}
                                      className="production-orders__quantityDetail"
                                      onClick={() => {
                                        if (detailId) {
                                          handleOpenModalUpdateShipmentOrderDetail(detailId);
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

                                {/* Пустые ячейки для новой колонки */}
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
                                    className="production-orders__quantityDetail">
                                    +
                                  </td>
                                ))}

                                <td
                                  className="production-orders__quantityDetail"
                                  onClick={() =>
                                    handleCreateAntypicalsDeliveryQuantity(antypDetails.id)
                                  }>
                                  {antypDetails.antypicals_delivery_quantity !== null ? (
                                    antypDetails.antypicals_delivery_quantity
                                  ) : (
                                    <div className="production-orders__quantityDetail plus">+</div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    </tbody>
                  </Table>
                </>
              );
            })}
          </div>
        </div>
      </>
    </div>
  );
}

export default ProductionOrders;
