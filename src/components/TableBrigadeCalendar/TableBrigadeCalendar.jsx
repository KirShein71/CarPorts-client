import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllCertainDays } from '../../http/brigadesDateApi';

function TableBrigadeCalendar() {
  const [dateBrigades, setDateBrigades] = React.useState([]);
  const [dates, setDates] = React.useState([]);

  React.useEffect(() => {
    getAllCertainDays().then((data) => setDateBrigades(data));
  }, []);

  React.useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 3);
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

  return (
    <div className="table" style={{ marginTop: '25px', width: '400px' }}>
      {dates.map((date) => (
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>{date.toLocaleDateString()}</th>
              <th>МО</th>
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
                  <td>{dateMoscow.brigade.name}</td>
                  <td>{dateMoscow.project?.name || dateMoscow.warranty || dateMoscow.weekend}</td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr>
              <th></th>
              <th>ЛО</th>
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
                  <td>{dateSpb.brigade.name}</td>
                  <td>{dateSpb.project?.name || dateSpb.warranty || dateSpb.weekend}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      ))}
    </div>
  );
}

export default TableBrigadeCalendar;
