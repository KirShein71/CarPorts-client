import React from 'react';
import { getOneAccount, logout } from '../../http/userApi';
import { Spinner, Table } from 'react-bootstrap';
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
                  <img src="./img/logo.png" alt="logo__company" />
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
                      <img src="../img/fon.jpg" alt="image__company" />
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
                          <div className="manager__name">
                            {userData.employee ? userData.employee.name : ''}
                          </div>
                        </div>
                        <div className="manager__content">
                          <div className="manager__title">Телефон:</div>
                          <a className="manager__phone" href={`tel:${userData.employee?.phone}`}>
                            {formatPhoneNumber(userData.employee?.phone)}
                          </a>
                        </div>
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
                                return targetDate.businessDiff(today, 'days'); // Используем businessDiff
                              }

                              const daysLeft = subtractDaysUntilZero(targetDate);

                              return daysLeft >= 0 ? daysLeft : `-${Math.abs(daysLeft)}`;
                            })()}
                          </div>
                        </div>
                        <div className="project__design">
                          <div className="project__design-title">Проектирование</div>
                          <Table bordered size="sm" className="mt-3">
                            <tbody>
                              <td
                                className="project__design-subtitle"
                                style={{
                                  color: (function () {
                                    const today = moment();
                                    return userData.project.design_start !== null &&
                                      moment(userData.project.design_start).isSameOrBefore(today)
                                      ? 'rgb(7,7,7)'
                                      : 'rgb(218, 206, 206)';
                                  })(),
                                }}>
                                Взяли в работу
                              </td>
                              <td>
                                <div
                                  className="project__design-circle"
                                  style={{
                                    backgroundColor: (function () {
                                      const today = moment();
                                      return userData.project.design_start !== null &&
                                        moment(userData.project.design_start).isSameOrBefore(today)
                                        ? 'rgb(7, 7, 7)'
                                        : 'rgb(218, 206, 206)';
                                    })(),
                                  }}></div>
                              </td>
                            </tbody>
                            <tbody>
                              <td
                                className="project__design-subtitle"
                                style={{
                                  color: (function () {
                                    const today = moment();
                                    return userData.project.project_delivery !== null &&
                                      moment(userData.project.project_delivery).isSameOrBefore(
                                        today,
                                      )
                                      ? 'rgb(7,7,7)'
                                      : 'rgb(218, 206, 206)'; // серый цвет
                                  })(),
                                }}>
                                Проект готов
                              </td>
                              <td>
                                <div
                                  className="project__design-circle"
                                  style={{
                                    backgroundColor: (function () {
                                      const today = moment();
                                      return userData.project.project_delivery !== null &&
                                        moment(userData.project.project_delivery).isSameOrBefore(
                                          today,
                                        )
                                        ? 'rgb(7, 7, 7)'
                                        : 'rgb(218, 206, 206)';
                                    })(),
                                  }}></div>
                              </td>
                            </tbody>
                            <tbody>
                              <td
                                className="project__design-subtitle"
                                style={{
                                  color: (function () {
                                    const today = moment();
                                    return userData.project.date_inspection !== null &&
                                      moment(userData.project.date_inspection).isSameOrBefore(today)
                                      ? 'rgb(7, 7, 7)'
                                      : 'rgb(218, 206, 206)';
                                  })(),
                                }}>
                                Проект проверен
                              </td>
                              <td style={{}}>
                                <div
                                  className="project__design-circle"
                                  style={{
                                    backgroundColor: (function () {
                                      const today = moment();
                                      return userData.project.date_inspection !== null &&
                                        moment(userData.project.date_inspection).isSameOrBefore(
                                          today,
                                        )
                                        ? 'rgb(7, 7, 7)'
                                        : 'rgb(218, 206, 206)';
                                    })(),
                                  }}></div>
                              </td>
                            </tbody>
                          </Table>
                        </div>
                        <div className="project__production">
                          <div className="project__production-title">Производство и снабжение</div>
                          <Table size="sm" className="mt-3">
                            <thead>
                              <tr>
                                <th></th>
                                <th className="project__production-head">Заказан</th>
                                <th className="project__production-head">Отгружен</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userData.project.project_materials.map((userMaterials) => (
                                <tr key={userMaterials.id}>
                                  <th className="project__production-body">
                                    {userMaterials.material_name}
                                  </th>
                                  <th>
                                    <div
                                      className="project__production-circle"
                                      style={{
                                        backgroundColor: (function () {
                                          const today = moment();
                                          return userMaterials.date_payment !== null &&
                                            moment(userMaterials.date_payment).isSameOrBefore(today)
                                            ? 'rgb(7, 7, 7)'
                                            : 'rgb(218, 206, 206)';
                                        })(),
                                      }}></div>
                                  </th>
                                  <th>
                                    <div
                                      className="project__production-circle"
                                      style={{
                                        backgroundColor: (function () {
                                          const today = moment();
                                          return userMaterials.shipping_date !== null &&
                                            moment(userMaterials.shipping_date).isSameOrBefore(
                                              today,
                                            )
                                            ? 'rgb(7, 7, 7)'
                                            : 'rgb(218, 206, 206)';
                                        })(),
                                      }}></div>
                                  </th>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
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
