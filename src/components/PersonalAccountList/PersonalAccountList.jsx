import React from 'react';
import { getOneAccount, logout } from '../../http/userApi';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useRef } from 'react';
import Moment from 'react-moment';
import moment from 'moment-business-days';

import './styles.scss';

function PersonalAccountList() {
  const [account, setAccount] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('information');
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const isMobileScreen = window.innerWidth < 991;

  const { user } = React.useContext(AppContext);
  const imageRef = useRef(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = localStorage.getItem('id');
    getOneAccount(userId)
      .then((data) => setAccount(data))
      .finally(() => setFetching(false));
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (fetching) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Spinner animation="border" />
      </div>
    );
  }

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

  const handleClickImage = ({ target }) => {
    if (!document.fullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen().catch((error) => console.log(error));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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
        {[account].map((userData) => (
          <>
            <div className="account__header">
              <div className="account__header-content">
                <div className="account__header-icon">
                  <img src="./logo.png" alt="logo__company" />
                </div>
                <div className="account__header-logout" onClick={handleLogout}>
                  Выйти
                </div>
              </div>
            </div>
            <div className="account__greeting">
              <div className="account__greeting-card">
                <div className="account__greeting-card__content">
                  <div className="account__greeting-card__image">
                    {userData.image === null ? (
                      <img src="../fon.jpg" alt="image__company" />
                    ) : (
                      <img src={process.env.REACT_APP_IMG_URL + userData.image} alt="main" />
                    )}
                  </div>
                  <div className="account__greeting-card__name">{userData.project.name}</div>
                </div>
              </div>
            </div>
            <div className="account__filter">
              <div className="account__filter-card">
                <div className="account__filter-card__content">
                  <div
                    className={`account__filter-card__item ${
                      activeTab === 'information' ? 'active' : ''
                    }`}
                    onClick={() => handleTabClick('information')}>
                    Информация
                  </div>
                  <div
                    className={`account__filter-card__item ${
                      activeTab === 'project' ? 'active' : ''
                    }`}
                    onClick={() => handleTabClick('project')}>
                    О проекте
                  </div>
                  <div
                    className={`account__filter-card__item ${activeTab === 'file' ? 'active' : ''}`}
                    onClick={() => handleTabClick('file')}>
                    Файлы
                  </div>
                  <div
                    className={`account__filter-card__item ${
                      activeTab === 'image' ? 'active' : ''
                    }`}
                    onClick={() => handleTabClick('image')}>
                    Фотографии
                  </div>
                </div>
              </div>
            </div>
            <div className="account__description">
              <div className="account__description-card">
                <div className="account__description-card__content">
                  {activeTab === 'information' && (
                    <div className="information">
                      <div className="manager">
                        <div className="manager__content">
                          <div className="manager__title">Менеджер:</div>
                          <div className="manager__name">{userData.employee.name}</div>
                        </div>
                        <div className="manager__content">
                          <div className="manager__title">Телефон:</div>
                          <a className="manager__phone" href={`tel:${userData.employee.phone}`}>
                            {formatPhoneNumber(userData.manager_phone)}
                          </a>
                        </div>
                      </div>
                      <div className="brigade">
                        <div className="brigade__content">
                          <div className="brigade__title">Монтажная бригада:</div>
                          <div className="brigade__foreman">
                            {userData.brigade && userData.brigade.name ? userData.brigade.name : ''}
                          </div>
                        </div>
                        <div className="brigade__content">
                          <div className="brigade__title">Телефон:</div>
                          <a className="brigade__phone" href={`tel:${userData.brigade?.phone}`}>
                            {formatPhoneNumber(userData.brigade?.phone)}
                          </a>
                        </div>
                        {isMobileScreen ? (
                          <div
                            className={`image-container ${isFullScreen ? 'full-screen' : ''}`}
                            onClick={toggleFullScreen}>
                            <img
                              src={process.env.REACT_APP_IMG_URL + userData.brigade?.image}
                              alt="foto__brigade"
                            />
                          </div>
                        ) : (
                          <div className="brigade-image">
                            <img
                              ref={imageRef}
                              onClick={handleClickImage}
                              src={process.env.REACT_APP_IMG_URL + userData.brigade?.image}
                              alt="foto__brigade"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activeTab === 'project' && (
                    <div className="project">
                      <div className="project__content">
                        <div className="project__items">
                          <div className="project__title">Дата договора:</div>
                          <div className="project__description">
                            <Moment format="DD.MM.YYYYY">{userData.project.agreement_date}</Moment>
                          </div>
                        </div>
                        <div className="project__items">
                          <div className="project__title">Дедлайн проектирования:</div>
                          <div className="project__description">
                            {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                              .businessAdd(userData.project.design_period, 'days')
                              .format('DD.MM.YYYY')}
                          </div>
                        </div>
                        <div className="project__items">
                          <div className="project__title">Дедлайн производства:</div>
                          <div className="project__description">
                            {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                              .businessAdd(userData.project.expiration_date, 'days')
                              .businessAdd(userData.project.design_period, 'days')
                              .format('DD.MM.YYYY')}
                          </div>
                        </div>
                        <div className="project__items">
                          <div className="project__title">Дата сдачи объекта:</div>
                          <div className="project__description">
                            {moment(userData.project.agreement_date, 'YYYY/MM/DD')
                              .businessAdd(userData.project.design_period, 'days')
                              .businessAdd(userData.project.expiration_date, 'days')
                              .businessAdd(userData.project.installation_period, 'days')
                              .format('DD.MM.YYYY')}
                          </div>
                        </div>
                        <div className="project__items">
                          <div className="project__title">Осталось дней:</div>
                          <div className="project__description">
                            {(() => {
                              const targetDate = moment(
                                userData.project.agreement_date,
                                'YYYY/MM/DD',
                              )
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'file' && (
                    <div className="file">
                      <div className="file__content">
                        {userData.userfiles?.map((file, index) => (
                          <div key={file.id}>
                            <div
                              className="file__item"
                              onClick={() =>
                                handleDownloadFile(process.env.REACT_APP_IMG_URL + file.file)
                              }>
                              {index + 1}. {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'image' && (
                    <div className="image">
                      <div className="image__content">
                        {account.userimages.map((userImage) => (
                          <div key={userImage.id}>
                            {isMobileScreen ? (
                              <>
                                <div
                                  className={`image-card ${isFullScreen ? 'full-card' : ''}`}
                                  onClick={toggleFullScreen}>
                                  <img
                                    ref={imageRef}
                                    onClick={handleClickImage}
                                    src={process.env.REACT_APP_IMG_URL + userImage.image}
                                    alt="photos of works"
                                  />
                                </div>
                                <div className="image__date">{userImage.date}</div>
                              </>
                            ) : (
                              <div className="image__card">
                                <img
                                  ref={imageRef}
                                  onClick={handleClickImage}
                                  src={process.env.REACT_APP_IMG_URL + userImage.image}
                                  alt="photos of works"
                                />
                                <div className="image__date">{userImage.date}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default PersonalAccountList;
