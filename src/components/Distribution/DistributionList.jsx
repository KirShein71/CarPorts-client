import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { getAllEstimatesForAllProjects } from '../../http/estimateApi';
import { fetchBrigades } from '../../http/bragadeApi';
import Moment from 'react-moment';
import { useNavigate, useLocation } from 'react-router-dom';

import './style.scss';

function DistributionList() {
  const [calculations, setCalculations] = React.useState([]);
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [selectedBrigadeName, setSelectedBrigadeName] = React.useState(null);
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const navigate = useNavigate();
  const navigateToInstallationPage = useNavigate();
  const location = useLocation();
  const modalRef = React.useRef();

  React.useEffect(() => {
    Promise.all([getAllEstimatesForAllProjects(), fetchBrigades()])
      .then(([estimatesData, brigadesData]) => {
        setCalculations(estimatesData);
        setBrigades(brigadesData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  const addToInstallationPage = (id) => {
    navigate(`/viewinginstallationpage/${id}`, { state: { from: location.pathname } });
  };

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  return (
    <div className="distribution-list">
      <div className="container">
        <Header title={'Сметы'} />
        <div className="dropdown" ref={modalRef}>
          <div className="dropdown__title" onClick={hadleOpenModalSelectedBrigade}>
            Бригада: <span>{selectedBrigadeName ? selectedBrigadeName : 'Все'}</span>
          </div>
          {openModalSelectedBrigade && (
            <div className="dropdown__modal">
              <div className="dropdown__modal-content">
                <ul className="dropdown__modal-items">
                  <li
                    className="dropdown__modal-item"
                    onClick={() => {
                      setSelectedBrigadeName('Все');
                      setSelectedBrigade(null);
                      setOpenModalSelectedBrigade(false);
                    }}>
                    Все
                  </li>
                  {brigades.map((brigadesName) => (
                    <li
                      key={brigadesName.id}
                      className="dropdown__modal-item"
                      onClick={() => {
                        setSelectedBrigadeName(brigadesName.name);
                        setSelectedBrigade(brigadesName.id);
                        setOpenModalSelectedBrigade(false);
                      }}>
                      {brigadesName.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <Table className="mt-4" style={{ width: '750px' }}>
          <thead>
            <tr>
              <th className="distribution__thead" style={{ width: '180px' }}>
                Проекты
              </th>
              <th className="distribution__thead" style={{ width: '120px' }}>
                Смета
              </th>
              <th className="distribution__thead" style={{ width: '120px' }}>
                Выполнено
              </th>
              <th className="distribution__thead" style={{ width: '120px' }}>
                Выплачено
              </th>
              <th className="distribution__thead" style={{ width: '120px' }}>
                Остаток
              </th>
            </tr>
          </thead>
          {calculations.map((calculation) => (
            <>
              <thead style={{ backgroundColor: 'rgb(187, 187, 187)' }}>
                <tr key={calculation.id}>
                  <th className="project-name" onClick={() => addToInfo(calculation.projectId)}>
                    {calculation.projectName}
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    {new Intl.NumberFormat('ru-RU').format(calculation.totalPrice)}
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    {new Intl.NumberFormat('ru-RU').format(calculation.totalSumDone)}
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    {new Intl.NumberFormat('ru-RU').format(calculation.totalPaymentSum)}
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    {isNaN(calculation.totalPaymentSum - calculation.totalSumDone)
                      ? '—'
                      : new Intl.NumberFormat('ru-RU').format(
                          calculation.totalPaymentSum - calculation.totalSumDone,
                        )}
                  </th>
                </tr>
              </thead>
              {calculation.brigades
                .filter((brigade) => {
                  // Если выбрана конкретная бригада, фильтруем по её ID
                  if (selectedBrigade) {
                    return brigade.brigadeId === selectedBrigade;
                  }
                  // Если выбрано "Все", показываем все бригады
                  return true;
                })
                .map((brigade) => (
                  <>
                    <tbody>
                      <tr key={brigade.id} style={{ borderBottom: '2px solid #000' }}>
                        <td onClick={() => addToInstallationPage(brigade.brigadeId)}>
                          {brigade.brigadeName}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalSum = brigade.estimates.reduce(
                              (acc, cur) => acc + Number(cur.price),
                              0,
                            );
                            return new Intl.NumberFormat('ru-RU').format(totalSum);
                          })()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalSum = brigade.estimates
                              .filter((esCol) => esCol.done === 'true')
                              .reduce((acc, cur) => acc + Number(cur.price), 0);
                            return new Intl.NumberFormat('ru-RU').format(totalSum);
                          })()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalSum = brigade.payments.reduce(
                              (acc, cur) => acc + Number(cur.sum),
                              0,
                            );
                            return new Intl.NumberFormat('ru-RU').format(totalSum);
                          })()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalPayments = brigade.payments.reduce(
                              (acc, cur) => acc + Number(cur.sum),
                              0,
                            );

                            const totalEstimates = brigade.estimates
                              .filter((esCol) => esCol.done === 'true')
                              .reduce((acc, cur) => acc + Number(cur.price), 0);

                            // Выполняем вычитание до форматирования
                            const difference = totalPayments - totalEstimates;

                            // Форматируем только результат разности
                            const formattedDifference = new Intl.NumberFormat('ru-RU').format(
                              difference,
                            );
                            return formattedDifference; // Возвращаем только отформатированную строку
                          })()}
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      {brigade.payments
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((paymentDate) => (
                          <tr key={paymentDate.id}>
                            <td style={{ textAlign: 'right' }}>
                              {' '}
                              <Moment format="DD.MM.YYYY">{paymentDate.date}</Moment>
                            </td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: 'center' }}>
                              {new Intl.NumberFormat('ru-RU').format(paymentDate.sum)}
                            </td>
                            <td></td>
                          </tr>
                        ))}
                    </tbody>
                  </>
                ))}
            </>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default DistributionList;
