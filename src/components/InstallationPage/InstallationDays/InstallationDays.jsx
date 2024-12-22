import React from 'react';
import { Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'react-moment';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import rus from 'date-fns/locale/ru';

import './style.scss';

registerLocale('rus', rus); // Регистрируем локаль
setDefaultLocale('rus');

function InstallationDays({ dates, daysBrigade, daysProject }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

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

  const filteredDates = dates.filter((date) => {
    const dateObj = new Date(date.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (startDate === '' || endDate === '') {
      return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
    } else {
      return dateObj >= start && dateObj <= end;
    }
  });

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', { weekday: 'long' });
  };

  const todayString = new Date().toISOString().split('T')[0];

  let totalEarnings = 0;

  return (
    <div className="installation-days">
      <>
        <div className="installation-days__filter">
          <div className="installation-days__month">
            <div className="installation-days__month-arrow" onClick={handlePrevMonth}>
              <img src="../img/left.png" alt="left arrow" />
            </div>
            <p className="installation-days__month-name">
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="installation-days__month-arrow" onClick={handleNextMonth}>
              <img src="../img/right.png" alt="right arrow" />
            </div>
          </div>
          <div className="installation-days__period">
            <DatePicker
              selected={startDate}
              locale="rus"
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="ДД.ММ.ГГГГ"
              className="installation-days__period-input"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="ДД.ММ.ГГГГ"
              className="installation-days__period-input"
              locale="rus"
            />
            <img
              width={20}
              height={20}
              style={{ cursor: 'pointer', marginTop: '5px' }}
              src="./img/reset.png"
              alt="reset"
              onClick={handleReset}
            />
          </div>
        </div>
        <Table bordered size="sm" className="installation-days">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Дата</th>
              <th style={{ textAlign: 'center' }}>Проект</th>
              <th style={{ textAlign: 'center' }}>За день</th>
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((dateInstal) => (
              <tr key={dateInstal.id}>
                <td
                  style={{
                    textAlign: 'left',
                    backgroundColor:
                      dateInstal.date.toLocaleString().split('T')[0] === todayString
                        ? '#bbbbbb'
                        : 'transparent',
                  }}>
                  {new Date(dateInstal.date).toLocaleDateString('ru-RU')} -{' '}
                  <div> {getDayName(dateInstal.date)}</div>
                </td>
                {daysBrigade
                  .filter((dayBrigade) => dayBrigade.dateId === dateInstal.id)
                  .map((dayBrigade) => {
                    return (
                      <td
                        style={{
                          textAlign: 'left',
                          color: dayBrigade.warranty
                            ? '#0000ff'
                            : dayBrigade.weekend
                            ? '#9b2d30'
                            : dayBrigade.downtime
                            ? '#ff0000'
                            : '#000000',
                          backgroundColor:
                            dateInstal.date.toLocaleString().split('T')[0] === todayString
                              ? '#bbbbbb'
                              : 'transparent',
                        }}
                        key={dayBrigade.id}>
                        {dayBrigade.project?.name ||
                          (dayBrigade.weekend
                            ? 'Выходной'
                            : dayBrigade.warranty
                            ? 'Гарантия'
                            : dayBrigade.downtime
                            ? 'Время простоя'
                            : '')}
                      </td>
                    );
                  })}
                {daysBrigade
                  .filter((dayBrigade) => dayBrigade.dateId === dateInstal.id)
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
                              const projectTotal = dayBrigadeSum.project.estimates
                                .filter((estimateForProject) => estimateForProject.done === 'true')
                                .reduce(
                                  (accumulator, current) => accumulator + Number(current.price),
                                  0,
                                );

                              const projectDays = daysProject
                                .filter(
                                  (dayProject) => dayProject.projectId === dayBrigadeSum.projectId,
                                )
                                .map((dayProject) => dayProject.days);
                              return (
                                <div>
                                  {new Intl.NumberFormat('ru-RU').format(
                                    Math.ceil(projectTotal / projectDays),
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                    );
                  })}
                {daysBrigade.filter((dayBrigade) => dayBrigade.dateId === dateInstal.id).length ===
                  0 && <td style={{ textAlign: 'center', backgroundColor: 'transparent' }}></td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </>
      {startDate !== '' && endDate !== '' ? (
        <div>
          <div className="installation-days__sumperiod">
            За период с <Moment format="DD.MM.YYYY">{startDate}</Moment> по{' '}
            <Moment format="DD.MM.YYYY">{endDate}</Moment>
          </div>
          {filteredDates.map((periodDay) =>
            daysBrigade
              .filter((periodBrigade) => periodBrigade.dateId === periodDay.id)
              .map((periodBrigade) => {
                if (periodBrigade.project && periodBrigade.project.estimates) {
                  const projectTotal = periodBrigade.project.estimates
                    .filter((estimateForProject) => estimateForProject.done === 'true')
                    .reduce((accumulator, current) => accumulator + Number(current.price), 0);

                  const projectDays = daysProject
                    .filter((dayProject) => dayProject.projectId === periodBrigade.projectId)
                    .map((dayProject) => dayProject.days);

                  const earningsPerDay = Math.ceil(projectTotal / projectDays); // Избегаем деления на 0

                  totalEarnings += earningsPerDay; // Накопление общей суммы
                }
                return null; // Возвращаем null, если проект или оценки отсутствуют
              }),
          )}
          <div className="installation-days__total-earnings">
            Общая сумма заработка: {totalEarnings} руб.
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default InstallationDays;
