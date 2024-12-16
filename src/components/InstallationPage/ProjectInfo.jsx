import React from 'react';
import { getProjectInfoInstallation } from '../../http/projectApi';
import CalendarInstallation from './CalendarInstallation/CalendarInstallation';
import { Button, Table } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  getAllEstimateForBrigade,
  getAllEstimateForBrigadeFinishProject,
  createEstimateBrigade,
} from '../../http/estimateApi';
import { getAllNumberOfDaysBrigade, getAllDate } from '../../http/brigadesDateApi';
import CheckboxInstallation from './checkbox/CheckboxInstallation';
import { getAllPaymentForBrigade } from '../../http/paymentApi';
import Moment from 'react-moment';

function ProjectInfo() {
  const { id } = useParams();
  const [project, setProject] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [checked, setChecked] = React.useState({});
  const [dates, setDates] = React.useState([]);
  const [days, setDays] = React.useState();
  const [paymentBrigade, setPaymentBrigade] = React.useState([]);
  const location = useLocation();

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');

    const fetchData = async () => {
      try {
        if (location.state && location.state.from) {
          let data;
          if (location.state.from === '/installeraccount') {
            data = await getAllEstimateForBrigade(brigadeId);
          } else if (location.state.from === '/project-finish') {
            data = await getAllEstimateForBrigadeFinishProject(brigadeId);
          }

          if (data) {
            setServiceEstimate(data);
            const initialChecked = {};
            data.forEach((col) => {
              col.estimates.forEach((colEst) => {
                initialChecked[colEst.id] = colEst.done === 'true';
              });
            });
            setChecked(initialChecked);
          }
        }

        const datesData = await getAllDate();
        setDates(datesData);

        const paymentData = await getAllPaymentForBrigade(brigadeId);
        setPaymentBrigade(paymentData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [location.state, change]);

  React.useEffect(() => {
    const projectId = Number(id);
    if (projectId !== null) {
      const fetchData = async () => {
        try {
          // Получаем информацию о проекте
          const projectData = await getProjectInfoInstallation(projectId);
          setProject(projectData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [change]);

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');
    const projectId = Number(id);

    if (projectId !== null) {
      getAllNumberOfDaysBrigade(brigadeId, projectId).then((data) => setDays(data));
    }
  }, [change]);

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id], // Меняем состояние чекбокса по его id
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Создаем плоский массив обновлений
    const updates = serviceEstimate.flatMap((col) =>
      col.estimates.map((colEst) => ({
        id: colEst.id,
        done: checked[colEst.id] ? 'true' : 'false',
      })),
    );

    // Отправляем данные на бэк
    Promise.all(
      updates.map((update) =>
        createEstimateBrigade(update.id, update.done)
          .then((response) => {
            setChange((state) => !state);
          })
          .catch((error) => {
            alert(error.response.data.message);
          }),
      ),
    ).then(() => {
      // Обработка успешного завершения всех запросов, если нужно
      console.log('Все изменения сохранены');
    });
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

  return (
    <div className="projectinfo">
      {location.state && location.state.from ? (
        <div className="header">
          <Link to={location.state.from}>
            <img className="header__icon" src="../img/back.png" alt="back" />
          </Link>
          <h1 className="header__title">Подробная информация</h1>
        </div>
      ) : null}
      <div className="projectinfo__content">
        <>
          <div className="projectinfo__content-title">Смета</div>
          <div className="projectinfo__content-table">
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th className="installation-page__head">Наименование</th>
                  <th className="installation-page__head">Стоимость</th>
                  <th className="installation-page__head">Выполнение</th>
                </tr>
              </thead>
              <tbody>
                {serviceEstimate.map((col) =>
                  col.estimates
                    .filter((estimateForProject) => estimateForProject.projectId === Number(id))
                    .map((estimateForProject) => (
                      <tr key={estimateForProject.id}>
                        <td className="installation-page__body">
                          {estimateForProject.service.name}
                        </td>
                        <td className="installation-page__body">{estimateForProject.price}</td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <CheckboxInstallation
                            change={checked[estimateForProject.id]} // Передаем состояние чекбокса
                            handle={() => handleCheckboxChange(estimateForProject.id)} // Обработчик изменения состояния
                          />
                        </td>
                      </tr>
                    )),
                )}
              </tbody>
            </Table>
            <form className="installation-page__form" onSubmit={handleSave}>
              <Button variant="dark" size="sm" type="submit">
                Сохранить
              </Button>
            </form>
          </div>
          <div className="projectinfo__content-money">
            {(() => {
              const totalPrice = serviceEstimate.reduce((total, sumEst) => {
                const projectTotal = sumEst.estimates
                  .filter(
                    (estimateForProject) =>
                      estimateForProject.done === 'true' &&
                      estimateForProject.projectId === Number(id),
                  )
                  .reduce((accumulator, current) => accumulator + Number(current.price), 0);
                return total + projectTotal;
              }, 0);

              return (
                <>
                  <div className="projectinfo__content-money__general">
                    Общая сумма: {totalPrice}₽
                  </div>
                  <div className="projectinfo__content-money__daily">
                    Заработок за день: {days > 0 ? Math.ceil(totalPrice / days) : 0}₽
                  </div>
                </>
              );
            })()}{' '}
          </div>
        </>
        <div className="projectinfo__content-title">Выплаты</div>
        <div className="projectinfo__content-table">
          <Table bordered className="mt-3">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {paymentBrigade
                .filter((sumProject) => sumProject.projectId === Number(id))
                .map((sumProject) => (
                  <tr key={sumProject.id}>
                    <td>
                      <Moment format="DD.MM.YYYY">{sumProject.date}</Moment>
                    </td>
                    <td>{sumProject.sum}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        {project.map((infoProject) => (
          <>
            <div className="projectinfo__calenadar">
              <CalendarInstallation
                brigadesDate={infoProject.brigadesdate}
                designer={infoProject.project.designer}
                startDateConstructor={infoProject.project.design_start}
                endDateСonstructor={infoProject.project.project_delivery}
                startDateDesing={infoProject.project.agreement_date}
                endDateDesing={(() => {
                  const agreementDate = new Date(
                    infoProject.project && infoProject.project.agreement_date,
                  );
                  const designPeriod = infoProject.project && infoProject.project.design_period;

                  const endDate = addWorkingDays(agreementDate, designPeriod);
                  const formattedEndDate = formatDate(endDate);
                  return formattedEndDate;
                })()}
                startDateProduction={infoProject.project.agreement_date}
                endDateProduction={(() => {
                  const agreementDate = new Date(
                    infoProject.project && infoProject.project.agreement_date,
                  );
                  const designPeriod = infoProject.project && infoProject.project.design_period;

                  const expirationDate = infoProject.project && infoProject.project.expiration_date;

                  const sumDays = designPeriod + expirationDate;

                  const endDate = addWorkingDays(agreementDate, sumDays);
                  const formattedEndDate = formatDate(endDate);
                  return formattedEndDate;
                })()}
                startDateInstallation={infoProject.project.agreement_date}
                endDateInstallation={(() => {
                  const agreementDate = new Date(
                    infoProject.project && infoProject.project.agreement_date,
                  );
                  const designPeriod = infoProject.project && infoProject.project.design_period;
                  const expirationDate = infoProject.project && infoProject.project.expiration_date;
                  const installationPeriod =
                    infoProject.project && infoProject.project.installation_period;
                  const sumDays = designPeriod + expirationDate + installationPeriod;

                  const endDate = addWorkingDays(agreementDate, sumDays);
                  const formattedEndDate = formatDate(endDate);
                  return formattedEndDate;
                })()}
              />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default ProjectInfo;
