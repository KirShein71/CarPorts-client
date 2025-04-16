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
        <div className="distribution-list__content">
          {calculations.map((calculation) => (
            <div key={calculation.id} className="distribution-list__estimate">
              <div
                className="distribution-list__projectName"
                onClick={() => addToInfo(calculation.projectId)}>
                {calculation.projectName}
              </div>
              <Table borderless className="distribution-list__table mt-3">
                <thead>
                  <tr>
                    <th className="distribution-list__firstThead"></th>
                    <th className="distribution-list__thead">смета</th>
                    <th className="distribution-list__thead">выполнено</th>
                    <th className="distribution-list__thead">выплачено</th>
                    <th className="distribution-list__thead">остаток</th>
                  </tr>
                </thead>
                {calculation.brigades
                  .filter((brigade) => {
                    if (selectedBrigade) {
                      return brigade.brigadeId === selectedBrigade;
                    }
                    return true;
                  })
                  .map((brigade) => (
                    <React.Fragment key={brigade.id}>
                      <tbody>
                        <tr key={brigade.id}>
                          <td
                            className="distribution-list__brigadeName"
                            onClick={() => addToInstallationPage(brigade.brigadeId)}>
                            {brigade.brigadeName}
                          </td>
                          <td className="distribution-list__total">
                            {new Intl.NumberFormat('en-US').format(
                              brigade.estimates.reduce((acc, cur) => acc + Number(cur.price), 0),
                            )}
                          </td>
                          <td className="distribution-list__total">
                            {new Intl.NumberFormat('en-US').format(
                              brigade.estimates
                                .filter((esCol) => esCol.done === 'true')
                                .reduce((acc, cur) => acc + Number(cur.price), 0),
                            )}
                          </td>
                          <td className="distribution-list__total">
                            {new Intl.NumberFormat('en-US').format(
                              brigade.payments.reduce((acc, cur) => acc + Number(cur.sum), 0),
                            )}
                          </td>
                          <td className="distribution-list__total">
                            {(() => {
                              const totalPayments = brigade.payments.reduce(
                                (acc, cur) => acc + Number(cur.sum),
                                0,
                              );
                              const totalEstimates = brigade.estimates
                                .filter((esCol) => esCol.done === 'true')
                                .reduce((acc, cur) => acc + Number(cur.price), 0);
                              return new Intl.NumberFormat('en-US').format(
                                totalPayments - totalEstimates,
                              );
                            })()}
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        {brigade.payments
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((paymentDate) => (
                            <tr key={`payment-${paymentDate.id}`}>
                              <td>
                                <div className="distribution-list__datePayment">
                                  <Moment format="DD/MM/YYYY">{paymentDate.date}</Moment>
                                </div>
                              </td>
                              <td></td>
                              <td></td>
                              <td className="distribution-list__totalPayment">
                                {new Intl.NumberFormat('en-US').format(paymentDate.sum)}
                              </td>
                              <td></td>
                            </tr>
                          ))}
                      </tbody>
                    </React.Fragment>
                  ))}

                <tbody className="mt-3">
                  <tr key={`total-${calculation.id}`}>
                    <td className="project-name"></td>
                    <td className="distribution-list__totalBottom">
                      {new Intl.NumberFormat('en-US').format(calculation.totalPrice)}
                    </td>
                    <td className="distribution-list__totalBottom">
                      {new Intl.NumberFormat('en-US').format(calculation.totalSumDone)}
                    </td>
                    <td className="distribution-list__totalBottom">
                      {new Intl.NumberFormat('en-US').format(calculation.totalPaymentSum)}
                    </td>
                    <td className="distribution-list__totalBottom">
                      {isNaN(calculation.totalPaymentSum - calculation.totalSumDone)
                        ? '—'
                        : new Intl.NumberFormat('en-US').format(
                            calculation.totalPaymentSum - calculation.totalSumDone,
                          )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DistributionList;
