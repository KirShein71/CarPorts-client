import React from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import UpdateNameProject from './modals/UpdateNameProject';
import UpdateNumberProject from './modals/UpdateNumberProject';
import UpdateDateProject from './modals/UpdateDateProject';
import CreateRegion from './modals/CreateRegion';
import CreateInstallationBilling from './modals/CreateInstallationBilling';
import GearModal from './modals/gearModal';
import { fetchAllProjects, deleteProject } from '../../http/projectApi';
import { getDaysInstallerForProjects } from '../../http/brigadesDateApi';
import { Spinner, Table, Button, Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Moment from 'react-moment';

import './style.scss';

function ProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [projectDays, setProjectDays] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [createShow, setCreateShow] = React.useState(false);
  const [updateNameModal, setUpdateNameModal] = React.useState(false);
  const [updateNumberProjectModal, setUpdateNumberProjectModal] = React.useState(false);
  const [updateDateProject, setUpdateDateProject] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [createRegionModal, setCreateRegionModal] = React.useState(false);
  const [createInstallationBillingModal, setCreateInstallationBillingModal] = React.useState(false);
  const [buttonMskProject, setButtonMskProject] = React.useState(true);
  const [buttonSpbProject, setButtonSpbProject] = React.useState(true);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [openGearModal, setOpenGearModal] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setFetching(true);
    fetchAllProjects()
      .then((data) => {
        setProjects(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
      isMsk: buttonMskProject,
      isSpb: buttonSpbProject,
    };

    const filteredProjects = projects.filter((project) => {
      // Условие для поиска по имени
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.date_finish === null
        : filters.isClosed
        ? project.date_finish !== null
        : true; // Если ни одна кнопка не активна, показываем все проекты

      // Проверяем, активны ли оба региона
      const isBothRegionsActive = filters.isMsk && filters.isSpb;

      // Проверяем, соответствует ли регион проекту
      const isRegionMatch =
        (filters.isMsk && project.regionId === 2) || (filters.isSpb && project.regionId === 1);

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        // Если обе кнопки активны, показываем все проекты, если оба региона неактивны
        return matchesSearch && (isBothRegionsActive || isRegionMatch);
      }

      // Если одна из кнопок активна (либо только активные, либо только закрытые)
      return (
        matchesSearch &&
        isActiveProject &&
        (isBothRegionsActive || (filters.isMsk || filters.isSpb ? isRegionMatch : true))
      );
    });

    setFilteredProjects(filteredProjects);
  }, [
    projects,
    buttonActiveProject,
    buttonClosedProject,
    buttonMskProject,
    buttonSpbProject,
    searchQuery,
  ]);
  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    getDaysInstallerForProjects().then((data) => setProjectDays(data));
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
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

  const handleButtonMskProject = () => {
    const newButtonMskProject = !buttonMskProject;
    setButtonMskProject(newButtonMskProject);

    if (!newButtonMskProject) {
      setButtonSpbProject(true);
    }
  };

  const handleButtonSpbProject = () => {
    const newButtonSpbProject = !buttonSpbProject;
    setButtonSpbProject(newButtonSpbProject);

    if (!newButtonSpbProject) {
      setButtonMskProject(true);
    }
  };

  const hadleUpdateNameProject = (id) => {
    setProject(id);
    setUpdateNameModal(true);
  };

  const hadleUpdateNumberProject = (id) => {
    setProject(id);
    setUpdateNumberProjectModal(true);
  };

  const hadleUpdateDateProject = (id) => {
    setProject(id);
    setUpdateDateProject(true);
  };

  const hadleCreateRegionProject = (id) => {
    setProject(id);
    setCreateRegionModal(true);
  };

  const hadleCreateInstallationBilling = (id) => {
    setProject(id);
    setCreateInstallationBillingModal(true);
  };

  const hadleOpenGearModal = (id) => {
    setProject(id);
    setOpenGearModal(true);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="projectlist">
      <Header title={'Проекты '} />

      <CreateProject show={createShow} setShow={setCreateShow} setChange={setChange} />
      <UpdateNameProject
        show={updateNameModal}
        setShow={setUpdateNameModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <UpdateNumberProject
        show={updateNumberProjectModal}
        setShow={setUpdateNumberProjectModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <UpdateDateProject
        show={updateDateProject}
        setShow={setUpdateDateProject}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <CreateRegion
        show={createRegionModal}
        setShow={setCreateRegionModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <CreateInstallationBilling
        show={createInstallationBillingModal}
        setShow={setCreateInstallationBillingModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <GearModal
        show={openGearModal}
        setShow={setOpenGearModal}
        change={change}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />

      <div style={{ display: 'flex' }}>
        <button className="button__addproject" onClick={() => setCreateShow(true)}>
          Добавить
        </button>
        <button
          className={`button__active ${buttonActiveProject === true ? 'active' : 'inactive'}`}
          onClick={handleButtonActiveProject}>
          Активные
        </button>
        <button
          className={`button__noactive ${buttonClosedProject === true ? 'active' : 'inactive'}`}
          onClick={handleButtonClosedProject}>
          Завершенные
        </button>
        <button
          className={`button__msk ${buttonMskProject === true ? 'active' : 'inactive'}`}
          onClick={handleButtonMskProject}>
          МО
        </button>
        <button
          className={`button__spb ${buttonSpbProject === true ? 'active' : 'inactive'}`}
          onClick={handleButtonSpbProject}>
          ЛО
        </button>

        <input
          class="project__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-4">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} className="production_column">
                Название
              </th>
              <th style={{ textAlign: 'center' }} className="thead_column">
                Номер
              </th>
              <th className="thead_column" onClick={() => handleSort('agreement_date')}>
                <div style={{ cursor: 'pointer', display: 'flex' }}>
                  {' '}
                  Дата дог.
                  <img
                    style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                    src="./img/sort.png"
                    alt="icon_sort"
                  />
                </div>
              </th>
              <th className="thead_column">Дедлайн</th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Регион
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Срок
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Факт
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                План
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Остаток
              </th>
              <th className="thead_column"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a[sortField]);
                const dateB = new Date(b[sortField]);

                if (sortOrder === 'desc') {
                  return dateB - dateA;
                } else {
                  return dateA - dateB;
                }
              })
              .map((item) => (
                <tr
                  key={item.id}
                  style={{
                    color: item.date_finish !== null ? '#808080' : 'black',
                  }}>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      addToInfo(item.id);
                    }}
                    className="td_column">
                    {item.name}
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      addToInfo(item.id);
                    }}>
                    {item.number}
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleUpdateDateProject(item.id)}>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                  </td>
                  <td>
                    {(() => {
                      const agreementDate = new Date(item && item.agreement_date);
                      const designPeriod = item && item.design_period;
                      const expirationDate = item && item.expiration_date;
                      const installationPeriod = item && item.installation_period;
                      const sumDays = designPeriod + expirationDate + installationPeriod;

                      const endDate = addWorkingDays(agreementDate, sumDays);
                      const formattedEndDate = formatDate(endDate);
                      return formattedEndDate;
                    })()}
                  </td>

                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleCreateRegionProject(item.id)}>
                    {item.region?.region}
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleCreateInstallationBilling(item.id)}>
                    {item.installation_billing}
                  </td>
                  {projectDays.some((projectDay) => projectDay.projectId === item.id) ? (
                    projectDays
                      .filter((projectDay) => projectDay.projectId === item.id)
                      .map((projectDay) => (
                        <>
                          <td style={{ textAlign: 'center' }}>{projectDay.factDay}</td>
                          <td style={{ textAlign: 'center' }}>{projectDay.planDay}</td>
                          <td style={{ textAlign: 'center' }}>
                            {item.installation_billing - projectDay.factDay - projectDay.planDay}
                          </td>
                        </>
                      ))
                  ) : (
                    <>
                      <td></td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                  <td>
                    {item.installation_billing === null || item.regionId === null ? (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/gear-red.png"
                        alt="gear"
                        onClick={() => hadleOpenGearModal(item.id)}
                      />
                    ) : (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/gear.png"
                        alt="gear"
                        onClick={() => hadleOpenGearModal(item.id)}
                      />
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

export default ProjectList;
