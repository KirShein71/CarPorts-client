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
                <th className="project-th"></th>
                {brigades
                  .filter(
                    (gantBrigName) =>
                      gantBrigName.regionId === selectedRegion && gantBrigName.active === 'true',
                  )
                  .map((gantBrigName) => (
                    <th
                      key={gantBrigName.id}
                      className="project-th"
                      style={{
                        whiteSpace: 'nowrap', // запрет переноса текста
                        overflow: 'hidden', // скрытие выходящего за границы содержимого
                        textOverflow: 'ellipsis', // добавление многоточия в конце
                        maxWidth: '120px', // ограничение максимальной ширины
                        minWidth: '50px', // минимальная ширина
                        textAlign: 'center', // выравнивание по центру
                      }}
                      title={gantBrigName.name}>
                      {gantBrigName.name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredDates.map((gantBrigDate) => {
                const currentDate = new Date(gantBrigDate.date);
                const dateString = currentDate.toISOString().split('T')[0];
                const dayOfWeek = currentDate.getDay();
                const isToday = dateString === todayString;
                const isWeekend = [0, 6].includes(dayOfWeek);

                return (
                  <tr key={gantBrigDate.id}>
                    <td
                      className="project-td mobile"
                      style={{
                        backgroundColor: isToday ? '#bbbbbb' : isWeekend ? '#e1dede' : '#ffffff',
                      }}>
                      {currentDate.toLocaleDateString('ru-RU')} -
                      {getDayName(gantBrigDate.date).replace('вск', 'вс')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {
                        brigadesDates.filter((brigadesDateLength) => {
                          const brigadesDateString = new Date(brigadesDateLength.date.date)
                            .toISOString()
                            .split('T')[0];
                          return (
                            brigadesDateString === dateString &&
                            brigadesDateLength.weekend === '' &&
                            brigadesDateLength.warranty === '' &&
                            brigadesDateLength.regionId === selectedRegion
                          );
                        }).length
                      }
                    </td>
                    {brigades
                      .filter(
                        (gantBrigName) =>
                          gantBrigName.regionId === selectedRegion &&
                          gantBrigName.active === 'true',
                      )
                      .map((gantBrigName) => {
                        const dateBrig = brigadesDates.find(
                          (el) => el.brigadeId === gantBrigName.id && el.dateId === gantBrigDate.id,
                        );

                        let bisness = '';
                        if (dateBrig) {
                          if (dateBrig.complaint?.project?.name) {
                            bisness = `*${dateBrig.complaint.project.name}*`;
                          } else {
                            bisness =
                              dateBrig.project?.name ||
                              dateBrig.warranty ||
                              dateBrig.weekend ||
                              dateBrig.downtime ||
                              '';
                          }
                        }

                        const cellStyle = {
                          cursor: 'pointer',
                          fontWeight: '500',
                          textAlign: 'left',
                          padding: '7px 4px 4px 4px', // уменьшил отступы для экономии места
                          color: '#000000',
                          backgroundColor: isToday ? '#bbbbbb' : isWeekend ? '#e1dede' : '#ffffff',
                          whiteSpace: 'nowrap', // запрет переноса текста
                          overflow: 'hidden', // скрытие выходящего за границы содержимого
                          textOverflow: 'ellipsis', // добавление многоточия в конце
                          maxWidth: '120px', // ограничение максимальной ширины
                          minWidth: '50px', // минимальная ширина для кликабельности
                        };

                        // Устанавливаем цвет текста в зависимости от типа занятия
                        if (bisness === 'Гарантийный день') {
                          cellStyle.color = '#0000ff';
                        } else if (bisness === 'Выходной') {
                          cellStyle.color = '#9b2d30';
                        } else if (bisness === 'Простой') {
                          cellStyle.color = '#ff0000';
                        }

                        return bisness ? (
                          <td
                            key={gantBrigName.id}
                            style={cellStyle}
                            onClick={() => dateBrig?.id && handleOpenModalEditDelete(dateBrig.id)}
                            title={bisness} // добавлен title для показа полного текста при наведении
                          >
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
                              backgroundColor: isToday
                                ? '#bbbbbb'
                                : isWeekend
                                ? '#e1dede'
                                : '#ffffff',
                              minWidth: '50px', // одинаковая минимальная ширина для пустых ячеек
                            }}>
                            {' '}
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default GantBrigade;
