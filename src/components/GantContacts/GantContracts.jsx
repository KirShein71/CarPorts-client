import React from 'react';
import Header from '../Header/Header';
import { Spinner, Table } from 'react-bootstrap';
import { getAllActiveProject } from '../../http/projectApi';
import { getAllDate } from '../../http/brigadesDateApi';
import Moment from 'react-moment';
import './style.scss';
import { useLocation, useNavigate } from 'react-router-dom';

function GantContracts() {
  const [projects, setProjects] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonMskProject, setButtonMskProject] = React.useState(true);
  const [buttonSpbProject, setButtonSpbProject] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [currentMonthGant, setCurrentMonthGant] = React.useState(new Date().getMonth());
  const [currentYearGant, setCurrentYearGant] = React.useState(new Date().getFullYear());
  const [isLoadingGant, setIsLoadingGant] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setIsLoadingGant(true);
      try {
        // Параллельное выполнение запросов для оптимизации
        const [projectsData, datesData] = await Promise.all([getAllActiveProject(), getAllDate()]);

        setProjects(projectsData);
        setDates(datesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // Можно добавить обработку ошибок (например, setErrorState)
      } finally {
        setFetching(false);
        setIsLoadingGant(false);
      }
    };

    fetchData();
  }, []);

  const handlePrevMonthGant = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      if (currentMonthGant === 0) {
        setCurrentMonthGant(11);
        setCurrentYearGant(currentYearGant - 1);
      } else {
        setCurrentMonthGant(currentMonthGant - 1);
      }
      setIsLoadingGant(false);
    }, 300); // Длительность анимации
  };

  const handleNextMonthGant = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      if (currentMonthGant === 11) {
        setCurrentMonthGant(0);
        setCurrentYearGant(currentYearGant + 1);
      } else {
        setCurrentMonthGant(currentMonthGant + 1);
      }
      setIsLoadingGant(false);
    }, 300);
  };

  const filteredDatesGant = dates.filter((date) => {
    const dateObj = new Date(date.date);
    return dateObj.getMonth() === currentMonthGant && dateObj.getFullYear() === currentYearGant;
  });

  React.useEffect(() => {
    const filters = {
      isMsk: buttonMskProject,
      isSpb: buttonSpbProject,
    };

    const filteredProjects = projects.filter((project) => {
      // Если выбраны оба региона - показываем все проекты
      if (filters.isMsk && filters.isSpb) {
        return true;
      }
      // Если выбран только Москва
      if (filters.isMsk) {
        return project.regionId === 2; // предполагая, что 2 - это ID Москвы
      }
      // Если выбран только Санкт-Петербург
      if (filters.isSpb) {
        return project.regionId === 1; // предполагая, что 1 - это ID СПб
      }
      // Если не выбран ни один регион - показываем все проекты
      return true;
    });

    setFilteredProjects(filteredProjects);
  }, [projects, buttonMskProject, buttonSpbProject]);

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
    <div className="gant-contracts">
      <Header title={'Гант договоров'} />
      <div style={{ display: 'flex' }}>
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
      </div>
      <div className="gant-contracts__month">
        <div className="gant-contracts__month-arrow" onClick={handlePrevMonthGant}>
          <img src="./img/left.png" alt="left arrow" />
        </div>
        <p className="gant-contracts__month-name">
          {new Date(currentYearGant, currentMonthGant).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="gant-contracts__month-arrow" onClick={handleNextMonthGant}>
          <img src="./img/right.png" alt="right arrow" />
        </div>
      </div>
      <div className="gant-contracts-table-container">
        {isLoadingGant ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}>
            {/* Спиннер загрузки */}
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
          </div>
        ) : (
          <div className="gant-contracts-table-wrapper">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th className="gant-contracts-table-th mobile">Название</th>
                  <th className="gant-contracts-table-th">Номер</th>
                  <th
                    className="gant-contracts-table-th"
                    onClick={() => handleSort('agreement_date')}>
                    <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
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
                  <th className="gant-contracts-table-th">Дедлайн</th>
                  <th className="gant-contracts-table-th">Регион</th>
                  {filteredDatesGant.map((gantDate) => (
                    <th key={gantDate.id} className="gant-contracts-table-th">
                      {new Date(gantDate.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </th>
                  ))}
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

                  .map((gantProject) => (
                    <tr key={gantProject.id}>
                      <td
                        className="gant-contracts-table__td mobile"
                        style={{
                          cursor: 'pointer',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          backgroundColor: (() => {
                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);

                            const agreementDate = new Date(gantProject?.agreement_date);
                            if (!agreementDate || isNaN(agreementDate)) return 'transparent';

                            agreementDate.setHours(0, 0, 0, 0);

                            const designPeriod = gantProject?.design_period || 0;
                            const designEndDate = addWorkingDays(agreementDate, designPeriod);
                            designEndDate.setHours(0, 0, 0, 0);

                            const expirationDate = gantProject?.expiration_date || 0;
                            const productionEndDate = addWorkingDays(
                              agreementDate,
                              designPeriod + expirationDate,
                            );
                            productionEndDate.setHours(0, 0, 0, 0);

                            const installationPeriod = gantProject?.installation_period || 0;
                            const installationEndDate = addWorkingDays(
                              agreementDate,
                              designPeriod + expirationDate + installationPeriod,
                            );
                            installationEndDate.setHours(0, 0, 0, 0);

                            // Проверяем периоды в правильном порядке
                            if (
                              currentDate > productionEndDate &&
                              currentDate <= installationEndDate
                            ) {
                              return '#C49D9D';
                            } else if (
                              currentDate > designEndDate &&
                              currentDate <= productionEndDate
                            ) {
                              return '#83C78A';
                            } else if (
                              currentDate >= agreementDate &&
                              currentDate <= designEndDate
                            ) {
                              return '#B4AFE0';
                            } else {
                              return '#ffffff';
                            }
                          })(),
                        }}
                        onClick={() => {
                          addToInfo(gantProject.id);
                        }}>
                        {gantProject.name}
                      </td>
                      <td
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                        onClick={() => {
                          addToInfo(gantProject.id);
                        }}>
                        {gantProject.number}
                      </td>
                      <td>
                        <Moment format="DD.MM.YYYY">{gantProject.agreement_date}</Moment>
                      </td>
                      <td>
                        {(() => {
                          const agreementDate = new Date(gantProject && gantProject.agreement_date);
                          const designPeriod = gantProject && gantProject.design_period;
                          const expirationDate = gantProject && gantProject.expiration_date;
                          const installationPeriod = gantProject && gantProject.installation_period;
                          const sumDays = designPeriod + expirationDate + installationPeriod;

                          const endDate = addWorkingDays(agreementDate, sumDays);
                          const formattedEndDate = formatDate(endDate);
                          return formattedEndDate;
                        })()}
                      </td>
                      <td style={{ cursor: 'pointer', textAlign: 'center' }}>
                        {gantProject.region?.region}
                      </td>
                      {filteredDatesGant.map((gantDate) => {
                        const currentDate = new Date(gantDate.date);

                        // Вычисляем даты начала и конца design периода
                        const agreementDate = new Date(gantProject?.agreement_date);
                        const designPeriod = gantProject?.design_period || 0;
                        const designEndDate = addWorkingDays(agreementDate, designPeriod);

                        // Вычисляем даты начала и конца production периода
                        const expirationDate = gantProject?.expiration_date || 0;
                        const productionEndDate = addWorkingDays(
                          agreementDate,
                          designPeriod + expirationDate,
                        );

                        // Вычисляем даты начала и конца installation периода
                        const installationPeriod = gantProject?.installation_period || 0;
                        const installationEndDate = addWorkingDays(
                          agreementDate,
                          designPeriod + expirationDate + installationPeriod,
                        );

                        // Проверяем, попадает ли текущая дата в design диапазон
                        const isInDesignRange =
                          agreementDate &&
                          designEndDate &&
                          currentDate >= agreementDate &&
                          currentDate <= designEndDate;

                        // Проверяем, попадает ли текущая дата в production диапазон
                        const isInProductionRange =
                          agreementDate &&
                          productionEndDate &&
                          currentDate > designEndDate &&
                          currentDate <= productionEndDate;

                        // Проверяем, попадает ли текущая дата в installation диапазон
                        const isInInstallationRange =
                          agreementDate &&
                          installationEndDate &&
                          currentDate > productionEndDate &&
                          currentDate <= installationEndDate;

                        // Функция для преобразования имени в инициал, а фамилии полностью
                        const formatBrigadeName = (brigadeName) => {
                          if (!brigadeName) return '';

                          // Разделяем название на слова (предполагаем, что это ФИО)
                          const words = brigadeName.split(' ').filter((word) => word.length > 0);

                          if (words.length === 0) return '';
                          if (words.length === 1) return words[0]; // если только одно слово - возвращаем как есть

                          // Первое слово - имя (делаем инициал), остальные - фамилия (оставляем полностью)
                          const firstName = words[0];
                          const lastName = words.slice(1).join(' ');

                          return `${firstName.charAt(0).toUpperCase()}. ${lastName}`;
                        };

                        // Находим все бригады, работающие в эту дату
                        const brigadesForThisDate =
                          gantProject?.brigades_dates?.filter(
                            (brigadeDate) => brigadeDate.date?.date === gantDate.date,
                          ) || [];

                        return (
                          <td
                            key={gantDate.id}
                            style={{
                              color: isInInstallationRange
                                ? '#C49D9D' // Розовый для installation
                                : isInProductionRange
                                ? '#83C78A' // Зеленый для production
                                : isInDesignRange
                                ? '#B4AFE0' // Синий для design
                                : 'inherit',
                              backgroundColor: isInInstallationRange
                                ? '#C49D9D' // Светло-розовый фон для installation
                                : isInProductionRange
                                ? '#83C78A' // Светло-зеленый фон для production
                                : isInDesignRange
                                ? '#B4AFE0' // Светло-синий фон для design
                                : 'transparent',
                              fontWeight:
                                isInInstallationRange || isInProductionRange || isInDesignRange
                                  ? 'bold'
                                  : 'normal',
                              position: 'relative',
                              minWidth: '40px',
                              height: '40px',
                            }}
                            title={
                              isInDesignRange
                                ? `Дизайнер: ${gantProject?.designer || 'Не указан'}`
                                : isInInstallationRange && brigadesForThisDate.length > 0
                                ? `Бригады: ${brigadesForThisDate
                                    .map((b) => b.brigade?.name)
                                    .join(', ')}`
                                : ''
                            }>
                            {/* Отображаем designer только в design периоде */}
                            {isInDesignRange && gantProject?.designer && (
                              <div
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 'normal',
                                  color: '#000',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  padding: '2px',
                                }}>
                                {gantProject.designer}
                              </div>
                            )}

                            {/* Отображаем бригады в installation периоде */}
                            {isInInstallationRange && brigadesForThisDate.length > 0 && (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px',
                                  height: '100%',
                                  padding: '2px',
                                }}>
                                {brigadesForThisDate.map((brigadeDate, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      fontSize: '7px',
                                      fontWeight: 'bold',
                                      color: '#000',
                                      background: 'rgba(255, 255, 255, 0.8)',
                                      padding: '1px 3px',
                                      borderRadius: '3px',
                                      textAlign: 'center',
                                      lineHeight: '1.1',
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}>
                                    {formatBrigadeName(brigadeDate.brigade?.name)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GantContracts;
