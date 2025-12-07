import React from 'react';
import { getProjectInfo } from '../../http/projectApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { deleteProjectBrigades } from '../../http/projectBrigadesApi';
import { generationUrlForClientAccount } from '../../http/userApi';
import CreateAccountModal from '../ClientAccountList/CreateAccountList/modal/CreateAccauntModal';
import CreateMainImage from '../ClientAccountList/CreateInformationClientList/modals/CreateMainImage';
import UpdateNote from './modals/UpdateNote';
import UpdateBrigade from './modals/UpdateBrigade';
import CreateBrigade from '../AppointBrigade/modals/CreateBrigade';
import CreatePlanStartDate from '../InstallationList/modals/CreatePlanStartDate';
import CreatePlanFinishDate from '../InstallationList/modals/CreateFinishDate';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Table, Spinner, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';
import CalendarProject from '../Calendar/CalendarProject';
import Estimate from '../Estimate/Estimate';
import { AppContext } from '../../context/AppContext';
import UpdateDesigner from '../PlanningList/modals/UpdateDisegner';
import CreateDesingStart from '../PlanningList/modals/CreateDesignerStart';
import CreateProjectDelivery from '../PlanningList/modals/CreateProjectDelivery';
import CreateInspectionDesigner from '../PlanningList/modals/CreateInspectionDisegner';
import CreateDateInspection from '../PlanningList/modals/CreateDateInspection';
import CreatePaymentDate from '../OrderMaterialsList/modals/createPaymentDate';
import CreateReadyDate from '../OrderMaterialsList/modals/createReadyDate';
import CreateShippingDate from '../OrderMaterialsList/modals/createShippingDate';
import CreatePlanDate from '../OrderMaterialsList/modals/CreatePlanDate';
import CreateCheck from '../OrderMaterialsList/modals/createCheck';
import CreateColor from '../OrderMaterialsList/modals/createColor';
import CreateOneProjectDetail from '../ProductionList/modal/CreateOneProjectDetail';
import UpdateProjectDetails from '../ProductionList/modal/UpdateProjectDetails';
import ClosedProject from './modals/ClosedProject';
import RestoreProject from './modals/RestoreProject';
import Complaint from './Complaint';
import CreateAntypical from '../ProductionList/modal/CreateAntypical';
import ImageModal from '../ProductionList/modal/ImageModal';
import Production from './Production';
import UpdateShipmentDetails from '../ShipmentList/modals/updateShipmentDetails';
import CreateOneShipmentDetail from '../ShipmentList/modals/createOneShipmentDetail';
import CreateOneDeliveryDetail from '../DeliveryDetails/modals/createOneDeliveryDetail';
import UpdateDeliveryDetails from '../DeliveryDetails/modals/updateDeliveryDetail';
import UpdateDesignPeriod from './modals/UpdateDesignPeriod';
import UpdateExpirationDate from './modals/UpdateExpirationDate';
import UpdateInstallationDate from './modals/UpdateInstallationDate';
import UserFile from './UserFile';
import ProjectLogistic from './ProjectLogistic';
import ModalUrlClient from './modals/ModalUrlClient';
import TechExamination from './TechExamination';

import './style.scss';

function ProjectInfoList() {
  const { id } = useParams();
  const { user } = React.useContext(AppContext);
  const [project, setProject] = React.useState();
  const [projectId, setProjectId] = React.useState(null);
  const [client, setClient] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('deadline');
  const [nameDetails, setNameDetails] = React.useState([]);
  const [createAccount, setCreateAccount] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [createMainImageModal, setCreateMainImageModal] = React.useState(false);
  const [updateNoteModal, setUpdateNoteModal] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [updateBrigadeModal, setUpdateBrigadeModal] = React.useState(false);
  const [projectBrigade, setProjectBrigade] = React.useState(null);
  const [createBrigadeModal, setCreateBrigadeModal] = React.useState(false);
  const [createStartDateModal, setCreateStartDateModal] = React.useState(false);
  const [createFinishDateModal, setCreateFinishDateModal] = React.useState(false);
  const [modalCreateDesigner, setModalCreateDesigner] = React.useState(false);
  const [modalCreateDesignStart, setModalCreateDesignStart] = React.useState(false);
  const [modalCreateProjectDelivery, setModalCreateProjectDelivery] = React.useState(false);
  const [modalCreateInspectionDesigner, setModalCreateInspectionDesigner] = React.useState(false);
  const [modalCreateDateInspection, setModalCreateDateInspection] = React.useState(false);
  const [projectMaterialId, setProjectMaterialId] = React.useState(null);
  const [modalCreatePaymentDay, setModalCreatePaymentDay] = React.useState(false);
  const [modalCreateReadyDate, setModalCreateReadyDate] = React.useState(false);
  const [modalCreateShippingDate, setModalCreateShippingDate] = React.useState(false);
  const [modalCreatePlanDate, setModalCreatePlanDate] = React.useState(false);
  const [modalCreateCheck, setModalCreateCheck] = React.useState(false);
  const [modalCreateColor, setModalCreateColor] = React.useState(false);
  const [projectDetailId, setProjectDetailId] = React.useState(null);
  const [detailId, setDetailId] = React.useState(null);
  const [modalCreateOneProjectDetail, setModalCreateOneProjectDetail] = React.useState(false);
  const [modalUpdateProjectDetail, setModalUpdateProjectDetail] = React.useState(false);
  const [modalClosedProject, setModalClosedProject] = React.useState(false);
  const [dateFinish, setDateFinish] = React.useState(null);
  const [modalRestoreProject, setModalRestoreProject] = React.useState(false);
  const [modalCreateAntypical, setModalCreateAntypical] = React.useState(false);
  const [antypicalImageModal, setAntypicalImageModal] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [shipmentDetailId, setShipmentDetailId] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [modalCreateOneShipmentDetail, setModalCreateOneShipmentDetail] = React.useState(false);
  const [modalUpdateShipmentDetail, setModalUpdateShipmentDetail] = React.useState(false);
  const [deliveryDetailId, setDeliveryDetailId] = React.useState(null);
  const [modalCreateOneDeliveryDetail, setModalCreateOneDeliveryDetail] = React.useState(false);
  const [modalUpdateDeliveryDetail, setModalUpdateDeliveryDetail] = React.useState(false);
  const [modalUpdateDesignPeriod, setModalUpdateDesignPeriod] = React.useState(false);
  const [modalUpdateExpirationDate, setModalUpdateExpirationDate] = React.useState(false);
  const [modalUpdateInstallationDate, setModalUpdateInstallationDate] = React.useState(false);
  const [openModalUrl, setOpenModalUrl] = React.useState(false);
  const [personalAccountLink, setPersonalAccountLink] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectInfo(id); // Получаем данные
        setProject(data);
        setUserId(data.userFile[0].userId);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [id, change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const HadleCreateAccountModal = (id) => {
    setProject(id);
    setCreateAccount(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateMainImage = (userId) => {
    setClient(userId);
    setCreateMainImageModal(true);
  };

  const hadleUpdateNote = (id) => {
    setProjectId(id);
    setUpdateNoteModal(true);
  };

  const hadleUpdateBrigade = (id) => {
    setProjectBrigade(id);
    setUpdateBrigadeModal(true);
  };

  const hadleCreateBrigade = (id) => {
    setProject(id);
    setCreateBrigadeModal(true);
  };

  const hadleCreateStartDate = (id) => {
    setProjectBrigade(id);
    setCreateStartDateModal(true);
  };

  const hadleCreateFinishDate = (id) => {
    setProjectBrigade(id);
    setCreateFinishDateModal(true);
  };

  const handleOpenModalCreateDesigner = (id) => {
    setProjectId(id);
    setModalCreateDesigner(true);
  };

  const handleOpenModalCreateDesignStart = (id) => {
    setProjectId(id);
    setModalCreateDesignStart(true);
  };

  const handleOpenModalCreateProjectDelivery = (id) => {
    setProjectId(id);
    setModalCreateProjectDelivery(true);
  };

  const handleOpenModalCreateInspectionDesigner = (id) => {
    setProjectId(id);
    setModalCreateInspectionDesigner(true);
  };

  const handleOpenModalCreateDateInspection = (id) => {
    setProjectId(id);
    setModalCreateDateInspection(true);
  };

  const handleOpenModalCreatePaymentDate = (id) => {
    setProjectMaterialId(id);
    setModalCreatePaymentDay(true);
  };

  const handleOpenModalCreateReadyDate = (id) => {
    setProjectMaterialId(id);
    setModalCreateReadyDate(true);
  };

  const handleOpenModalCreateShippingDate = (id) => {
    setProjectMaterialId(id);
    setModalCreateShippingDate(true);
  };

  const handleOpenModalCreatePlanDate = (id) => {
    setProjectMaterialId(id);
    setModalCreatePlanDate(true);
  };

  const handleOpenModalCreateCheck = (id) => {
    setProjectMaterialId(id);
    setModalCreateCheck(true);
  };

  const handleOpenModalCreateColor = (id) => {
    setProjectMaterialId(id);
    setModalCreateColor(true);
  };

  const handleOpenModalCreateOneProjectDetail = (id, project) => {
    setDetailId(id);
    setProjectId(project);
    setModalCreateOneProjectDetail(true);
  };

  const handleOpenModalUpdateProjectDetail = (id) => {
    setProjectDetailId(id);
    setModalUpdateProjectDetail(true);
  };

  const handleOpenModalCreateOneShipmentDetail = (id, project, shipmentDate) => {
    setDetailId(id);
    setProjectId(project);
    setShipmentDate(shipmentDate);
    setModalCreateOneShipmentDetail(true);
  };

  const handleOpenModalUpdateShipmentDetail = (id) => {
    setShipmentDetailId(id);
    setModalUpdateShipmentDetail(true);
  };

  const handleOpenModalCreateOneDeliveryDetail = (id, project) => {
    setDetailId(id);
    setProjectId(project);
    setModalCreateOneDeliveryDetail(true);
  };

  const handleOpenModalUpdateDeliveryDetail = (id) => {
    setDeliveryDetailId(id);
    setModalUpdateDeliveryDetail(true);
  };

  const handleOpenModalClosedProject = (id, dateFinish) => {
    setModalClosedProject(true);
    setProject(id);
    setDateFinish(dateFinish);
  };

  const handleOpenModalRestoreProject = (id) => {
    setModalRestoreProject(true);
    setProject(id);
  };

  const handleOpenModalUpdateDesignPeriod = (id) => {
    setProjectId(id);
    setModalUpdateDesignPeriod(true);
  };

  const handleOpenModalUpdateExpirationDate = (id) => {
    setProjectId(id);
    setModalUpdateExpirationDate(true);
  };

  const handleOpenModalUpdateInstallationDate = (id) => {
    setProjectId(id);
    setModalUpdateInstallationDate(true);
  };

  const handleDeleteProjectBrigades = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить бригаду?');
    if (confirmed) {
      deleteProjectBrigades(id)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
          console.log(id);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleGenerationUrl = (id) => {
    generationUrlForClientAccount(id)
      .then((data) => {
        setChange(!change);
        setOpenModalUrl(true);
        setPersonalAccountLink(data); // убрали .response
        console.log(data); // убрали .response
        console.log(id);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleToggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOpenModalCreateAntypical = (project) => {
    setProjectId(project);
    setModalCreateAntypical(true);
  };

  const handleOpenModalAntypicalImage = (images, id) => {
    setImages(images, id);
    setAntypicalImageModal(true);
  };

  const holidays = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-08',
    '2024-02-23',
    '2024-03-08',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-09',
    '2024-05-10',
    '2024-06-12',
    '2024-11-04',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',
    '2025-01-06',
    '2025-01-07',
    '2025-01-08',
    '2025-05-01',
    '2025-05-02',
    '2025-05-08',
    '2025-05-09',
    '2025-06-12',
    '2025-06-13',
    '2025-11-03',
    '2025-11-04',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05',
    '2026-01-08',
    '2026-01-09',
    '2026-02-23',
    '2026-03-09',
    '2026-05-01',
    '2026-05-11',
    '2026-06-12',
    '2026-11-04',
    '2026-12-31',
  ].map((date) => new Date(date));

  // Функция для проверки, является ли дата выходным или праздничным днем
  function isWorkingDay(date) {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const isHoliday = holidays.some((holiday) => {
      const holidayString = holiday.toDateString();
      const dateString = date.toDateString();
      return holidayString === dateString;
    });

    return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
  }
  // Функция для добавления рабочих дней к дате
  function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
      if (isWorkingDay(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  // Функция для форматирования даты в формате ДД.ММ.ГГГГ
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Исправлено: добавлены кавычки для шаблонной строки
  }

  const addToInfoAccount = (id) => {
    navigate(`/createinformationclient/${id}`, { state: { from: location.pathname } });
  };

  if (!project) {
    return <Spinner />;
  }

  return (
    <div className="projectinfo">
      <CreateAccountModal
        projectId={id}
        show={createAccount}
        setShow={setCreateAccount}
        setChange={setChange}
      />
      <CreateMainImage
        id={client}
        show={createMainImageModal}
        setShow={setCreateMainImageModal}
        setChange={setChange}
      />
      <UpdateNote
        id={projectId}
        show={updateNoteModal}
        setShow={setUpdateNoteModal}
        setChange={setChange}
      />
      <UpdateBrigade
        id={projectBrigade}
        show={updateBrigadeModal}
        setShow={setUpdateBrigadeModal}
        setChange={setChange}
      />
      <CreateBrigade
        projectId={id}
        show={createBrigadeModal}
        setShow={setCreateBrigadeModal}
        setChange={setChange}
      />
      <CreatePlanStartDate
        id={projectBrigade}
        show={createStartDateModal}
        setShow={setCreateStartDateModal}
        setChange={setChange}
      />
      <CreatePlanFinishDate
        id={projectBrigade}
        show={createFinishDateModal}
        setShow={setCreateFinishDateModal}
        setChange={setChange}
      />
      <UpdateDesigner
        id={projectId}
        show={modalCreateDesigner}
        setShow={setModalCreateDesigner}
        setChange={setChange}
        planningPage={false}
      />
      <CreateDesingStart
        id={projectId}
        show={modalCreateDesignStart}
        setShow={setModalCreateDesignStart}
        setChange={setChange}
        planningPage={false}
      />
      <CreateProjectDelivery
        id={projectId}
        show={modalCreateProjectDelivery}
        setShow={setModalCreateProjectDelivery}
        setChange={setChange}
        planningPage={false}
      />
      <CreateInspectionDesigner
        id={projectId}
        show={modalCreateInspectionDesigner}
        setShow={setModalCreateInspectionDesigner}
        setChange={setChange}
        planningPage={false}
      />
      <CreateDateInspection
        id={projectId}
        show={modalCreateDateInspection}
        setShow={setModalCreateDateInspection}
        setChange={setChange}
        planningPage={false}
      />
      <CreatePaymentDate
        id={projectMaterialId}
        show={modalCreatePaymentDay}
        setShow={setModalCreatePaymentDay}
        setChange={setChange}
        projectInfoPage={true}
      />
      <CreateReadyDate
        id={projectMaterialId}
        show={modalCreateReadyDate}
        setShow={setModalCreateReadyDate}
        setChange={setChange}
        projectInfoPage={true}
      />
      <CreateShippingDate
        id={projectMaterialId}
        show={modalCreateShippingDate}
        setShow={setModalCreateShippingDate}
        setChange={setChange}
        projectInfoPage={true}
      />
      <CreatePlanDate
        id={projectMaterialId}
        show={modalCreatePlanDate}
        setShow={setModalCreatePlanDate}
        setChange={setChange}
        projectInfoPage={true}
      />
      <CreateCheck
        id={projectMaterialId}
        show={modalCreateCheck}
        setShow={setModalCreateCheck}
        setChange={setChange}
        projectInfoPage={true}
      />
      <CreateColor
        id={projectMaterialId}
        show={modalCreateColor}
        setShow={setModalCreateColor}
        setChange={setChange}
        projectInfoPage={true}
      />
      <UpdateProjectDetails
        id={projectDetailId}
        show={modalUpdateProjectDetail}
        setShow={setModalUpdateProjectDetail}
        setChange={setChange}
      />
      <CreateOneProjectDetail
        detailId={detailId}
        projectId={projectId}
        show={modalCreateOneProjectDetail}
        setShow={setModalCreateOneProjectDetail}
        setChange={setChange}
      />
      <UpdateShipmentDetails
        id={shipmentDetailId}
        show={modalUpdateShipmentDetail}
        setShow={setModalUpdateShipmentDetail}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={projectId}
        shipmentDate={shipmentDate}
        show={modalCreateOneShipmentDetail}
        setShow={setModalCreateOneShipmentDetail}
        setChange={setChange}
      />
      <UpdateDeliveryDetails
        id={deliveryDetailId}
        show={modalUpdateDeliveryDetail}
        setShow={setModalUpdateDeliveryDetail}
        setChange={setChange}
      />
      <CreateOneDeliveryDetail
        detailId={detailId}
        projectId={projectId}
        show={modalCreateOneDeliveryDetail}
        setShow={setModalCreateOneDeliveryDetail}
        setChange={setChange}
      />
      <ClosedProject
        show={modalClosedProject}
        setShow={setModalClosedProject}
        id={project}
        setChange={setChange}
        dateFinish={dateFinish}
      />
      <RestoreProject
        show={modalRestoreProject}
        setShow={setModalRestoreProject}
        id={project}
        setChange={setChange}
      />
      <CreateAntypical
        projectId={projectId}
        show={modalCreateAntypical}
        setShow={setModalCreateAntypical}
        setChange={setChange}
      />
      <ImageModal
        show={antypicalImageModal}
        images={images}
        setImages={setImages}
        setShow={setAntypicalImageModal}
        setChange={setChange}
        change={change}
      />
      <UpdateDesignPeriod
        id={projectId}
        show={modalUpdateDesignPeriod}
        setShow={setModalUpdateDesignPeriod}
        setChange={setChange}
      />
      <UpdateExpirationDate
        id={projectId}
        show={modalUpdateExpirationDate}
        setShow={setModalUpdateExpirationDate}
        setChange={setChange}
      />
      <UpdateInstallationDate
        id={projectId}
        show={modalUpdateInstallationDate}
        setShow={setModalUpdateInstallationDate}
        setChange={setChange}
      />
      <ModalUrlClient
        show={openModalUrl}
        setShow={setOpenModalUrl}
        personalAccountLink={personalAccountLink}
      />
      <div className="header">
        <Link
          to={
            location.state?.from?.includes('/complaint-info')
              ? '/project'
              : location.state?.from || '/project'
          }>
          <img className="header__icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Подробная информация</h1>
      </div>
      <div className="projectinfo_content">
        <div className="projectinfo__image">
          {project &&
          project.userProject &&
          (project.userProject.length === 0 || project.userProject.every((user) => !user.image)) ? (
            <img
              src="../img/fon.jpg"
              alt="image__company"
              onClick={() => handleCreateMainImage(user.userId)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            project.userProject &&
            project.userProject.map(
              (user) =>
                user.image && (
                  <img
                    key={user.id}
                    src={process.env.REACT_APP_IMG_URL + user.image}
                    alt="main"
                    onClick={() => handleCreateMainImage(user.userId)}
                    style={{ cursor: 'pointer' }}
                  />
                ),
            )
          )}
        </div>

        <div className="projectinfo__information">
          <div className="projectinfo__number">{project.project && project.project.number}</div>
          <div className="projectinfo__name">{project.project && project.project.name}</div>
          <div className="projectinfo__date">
            <Moment format="DD.MM.YYYY">{project.project && project.project.agreement_date}</Moment>
          </div>
        </div>
        <div className="projectinfo__filter">
          <div className="projectinfo__filter-card">
            <div className="projectinfo__filter-card__content">
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'deadline' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('deadline')}>
                Сроки
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'designer' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('designer')}>
                Проектирование
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'procurement' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('procurement')}>
                Закупки
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'production' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('production')}>
                Производство
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'calendar' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('calendar')}>
                Календарь
              </div>
              {user.isManagerSale ? null : (
                <div
                  className={`projectinfo__filter-card__item ${
                    activeTab === 'estimate' ? 'active' : ''
                  }`}
                  onClick={() => handleTabClick('estimate')}>
                  Смета
                </div>
              )}
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'techSupervision' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('techSupervision')}>
                Тех.надзор
              </div>
              {project.complaints?.length > 0 ? (
                <div
                  className={`projectinfo__filter-card__item ${
                    activeTab === 'complaint' ? 'active' : ''
                  }`}
                  onClick={() => handleTabClick('complaint')}>
                  Рекламация
                </div>
              ) : null}
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'cabinet' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('cabinet')}>
                Личный кабинет
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'userFile' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('userFile')}>
                Файлы
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'logistic' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('logistic')}>
                Логистика
              </div>
            </div>
          </div>
        </div>
        {activeTab === 'deadline' && (
          <div className="deadline">
            <Table bordered hover size="md" className="mt-3">
              <thead>
                <tr>
                  <th>Сроки</th>
                  <th>Сроки по договору</th>
                  <th>Дедлайн</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Проектирование</td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModalUpdateDesignPeriod(project.project.id)}>
                    {project.project && project.project.design_period}
                  </td>
                  <td>
                    {(() => {
                      const agreementDate = new Date(
                        project.project && project.project.agreement_date,
                      );
                      const designPeriod = project.project && project.project.design_period;

                      const endDate = addWorkingDays(agreementDate, designPeriod);
                      const formattedEndDate = formatDate(endDate);
                      return formattedEndDate;
                    })()}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>Производство</td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModalUpdateExpirationDate(project.project.id)}>
                    {project.project && project.project.expiration_date}
                  </td>
                  <td>
                    {(() => {
                      const agreementDate = new Date(
                        project.project && project.project.agreement_date,
                      );
                      const designPeriod = project.project && project.project.design_period;

                      const expirationDate = project.project && project.project.expiration_date;

                      const sumDays = designPeriod + expirationDate;

                      const endDate = addWorkingDays(agreementDate, sumDays);
                      const formattedEndDate = formatDate(endDate);
                      return formattedEndDate;
                    })()}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>Монтажные работы</td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModalUpdateInstallationDate(project.project.id)}>
                    {project.project && project.project.installation_period}
                  </td>
                  <td>
                    {(() => {
                      const agreementDate = new Date(
                        project.project && project.project.agreement_date,
                      );
                      const designPeriod = project.project && project.project.design_period;
                      const expirationDate = project.project && project.project.expiration_date;
                      const installationPeriod =
                        project.project && project.project.installation_period;
                      const sumDays = designPeriod + expirationDate + installationPeriod;

                      const endDate = addWorkingDays(agreementDate, sumDays);
                      const formattedEndDate = formatDate(endDate);
                      return formattedEndDate;
                    })()}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        {activeTab === 'designer' && (
          <div className="designer">
            <Table bordered hover size="sm" className="mt-3 table-planning">
              <thead>
                <tr>
                  <th>Конструктор</th>
                  <td
                    onClick={() => handleOpenModalCreateDesigner(project.project.id)}
                    style={{ cursor: 'pointer' }}>
                    {project.project && project.project.designer}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Дата начала</th>
                  <td
                    onClick={() => handleOpenModalCreateDesignStart(project.project.id)}
                    style={{ cursor: 'pointer' }}>
                    {project.project && project.project.design_start ? (
                      <Moment format="DD.MM.YYYY">
                        {project.project && project.project.design_start}
                      </Moment>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th>Дата сдачи</th>
                  <td
                    onClick={() => handleOpenModalCreateProjectDelivery(project.project.id)}
                    style={{ cursor: 'pointer' }}>
                    {project.project && project.project.project_delivery ? (
                      <Moment format="DD.MM.YYYY">
                        {project.project && project.project.project_delivery}
                      </Moment>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th>Проверяет проект</th>
                  <td
                    onClick={() => handleOpenModalCreateInspectionDesigner(project.project.id)}
                    style={{ cursor: 'pointer' }}>
                    {project.project && project.project.inspection_designer}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th>Дата проверки</th>
                  <td
                    onClick={() => handleOpenModalCreateDateInspection(project.project.id)}
                    style={{ cursor: 'pointer' }}>
                    {project.project && project.project.date_inspection ? (
                      <Moment format="DD.MM.YYYY">
                        {project.project && project.project.date_inspection}
                      </Moment>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        {activeTab === 'procurement' && (
          <div className="table-container">
            <Table bordered hover size="sm" className="mt-3">
              <thead>
                <tr>
                  <th className="production_column">Тип материала</th>
                  <th style={{ textAlign: 'center' }}>Счёт</th>
                  <th style={{ textAlign: 'center' }}>Оплаты</th>
                  <th style={{ textAlign: 'center' }}>План</th>
                  <th style={{ textAlign: 'center' }}>Готовность</th>
                  <th style={{ textAlign: 'center' }}>Отгрузки</th>
                  <th style={{ textAlign: 'center' }}>Цвет</th>
                </tr>
              </thead>
              <tbody>
                {project.projectmaterials.map((property) => (
                  <tr key={property.id}>
                    <td className="production_column">{property.materialName}</td>
                    <td
                      onClick={() => handleOpenModalCreateCheck(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.check ? property.check : ''}
                    </td>
                    <td
                      onClick={() => handleOpenModalCreatePaymentDate(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.date_payment ? (
                        <Moment format="DD.MM.YYYY">{property.date_payment}</Moment>
                      ) : (
                        ''
                      )}
                    </td>
                    <td
                      onClick={() => handleOpenModalCreatePlanDate(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.plan_date ? (
                        <Moment format="DD.MM.YYYY">{property.plan_date}</Moment>
                      ) : (
                        ''
                      )}
                    </td>
                    <td
                      onClick={() => handleOpenModalCreateReadyDate(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.ready_date ? (
                        <Moment format="DD.MM.YYYY">{property.ready_date}</Moment>
                      ) : (
                        ''
                      )}
                    </td>
                    <td
                      onClick={() => handleOpenModalCreateShippingDate(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.shipping_date ? (
                        <Moment format="DD.MM.YYYY">{property.shipping_date}</Moment>
                      ) : (
                        ''
                      )}
                    </td>
                    <td
                      onClick={() => handleOpenModalCreateColor(property.id)}
                      style={{ cursor: 'pointer', textAlign: 'center' }}>
                      {property.color ? property.color : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {activeTab === 'production' && (
          <Production
            nameDetails={nameDetails}
            project={project}
            handleOpenModalUpdateProjectDetail={handleOpenModalUpdateProjectDetail}
            handleOpenModalCreateOneProjectDetail={handleOpenModalCreateOneProjectDetail}
            handleOpenModalCreateOneShipmentDetail={handleOpenModalCreateOneShipmentDetail}
            handleOpenModalUpdateShipmentDetail={handleOpenModalUpdateShipmentDetail}
            handleOpenModalCreateAntypical={handleOpenModalCreateAntypical}
            handleOpenModalAntypicalImage={handleOpenModalAntypicalImage}
            handleOpenModalCreateOneDeliveryDetail={handleOpenModalCreateOneDeliveryDetail}
            handleOpenModalUpdateDeliveryDetail={handleOpenModalUpdateDeliveryDetail}
          />
        )}
        {activeTab === 'brigade' && (
          <div className="brigade">
            <div className="table-container">
              <Table striped bordered size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Бригада</th>
                    <th>Наш план начала работ</th>
                    <th>Наш план окончания работ</th>
                    <th>Количество дней</th>
                    <th>Выход на монтаж по договору</th>
                    <th>Дедлайн по договору</th>
                    <th>Количество дней</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {project.projectbrigades?.map((brigade) => (
                    <>
                      <tr key={brigade.id}>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => hadleUpdateBrigade(brigade.id)}>
                          {brigade.brigade.name}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => hadleCreateStartDate(brigade.id)}>
                          <Moment format="DD.MM.YYYY">{brigade.plan_start}</Moment>
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => hadleCreateFinishDate(brigade.id)}>
                          <Moment format="DD.MM.YYYY">{brigade.plan_finish}</Moment>
                        </td>
                        <td>
                          {moment(brigade.plan_finish, 'YYYY/MM/DD').businessDiff(
                            moment(brigade.plan_start, 'YYYY/MM/DD'),
                            'days',
                          )}
                        </td>
                        <td>
                          {moment(project.project.agreement_date, 'YYYY/MM/DD')
                            .businessAdd(project.project.design_period, 'days')
                            .businessAdd(project.project.expiration_date, 'days')
                            .format('DD.MM.YYYY')}
                        </td>
                        <td>
                          {moment(project.project.agreement_date, 'YYYY/MM/DD')
                            .businessAdd(project.project.design_period, 'days')
                            .businessAdd(project.project.expiration_date, 'days')
                            .businessAdd(project.project.installation_period, 'days')
                            .format('DD.MM.YYYY')}
                        </td>
                        <td>
                          {moment(brigade.plan_finish, 'YYYY/MM/DD').businessDiff(
                            moment(brigade.plan_start, 'YYYY/MM/DD'),
                            'days',
                          )}
                        </td>
                        <td>
                          <Button
                            variant="dark"
                            onClick={() => handleDeleteProjectBrigades(brigade.id)}>
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
              <Button variant="dark" onClick={() => hadleCreateBrigade(project.project.id)}>
                Назначить бригаду
              </Button>
            </div>
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="calendar">
            <CalendarProject
              brigadesDate={project.brigadesdate}
              designer={project.project.designer}
              startDateConstructor={project.project.design_start}
              endDateСonstructor={project.project.project_delivery}
              startDateDesing={project.project.agreement_date}
              endDateDesing={(() => {
                const agreementDate = new Date(project.project && project.project.agreement_date);
                const designPeriod = project.project && project.project.design_period;

                const endDate = addWorkingDays(agreementDate, designPeriod);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
              startDateProduction={project.project.agreement_date}
              endDateProduction={(() => {
                const agreementDate = new Date(project.project && project.project.agreement_date);
                const designPeriod = project.project && project.project.design_period;

                const expirationDate = project.project && project.project.expiration_date;

                const sumDays = designPeriod + expirationDate;

                const endDate = addWorkingDays(agreementDate, sumDays);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
              startDateInstallation={project.project.agreement_date}
              endDateInstallation={(() => {
                const agreementDate = new Date(project.project && project.project.agreement_date);
                const designPeriod = project.project && project.project.design_period;
                const expirationDate = project.project && project.project.expiration_date;
                const installationPeriod = project.project && project.project.installation_period;
                const sumDays = designPeriod + expirationDate + installationPeriod;

                const endDate = addWorkingDays(agreementDate, sumDays);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
            />
          </div>
        )}
        {user.isManagerSale
          ? null
          : activeTab === 'estimate' && (
              <Estimate projectId={id} regionId={project.project.regionId} />
            )}
        {activeTab === 'techSupervision' && (
          <TechExamination projectId={id} regionId={project.project.regionId} />
        )}
        {activeTab === 'cabinet' && (
          <div className="cabinet">
            {project.userProject && project.userProject.length > 0 ? (
              project.userProject.map((user) => (
                <div
                  style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                  key={user.userId}>
                  <div className="cabinet__item" onClick={() => addToInfoAccount(user.userId)}>
                    Перейти
                  </div>
                  {user.image === null ? (
                    <div
                      className="cabinet__item"
                      onClick={() => handleCreateMainImage(user.userId)}>
                      Добавить изображение
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="cabinet__item" onClick={() => handleGenerationUrl(user.userId)}>
                    Сформировать ссылку
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <div
                  className="cabinet__item"
                  onClick={() => HadleCreateAccountModal(project.project.id)}>
                  Создать личный кабинет
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'userFile' && (
          <UserFile
            project={project}
            change={change}
            setChange={setChange}
            userId={project.userProject[0].userId}
          />
        )}
        {activeTab === 'complaint' && <Complaint project={project} />}
        {activeTab === 'logistic' && (
          <ProjectLogistic project={project} projectId={id} setChange={setChange} />
        )}
      </div>
      <div className="note">
        <div className="note__title">Комментарии</div>
        <div className="note__content">
          <pre className="note__field">
            {isExpanded
              ? project.project?.note
              : project.project?.note && project.project.note.slice(0, 255)}
          </pre>
          {project.project?.note && project.project.note.length > 255 && (
            <div className="note__show" onClick={handleToggleText}>
              {isExpanded ? 'Скрыть' : 'Показать все...'}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <Button variant="dark" onClick={() => hadleUpdateNote(project.project?.id)}>
            Добавить
          </Button>
        </div>
      </div>
      {project.project && project.project.finish === 'true' ? (
        <div style={{ marginBottom: '25px' }}>
          <Button
            variant="dark"
            style={{ display: 'block', margin: '0 auto' }}
            onClick={() => handleOpenModalRestoreProject(project.project.id)}>
            Восстановить
          </Button>
        </div>
      ) : (
        <div style={{ marginBottom: '25px' }}>
          {project.project && project.project.date_finish !== null ? (
            <Button
              variant="dark"
              style={{ display: 'block', margin: '0 auto' }}
              onClick={() =>
                handleOpenModalClosedProject(project.project.id, project.project.date_finish)
              }>
              Завершить проект
            </Button>
          ) : (
            <Button
              variant="dark"
              style={{ display: 'block', margin: '0 auto' }}
              onClick={() =>
                handleOpenModalClosedProject(project.project.id, project.project.date_finish)
              }>
              Завершить проект
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectInfoList;
