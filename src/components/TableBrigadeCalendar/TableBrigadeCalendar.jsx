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

  return (
    <div className="table-brigade" style={{ marginTop: '25px', width: '360px' }}>
      {dates.map((date) => (
        <Table size="sm" key={date.toISOString()}>
          <thead>
            <tr>
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor:
                    date.toISOString().split('T')[0] === todayString ? '#bbbbbb' : 'transparent',
                }}>
                {date.toLocaleDateString()}
              </th>
              <th
                className="table-brigade__header"
                style={{
                  backgroundColor:
                    date.toISOString().split('T')[0] === todayString ? '#bbbbbb' : 'transparent',
                }}>
                МО
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
                    className="table-brigade__body"
                    style={{
                      backgroundColor:
                        date.toISOString().split('T')[0] === todayString
                          ? '#bbbbbb'
                          : 'transparent',
                    }}>
                    {dateMoscow.brigade.name}
                  </td>
                  <td
                    className="table-brigade__body"
                    style={{
                      backgroundColor:
                        date.toISOString().split('T')[0] === todayString
                          ? '#bbbbbb'
                          : 'transparent',
                    }}>
                    {dateMoscow.project?.name} {dateMoscow.warranty} {dateMoscow.weekend}
                  </td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor:
                    date.toISOString().split('T')[0] === todayString ? '#bbbbbb' : 'transparent',
                }}></th>
              <th
                style={{
                  backgroundColor:
                    date.toISOString().split('T')[0] === todayString ? '#bbbbbb' : 'transparent',
                }}>
                ЛО
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
                    className="table-brigade__body"
                    style={{
                      backgroundColor:
                        date.toISOString().split('T')[0] === todayString
                          ? '#bbbbbb'
                          : 'transparent',
                    }}>
                    {dateSpb.brigade ? dateSpb.brigade.date : ''}
                  </td>
                  <td
                    className="table-brigade__body"
                    style={{
                      backgroundColor:
                        date.toISOString().split('T')[0] === todayString
                          ? '#bbbbbb'
                          : 'transparent',
                    }}>
                    {dateSpb.project?.name} {dateSpb.warranty} {dateSpb.weekend}
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
