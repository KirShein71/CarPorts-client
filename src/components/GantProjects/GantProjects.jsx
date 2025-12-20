import React from 'react';
import Header from '../Header/Header';
import { getAllGanttData } from '../../http/gantApi';
import { Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.scss';

function GantProjects() {
  const [ganttData, setGanttData] = React.useState({ weeks: [], projects: [] });
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [isLoadingGant, setIsLoadingGant] = React.useState(false);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonMskProject, setButtonMskProject] = React.useState(true);
  const [buttonSpbProject, setButtonSpbProject] = React.useState(true);
  const tableWrapperRef = React.useRef(null);
  const [currentWeekIndex, setCurrentWeekIndex] = React.useState(-1);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setIsLoadingGant(true);
      try {
        const gantData = await getAllGanttData();
        console.log('Загруженные данные:', gantData); // Для отладки
        setGanttData(gantData);

        // Находим индекс текущей недели сразу после загрузки данных
        const today = new Date();
        const currentWeekStart = getWeekStartDate(today);
        const foundIndex = gantData.weeks.findIndex((week) => week.week_start === currentWeekStart);
        setCurrentWeekIndex(foundIndex);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setFetching(false);
        setIsLoadingGant(false);
      }
    };

    fetchData();
  }, [change]);

  // Скролл сразу после установки currentWeekIndex
  React.useEffect(() => {
    if (currentWeekIndex !== -1 && tableWrapperRef.current) {
      setTimeout(() => {
        scrollToCurrentWeek();
      }, 50);
    }
  }, [currentWeekIndex]);

  const scrollToCurrentWeek = () => {
    if (!tableWrapperRef.current || currentWeekIndex === -1) return;

    const targetIndex = Math.max(0, currentWeekIndex - 5);
    const table = tableWrapperRef.current;

    // Получаем все ячейки заголовка с датами
    const dateHeaders = table.querySelectorAll('thead th:not(.mobile)');

    if (dateHeaders[targetIndex]) {
      // Вычисляем позицию для скролла
      const scrollPosition = calculateScrollPosition(dateHeaders, targetIndex);
      table.scrollLeft = scrollPosition;
    }
  };

  // Функция для вычисления позиции скролла
  const calculateScrollPosition = (headers, targetIndex) => {
    let position = 0;
    for (let i = 0; i < targetIndex; i++) {
      if (headers[i]) {
        position += headers[i].offsetWidth;
      }
    }
    // Добавляем отступ для лучшего визуального восприятия
    return Math.max(0, position - 100);
  };

  // Фильтрация проектов по регионам
  React.useEffect(() => {
    if (ganttData.projects && ganttData.projects.length > 0) {
      const filters = {
        isMsk: buttonMskProject,
        isSpb: buttonSpbProject,
      };

      const filteredProjects = ganttData.projects.filter((project) => {
        if (filters.isMsk && filters.isSpb) return true;
        if (filters.isMsk) return project.regionId === 2;
        if (filters.isSpb) return project.regionId === 1;
        return true;
      });

      setFilteredProjects(filteredProjects);
    }
  }, [ganttData.projects, buttonMskProject, buttonSpbProject]);

  // Функция для получения начала недели (понедельника)
  const getWeekStartDate = (date) => {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(dateObj);
    monday.setDate(dateObj.getDate() + diff);
    return monday.toISOString().split('T')[0];
  };

  const handleButtonMskProject = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      const newButtonMskProject = !buttonMskProject;
      setButtonMskProject(newButtonMskProject);

      if (!newButtonMskProject) {
        setButtonSpbProject(true);
      }
      setIsLoadingGant(false);
    }, 300);
  };

  const handleButtonSpbProject = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      const newButtonSpbProject = !buttonSpbProject;
      setButtonSpbProject(newButtonSpbProject);

      if (!newButtonSpbProject) {
        setButtonMskProject(true);
      }
      setIsLoadingGant(false);
    }, 300);
  };

  // Функция для форматирования даты
  const formatWeekDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();

    const monthNames = {
      0: 'янв',
      1: 'фев',
      2: 'март',
      3: 'апр',
      4: 'май',
      5: 'июнь',
      6: 'июль',
      7: 'авг',
      8: 'сент',
      9: 'окт',
      10: 'нояб',
      11: 'дек',
    };

    return `${day}.${monthNames[month]}`;
  };

  const isCurrentWeek = (weekStartDate) => {
    const today = new Date();
    const currentWeekStart = getWeekStartDate(today);
    return weekStartDate === currentWeekStart;
  };

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="gant-projects">
      <Header title={'Гант проектов'} />
      <div style={{ display: 'flex', marginBottom: '10px' }}>
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
      </div>

      <div className="gant-projects-table-container">
        {isLoadingGant ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #0f0f0f',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
          </div>
        ) : (
          <div className="gant-projects-table-wrapper" ref={tableWrapperRef}>
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th className="gant-projects-table-th mobile"></th>
                  {ganttData.weeks?.map((week) => (
                    <th
                      key={week.week_start}
                      className="gant-projects-table-th date-header"
                      data-date={formatWeekDate(week.week_start)}
                      style={{
                        backgroundColor: isCurrentWeek(week.week_start) ? '#f0f0f0' : '#ffffff',
                        fontWeight: isCurrentWeek(week.week_start) ? 'bold' : 'normal',
                        position: 'relative',
                      }}>
                      <span>{formatWeekDate(week.week_start)}</span>
                      {isCurrentWeek(week.week_start) && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            backgroundColor: '#007bff',
                          }}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proGP) => (
                  <React.Fragment key={proGP.id}>
                    <tr style={{ borderTop: '2px solid #000000' }}>
                      <td
                        colSpan={ganttData.weeks.length + 1}
                        style={{ padding: 0, border: 'none' }}></td>
                    </tr>

                    {/* Строка проекта - выделяем текущую неделю */}
                    <tr>
                      <td
                        className="gant-projects-table__td mobile-project"
                        onClick={() => {
                          addToInfo(proGP.id);
                        }}>
                        {proGP.name}
                      </td>
                      {proGP.colors?.map((colorData) => {
                        const isCurrent = isCurrentWeek(colorData.week_start);
                        return (
                          <td
                            key={`project-${proGP.id}-${colorData.week_start}`}
                            className="project-cell"
                            style={{
                              backgroundColor: colorData.color,
                              border: '1px solid #dee2e6',
                              position: 'relative',
                              // Добавляем серую рамку для текущей недели
                              boxShadow: isCurrent ? 'inset 0 0 0 2px #6c757d' : 'none',
                            }}
                          />
                        );
                      })}
                    </tr>

                    {/* Строка проектировщика - выделяем текущую неделю */}
                    <tr>
                      <td className="gant-projects-table__td mobile">{proGP.designer || ''}</td>
                      {proGP.designerColors?.map((colorData) => {
                        const isCurrent = isCurrentWeek(colorData.week_start);
                        return (
                          <td
                            key={`designer-${proGP.id}-${colorData.week_start}`}
                            className="designer-cell"
                            style={{
                              backgroundColor: colorData.color,
                              border: '1px solid #dee2e6',
                              height: '20px',
                              position: 'relative',
                              boxShadow: isCurrent ? 'inset 0 0 0 2px #6c757d' : 'none',
                            }}
                          />
                        );
                      })}
                    </tr>

                    {/* Строки бригад - выделяем текущую неделю */}
                    {proGP.brigadesDetails && proGP.brigadesDetails.length > 0 ? (
                      proGP.brigadesDetails.map((brigade) => (
                        <tr key={`brigade-${proGP.id}-${brigade.id}`}>
                          <td className="gant-projects-table__td mobile">{brigade.name}</td>
                          {proGP.brigadeColors && proGP.brigadeColors[brigade.id]
                            ? proGP.brigadeColors[brigade.id].map((colorData) => {
                                const isCurrent = isCurrentWeek(colorData.week_start);
                                return (
                                  <td
                                    key={`brigade-${proGP.id}-${brigade.id}-${colorData.week_start}`}
                                    className="brigade-cell"
                                    style={{
                                      backgroundColor: colorData.color,
                                      border: '1px solid #dee2e6',
                                      height: '20px',
                                      position: 'relative',
                                      boxShadow: isCurrent ? 'inset 0 0 0 2px #6c757d' : 'none',
                                    }}
                                  />
                                );
                              })
                            : ganttData.weeks?.map((week) => {
                                const isCurrent = isCurrentWeek(week.week_start);
                                return (
                                  <td
                                    key={`empty-${proGP.id}-${brigade.id}-${week.week_start}`}
                                    className="brigade-cell"
                                    style={{
                                      backgroundColor: 'transparent',
                                      border: '1px solid #dee2e6',
                                      height: '20px',
                                      position: 'relative',
                                      boxShadow: isCurrent ? 'inset 0 0 0 2px #6c757d' : 'none',
                                    }}
                                  />
                                );
                              })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="gant-projects-table__td mobile">Нет бригад</td>
                        {ganttData.weeks?.map((week) => {
                          const isCurrent = isCurrentWeek(week.week_start);
                          return (
                            <td
                              key={`empty-${proGP.id}-${week.week_start}`}
                              className="brigade-cell"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #dee2e6',
                                height: '20px',
                                position: 'relative',
                                boxShadow: isCurrent ? 'inset 0 0 0 2px #6c757d' : 'none',
                              }}
                            />
                          );
                        })}
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GantProjects;
