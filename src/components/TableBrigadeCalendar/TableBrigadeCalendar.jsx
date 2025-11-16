import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllCertainDays } from '../../http/brigadesDateApi';
import './style.scss';

function TableBrigadeCalendar() {
  const [dateBrigades, setDateBrigades] = React.useState([]);
  const [dates, setDates] = React.useState([]);

  React.useEffect(() => {
    getAllCertainDays().then((data) => setDateBrigades(data));
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
    <div className="table-brigade" style={{ marginTop: '25px', width: '360px' }}>
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
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor: '#e1dede',
                  borderBottom: '1px solid #dee2e6',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#000000',
                }}>
                {date.toLocaleDateString()} - {getDayName(date)}
              </th>
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor: '#e1dede',
                  borderBottom: '1px solid #dee2e6',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#000000',
                }}>
                МО{' '}
                {
                  dateBrigades.filter((dateMoscow) => {
                    const dateString = date.toISOString().split('T')[0];
                    return (
                      dateMoscow.date.date.startsWith(dateString) &&
                      dateMoscow.weekend === '' &&
                      dateMoscow.warranty === '' &&
                      dateMoscow.regionId === 2
                    );
                  }).length
                }
              </th>
            </tr>
          </thead>
          <tbody>
            {dateBrigades
              .filter((dateMoscow) => {
                const dateString = date.toISOString().split('T')[0];
                return dateMoscow.date.date.startsWith(dateString) && dateMoscow.regionId === 2;
              })
              .map((dateMoscow) => (
                <tr key={dateMoscow.id}>
                  <td
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#000000',
                    }}
                    className="table-brigade__body">
                    {dateMoscow.brigade.name}
                  </td>
                  <td
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#000000',
                    }}
                    className="table-brigade__body">
                    {dateMoscow.project?.name}{' '}
                    {dateMoscow.complaint ? `*${dateMoscow.complaint.project.name}*` : ''}
                    {dateMoscow.warranty} {dateMoscow.weekend}
                  </td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr>
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor: '#e1dede',
                  borderTop: '1px solid #dee2e6',
                  borderBottom: '1px solid #dee2e6',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#000000',
                }}>
                {date.toLocaleDateString()} - {getDayName(date)}
              </th>
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor: '#e1dede',
                  borderTop: '1px solid #dee2e6',
                  borderBottom: '1px solid #dee2e6',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#000000',
                }}>
                ЛО{' '}
                {
                  dateBrigades.filter((dateSankt) => {
                    const dateString = date.toISOString().split('T')[0];
                    return (
                      dateSankt.date.date.startsWith(dateString) &&
                      dateSankt.weekend === '' &&
                      dateSankt.warranty === '' &&
                      dateSankt.regionId === 1
                    );
                  }).length
                }
              </th>
            </tr>
          </thead>
          <tbody>
            {dateBrigades
              .filter((dateSpb) => {
                const dateString = date.toISOString().split('T')[0];
                return dateSpb.date.date.startsWith(dateString) && dateSpb.regionId === 1;
              })
              .map((dateSpb) => (
                <tr key={dateSpb.id}>
                  <td
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#000000',
                    }}
                    className="table-brigade__body">
                    {dateSpb.brigade ? dateSpb.brigade.name : ''}
                  </td>
                  <td
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#000000',
                    }}
                    className="table-brigade__body">
                    {dateSpb.project?.name}{' '}
                    {dateSpb.complaint ? `*${dateSpb.complaint.project.name}*` : ''}
                    {dateSpb.warranty} {dateSpb.weekend}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ))}
    </div>
  );
}

export default TableBrigadeCalendar;
