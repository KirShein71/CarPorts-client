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
                <div className="account__manager-title">Ваш менеджер:</div>

                <div className="account__manager-content">
                  <div className="account__manager-name">{userData.manager}</div>
                  <a className="account__manager-phone" href={`tel:${userData.manager_phone}`}>
                    {userData.manager_phone}
                  </a>
                </div>
              </div>
              <div className="account__file">
                <h4 className="account__file-title">Файлы:</h4>
                <div className="account__file-items">
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
              <div className="table-scrollable">
                <Table bordered hover size="sm" className="mt-5">
                  <thead>
                    <tr>
                      <th>Дата договора</th>
                      <th>Дедлайн проектирования</th>
                      <th>Дедлайн производства</th>
                      <th>Дата сдачи объекта</th>
                      <th>Осталось дней</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
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
              <div className="account__brigade">
                <h3 className="account__brigade-title">Монтажная бригада</h3>
                <div className="account__brigade-content">
                  <div className="account__brigade-information">
                    <div className="account__brigade-foreman">
                      Бригадир: <span>{userData.brigade.name}</span>
                    </div>
                    <div className="account__brigade-phone">
                      Телефон:{' '}
                      <a href={`tel:${userData.brigade.phone}`}>{userData.brigade.phone}</a>
                    </div>
                  </div>
                  <div className="account__brigade-image">
                    <img
                      onClick={hadleClickImage}
                      src={process.env.REACT_APP_IMG_URL + userData.brigade.image}
                      alt="image"
                    />
                  </div>
                </div>
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
                          alt="image"
                        />
                        <div className="account__image-date">{userImage.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleLogout}>Выйти</Button>
        </>
      </div>
    </>
  );
}

export default PersonalAccountList;
