import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import UpdateNameProject from './modals/UpdateNameProject';
import UpdateNumberProject from './modals/UpdateNumberProject';
import UpdateDateProject from './modals/UpdateDateProject';
import CreateRegion from './modals/CreateRegion';
import CreateInstallationBilling from './modals/CreateInstallationBilling';
import GearModal from './modals/gearModal';
import { getAllForProjectPage } from '../../http/projectApi';
import { getDaysInstallerForProjects } from '../../http/brigadesDateApi';
import { Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import UpdateDateFinishProject from './modals/UpdateDateFinishProject';
import CreatePriceProject from './modals/CreatePriceProject';
import NpsModal from './modals/NpsModal';
import './style.scss';

// Выносим константы за пределы компонента
const HOLIDAYS = [
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
];

const holidaysSet = new Set(HOLIDAYS);

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [projectDays, setProjectDays] = useState(new Map());
  const [fetching, setFetching] = useState(true);
  const [createShow, setCreateShow] = useState(false);
  const [updateNameModal, setUpdateNameModal] = useState(false);
  const [updateNumberProjectModal, setUpdateNumberProjectModal] = useState(false);
  const [updateDateProject, setUpdateDateProject] = useState(false);
  const [change, setChange] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('agreement_date');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [createRegionModal, setCreateRegionModal] = useState(false);
  const [createInstallationBillingModal, setCreateInstallationBillingModal] = useState(false);
  const [createPriceProjectModal, setCreatePriceProjectModal] = useState(false);
  const [buttonMskProject, setButtonMskProject] = useState(true);
  const [buttonSpbProject, setButtonSpbProject] = useState(true);
  const [buttonActiveProject, setButtonActiveProject] = useState(true);
  const [buttonClosedProject, setButtonClosedProject] = useState(false);
  const [openGearModal, setOpenGearModal] = useState(false);
  const [openModalUpdateDateFinishProject, setOpenModalUpdateDateFinishProject] = useState(false);
  const [openModalNpsProject, setOpenModalNpsProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [nameProject, setNameProject] = useState(null);
  const [numberProject, setNumberProject] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Мемоизированные функции для расчета дат
  const isWorkingDay = useCallback((date) => {
    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split('T')[0];
    return dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaysSet.has(dateString);
  }, []);

  const addWorkingDays = useCallback(
    (startDate, daysToAdd) => {
      let currentDate = new Date(startDate);
      let addedDays = 0;

      while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (isWorkingDay(currentDate)) {
          addedDays++;
        }
      }
      return currentDate;
    },
    [isWorkingDay],
  );

  const formatDate = useCallback((date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      try {
        const [projectsData, daysData] = await Promise.all([
          getAllForProjectPage(),
          getDaysInstallerForProjects(),
        ]);

        setProjects(projectsData);

        // Создаем Map для быстрого доступа
        const daysMap = new Map();
        daysData.forEach((item) => {
          daysMap.set(item.projectId, {
            factDay: item.factDay,
            planDay: item.planDay,
          });
        });
        setProjectDays(daysMap);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [change]);

  // Фильтрация проектов с useMemo
  useEffect(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());

      let isActiveMatch = true;
      if (buttonActiveProject && !buttonClosedProject) {
        isActiveMatch = project.finish === null;
      } else if (!buttonActiveProject && buttonClosedProject) {
        isActiveMatch = project.finish === 'true';
      }

      const isRegionMatch =
        (buttonMskProject && project.regionId === 2) ||
        (buttonSpbProject && project.regionId === 1);
      const isBothRegions = buttonMskProject && buttonSpbProject;

      return matchesSearch && isActiveMatch && (isBothRegions || isRegionMatch);
    });

    setFilteredProjects(filtered);
  }, [
    projects,
    searchQuery,
    buttonActiveProject,
    buttonClosedProject,
    buttonMskProject,
    buttonSpbProject,
  ]);

  // Сортировка с useMemo
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      let dateA, dateB;

      if (sortField === 'agreement_date') {
        dateA = new Date(a[sortField]);
        dateB = new Date(b[sortField]);
      } else {
        dateA = a[sortField];
        dateB = b[sortField];
      }

      if (sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [filteredProjects, sortField, sortOrder]);

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleButtonActiveProject = useCallback(() => {
    setButtonActiveProject((prev) => !prev);
    if (buttonActiveProject) {
      setButtonClosedProject(false);
    }
  }, [buttonActiveProject]);

  const handleButtonClosedProject = useCallback(() => {
    setButtonClosedProject((prev) => !prev);
    if (buttonClosedProject) {
      setButtonActiveProject(false);
    }
  }, [buttonClosedProject]);

  const handleButtonMskProject = useCallback(() => {
    setButtonMskProject((prev) => !prev);
    if (!buttonMskProject) {
      setButtonSpbProject(true);
    }
  }, [buttonMskProject]);

  const handleButtonSpbProject = useCallback(() => {
    setButtonSpbProject((prev) => !prev);
    if (!buttonSpbProject) {
      setButtonMskProject(true);
    }
  }, [buttonSpbProject]);

  const addToInfo = useCallback(
    (id) => {
      navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
    },
    [navigate, location.pathname],
  );

  // Компонент строки таблицы для оптимизации рендеринга
  const ProjectRow = React.memo(
    ({
      item,
      projectDays,
      addWorkingDays,
      formatDate,
      addToInfo,
      hadleUpdateDateProject,
      hadleCreateRegionProject,
      hadleCreatePriceProject,
      hadleOpenModalUpdateDateFinishProject,
      hadleOpenGearModal,
      handleOpenModalNpsProject,
    }) => {
      const daysInfo = projectDays.get(item.id);

      const getDeadlineInfo = useMemo(() => {
        const agreementDate = new Date(item.agreement_date);
        const sumDays =
          (item.design_period || 0) + (item.expiration_date || 0) + (item.installation_period || 0);
        const endDate = addWorkingDays(agreementDate, sumDays);
        const formattedEndDate = formatDate(endDate);

        const finishDate = item.date_finish ? new Date(item.date_finish) : null;
        const isProjectClosed = finishDate !== null;
        const deadlineDate = new Date(endDate);
        deadlineDate.setHours(0, 0, 0, 0);

        let textColor = '#000000';
        let fontWeight = 'normal';

        if (isProjectClosed) {
          const finishDateOnly = new Date(finishDate);
          finishDateOnly.setHours(0, 0, 0, 0);
          if (finishDateOnly > deadlineDate) {
            textColor = '#dc3545';
          }
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffTime = deadlineDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays < 0) {
            textColor = '#dc3545';
          } else if (diffDays <= 7) {
            textColor = '#e83e8c';
            fontWeight = 'bold';
          }
        }

        return { formattedEndDate, textColor, fontWeight };
      }, [item, addWorkingDays, formatDate]);

      return (
        <tr style={{ color: item.finish === 'true' ? '#808080' : 'black' }}>
          <td
            className="project-td mobile"
            style={{ cursor: 'pointer', textAlign: 'left' }}
            onClick={() => addToInfo(item.id)}>
            {item.name}
          </td>
          <td style={{ textAlign: 'center' }}>
            {daysInfo && item.installation_period !== 0
              ? `${Math.round((daysInfo.factDay / item.installation_period) * 100)}%`
              : ''}
          </td>
          <td style={{ textAlign: 'center' }}>
            {item.paymentPercentage ? `${item.paymentPercentage}%` : ''}
          </td>
          <td style={{ cursor: 'pointer', textAlign: 'left' }} onClick={() => addToInfo(item.id)}>
            {item.number}
          </td>
          <td
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => hadleUpdateDateProject(item.id)}>
            <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
          </td>
          <td style={{ textAlign: 'center' }}>
            <span
              style={{ color: getDeadlineInfo.textColor, fontWeight: getDeadlineInfo.fontWeight }}>
              {getDeadlineInfo.formattedEndDate}
            </span>
          </td>
          <td
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => hadleCreateRegionProject(item.id)}>
            {item.region?.region}
          </td>
          <td
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => hadleCreatePriceProject(item.id)}>
            {item.price?.toLocaleString('ru-RU')}
          </td>
          <td style={{ textAlign: 'center' }}>{item.installation_billing}</td>
          <td style={{ textAlign: 'center' }}>{daysInfo?.factDay || ''}</td>
          <td style={{ textAlign: 'center' }}>{daysInfo?.planDay || ''}</td>
          <td style={{ textAlign: 'center' }}>
            {item.installation_period - (daysInfo?.factDay || 0) - (daysInfo?.planDay || 0)}
          </td>
          <td style={{ textAlign: 'center' }}>
            {item.date_finish && (
              <Moment
                format="DD.MM.YYYY"
                style={{ cursor: 'pointer' }}
                onClick={() => hadleOpenModalUpdateDateFinishProject(item.id)}>
                {item.date_finish}
              </Moment>
            )}
          </td>
          <td style={{ textAlign: 'center' }}>
            {item.agreement_date &&
              (() => {
                const finishDate = item.date_finish ? new Date(item.date_finish) : new Date();
                const agreementDate = new Date(item.agreement_date);
                return Math.ceil((finishDate - agreementDate) / (1000 * 60 * 60 * 24));
              })()}
          </td>
          <td style={{ textAlign: 'center' }}>
            {item.hasExamination && (
              <img style={{ display: 'block', margin: '0 auto' }} src="./img/done.png" alt="done" />
            )}
          </td>
          <td style={{ textAlign: 'center' }}>
            {item.estimate && (
              <img style={{ display: 'block', margin: '0 auto' }} src="./img/done.png" alt="done" />
            )}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter1 ? `${item.npsChapter1}%` : ''}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter2 ? `${item.npsChapter2}%` : ''}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter3 ? `${item.npsChapter3}%` : ''}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter4 ? `${item.npsChapter4}%` : ''}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter5 ? `${item.npsChapter5}%` : ''}
          </td>
          <td
            className="project__nps"
            onClick={() => handleOpenModalNpsProject(item.id, item.name, item.number)}>
            {item.npsChapter6 ? `${item.npsChapter6}%` : ''}
          </td>
          <td>
            <img
              style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
              src={
                item.installation_period === null || item.regionId === null
                  ? './img/gear-red.png'
                  : './img/gear.png'
              }
              alt="gear"
              onClick={() => hadleOpenGearModal(item.id)}
            />
          </td>
        </tr>
      );
    },
  );

  if (fetching) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="projectlist">
      <Header title={'Проекты '} />

      {/* Модальные окна */}
      <CreateProject show={createShow} setShow={setCreateShow} setChange={setChange} />
      <UpdateNameProject
        show={updateNameModal}
        setShow={setUpdateNameModal}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <UpdateNumberProject
        show={updateNumberProjectModal}
        setShow={setUpdateNumberProjectModal}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <UpdateDateProject
        show={updateDateProject}
        setShow={setUpdateDateProject}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <CreateRegion
        show={createRegionModal}
        setShow={setCreateRegionModal}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <CreateInstallationBilling
        show={createInstallationBillingModal}
        setShow={setCreateInstallationBillingModal}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <CreatePriceProject
        show={createPriceProjectModal}
        setShow={setCreatePriceProjectModal}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <GearModal
        show={openGearModal}
        setShow={setOpenGearModal}
        change={change}
        setChange={setChange}
        id={selectedProject}
        scrollPosition={scrollPosition}
      />
      <UpdateDateFinishProject
        show={openModalUpdateDateFinishProject}
        setShow={setOpenModalUpdateDateFinishProject}
        change={change}
        setChange={setChange}
        id={selectedProject}
      />
      <NpsModal
        show={openModalNpsProject}
        setShow={setOpenModalNpsProject}
        projectId={selectedProject}
        nameProject={nameProject}
        numberProject={numberProject}
        setChangeProject={setChange}
      />

      <div style={{ display: 'flex' }}>
        <button className="button__addproject" onClick={() => setCreateShow(true)}>
          Добавить
        </button>
        <button
          className={`button__active ${buttonActiveProject ? 'active' : 'inactive'}`}
          onClick={handleButtonActiveProject}>
          Активные
        </button>
        <button
          className={`button__noactive ${buttonClosedProject ? 'active' : 'inactive'}`}
          onClick={handleButtonClosedProject}>
          Завершенные
        </button>
        <button
          className={`button__msk ${buttonMskProject ? 'active' : 'inactive'}`}
          onClick={handleButtonMskProject}>
          МО
        </button>
        <button
          className={`button__spb ${buttonSpbProject ? 'active' : 'inactive'}`}
          onClick={handleButtonSpbProject}>
          ЛО
        </button>
        <input
          className="project__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="project-table-container">
        <div className="project-table-wrapper">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th className="project-th mobile">Название</th>
                <th className="project-th">% вып</th>
                <th className="project-th">% впл</th>
                <th className="project-th">Номер</th>
                <th className="project-th" onClick={() => setSortField('agreement_date')}>
                  <div style={{ cursor: 'pointer', display: 'flex' }}>
                    Дата дог.
                    <img
                      style={{
                        marginLeft: '10px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                      src="./img/sort.png"
                      alt="icon_sort"
                    />
                  </div>
                </th>
                <th className="project-th">Дедлайн</th>
                <th className="project-th">Регион</th>
                <th className="project-th">Работы</th>
                <th className="project-th">Срок</th>
                <th className="project-th">Факт</th>
                <th className="project-th">План</th>
                <th className="project-th">Остаток</th>
                <th className="project-th">Дата закр.</th>
                <th className="project-th">Ср. реал.</th>
                <th className="project-th">ТН</th>
                <th className="project-th">СМ</th>
                <th className="project-th">Nps(1)</th>
                <th className="project-th">Nps(2)</th>
                <th className="project-th">Nps(3)</th>
                <th className="project-th">Nps(4)</th>
                <th className="project-th">Nps(5)</th>
                <th className="project-th">Nps(6)</th>
                <th className="project-th"></th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((item) => (
                <ProjectRow
                  key={item.id}
                  item={item}
                  projectDays={projectDays}
                  addWorkingDays={addWorkingDays}
                  formatDate={formatDate}
                  addToInfo={addToInfo}
                  hadleUpdateDateProject={(id) => {
                    setSelectedProject(id);
                    setUpdateDateProject(true);
                  }}
                  hadleCreateRegionProject={(id) => {
                    setSelectedProject(id);
                    setCreateRegionModal(true);
                  }}
                  hadleCreatePriceProject={(id) => {
                    setSelectedProject(id);
                    setCreatePriceProjectModal(true);
                  }}
                  hadleOpenModalUpdateDateFinishProject={(id) => {
                    setSelectedProject(id);
                    setOpenModalUpdateDateFinishProject(true);
                  }}
                  hadleOpenGearModal={(id) => {
                    setSelectedProject(id);
                    setOpenGearModal(true);
                  }}
                  handleOpenModalNpsProject={(id, name, number) => {
                    setSelectedProject(id);
                    setNameProject(name);
                    setNumberProject(number);
                    setOpenModalNpsProject(true);
                  }}
                />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProjectList;
