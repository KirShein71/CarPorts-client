import React from 'react';
import { getProjectInfo, createDateFinish } from '../../http/projectApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { deleteProjectBrigades } from '../../http/projectBrigadesApi';
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

import './style.scss';

function ProjectInfoList() {
  const { id } = useParams();
  const [project, setProject] = React.useState();
  const [user, setUser] = React.useState(null);
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

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    getProjectInfo(id).then((data) => setProject(data));
    fetchAllDetails().then((data) => setNameDetails(data));
  }, [id, change]);

  const handleFinishProject = (id) => {
    if (project.project.date_finish !== null) {
      return;
    }
    setProject(id);
    createDateFinish(id, { date_finish: new Date().toISOString() })
      .then(() => {
        navigate('/project');
      })
      .catch((error) => alert(error.response.data.message));
  };

  const HadleCreateAccountModal = (id) => {
    setProject(id);
    setCreateAccount(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateMainImage = (userId) => {
    setUser(userId);
    setCreateMainImageModal(true);
  };

  const hadleUpdateNote = (id) => {
    setProject(id);
    setUpdateNoteModal(true);
  };

  const hadleUpdateBrigade = (id) => {
    setProjectBrigade(id);
    setUpdateBrigadeModal(true);
  };

  const hadleCreateBrigade = (id) => {
    setProject(id);
    setCreateBrigadeModal(true);
    console.log(id);
  };

  const hadleCreateStartDate = (id) => {
    setProjectBrigade(id);
    setCreateStartDateModal(true);
  };

  const hadleCreateFinishDate = (id) => {
    setProjectBrigade(id);
    setCreateFinishDateModal(true);
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

  const handleToggleText = () => {
    setIsExpanded(!isExpanded);
  };

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
        id={user}
        show={createMainImageModal}
        setShow={setCreateMainImageModal}
        setChange={setChange}
      />
      <UpdateNote
        id={id}
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
      <div className="header">
        <Link to="/project">
          <img className="header__icon" src="../back.png" alt="back" />
        </Link>
        <h1 className="header__title">Подробная информация о проекте</h1>
      </div>
      <div className="projectinfo__content">
        <div className="projectinfo__content">
          <div className="projectinfo__image">
            {project &&
            project.userProject &&
            (project.userProject.length === 0 ||
              project.userProject.every((user) => !user.image)) ? (
              <img src="../fon.jpg" alt="image__company" />
            ) : (
              project.userProject &&
              project.userProject.map(
                (user) =>
                  user.image && (
                    <img
                      key={user.id}
                      src={process.env.REACT_APP_IMG_URL + user.image}
                      alt="main"
                    />
                  ),
              )
            )}
          </div>
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
                  activeTab === 'brigade' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('brigade')}>
                Монтаж
              </div>
              <div
                className={`projectinfo__filter-card__item ${
                  activeTab === 'cabinet' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('cabinet')}>
                Личный кабинет
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
                  <td>{project.project && project.project.design_period}</td>
                  <td>
                    {moment(project.project && project.project.agreement_date, 'YYYY/MM/DD')
                      .businessAdd(project.project && project.project.design_period, 'days')
                      .format('DD.MM.YYYY')}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>Производство</td>
                  <td>{project.project && project.project.expiration_date}</td>
                  <td>
                    {moment(project.project && project.project.agreement_date, 'YYYY/MM/DD')
                      .businessAdd(project.project && project.project.expiration_date, 'days')
                      .format('DD.MM.YYYY')}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>Монтажные работы</td>
                  <td>{project.project && project.project.installation_period}</td>
                  <td>
                    {moment(project.project && project.project.agreement_date, 'YYYY/MM/DD')
                      .businessAdd(project.project && project.project.installation_period, 'days')
                      .format('DD.MM.YYYY')}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        {activeTab === 'designer' && (
          <div className="designer">
            <Table bordered hover size="sm" className="mt-3 custom-table">
              <thead>
                <tr>
                  <th>Конструктор</th>
                  <td>{project.project && project.project.designer}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Дата начала</th>
                  <td>
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
                  <td>
                    {project.project && project.project.design_start ? (
                      <Moment format="DD.MM.YYYY">
                        {project.project && project.project_delivery}
                      </Moment>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th>Проверяет проек</th>
                  <td>{project.project && project.project.inspection_designer}</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <th>Дата проверки</th>
                  <td>
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
          <Table bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Тип материала</th>
                <th>Оплаты</th>
                <th>Прогноз готовности</th>
                <th>Готовность</th>
                <th>Отгрузки</th>
              </tr>
            </thead>
            <tbody>
              {project.projectmaterials.map((property) => (
                <tr key={property.id}>
                  <td>{property.materialName}</td>
                  <td>
                    {property.date_payment ? (
                      <Moment format="DD.MM.YYYY">{property.date_payment}</Moment>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {moment(property.date_payment, 'YYYY/MM/DD').isValid() &&
                    moment(property.expirationMaterial_date, 'YYYY/MM/DD').isValid()
                      ? moment(property.date_payment, 'YYYY/MM/DD')
                          .businessAdd(property.expirationMaterial_date, 'days')
                          .format('DD.MM.YYYY')
                      : ''}
                  </td>
                  <td>
                    {property.ready_date ? (
                      <Moment format="DD.MM.YYYY">{property.ready_date}</Moment>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {property.shipping_date ? (
                      <Moment format="DD.MM.YYYY">{property.shipping_date}</Moment>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {activeTab === 'production' && (
          <div className="production">
            <div className="table-container">
              <Table bordered size="md" className="mt-3">
                <thead className="thead_column">
                  <tr>
                    <th className="production_column">Производство</th>
                    {nameDetails
                      .sort((a, b) => a.id - b.id)
                      .map((part) => (
                        <th key={part.id}>{part.name}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="production_column">Заказ</th>
                    {nameDetails
                      .sort((a, b) => a.id - b.id)
                      .map((part) => {
                        const detailProject = project.extractedDetails.find(
                          (prop) => prop.detailId === part.id,
                        );
                        const quantity = detailProject ? detailProject.quantity : '';
                        return <td key={part.id}>{quantity}</td>;
                      })}
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <th className="production_column">Отгрузка</th>
                    {nameDetails
                      .sort((a, b) => a.id - b.id)
                      .map((part) => {
                        const detailProject = project.shipmentDetails.find(
                          (prop) => prop.detailId === part.id,
                        );
                        const quantity = detailProject ? detailProject.quantity : '';
                        return <td key={part.id}>{quantity}</td>;
                      })}
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
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
                            variant="secondary"
                            onClick={() => handleDeleteProjectBrigades(brigade.id)}>
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
              <Button onClick={() => hadleCreateBrigade(project.project.id)}>
                Назначить бригаду
              </Button>
            </div>
          </div>
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
          <Button onClick={() => hadleUpdateNote(project.project?.id)}>Добавить</Button>
        </div>
      </div>
      <div style={{ marginBottom: '25px' }}>
        <Button
          variant="outline-secondary"
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => handleFinishProject(project.project.id)}
          disabled={project.project && project.project.date_finish !== null}>
          Завершить проект
        </Button>
      </div>
    </div>
  );
}

export default ProjectInfoList;
