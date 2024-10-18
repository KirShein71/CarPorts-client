import React from 'react';
import { Table } from 'react-bootstrap';

import './style.scss';

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

  return (
    <div className="installation-days">
      <>
        <div className="installation-days__filter">
          <div className="installation-days__month">
            <div className="installation-days__month-arrow" onClick={handlePrevMonth}>
              <img src="./img/left.png" alt="left arrow" />
            </div>
            <p className="installation-days__month-name">
              {new Date(currentYear, currentMonth).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="installation-days__month-arrow" onClick={handleNextMonth}>
              <img src="./img/right.png" alt="right arrow" />
            </div>
          </div>
          <div className="installation-days__period">
            {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
              <>
                <input
                  className="installation-days__period-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                />
                <input
                  className="installation-days__period-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                />
              </>
            ) : (
              <>
                <input
                  className="installation-days__period-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  className="installation-days__period-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((dateInstal) => (
              <tr key={dateInstal.id}>
                <td
                  style={{
                    textAlign: 'center',
                    backgroundColor:
                      dateInstal.date.toLocaleString().split('T')[0] === todayString
                        ? '#bbbbbb'
                        : 'transparent',
                  }}>
                  {new Date(dateInstal.date).toLocaleDateString('ru-RU')} -{' '}
                  {getDayName(dateInstal.date)}
                </td>
                {daysBrigade
                  .filter((dayBrigade) => dayBrigade.dateId === dateInstal.id)
                  .map((dayBrigade) => {
                    return (
                      <td
                        style={{
                          textAlign: 'center',

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
                          dayBrigade.warranty ||
                          dayBrigade.weekend ||
                          dayBrigade.downtime ||
                          ''}
                        {dayBrigade.project && dayBrigade.project.estimates ? (
                          <div>
                            {(() => {
                              const projectTotal = dayBrigade.project.estimates
                                .filter((estimateForProject) => estimateForProject.done === 'true')
                                .reduce(
                                  (accumulator, current) => accumulator + Number(current.price),
                                  0,
                                );

                              const projectDays = daysProject
                                .filter(
                                  (dayProject) => dayProject.projectId === dayBrigade.projectId,
                                )
                                .map((dayProject) => dayProject.days);

                              return (
                                <div>
                                  Заработок за день: {Math.ceil(projectTotal / projectDays)}
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
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    </div>
  );
}

export default InstallationDays;
