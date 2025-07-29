import React from 'react';
import { Table } from 'react-bootstrap';

function GantBrigade(props) {
  const {
    selectedRegion,
    brigades,
    handleNextMonthGant,
    handlePrevMonthGant,
    currentYearGant,
    currentMonthGant,
    filteredDates,
    todayString,
    getDayName,
    brigadesDates,
    handleOpenModalCreateBrigadeDate,
    handleOpenModalEditDelete,
  } = props;

  return (
    <div className="gant-brigade">
      <div className="calendar-brigade__month">
        <div className="calendar-brigade__month-arrow" onClick={handlePrevMonthGant}>
          <img src="./img/left.png" alt="left arrow" />
        </div>
        <p className="calendar-brigade__month-name">
          {new Date(currentYearGant, currentMonthGant).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="calendar-brigade__month-arrow" onClick={handleNextMonthGant}>
          <img src="./img/right.png" alt="right arrow" />
        </div>
      </div>
      <div className="gant-brigade__container">
        <div className="gant-brigade__table">
          <Table bordered size="md">
            <thead>
              <tr>
                <th className="project-th mobile">Дата</th>
                {brigades
                  .filter(
                    (gantBrigName) =>
                      gantBrigName.regionId === selectedRegion && gantBrigName.active === 'true',
                  )
                  .map((gantBrigName) => (
                    <th key={gantBrigName.id} className="project-th">
                      {gantBrigName.name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredDates.map((gantBrigDate) => (
                <tr key={gantBrigDate.id}>
                  <td
                    className="project-td mobile"
                    style={{
                      backgroundColor:
                        gantBrigDate.date.toLocaleString().split('T')[0] === todayString
                          ? '#bbbbbb'
                          : '#ffffff',
                    }}>
                    {new Date(gantBrigDate.date).toLocaleDateString('ru-RU')} -
                    {getDayName(gantBrigDate.date)}
                  </td>
                  {brigades
                    .filter(
                      (gantBrigName) =>
                        gantBrigName.regionId === selectedRegion && gantBrigName.active === 'true',
                    )
                    .map((gantBrigName) => {
                      const dateBrig = brigadesDates.find(
                        (el) => el.brigadeId === gantBrigName.id && el.dateId === gantBrigDate.id,
                      );

                      let bisness = '';
                      if (dateBrig) {
                        if (dateBrig.complaint?.project.name) {
                          bisness = `*${dateBrig.complaint.project.name}*`;
                        } else {
                          bisness =
                            dateBrig.project?.name ||
                            dateBrig.warranty ||
                            dateBrig.weekend ||
                            dateBrig.downtime;
                        }
                      }

                      return bisness ? (
                        <td
                          key={gantBrigName.id}
                          style={{
                            cursor: 'pointer',

                            fontWeight: '500',
                            textAlign: 'center',
                            paddingTop: '7px',
                            color:
                              bisness === 'Гарантийный день'
                                ? '#0000ff'
                                : bisness === 'Выходной'
                                ? '#9b2d30'
                                : bisness === 'Простой'
                                ? '#ff0000'
                                : '#000000',
                            backgroundColor:
                              new Date(gantBrigDate.date).toISOString().split('T')[0] ===
                              todayString
                                ? '#bbbbbb'
                                : 'transparent',
                          }}
                          onClick={() => handleOpenModalEditDelete(dateBrig?.id)}>
                          {bisness}
                        </td>
                      ) : (
                        <td
                          key={gantBrigName.id}
                          onClick={() =>
                            handleOpenModalCreateBrigadeDate(gantBrigName.id, gantBrigDate.id)
                          }
                          style={{
                            cursor: 'pointer',
                            backgroundColor:
                              new Date(gantBrigDate.date).toISOString().split('T')[0] ===
                              todayString
                                ? '#bbbbbb'
                                : 'transparent',
                          }}>
                          {' '}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default GantBrigade;
