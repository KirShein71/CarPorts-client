import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllCertainDays } from '../../http/controlTourApi';
import './style.scss';

function ControlTourCalendar() {
  const [controlTourDates, setControlTourDates] = React.useState([]);
  const [dates, setDates] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchControlTourDates = async () => {
      try {
        const data = await getAllCertainDays();
        if (isMounted) {
          setControlTourDates(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке дат контрольного тура:', error);
      }
    };

    fetchControlTourDates();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 1);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 3);
    const datesArray = [];

    // Генерация дат
    let currentDate = startDate;
    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDates(datesArray);
  }, []);

  const todayString = new Date().toISOString().split('T')[0]; // Получаем строку даты для сравнения

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

  return (
    <div className="control-table">
      <div className="control-table__title">Контроль тур</div>
      {dates.map((date) => (
        <Table
          bordered
          hover
          size="sm"
          key={date.toISOString()}
          style={{
            border:
              date.toISOString().split('T')[0] === todayString
                ? '3px solid #000'
                : '1px solid #dee2e6',
          }}>
          <thead>
            <tr>
              <th className="control-table__header">
                {date.toLocaleDateString()} - {getDayName(date)}
              </th>
              <th className="control-table__header">
                МО{' '}
                {
                  controlTourDates.filter((dateMoscow) => {
                    const dateString = date.toISOString().split('T')[0];
                    return (
                      dateMoscow.date.date.startsWith(dateString) &&
                      dateMoscow.warehouse === '' &&
                      dateMoscow.regionId === 2
                    );
                  }).length
                }
              </th>
            </tr>
          </thead>
          <tbody>
            {controlTourDates
              .filter((dateMoscow) => {
                const dateString = date.toISOString().split('T')[0];
                return dateMoscow.date.date.startsWith(dateString) && dateMoscow.regionId === 2;
              })
              .map((dateMoscow) => (
                <tr key={dateMoscow.id}>
                  <td className="control-table__body">{dateMoscow.set.name}</td>
                  <td className="control-table__body">
                    {dateMoscow.project?.name}{' '}
                    {dateMoscow.complaint ? `*${dateMoscow.complaint.project.name}*` : ''}
                    {dateMoscow.warehouse}
                  </td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr>
              <th className="control-table__header th">
                {date.toLocaleDateString()} - {getDayName(date)}
              </th>
              <th className="control-table__header th">
                ЛО{' '}
                {
                  controlTourDates.filter((dateSankt) => {
                    const dateString = date.toISOString().split('T')[0];
                    return (
                      dateSankt.date.date.startsWith(dateString) &&
                      dateSankt.warehouse === '' &&
                      dateSankt.regionId === 1
                    );
                  }).length
                }
              </th>
            </tr>
          </thead>
          <tbody>
            {controlTourDates
              .filter((dateSpb) => {
                const dateString = date.toISOString().split('T')[0];
                return dateSpb.date.date.startsWith(dateString) && dateSpb.regionId === 1;
              })
              .map((dateSpb) => (
                <tr key={dateSpb.id}>
                  <td className="control-table__body">{dateSpb.brigade ? dateSpb.set.name : ''}</td>
                  <td className="control-table__body">
                    {dateSpb.project?.name}{' '}
                    {dateSpb.complaint ? `*${dateSpb.complaint.project.name}*` : ''}
                    {dateSpb.warehouse}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ))}
    </div>
  );
}

export default ControlTourCalendar;
