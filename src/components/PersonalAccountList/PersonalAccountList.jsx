import React from 'react';
import { getOneAccount, logout } from '../../http/userApi';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment-business-days';

import './styles.scss';

function PersonalAccountList() {
  const [account, setAccount] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [openImage, setOpenImage] = React.useState(false);
  const { user } = React.useContext(AppContext);

  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = localStorage.getItem('id');
    getOneAccount(userId)
      .then((data) => setAccount(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  const handleOpenImage = () => {
    setOpenImage(true);
  };

  const handleDownloadFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error('Ошибка при скачивании файла:', error));
  };

  const hadleClickImage = ({ target }) => {
    if (!document.fullscreenElement) {
      target.requestFullscreen().catch((error) => console.log(error));
    } else {
      document.exitFullscreen();
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${7}(${match[2]})-${match[3]}-${match[4]}-${match[5]}`;
    }
    return phoneNumber;
  };

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <div className="account">
        <h2 className="account__title">Личный кабинет</h2>
        <>
          {[account].map((userData) => (
            <div key={userData.id}>
              <div className="account__manager">
                <div className="account__manager-content">
                  <div className="account__manager-title">Ваш менеджер:</div>
                  <div className="account__manager-name">{userData.manager},</div>
                  <a className="account__manager-phone" href={`tel:${userData.manager_phone}`}>
                    {formatPhoneNumber(userData.manager_phone)}
                  </a>
                </div>
              </div>
              <div className="account__file">
                <div className="account__file-items">
                  <div className="account__file-title">Файлы:</div>
                  {userData.userfiles.map((file) => (
                    <div key={file.id}>
                      <div
                        className="account__file-item"
                        onClick={() =>
                          handleDownloadFile(process.env.REACT_APP_IMG_URL + file.file)
                        }>
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="account__brigade">
                <div className="account__brigade-content">
                  <div className="account__brigade-title">Монтажная бригада:</div>
                  <div className="account__brigade-foreman">
                    {userData.brigade && userData.brigade.name ? userData.brigade.name : ''},
                  </div>
                  <a className="account__brigade-phone" href={`tel:${userData.brigade?.phone}`}>
                    {formatPhoneNumber(userData.brigade?.phone)},
                  </a>
                  <div
                    className="account__brigade-foto"
                    onClick={() => {
                      handleOpenImage();
                    }}>
                    фотография бригады
                  </div>
                </div>
                {openImage && (
                  <div className="account__brigade-image">
                    <img
                      src={process.env.REACT_APP_IMG_URL + userData.brigade?.image}
                      alt="foto__brigade"
                      onClick={() => setOpenImage(false)}
                    />
                  </div>
                )}
              </div>
              <div className="table-scrollable">
                <Table bordered hover size="sm" className="mt-5">
                  <thead style={{ backgroundColor: '#7d7f7d' }}>
                    <tr style={{ color: '#ffff', textAlign: 'center' }}>
                      <th>Дата договора</th>
                      <th>Дедлайн проектирования</th>
                      <th>Дедлайн производства</th>
                      <th>Дата сдачи объекта</th>
                      <th>Осталось дней</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ textAlign: 'center' }}>
                      <td>
                        <Moment format="DD.MM.YYYYY">{userData.project.agreement_date}</Moment>
                      </td>
                      <td>
                        {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                          .businessAdd(userData.project.design_period, 'days')
                          .format('DD.MM.YYYY')}
                      </td>
                      <td>
                        {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                          .businessAdd(userData.project.expiration_date, 'days')
                          .businessAdd(userData.project.design_period, 'days')
                          .format('DD.MM.YYYY')}
                      </td>
                      <td>
                        {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                          .businessAdd(userData.project.design_period, 'days')
                          .businessAdd(userData.project.expiration_date, 'days')
                          .businessAdd(userData.project.installation_period, 'days')
                          .format('DD.MM.YYYY')}
                      </td>
                      <td>
                        {(() => {
                          const targetDate = moment(userData.project.agreement_date, 'YYYY/MM/DD')
                            .businessAdd(userData.project.design_period, 'days')
                            .businessAdd(userData.project.expiration_date, 'days')
                            .businessAdd(userData.project.installation_period, 'days');

                          function subtractDaysUntilZero(targetDate) {
                            const today = moment();
                            let daysLeft = 0;

                            while (targetDate.diff(today, 'days') > 0) {
                              daysLeft++;
                              targetDate.subtract(1, 'day');
                            }

                            return daysLeft;
                          }

                          return subtractDaysUntilZero(targetDate);
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="account__image">
                <h3 className="account__image-title">Фотографии работ</h3>
                <div className="account__image-content">
                  {account.userimages.map((userImage) => (
                    <div key={userImage.id}>
                      <div className="account__image-card">
                        <img
                          onClick={hadleClickImage}
                          src={process.env.REACT_APP_IMG_URL + userImage.image}
                          alt="photos of works"
                        />
                        <div className="account__image-date">{userImage.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button
            className="mt-5"
            variant="secondary"
            style={{ display: 'block', margin: '0 auto' }}
            onClick={handleLogout}>
            Выйти
          </Button>
        </>
      </div>
    </>
  );
}

export default PersonalAccountList;
