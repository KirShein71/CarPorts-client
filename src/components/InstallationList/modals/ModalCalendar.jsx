import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ModalCalendar.styles.scss';

function ModalCalendar(props) {
  const {
    plan_start,
    plan_finish,
    agreement_date,
    design_period,
    expiration_date,
    installation_period,
  } = props;

  const planStart = new Date(plan_start);
  const planFinish = new Date(plan_finish);
  const agreementDate = new Date(agreement_date);

  const calendarDates = [
    {
      date: new Date(
        agreementDate.getTime() + (design_period + expiration_date) * 24 * 60 * 60 * 1000,
      ),
      color: 'orange',
    },
    {
      date: new Date(
        agreementDate.getTime() +
          (design_period + expiration_date + installation_period) * 24 * 60 * 60 * 1000,
      ),
      color: 'red',
    },
  ];

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateObj = calendarDates.find((item) => item.date.getTime() === date.getTime());
      if (dateObj) {
        return <div className={`calendar__tile ${dateObj.color}`}></div>;
      }
    }
  };

  return (
    <div className="modal-calendar">
      <Calendar
        tileContent={tileContent}
        value={[planStart, planFinish, agreementDate]}
        minDetail="month"
        maxDetail="month"
        showNavigation={true}
        showNeighboringMonth={false}
      />
    </div>
  );
}

export default ModalCalendar;
