import React from 'react';
import { getProjectInfoInstallation } from '../../http/projectApi';
import { getUserForBrigade } from '../../http/userApi';
import { getAllUserImageByUserId, deleteUserImage } from '../../http/userImageApi';
import CalendarInstallation from './CalendarInstallation/CalendarInstallation';
import CreateUserImage from './modals/CreateUserImage';
import { Button } from 'react-bootstrap';

function ProjectInfo({ projectId }) {
  const [project, setProject] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [userImages, setUserImages] = React.useState([]);
  const [imageCreateModal, setImageCreateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    if (projectId !== null) {
      const fetchData = async () => {
        try {
          // Получаем информацию о проекте
          const projectData = await getProjectInfoInstallation(projectId);
          setProject(projectData);

          // Получаем пользователя для бригады
          const userId = await getUserForBrigade(projectId);
          setUser(userId);

          // Если пользователь найден, получаем его изображения
          if (userId) {
            const userImages = await getAllUserImageByUserId(userId);
            setUserImages(userImages);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [projectId, change]);

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

  const handleCreateImage = () => {
    setImageCreateModal(true);
  };

  const handleDeleteImage = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить изображение?');
    if (confirmed) {
      deleteUserImage(id)
        .then((data) => {
          setChange(!change);
          // Удалить удаленное изображение из списка images
          const updatedImages = userImages.filter((image) => image.id !== id);
          setUserImages(updatedImages);
          alert('Изображение удалено');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <div className="projectinfo">
      <CreateUserImage
        userId={user}
        show={imageCreateModal}
        setShow={setImageCreateModal}
        setChange={setChange}
      />
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
          <div className="projectinfo__files">
            <div
              className="projectinfo__files-title"
              style={{
                marginTop: '25px',
                color: 'rgb(7, 7, 7)',
                fontSize: '22px',
                fontWeight: '600',
              }}>
              Изображения хода работ
            </div>
            <Button
              variant="dark"
              className="mt-3"
              size="sm"
              onClick={() => handleCreateImage(user)}>
              Добавить изображение
            </Button>
            <div
              className="projectinfo__files-content"
              style={{
                marginTop: '25px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridColumnGap: '5px',
                gridRowGap: '5px',
              }}>
              {userImages.map((image) => (
                <div key={image.id}>
                  <div className="projectinfo__files-card">
                    <img
                      style={{ width: '70%', marginBottom: '10px' }}
                      src={process.env.REACT_APP_IMG_URL + image.image}
                      alt="photos of works"
                    />
                    <div>{image.date}</div>
                    <div
                      className="delete__image"
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDeleteImage(image.id)}>
                      Удалить
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default ProjectInfo;
