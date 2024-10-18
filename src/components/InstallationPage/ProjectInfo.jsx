import React from 'react';
import { getProjectInfoInstallation } from '../../http/projectApi';
import CalendarInstallation from './CalendarInstallation/CalendarInstallation';

function ProjectInfo({ projectId }) {
  const [project, setProject] = React.useState([]);

  React.useEffect(() => {
    if (projectId !== null) {
      getProjectInfoInstallation(projectId)
        .then((data) => setProject(data))
        .catch((error) => {
          console.error('Error fetching project info:', error);
        });
    }
  }, [projectId]);

  const holidays = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-08',
    '2024-02-23',
    '2024-03-08',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-09',
    '2024-05-10',
    '2024-06-12',
    '2024-11-04',
  ].map((date) => new Date(date));

  // Функция для проверки, является ли дата выходным или праздничным днем
  function isWorkingDay(date) {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const isHoliday = holidays.some((holiday) => {
      const holidayString = holiday.toDateString();
      const dateString = date.toDateString();
      return holidayString === dateString;
    });

    return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
  }
  // Функция для добавления рабочих дней к дате
  function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
      if (isWorkingDay(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  // Функция для форматирования даты в формате ДД.ММ.ГГГГ
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Исправлено: добавлены кавычки для шаблонной строки
  }

  return (
    <div className="projectinfo">
      {project.map((infoProject) => (
        <>
          <div className="projectinfo__calenadar">
            <CalendarInstallation
              brigadesDate={infoProject.brigadesdate}
              designer={infoProject.project.designer}
              startDateConstructor={infoProject.project.design_start}
              endDateСonstructor={infoProject.project.project_delivery}
              startDateDesing={infoProject.project.agreement_date}
              endDateDesing={(() => {
                const agreementDate = new Date(
                  infoProject.project && infoProject.project.agreement_date,
                );
                const designPeriod = infoProject.project && infoProject.project.design_period;

                const endDate = addWorkingDays(agreementDate, designPeriod);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
              startDateProduction={infoProject.project.agreement_date}
              endDateProduction={(() => {
                const agreementDate = new Date(
                  infoProject.project && infoProject.project.agreement_date,
                );
                const designPeriod = infoProject.project && infoProject.project.design_period;

                const expirationDate = infoProject.project && infoProject.project.expiration_date;

                const sumDays = designPeriod + expirationDate;

                const endDate = addWorkingDays(agreementDate, sumDays);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
              startDateInstallation={infoProject.project.agreement_date}
              endDateInstallation={(() => {
                const agreementDate = new Date(
                  infoProject.project && infoProject.project.agreement_date,
                );
                const designPeriod = infoProject.project && infoProject.project.design_period;
                const expirationDate = infoProject.project && infoProject.project.expiration_date;
                const installationPeriod =
                  infoProject.project && infoProject.project.installation_period;
                const sumDays = designPeriod + expirationDate + installationPeriod;

                const endDate = addWorkingDays(agreementDate, sumDays);
                const formattedEndDate = formatDate(endDate);
                return formattedEndDate;
              })()}
            />
          </div>
        </>
      ))}
    </div>
  );
}

export default ProjectInfo;
