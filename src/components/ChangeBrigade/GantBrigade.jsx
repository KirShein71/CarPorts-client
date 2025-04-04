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
    handleOpenModalUpdateBrigadeDate,
    handleOpenModalDeleteBrigadeDateData,
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
      <div className="gant-brigade__table">
        <Table bordered size="md" className="mt-3">
          <thead>
            <tr>
              <th className="gant-brigade__table-th">Дата</th>
              {brigades
                .filter((gantBrigName) => gantBrigName.regionId === selectedRegion)
                .map((gantBrigName) => (
                  <th key={gantBrigName.id} style={{ textAlign: 'center' }}>
                    {gantBrigName.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((gantBrigDate) => (
              <tr key={gantBrigDate.id}>
                <td
                  className="gant-brigade__table-th"
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
                  .filter((gantBrigName) => gantBrigName.regionId === selectedRegion)
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

                    const handleClick = () => {
                      if (bisness) {
                        handleOpenModalUpdateBrigadeDate(dateBrig?.id);
                      } else {
                        handleOpenModalCreateBrigadeDate(gantBrigName.id, gantBrigDate.id);
                      }
                    };

                    return bisness ? (
                      <td
                        key={gantBrigName.id}
                        style={{
                          cursor: 'pointer',
                          fontSize: '17px',
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
                            new Date(gantBrigDate.date).toISOString().split('T')[0] === todayString
                              ? '#bbbbbb'
                              : 'transparent',
                        }}>
                        <div className="gant-brigade__td">
                          <div
                            className="gant-brigade__td-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModalDeleteBrigadeDateData(dateBrig?.id);
                            }}>
                            <img src="./img/delete-small.png" alt="delete" />
                          </div>
                          <div className="gant-brigade__td-text" onClick={handleClick}>
                            {bisness}
                          </div>
                        </div>
                      </td>
                    ) : (
                      <td
                        key={gantBrigName.id}
                        onClick={handleClick}
                        style={{
                          cursor: 'pointer',
                          backgroundColor:
                            new Date(gantBrigDate.date).toISOString().split('T')[0] === todayString
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
  );
}

export default GantBrigade;
