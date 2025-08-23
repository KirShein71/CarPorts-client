import React from 'react';
import Header from '../Header/Header';
import CreateProjectDelivery from './modals/CreateProjectDelivery';
import CreateDateInspection from './modals/CreateDateInspection';
import CreateInspectionDesigner from './modals/CreateInspectionDisegner';
import CreateDesignerStart from './modals/CreateDesignerStart';
import UpdateDesigner from './modals/UpdateDisegner';
import UpdateNote from './modals/UpdateNote';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment-business-days';
import { logout } from '../../http/userApi';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

import './style.scss';

function PlanningList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [createDesignerStart, setCreateDesignerStart] = React.useState(false);
  const [createDateInspectionModal, setCreateDateInspectionModal] = React.useState(false);
  const [createInspectionDesignerModal, setCreateInspectionDesignerModal] = React.useState(false);
  const [updateDisegnerModal, setUpdateDisegnerModal] = React.useState(false);
  const [updateNote, setUpdateNote] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [buttonNoDesignerProject, setButtonNoDesignerProject] = React.useState(true);
  const [buttonInProgressProject, setButtonInProgressProject] = React.useState(true);
  const [buttonCompletedProject, setButtonCompletedProject] = React.useState(false);
  const navigate = useNavigate();
  const navigateToProjectInfo = useNavigate();
  const location = useLocation();
  const { user } = React.useContext(AppContext);

  React.useEffect(() => {
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
      isNoDesigner: buttonNoDesignerProject,
      isProgress: buttonInProgressProject,
      isCompleted: buttonCompletedProject,
    };

    const filteredProjects = projects.filter((project) => {
      // Условие для поиска по имени
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.finish === null
        : filters.isClosed
        ? project.finish === 'true'
        : true; // Если ни одна кнопка не активна, показываем все проекты

      // Проверяем, активны ли оба региона
      const isButtonPlanningActive =
        filters.isNoDesigner && filters.isProgress && filters.isCompleted;

      // Проверяем, соответствует ли регион проекту
      const isButtonMatch =
        (filters.isNoDesigner && project.designer === null) ||
        (filters.isProgress && project.date_inspection === null && project.designer !== null) ||
        (filters.isCompleted && project.project_delivery !== null);

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        // Если обе кнопки активны, показываем все проекты, если оба региона неактивны
        return matchesSearch && (isButtonPlanningActive || isButtonMatch);
      }

      // Если одна из кнопок активна (либо только активные, либо только закрытые)
      return (
        matchesSearch &&
        isActiveProject &&
        (isButtonPlanningActive ||
          (filters.isNoDesigner || filters.isProgress || filters.isCompleted
            ? isButtonMatch
            : true))
      );
    });

    setFilteredProjects(filteredProjects);
  }, [
    projects,
    buttonActiveProject,
    buttonClosedProject,
    buttonCompletedProject,
    buttonInProgressProject,
    buttonNoDesignerProject,
    searchQuery,
  ]);

  const handleUpdateProjectDelivery = (id) => {
    setProject(id);
    setUpdateShow(true);
  };

  const handleCreateDesignerStart = (id) => {
    setProject(id);
    setCreateDesignerStart(true);
  };

  const handleCreateDateInspection = (id) => {
    setProject(id);
    setCreateDateInspectionModal(true);
  };

  const handleCreateInspectionDesigner = (id) => {
    setProject(id);
    setCreateInspectionDesignerModal(true);
  };

  const handleUpdateDisegnerModal = (id) => {
    setProject(id);
    setUpdateDisegnerModal(true);
  };

  const handleUpdateNote = (id) => {
    setProject(id);
    setUpdateNote(true);
  };

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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

  const handleNoDisegnerProject = () => {
    setButtonNoDesignerProject(!buttonNoDesignerProject);
  };

  const handleButtonInProgressPorject = () => {
    setButtonInProgressProject(!buttonInProgressProject);
  };

  const handleCompletedProject = () => {
    setButtonCompletedProject(!buttonCompletedProject);
  };

  const handleToggleText = (id) => {
    if (selectedNote === id) {
      setSelectedNote(null);
      window.scrollTo(0, scrollPosition); // Возвращаемся к предыдущей позиции скролла
    } else {
      // Сохраняем информацию о скрытой ячейке

      setScrollPosition(window.scrollY); // Сохраняем текущую позицию скролла
      setSelectedNote(id);
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

  if (fetching) {
    return <Spinner animation="border" />;
  }

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  const addToProjectInfo = (id) => {
    navigateToProjectInfo(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="planninglist">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Header title={'Проектирование'} />
        {user.isConstructor ? (
          <div className="homepage__item" style={{ marginTop: '25px' }} onClick={handleLogout}>
            Выйти
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex' }}>
        <button
          className={`button__nodesigner ${
            buttonNoDesignerProject === true ? 'active' : 'inactive'
          }`}
          onClick={handleNoDisegnerProject}>
          Новые
        </button>
        <button
          className={`button__inprogress ${
            buttonInProgressProject === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonInProgressPorject}>
          В работе
        </button>
        <button
          className={`button__completed ${buttonCompletedProject === true ? 'active' : 'inactive'}`}
          onClick={handleCompletedProject}>
          Сданные
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
        <input
          class="planning__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
          style={{ color: 'black' }}
        />
      </div>
      <input
        class="planning__search mobile"
        placeholder="Поиск"
        value={searchQuery}
        onChange={handleSearch}
      />
      <CreateProjectDelivery
        id={project}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
        planningPage={true}
      />
      <CreateDesignerStart
        id={project}
        show={createDesignerStart}
        setShow={setCreateDesignerStart}
        setChange={setChange}
        scrollPosition={scrollPosition}
        planningPage={true}
      />
      <CreateDateInspection
        id={project}
        show={createDateInspectionModal}
        setShow={setCreateDateInspectionModal}
        setChange={setChange}
        scrollPosition={scrollPosition}
        planningPage={true}
      />
      <CreateInspectionDesigner
        id={project}
        show={createInspectionDesignerModal}
        setShow={setCreateInspectionDesignerModal}
        setChange={setChange}
        scrollPosition={scrollPosition}
        planningPage={true}
      />
      <UpdateDesigner
        id={project}
        show={updateDisegnerModal}
        setShow={setUpdateDisegnerModal}
        setChange={setChange}
        planningPage={true}
      />
      <UpdateNote
        id={project}
        show={updateNote}
        setShow={setUpdateNote}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <div className="planning-table-container">
        <div className="planning-table-wrapper">
          <Table Table bordered hover size="sm">
            <thead>
              <tr>
                <th className="planning-th mobile">
                  Название<div className="border_bottom"></div>
                </th>
                <th className="planning-th">Примечание</th>
                <th className="planning-th" onClick={() => handleSort('agreement_date')}>
                  <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                    <img
                      style={{ marginLeft: '5px', height: '100%' }}
                      src="./img/sort.png"
                      alt="icon_sort"
                    />
                  </div>
                </th>
                <th className="planning-th">Срок</th>
                <th className="planning-th">Дедлайн</th>
                <th className="planning-th">Дата начала</th>
                <th className="planning-th">Дата сдачи</th>
                <th className="planning-th">Дата проверки</th>
                <th className="planning-th">Осталось дней</th>
                <th className="planning-th">Проектировщик</th>
                <th className="planning-th">Проверяет проект</th>
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
                  <tr style={{ color: item.finish === 'true' ? '#808080' : 'black' }} key={item.id}>
                    {user.isConstructor ? (
                      <td className="planning-td mobile" style={{ cursor: 'pointer' }}>
                        <div style={{ whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div>{item.number}</div>

                        <div className="border_top"></div>
                      </td>
                    ) : (
                      <td
                        className="planning-td mobile"
                        onClick={() => addToProjectInfo(item.id)}
                        style={{ cursor: 'pointer' }}>
                        <div style={{ whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div>{item.number}</div>

                        <div className="border_top"></div>
                      </td>
                    )}

                    <td style={{ cursor: 'pointer' }}>
                      {item.note && (
                        <div onClick={() => handleUpdateNote(item.id)}>
                          {selectedNote === item.id
                            ? item.note
                            : item.note.slice(0, window.innerWidth < 460 ? 20 : 180)}
                        </div>
                      )}
                      {item.note.length > 180 ||
                      (window.innerWidth < 460 && item.note.length > 20) ? (
                        <div className="show" onClick={() => handleToggleText(item.id)}>
                          {selectedNote === item.id ? 'Скрыть' : '...'}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.design_period}</td>
                    <td>
                      {(() => {
                        const agreementDate = new Date(item.agreement_date);
                        const designPeriod = item.design_period;

                        const endDate = addWorkingDays(agreementDate, designPeriod);
                        const formattedEndDate = formatDate(endDate);
                        return formattedEndDate;
                      })()}
                    </td>
                    <td
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleCreateDesignerStart(item.id)}>
                      {item.design_start ? (
                        <Moment format="DD.MM.YYYY">{item.design_start}</Moment>
                      ) : (
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}>
                          +
                        </span>
                      )}
                    </td>
                    <td
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleUpdateProjectDelivery(item.id)}>
                      {item.project_delivery ? (
                        <Moment format="DD.MM.YYYY">{item.project_delivery}</Moment>
                      ) : (
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}>
                          +
                        </span>
                      )}
                    </td>
                    <td
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleCreateDateInspection(item.id)}>
                      {item.date_inspection ? (
                        <Moment format="DD.MM.YYYY" parse="YYYY-MM-DD">
                          {item.date_inspection}
                        </Moment>
                      ) : (
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}>
                          +
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        backgroundColor: (() => {
                          const targetDate = moment(item.agreement_date, 'YYYY/MM/DD').businessAdd(
                            item.design_period,
                            'days',
                          );

                          function getDaysLeft(targetDate) {
                            const today = moment();
                            return targetDate.diff(today, 'days');
                          }

                          const daysLeft = getDaysLeft(targetDate);

                          if (daysLeft < 0) {
                            return '#ff0000'; // красный для минусовых значений
                          } else if (daysLeft < 7) {
                            return '#ffe6e6'; // бледно-розовый для менее 7 дней
                          } else {
                            return 'transparent'; // прозрачный для остальных
                          }
                        })(),
                      }}>
                      {(() => {
                        const targetDate = moment(item.agreement_date, 'YYYY/MM/DD').businessAdd(
                          item.design_period,
                          'days',
                        );

                        const today = moment();
                        return targetDate.diff(today, 'days'); // Просто возвращаем разницу в днях
                      })()}
                    </td>
                    <td
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleUpdateDisegnerModal(item.id)}>
                      {item.designer ? (
                        <div>{item.designer}</div>
                      ) : (
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}>
                          +
                        </span>
                      )}
                    </td>
                    <td
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => handleCreateInspectionDesigner(item.id)}>
                      {item.inspection_designer ? (
                        <div>{item.inspection_designer}</div>
                      ) : (
                        <span
                          style={{
                            color: 'red',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}>
                          +
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {/* <CSVLink data={flattenedProjects} headers={headers} filename={'данные.csv'}>
            Экспорт в CSV
          </CSVLink> */}
        </div>
      </div>
    </div>
  );
}

export default PlanningList;
