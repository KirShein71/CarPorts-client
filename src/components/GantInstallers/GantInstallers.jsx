import React from 'react';
import { getAllActiveBrigade } from '../../http/bragadeApi';
import { getAllDate, getAllBrigadesDate } from '../../http/brigadesDateApi';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.scss';

function GantInstallers() {
  const [brigades, setBrigades] = React.useState([]);
  const [brigadeDates, setBrigadeDates] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [isLoadingGant, setIsLoadingGant] = React.useState(false);
  const [currentMonthGant, setCurrentMonthGant] = React.useState(new Date().getMonth());
  const [currentYearGant, setCurrentYearGant] = React.useState(new Date().getFullYear());
  const [filteredBrigades, setFilteredBrigades] = React.useState([]);
  const [buttonMskBrigade, setButtonMskBrigade] = React.useState(true);
  const [buttonSpbBrigade, setButtonSpbBrigade] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      setIsLoadingGant(true);
      try {
        const [brigadesData, datesData, brigadeDatesData] = await Promise.all([
          getAllActiveBrigade(),
          getAllDate(),
          getAllBrigadesDate(),
        ]);

        setBrigades(brigadesData);
        setDates(datesData);
        setBrigadeDates(brigadeDatesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setFetching(false);
        setIsLoadingGant(false);
      }
    };

    fetchData();
  }, [change]);

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
    }, 300);
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
      isMsk: buttonMskBrigade,
      isSpb: buttonSpbBrigade,
    };

    const filteredBrigades = brigades.filter((brigade) => {
      if (filters.isMsk && filters.isSpb) {
        return true;
      }
      if (filters.isMsk) {
        return brigade.regionId === 2;
      }
      if (filters.isSpb) {
        return brigade.regionId === 1;
      }
      return true;
    });

    setFilteredBrigades(filteredBrigades);
  }, [brigades, buttonMskBrigade, buttonSpbBrigade]);

  const handleButtonMskBrigade = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      const newButtonMskBrigade = !buttonMskBrigade;
      setButtonMskBrigade(newButtonMskBrigade);

      if (!newButtonMskBrigade) {
        setButtonSpbBrigade(true);
      }
      setIsLoadingGant(false);
    }, 300);
  };

  const handleButtonSpbBrigade = () => {
    setIsLoadingGant(true);
    setTimeout(() => {
      const newButtonSpbBrigade = !buttonSpbBrigade;
      setButtonSpbBrigade(newButtonSpbBrigade);

      if (!newButtonSpbBrigade) {
        setButtonMskBrigade(true);
      }
      setIsLoadingGant(false);
    }, 300);
  };

  // Функция для проверки является ли день выходным
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 - воскресенье, 6 - суббота
  };

  // Функция для получения проекта бригады на конкретную дату
  const getProjectForBrigadeOnDate = (brigadeId, dateId) => {
    const brigadeDate = brigadeDates.find(
      (bd) => bd.brigadeId === brigadeId && bd.dateId === dateId,
    );

    if (brigadeDate) {
      // Если есть projectId, возвращаем объект с данными
      if (brigadeDate.projectId && brigadeDate.project) {
        return {
          name: brigadeDate.project.name,
          projectId: brigadeDate.projectId,
          type: 'project',
        };
      }
      // Если нет projectId, но есть complaintId и complaint с проектом
      if (brigadeDate.complaintId && brigadeDate.complaint && brigadeDate.complaint.project) {
        return {
          name: `*${brigadeDate.complaint.project.name}*`,
          projectId: null,
          type: 'complaint',
        };
      }
    }

    return {
      name: '',
      projectId: null,
      type: 'empty',
    };
  };

  // Функция для проверки, является ли день рабочим для бригады
  const isWorkingDayForBrigade = (brigadeId, dateId) => {
    const brigadeDate = brigadeDates.find(
      (bd) => bd.brigadeId === brigadeId && bd.dateId === dateId,
    );

    // День считается рабочим, если есть projectId ИЛИ complaintId
    return brigadeDate && (brigadeDate.projectId || brigadeDate.complaintId);
  };

  // Функция для подсчета рабочих дней бригады
  const getWorkingDaysCount = (brigadeId) => {
    const brigadeDatesForMonth = brigadeDates.filter((bd) => {
      const dateObj = new Date(bd.date?.date);
      return (
        bd.brigadeId === brigadeId &&
        (bd.projectId || bd.complaintId) && // Проверяем, что projectId ИЛИ complaintId существует
        dateObj.getMonth() === currentMonthGant &&
        dateObj.getFullYear() === currentYearGant
      );
    });

    return brigadeDatesForMonth.length;
  };

  // Функция для подсчета количества работающих бригад на конкретную дату
  const getWorkingBrigadesCountOnDate = (dateId) => {
    return brigadeDates.filter((bd) => {
      const dateObj = new Date(bd.date?.date);
      return (
        bd.dateId === dateId &&
        (bd.projectId || bd.complaintId) && // Проверяем, что projectId ИЛИ complaintId существует
        dateObj.getMonth() === currentMonthGant &&
        dateObj.getFullYear() === currentYearGant &&
        // Проверяем, что бригада входит в отфильтрованный список
        filteredBrigades.some((brigade) => brigade.id === bd.brigadeId)
      );
    }).length;
  };

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="gant-installers">
      <Header title={'Гант монтажников'} />
      <div style={{ display: 'flex' }}>
        <button
          className={`button__msk ${buttonMskBrigade === true ? 'active' : 'inactive'}`}
          onClick={handleButtonMskBrigade}>
          МО
        </button>
        <button
          className={`button__spb ${buttonSpbBrigade === true ? 'active' : 'inactive'}`}
          onClick={handleButtonSpbBrigade}>
          ЛО
        </button>
      </div>
      <div className="gant-installers__month">
        <div className="gant-installers__month-arrow" onClick={handlePrevMonthGant}>
          <img src="./img/left.png" alt="left arrow" />
        </div>
        <p className="gant-installers__month-name">
          {new Date(currentYearGant, currentMonthGant).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="gant-installers__month-arrow" onClick={handleNextMonthGant}>
          <img src="./img/right.png" alt="right arrow" />
        </div>
      </div>
      <div className="gant-installers-table-container">
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
          <div className="gant-installers-table-wrapper">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th className="gant-installers-table-th mobile">Монтажная бригада</th>
                  <th className="gant-installers-table-th">Регион</th>
                  <th className="gant-installers-table-th">Раб. дней</th>
                  {filteredDatesGant.map((gantDate) => (
                    <th
                      className="gant-installers-table-th"
                      key={gantDate.id}
                      style={{
                        backgroundColor: isWeekend(gantDate.date) ? '#f0f0f0' : 'transparent',
                      }}>
                      {new Date(gantDate.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBrigades.map((brigGant) => (
                  <tr key={brigGant.id}>
                    <td className="gant-installers-table__td mobile">{brigGant.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      {brigGant.regionId === 1 ? 'Спб' : 'Мск'}
                    </td>
                    <td style={{ textAlign: 'center' }}>{getWorkingDaysCount(brigGant.id)}</td>
                    {filteredDatesGant.map((gantDate) => {
                      const projectData = getProjectForBrigadeOnDate(brigGant.id, gantDate.id);
                      const isClickable = projectData.type === 'project' && projectData.projectId;

                      return (
                        <td
                          key={gantDate.id}
                          style={{
                            minWidth: '120px',
                            fontSize: '12px',
                            padding: '4px 8px',
                            backgroundColor: isWeekend(gantDate.date) ? '#f8f9fa' : 'transparent',
                            cursor: isClickable ? 'pointer' : 'default',
                            textAlign: 'center',
                            fontStyle: projectData.type === 'complaint' ? 'italic' : 'normal',
                          }}
                          onClick={
                            isClickable ? () => addToInfo(projectData.projectId) : undefined
                          }>
                          {projectData.name}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Строка "Всего" */}
                <tr style={{ fontWeight: 'bold' }}>
                  <td className="gant-installers-table__td mobile" style={{ textAlign: 'left' }}>
                    Всего
                  </td>
                  <td></td>
                  <td style={{ textAlign: 'center' }}></td>
                  {filteredDatesGant.map((gantDate) => (
                    <td
                      key={`total-${gantDate.id}`}
                      style={{
                        backgroundColor: isWeekend(gantDate.date) ? '#e9ecef' : 'transparent',
                        textAlign: 'center',
                      }}>
                      {getWorkingBrigadesCountOnDate(gantDate.id)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GantInstallers;
