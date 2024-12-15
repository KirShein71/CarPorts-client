import React from 'react';
import {
  getAllOneBrigadesDate,
  getAllDate,
  getAllNumberOfDaysBrigadeForProject,
  getDaysInstallerForProjects,
} from '../../http/brigadesDateApi';
import { logout } from '../../http/bragadeApi';
import { Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import InstallationDays from './InstallationDays/InstallationDays';
import { getAllPaymentForBrigade } from '../../http/paymentApi';
import './style.scss';
import ImageProject from './ImagePorject';

function InstallationPage() {
  const { user } = React.useContext(AppContext);
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [paymentBrigade, setPaymentBrigade] = React.useState([]);
  const [daysBrigade, setDaysBrigade] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const navigate = useNavigate();
  const navigateInfoProject = useNavigate();
  const location = useLocation();
  const [daysProject, setDaysProject] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [projectDays, setProjectDays] = React.useState([]);

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');

    getAllOneBrigadesDate(brigadeId).then((data) => setDaysBrigade(data));
    getAllDate().then((data) => setDates(data));
    getAllNumberOfDaysBrigadeForProject(brigadeId).then((data) => setDaysProject(data));
    getAllPaymentForBrigade(brigadeId).then((data) => setPaymentBrigade(data));
  }, [change]);

  React.useEffect(() => {
    getDaysInstallerForProjects().then((data) => setProjectDays(data));
  }, []);

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  const addToInfo = (id) => {
    navigateInfoProject(`/projectinformation/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="installation-page">
      <div className="installation-page__content">
        <div className="installation-page__projects">
          <div className="installation-page__title">Активные проекты</div>
          <div className="table-scrollable">
            <Table bordered>
              <thead>
                <tr>
                  <th className="production_column" style={{ textAlign: 'center' }}>
                    Наименование
                  </th>
                  <th style={{ textAlign: 'center' }}>Фото</th>
                  <th></th>
                  <th style={{ textAlign: 'center' }}>Расчетный срок монтажа</th>
                  <th style={{ textAlign: 'center' }}>Факт монтажа</th>
                  <th style={{ textAlign: 'center' }}>Сумма сметы</th>
                  <th style={{ textAlign: 'center' }}>Выплачено</th>
                  <th style={{ textAlign: 'center' }}>Остаток</th>
                </tr>
              </thead>
              <tbody>
                {serviceEstimate.map((estimateProject) => (
                  <tr>
                    <td className="td_column" style={{ textAlign: 'center' }}>
                      {estimateProject.projectName}
                    </td>
                    <td>
                      <ImageProject projectId={estimateProject.projectId} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => addToInfo(estimateProject.projectId)}>
                        Подробнее
                      </Button>
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

                        return <div style={{ textAlign: 'center' }}>{totalEstimate}₽</div>;
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
                            return total + Number(sumEst.sum); // Замените 'amount' на нужное вам свойство
                          }, 0);

                        return <div style={{ textAlign: 'center' }}>{totalPayment}₽</div>; // Отображаем итоговую сумму
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
                            {totalEstimate - totalPayment} ₽
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
      <InstallationDays dates={dates} daysBrigade={daysBrigade} daysProject={daysProject} />
      <div className="installation-page__logout" onClick={handleLogout}>
        {' '}
        Выйти
      </div>
    </div>
  );
}

export default InstallationPage;
