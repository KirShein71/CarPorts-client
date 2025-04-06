import React from 'react';
import { Table } from 'react-bootstrap';
import { fetchBrigades } from '../../http/bragadeApi';
import {
  getAllBrigadesDate,
  getAllDate,
  getAllOneBrigadesDate,
  getAllNumberOfDaysBrigadeForProject,
} from '../../http/brigadesDateApi';
import { getAllEstimateForBrigadeAllProject } from '../../http/estimateApi';
import { getAllPaymentForBrigade } from '../../http/paymentApi';
import { getAllRegion } from '../../http/regionApi';
import CreateBrigadeDate from './modals/CreateBrigadeDate';
import UpdateBrigadeDate from './modals/UpdateBrigadeDate';
import Header from '../Header/Header';
import GantBrigade from './GantBrigade';
import DeleteBrigadesData from './modals/DeleteBrigadesData';
import EditDeleteModal from './modals/EditDeleteModal';

import './style.scss';

function ChangeBrigade() {
  const [brigades, setBrigades] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [brigadesDates, setBrigadesDates] = React.useState([]);
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [daysBrigade, setDaysBrigade] = React.useState([]);
  const [daysProject, setDaysProject] = React.useState([]);
  const [paymentBrigade, setPaymentBrigade] = React.useState([]);
  const [bridaDateId, setBrigadeDateId] = React.useState(null);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [selectedBrigadeName, setSelectedBrigadeName] = React.useState(null);
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [openCreateBrigadeDate, setOpenCreateBrigadeDate] = React.useState(false);
  const [openUpdateBrigadeDate, setOpenUpdateBrigadeDate] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [dateBrigade, setDateBrigade] = React.useState(null);
  const [regions, setRegions] = React.useState([]);
  const [selectedRegion, setSelectedRegion] = React.useState(1);
  const modalRef = React.useRef();
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [currentMonthGant, setCurrentMonthGant] = React.useState(new Date().getMonth());
  const [currentYearGant, setCurrentYearGant] = React.useState(new Date().getFullYear());
  const [modalDeleteBrigadesDateData, setModalmodalDeleteBrigadesDateData] = React.useState(false);
  const [modalEditDelete, setModalEditDelete] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [brigadesData, brigadesDatesData, datesData, regionsData] = await Promise.all([
          fetchBrigades(),
          getAllBrigadesDate(),
          getAllDate(),
          getAllRegion(),
        ]);

        setBrigades(brigadesData);
        setBrigadesDates(brigadesDatesData);
        setDates(datesData);
        setRegions(regionsData);
        setOpenUpdateBrigadeDate(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [change]);

  React.useEffect(() => {
    const fetchBrigadeData = async () => {
      if (selectedBrigade !== null) {
        try {
          const [daysData, projectDaysData, estimateData] = await Promise.all([
            getAllOneBrigadesDate(selectedBrigade),
            getAllNumberOfDaysBrigadeForProject(selectedBrigade),
            getAllEstimateForBrigadeAllProject(selectedBrigade),
          ]);

          setDaysBrigade(daysData);
          setDaysProject(projectDaysData);
          setServiceEstimate(estimateData);
        } catch (error) {
          console.error('Error fetching brigade data:', error);
        }
      }
    };

    fetchBrigadeData();
  }, [selectedBrigade]);

  React.useEffect(() => {
    if (selectedBrigade !== null) {
      try {
        getAllEstimateForBrigadeAllProject(selectedBrigade).then((data) =>
          setServiceEstimate(data),
        );
      } catch (error) {
        console.error('Error fetching brigade data:', error);
      }
    }
  }, [selectedBrigade]);

  React.useEffect(() => {
    if (selectedBrigade !== null) {
      try {
        getAllPaymentForBrigade(selectedBrigade).then((data) => setPaymentBrigade(data));
      } catch (error) {
        console.error('Error fetching brigade data:', error);
      }
    }
  }, [selectedBrigade]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonthGant = () => {
    if (currentMonthGant === 0) {
      setCurrentMonthGant(11);
      setCurrentYearGant(currentYearGant - 1);
    } else {
      setCurrentMonthGant(currentMonthGant - 1);
    }
  };

  const handleNextMonthGant = () => {
    if (currentMonthGant === 11) {
      setCurrentMonthGant(0);
      setCurrentYearGant(currentYearGant + 1);
    } else {
      setCurrentMonthGant(currentMonthGant + 1);
    }
  };

  const filteredDates = dates.filter((date) => {
    const dateObj = new Date(date.date);
    return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
  });

  const filteredDatesGant = dates.filter((date) => {
    const dateObj = new Date(date.date);
    return dateObj.getMonth() === currentMonthGant && dateObj.getFullYear() === currentYearGant;
  });

  React.useEffect(() => {
    const hadleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModalSelectedBrigade(false);
      }
    };

    document.body.addEventListener('click', hadleClickOutside);

    return () => {
      document.body.removeEventListener('click', hadleClickOutside);
    };
  });

  const getDayName = (date) => {
    const dayNames = {
      воскресенье: 'вск',
      понедельник: 'пн',
      вторник: 'вт',
      среда: 'ср',
      четверг: 'чт',
      пятница: 'пт',
      суббота: 'сб',
    };

    const fullDayName = new Date(date).toLocaleDateString('ru-RU', { weekday: 'long' });
    return dayNames[fullDayName] || fullDayName;
  };
  const handleOpenModalCreateBrigadeDate = (selectedBrigade, date) => {
    setBrigadeId(selectedBrigade);
    setDateBrigade(date);
    setOpenCreateBrigadeDate(true);
  };

  const handleOpenModalUpdateBrigadeDate = (id) => {
    setOpenUpdateBrigadeDate(true);
    setBrigadeDateId(id);
  };

  const handleOpenModalDeleteBrigadeDateData = (id) => {
    setModalmodalDeleteBrigadesDateData(true);
    setBrigadeDateId(id);
  };

  const handleOpenModalEditDelete = (id) => {
    setModalEditDelete(true);
    setBrigadeDateId(id);
  };

  const handleRegionClick = (id) => {
    setSelectedRegion(id);
  };

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  const todayString = new Date().toISOString().split('T')[0]; // Получаем строку даты для сравнения

  return (
    <div className="calendar-brigade">
      <CreateBrigadeDate
        show={openCreateBrigadeDate}
        setShow={setOpenCreateBrigadeDate}
        setChange={setChange}
        brigadeId={brigadeId}
        dateId={dateBrigade}
        regionId={selectedRegion}
      />
      <UpdateBrigadeDate
        show={openUpdateBrigadeDate}
        setShow={setOpenUpdateBrigadeDate}
        setChange={setChange}
        id={bridaDateId}
        regionId={selectedRegion}
      />
      <DeleteBrigadesData
        id={bridaDateId}
        showDeleteModal={modalDeleteBrigadesDateData}
        setShowDeleteModal={setModalmodalDeleteBrigadesDateData}
        setChange={setChange}
      />
      <EditDeleteModal
        show={modalEditDelete}
        setShow={setModalEditDelete}
        id={bridaDateId}
        handleOpenModalUpdateBrigadeDate={handleOpenModalUpdateBrigadeDate}
        handleOpenModalDeleteBrigadeDateData={handleOpenModalDeleteBrigadeDateData}
      />
      <Header title={'Календарь монтажных работ'} />
      <div className="container">
        <div className="calendar-brigade__filter">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`calendar-brigade__filter-item ${
                selectedRegion === region.id ? 'active' : ''
              }`}
              onClick={() =>
                handleRegionClick(region.id, setSelectedBrigade(null), setSelectedBrigadeName(null))
              }>
              {region.id === 1 ? 'Санкт-Петербург' : 'Москва'}
            </div>
          ))}
        </div>

        <div className="dropdown" ref={modalRef}>
          <div className="dropdown__title" onClick={hadleOpenModalSelectedBrigade}>
            Бригада: <span>{selectedBrigadeName ? selectedBrigadeName : 'Выбрать'}</span>
          </div>
          {openModalSelectedBrigade && (
            <div className="dropdown__modal">
              <div className="dropdown__modal-content">
                <ul className="dropdown__modal-items">
                  {/* Кнопка сброса выбора бригады */}
                  <div
                    className="dropdown__modal-item dropdown__modal-item--reset"
                    onClick={() => {
                      setSelectedBrigadeName(null);
                      setSelectedBrigade(null);
                      setOpenModalSelectedBrigade(false);
                    }}>
                    <li>Сбросить</li>
                  </div>
                  {brigades
                    .filter((brigadesName) => brigadesName.regionId === selectedRegion)
                    .map((brigadesName) => (
                      <div key={brigadesName.id}>
                        <li
                          className="dropdown__modal-item"
                          onClick={() => {
                            setSelectedBrigadeName(brigadesName.name);
                            setSelectedBrigade(brigadesName.id);
                            setOpenModalSelectedBrigade(false);
                          }}>
                          {brigadesName.name}
                        </li>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {selectedBrigade !== null ? (
          <>
            <div className="calendar-brigade__month">
              <div className="calendar-brigade__month-arrow" onClick={handlePrevMonth}>
                <img src="./img/left.png" alt="left arrow" />
              </div>
              <p className="calendar-brigade__month-name">
                {new Date(currentYear, currentMonth).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <div className="calendar-brigade__month-arrow" onClick={handleNextMonth}>
                <img src="./img/right.png" alt="right arrow" />
              </div>
            </div>
            <div className="table-scrollable">
              <Table bordered size="sm" className="calendar-brigade__table">
                <thead>
                  <tr>
                    <th className="thead_column">Дата</th>
                    <th className="thead_column">Проект</th>
                    <th className="thead_column">Смета</th>
                    <th className="thead_column">Выполнено</th>
                    <th className="thead_column">Выплачено</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDates.map((date) => (
                    <tr key={date.id}>
                      <td
                        style={{
                          backgroundColor:
                            date.date.toLocaleString().split('T')[0] === todayString
                              ? '#bbbbbb'
                              : 'transparent',
                        }}>
                        {new Date(date.date).toLocaleDateString('ru-RU')} -{getDayName(date.date)}
                      </td>
                      {brigadesDates.filter(
                        (brigadeDate) =>
                          brigadeDate.brigadeId === selectedBrigade &&
                          brigadeDate.dateId === date.id,
                      ).length > 0 ? (
                        brigadesDates
                          .filter(
                            (brigadeDate) =>
                              brigadeDate.brigadeId === selectedBrigade &&
                              brigadeDate.dateId === date.id,
                          )
                          .map((brigadeDate) => {
                            return (
                              <td
                                style={{
                                  cursor: 'pointer',
                                  textAlign: 'center',
                                  fontWeight: '500',
                                  paddingTop: '7px',
                                  color: brigadeDate.warranty
                                    ? '#0000ff'
                                    : brigadeDate.weekend
                                    ? '#9b2d30'
                                    : brigadeDate.downtime
                                    ? '#ff0000'
                                    : '#000000',
                                  backgroundColor:
                                    date.date.toLocaleString().split('T')[0] === todayString
                                      ? '#bbbbbb'
                                      : 'transparent',
                                }}
                                key={brigadeDate.id}
                                onClick={() => handleOpenModalEditDelete(brigadeDate.id)}>
                                {brigadeDate.project?.name ||
                                  brigadeDate.complaint?.project.name ||
                                  brigadeDate.warranty ||
                                  brigadeDate.weekend ||
                                  brigadeDate.downtime ||
                                  ''}
                              </td>
                            );
                          })
                      ) : (
                        <td
                          style={{
                            cursor: 'pointer',
                            backgroundColor:
                              date.date.toLocaleString().split('T')[0] === todayString
                                ? '#bbbbbb'
                                : 'transparent',
                          }}
                          onClick={() =>
                            handleOpenModalCreateBrigadeDate(selectedBrigade, date.id)
                          }>
                          Добавить
                        </td>
                      )}
                      {daysBrigade.filter((dayBrigade) => dayBrigade.dateId === date.id).length >
                      0 ? (
                        daysBrigade
                          .filter((dayBrigade) => dayBrigade.dateId === date.id)
                          .map((dayBrigadeSum) => {
                            return (
                              <td
                                style={{
                                  textAlign: 'right',
                                }}
                                key={dayBrigadeSum.id}>
                                {dayBrigadeSum.project && dayBrigadeSum.project.estimates ? (
                                  <div>
                                    {(() => {
                                      const projectTotal = serviceEstimate
                                        .filter(
                                          (estimateForProject) =>
                                            estimateForProject.projectId ===
                                            dayBrigadeSum.projectId,
                                        )
                                        .flatMap(
                                          (estimateForProject) => estimateForProject.estimates,
                                        )
                                        .reduce(
                                          (accumulator, current) =>
                                            accumulator + Number(current.price), // Суммируем все цены
                                          0,
                                        );

                                      const projectDays = daysProject
                                        .filter(
                                          (dayProject) =>
                                            dayProject.projectId === dayBrigadeSum.projectId,
                                        )
                                        .map((dayProject) => dayProject.days);
                                      return (
                                        <>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            Общая:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(projectTotal),
                                            )}
                                          </div>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            За день:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(projectTotal / projectDays),
                                            )}
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>
                            );
                          })
                      ) : (
                        <td></td>
                      )}
                      {daysBrigade.filter((dayBrigade) => dayBrigade.dateId === date.id).length >
                      0 ? (
                        daysBrigade
                          .filter((dayBrigade) => dayBrigade.dateId === date.id)
                          .map((dayBrigadeSum) => {
                            return (
                              <td
                                style={{
                                  textAlign: 'right',
                                }}
                                key={dayBrigadeSum.id}>
                                {dayBrigadeSum.project && dayBrigadeSum.project.estimates ? (
                                  <div>
                                    {(() => {
                                      const projectTotal = serviceEstimate
                                        .filter(
                                          (estimateForProject) =>
                                            estimateForProject.projectId ===
                                            dayBrigadeSum.projectId,
                                        )
                                        .flatMap((estimateForProject) =>
                                          estimateForProject.estimates.filter(
                                            (est) => est.done === 'true',
                                          ),
                                        )
                                        .reduce(
                                          (accumulator, current) =>
                                            accumulator + Number(current.price),
                                          0,
                                        );

                                      const projectDays = daysProject
                                        .filter(
                                          (dayProject) =>
                                            dayProject.projectId === dayBrigadeSum.projectId,
                                        )
                                        .map((dayProject) => dayProject.days);
                                      return (
                                        <>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            Общая:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(projectTotal),
                                            )}
                                          </div>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            За день:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(projectTotal / projectDays),
                                            )}
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>
                            );
                          })
                      ) : (
                        <td></td>
                      )}
                      {daysBrigade.filter((dayBrigade) => dayBrigade.dateId === date.id).length >
                      0 ? (
                        daysBrigade
                          .filter((dayBrigade) => dayBrigade.dateId === date.id)
                          .map((dayBrigadeSum) => {
                            return (
                              <td
                                style={{
                                  textAlign: 'right',
                                }}
                                key={dayBrigadeSum.id}>
                                {dayBrigadeSum.project && dayBrigadeSum.project.estimates ? (
                                  <div>
                                    {(() => {
                                      const payments = paymentBrigade.filter(
                                        (paymentForProject) =>
                                          paymentForProject.projectId === dayBrigadeSum.projectId,
                                      );

                                      // Суммируем все значения sum
                                      const totalSum = payments.reduce(
                                        (acc, paymentForProject) => acc + paymentForProject.sum,
                                        0,
                                      );
                                      const projectDays = daysProject
                                        .filter(
                                          (dayProject) =>
                                            dayProject.projectId === dayBrigadeSum.projectId,
                                        )
                                        .map((dayProject) => dayProject.days);
                                      return (
                                        <>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            Общая:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(totalSum),
                                            )}
                                          </div>
                                          <div style={{ whiteSpace: 'nowrap' }}>
                                            За день:
                                            {new Intl.NumberFormat('ru-RU').format(
                                              Math.ceil(totalSum / projectDays),
                                            )}
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </td>
                            );
                          })
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <GantBrigade
            brigades={brigades}
            selectedRegion={selectedRegion}
            handleNextMonthGant={handleNextMonthGant}
            handlePrevMonthGant={handlePrevMonthGant}
            currentYearGant={currentYearGant}
            currentMonthGant={currentMonthGant}
            filteredDates={filteredDatesGant}
            todayString={todayString}
            getDayName={getDayName}
            brigadesDates={brigadesDates}
            handleOpenModalCreateBrigadeDate={handleOpenModalCreateBrigadeDate}
            handleOpenModalUpdateBrigadeDate={handleOpenModalUpdateBrigadeDate}
            handleOpenModalDeleteBrigadeDateData={handleOpenModalDeleteBrigadeDateData}
            handleOpenModalEditDelete={handleOpenModalEditDelete}
          />
        )}
      </div>
    </div>
  );
}

export default ChangeBrigade;
