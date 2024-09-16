import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.scss';

function CalendarComponent(props) {
  const {
    startDateDesing,
    endDateDesing,
    startDateProduction,
    endDateProduction,
    startDateInstallation,
    endDateInstallation,
  } = props;

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  };

  const dateRanges = [
    { start: new Date(startDateDesing), end: new Date(endDateDesing), color: '#42aaff' },
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

  const getColorsForDate = (date) => {
    return dateRanges
      .filter((range) => date >= range.start && date <= range.end)
      .map((range) => range.color);
  };

  // Функция для отображения контента на тайле
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const colors = getColorsForDate(date);
      if (colors.length > 0) {
        return (
          <div style={{ display: 'flex', height: '100%' }}>
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: color,
                  height: '100%',
                  width: '100%',
                }}
              />
            ))}
          </div>
        );
      }
    }
  };

  return (
    <div className="calendar">
      <div className="calendar__content">
        <Calendar
          tileContent={tileContent}
          minDetail="month"
          maxDetail="month"
          showNavigation={true}
          showNeighboringMonth={false}
        />
        <div className="calendar__tooltip">
          <div className="calendar__tooltip-items">
            <div className="calendar__tooltip-items__planning"></div>
            <div className="calendar__tooltip-items__description">Проектирование</div>
          </div>
          <div className="calendar__tooltip-items">
            <div className="calendar__tooltip-items__materials"></div>
            <div className="calendar__tooltip-items__description">Снабжение</div>
          </div>
          <div className="calendar__tooltip-items">
            <div className="calendar__tooltip-items__installation"></div>
            <div className="calendar__tooltip-items__description">Монтаж</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarComponent;
