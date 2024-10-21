import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.scss';

function CalendarInstallation(props) {
  const {
    startDateDesing,
    endDateDesing,
    startDateProduction,
    endDateProduction,
    startDateInstallation,
    endDateInstallation,
    startDateConstructor,
    endDateСonstructor,
    designer,
    brigadesDate,
  } = props;

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  };

  const dateRanges = [
    {
      start: new Date(startDateDesing),
      end: new Date(formatDate(endDateDesing)),
      color: '#42aaff',
    },
    {
      start: new Date(startDateProduction),
      end: new Date(formatDate(endDateProduction)),
      color: '#008000',
    },
    {
      start: new Date(startDateInstallation),
      end: new Date(formatDate(endDateInstallation)),
      color: '#ffc0cb',
    },
  ];

  const dateConstructor = [
    {
      start: new Date(startDateConstructor),
      end: endDateСonstructor ? new Date(endDateСonstructor) : new Date(),
    },
  ];

  const isDateInRange = (date) => {
    return dateRanges.find((range) => {
      return date >= range.start && date <= range.end;
    });
  };

  const isDateConstructor = (date) => {
    return dateConstructor.find((constructor) => {
      return date >= constructor.start && date <= constructor.end;
    });
  };

  // Функция для отображения контента на тайле
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const range = isDateInRange(date);
      const constructor = isDateConstructor(date);
      const brigadesEntries = brigadesDate.filter((entry) => {
        // Сравнение только дат без учета времени
        const entryDate = new Date(entry.date);
        const tileDate = new Date(date);
        return (
          entryDate.getDate() === tileDate.getDate() &&
          entryDate.getMonth() === tileDate.getMonth() &&
          entryDate.getFullYear() === tileDate.getFullYear()
        );
      });

      return (
        <>
          {range && (
            <div style={{ backgroundColor: range.color, height: '10px', opacity: 0.5 }}></div>
          )}
          {constructor && <div style={{ fontSize: '0.8em', textAlign: 'center' }}>{designer}</div>}
          {brigadesEntries.length > 0 && (
            <div style={{ fontSize: '0.8em', textAlign: 'center' }}>
              <div>Р</div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="calendar-installation">
      <div className="calendar-installation__content">
        <Calendar
          tileContent={tileContent}
          minDetail="month"
          maxDetail="month"
          showNavigation={true}
          showNeighboringMonth={false}
        />
        <div className="calendar-installation__tooltip">
          <div className="calendar-installation__tooltip-items">
            <div className="calendar-installation__tooltip-items__planning"></div>
            <div className="calendar-installation__tooltip-items__description">Проектирование</div>
          </div>
          <div className="calendar-installation__tooltip-items">
            <div className="calendar-installation__tooltip-items__materials"></div>
            <div className="calendar__tooltip-items__description">Снабжение</div>
          </div>
          <div className="calendar-installation__tooltip-items">
            <div className="calendar-installation__tooltip-items__installation"></div>
            <div className="calendar-installation__tooltip-items__description">Монтаж</div>
          </div>
          {designer !== null ? (
            <div className="calendar-installation__tooltip-items">
              <div className="calendar-installation__tooltip-items__brigade">Конструктор:</div>
              <div className="calendar-installation__tooltip-items__description">{designer}</div>
            </div>
          ) : (
            ''
          )}
          {brigadesDate.length > 0 ? (
            <div className="calendar-installation__tooltip-items">
              <div className="calendar-installation__tooltip-items__brigade">Р:</div>
              <div className="calendar-installation__tooltip-items__description">Рабочий день</div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarInstallation;
