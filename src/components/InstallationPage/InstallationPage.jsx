import React from 'react';
import {
  getAllEstimateForBrigadeAllProject,
  getAllEstimateForBrigade,
} from '../../http/estimateApi';
import {
  getAllOneBrigadesDate,
  getAllDate,
  getAllNumberOfDaysBrigadeForProject,
  getDaysInstallerForProjects,
} from '../../http/brigadesDateApi';
import { logout, fetchOneBrigade } from '../../http/bragadeApi';
import { Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import InstallationDays from './InstallationDays/InstallationDays';
import { getAllPaymentForBrigade } from '../../http/paymentApi';
import './style.scss';
import ImageProject from './ImagePorject';

function InstallationPage() {
  const { user } = React.useContext(AppContext);
  const [brigade, setBrigade] = React.useState([]);
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [serviceEstimateAllProject, setServiceEstimateAllProject] = React.useState([]);
  const [paymentBrigade, setPaymentBrigade] = React.useState([]);
  const [daysBrigade, setDaysBrigade] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const navigate = useNavigate();
  const navigateInfoProject = useNavigate();
  const [daysProject, setDaysProject] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [projectDays, setProjectDays] = React.useState([]);
  const [filteredServiceEstimates, setFilteredServiceEstimates] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const location = useLocation();
  const navigateToComplaint = useNavigate();

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');

    // Проверяем, есть ли brigadeId
    if (!brigadeId) {
      console.error('Brigade ID not found in localStorage');
      return;
    }

    // Создаем массив промисов
    const promises = [
      getAllEstimateForBrigade(brigadeId).then(setServiceEstimate),
      getAllEstimateForBrigadeAllProject(brigadeId).then(setServiceEstimateAllProject),
      getAllOneBrigadesDate(brigadeId).then(setDaysBrigade),
      getAllDate().then(setDates),
      getAllNumberOfDaysBrigadeForProject(brigadeId).then(setDaysProject),
      getAllPaymentForBrigade(brigadeId).then(setPaymentBrigade),
      fetchOneBrigade(brigadeId).then((data) => setBrigade(data)),
    ];

    // Используем Promise.all для ожидания завершения всех промисов
    Promise.all(promises).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
    };

    const filteredServiceEstimates = serviceEstimate.filter((serEst) => {
      const isActiveProject = filters.isActive && serEst.projectFinish === null;
      const isClosedProject = filters.isClosed && serEst.projectFinish !== null;

      // Если ни одна кнопка не активна, показываем все проекты
      return isClosedProject || isActiveProject;
    });

    setFilteredServiceEstimates(filteredServiceEstimates);
  }, [serviceEstimate, buttonActiveProject, buttonClosedProject]);

  React.useEffect(() => {
    getDaysInstallerForProjects().then((data) => setProjectDays(data));
  }, []);

  const handleButtonActiveProject = () => {
    const newButtonActiveProject = !buttonActiveProject;
    setButtonActiveProject(newButtonActiveProject);

    if (!newButtonActiveProject) {
      setButtonClosedProject(true);
    } else {
      setButtonClosedProject(false);
    }
  };

  const handleButtonClosedProject = () => {
    const newButtonClosedProject = !buttonClosedProject;
    setButtonClosedProject(newButtonClosedProject);

    if (!newButtonClosedProject) {
      setButtonActiveProject(true);
    } else {
      setButtonActiveProject(false);
    }
  };

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  const addToInfo = (id) => {
    navigateInfoProject(`/projectinformation/${id}`, { state: { from: location.pathname } });
  };

  const addToComplaint = () => {
    navigateToComplaint(`/installation-complaint`, {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="installation-page">
      {[brigade].map((nameBrigade) => (
        <div className="installation-page__name">{nameBrigade.name}</div>
      ))}
      <div className="installation-page__content">
        <div className="installation-page__projects">
          <div style={{ display: 'flex' }}>
            <button
              className={`installation-page__button-active ${
                buttonActiveProject === true ? 'active' : 'inactive'
              }`}
              onClick={handleButtonActiveProject}>
              Активные
            </button>
            <button
              className={`installation-page__button-noactive ${
                buttonClosedProject === true ? 'active' : 'inactive'
              }`}
              onClick={handleButtonClosedProject}>
              Закрытые
            </button>
            <button className="installation-page__button-complaint" onClick={addToComplaint}>
              Рекламация
            </button>
          </div>
          <div className="table-scrollable">
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th className="production_column" style={{ textAlign: 'center' }}>
                    Наименование
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Фото
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Расчетный срок монтажа
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Факт монтажа
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Сумма сметы
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Выплачено
                  </th>
                  <th style={{ textAlign: 'center' }} className="thead_column">
                    Остаток
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceEstimates.map((estimateProject) => (
                  <tr>
                    <td className="td_column" style={{ textAlign: 'center' }}>
                      {estimateProject.projectName}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="link"
                          style={{
                            color: 'black',
                            fontSize: '16px',
                            fontWeight: '600',
                            padding: '0px',
                          }}
                          onClick={() => addToInfo(estimateProject.projectId)}>
                          Подробнее
                        </Button>
                      </div>
                      <ImageProject projectId={estimateProject.projectId} />
                    </td>
                    <td style={{ textAlign: 'center' }}>{estimateProject.installationBilling}</td>
                    {projectDays.some(
                      (projectDay) => projectDay.projectId === estimateProject.projectId,
                    ) ? (
                      projectDays
                        .filter((projectDay) => projectDay.projectId === estimateProject.projectId)
                        .map((projectDay) => (
                          <>
                            <td style={{ textAlign: 'center' }}>{projectDay.factDay}</td>
                          </>
                        ))
                    ) : (
                      <>
                        <td></td>
                        <td></td>
                        <td></td>
                      </>
                    )}
                    <td>
                      {' '}
                      {(() => {
                        const totalEstimate = serviceEstimate.reduce((total, sumEst) => {
                          const projectTotal = sumEst.estimates
                            .filter(
                              (estimateForProject) =>
                                estimateForProject.done === 'true' &&
                                estimateForProject.projectId === estimateProject.projectId,
                            )
                            .reduce(
                              (accumulator, current) => accumulator + Number(current.price),
                              0,
                            );
                          return total + projectTotal;
                        }, 0);

                        return (
                          <div style={{ textAlign: 'center' }}>
                            {new Intl.NumberFormat('ru-RU').format(totalEstimate)}₽
                          </div>
                        );
                      })()}{' '}
                    </td>
                    <td>
                      {(() => {
                        const totalPayment = paymentBrigade
                          .filter(
                            (paymentForBrigade) =>
                              paymentForBrigade.projectId === estimateProject.projectId,
                          )
                          .reduce((total, sumEst) => {
                            return total + Number(sumEst.sum);
                          }, 0);

                        return (
                          <div style={{ textAlign: 'center' }}>
                            {new Intl.NumberFormat('ru-RU').format(totalPayment)}₽
                          </div>
                        ); // Отображаем итоговую сумму
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const totalEstimate = serviceEstimate.reduce((total, sumEst) => {
                          const projectTotal = sumEst.estimates
                            .filter(
                              (estimateForProject) =>
                                estimateForProject.done === 'true' &&
                                estimateForProject.projectId === estimateProject.projectId,
                            )
                            .reduce(
                              (accumulator, current) => accumulator + Number(current.price),
                              0,
                            );
                          return total + projectTotal;
                        }, 0);

                        const totalPayment = paymentBrigade
                          .filter(
                            (paymentForBrigade) =>
                              paymentForBrigade.projectId === estimateProject.projectId,
                          )
                          .reduce((total, sumEst) => {
                            return total + Number(sumEst.sum); // Замените 'sum' на нужное вам свойство
                          }, 0);
                        return (
                          <div style={{ textAlign: 'center' }}>
                            {new Intl.NumberFormat('ru-RU').format(totalEstimate - totalPayment)} ₽
                          </div>
                        );
                      })()}{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="installation-page__title">Календарь</div>
      <InstallationDays
        dates={dates}
        daysBrigade={daysBrigade}
        daysProject={daysProject}
        serviceEstimateAllProject={serviceEstimateAllProject}
        paymentBrigade={paymentBrigade}
      />
      <div className="installation-page__logout" onClick={handleLogout}>
        {' '}
        Выйти
      </div>
    </div>
  );
}

export default InstallationPage;
