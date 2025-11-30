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
          <button
            className="distribution-list__dropdown-brigade"
            onClick={hadleOpenModalSelectedBrigade}>
            {selectedBrigadeName ? (
              selectedBrigadeName
            ) : (
              <div>
                Бригада <img src="./img/arrow-down.png" alt="arrow down" />
              </div>
            )}
          </button>
          {openModalSelectedBrigade && (
            <div className="distribution-list__dropdown-modal">
              <div className="distribution-list__dropdown-content">
                <div className="distribution-list__dropdown-items">
                  <div
                    className="distribution-list__dropdown-item planning__dropdown-item--reset"
                    onClick={() => {
                      setSelectedBrigadeName(null);
                      setSelectedBrigade(null);
                      setOpenModalSelectedBrigade(false);
                    }}>
                    <div>Сбросить</div>
                  </div>
                  {brigades.map((brigadesName) => (
                    <div key={brigadesName.id}>
                      <div
                        className="distribution-list__dropdown-item"
                        onClick={() => {
                          setSelectedBrigadeName(brigadesName.name);
                          setSelectedBrigade(brigadesName.id);
                          setOpenModalSelectedBrigade(false);
                        }}>
                        {brigadesName.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="distribution-list__content">
          {calculations
            .filter((calculation) => {
              if (!selectedBrigade) return true;
              return calculation.brigades.some((brigade) => brigade.brigadeId === selectedBrigade);
            })
            .map((calculation) => (
              <div key={calculation.id} className="distribution-list__estimate">
                <Table borderless className="distribution-list__table">
                  <thead>
                    <tr className="distribution-list__project-header">
                      <th></th>
                      <th className="distribution-list__thead">смета</th>
                      <th className="distribution-list__thead">выплачено</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr style={{ backgroundColor: '#afacac' }}>
                      <td
                        className="distribution-list__projectName"
                        onClick={() => addToInfo(calculation.projectId)}>
                        {calculation.projectName}
                      </td>
                      <td className="distribution-list__total-project">
                        {new Intl.NumberFormat('en-US').format(calculation.totalPrice)}
                      </td>
                      <td className="distribution-list__total-project">
                        {new Intl.NumberFormat('en-US').format(calculation.totalPaymentSum)}
                      </td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>

                  <tbody>
                    {calculation.brigades
                      .filter((brigade) => {
                        if (selectedBrigade) {
                          return brigade.brigadeId === selectedBrigade;
                        }
                        return true;
                      })
                      .map((brigade) => {
                        const brigadeEstimate = brigade.estimates.reduce(
                          (acc, cur) => acc + Number(cur.price),
                          0,
                        );
                        const brigadePayment = brigade.payments.reduce(
                          (acc, cur) => acc + Number(cur.sum),
                          0,
                        );

                        return (
                          <React.Fragment key={brigade.id}>
                            {/* Строка бригады */}
                            <tr
                              className="distribution-list__brigade-row"
                              style={{ backgroundColor: '#e9e3e3' }}>
                              <td
                                className="distribution-list__brigadeName"
                                onClick={() => addToInstallationPage(brigade.brigadeId)}>
                                {brigade.brigadeName}
                              </td>
                              <td className="distribution-list__total">
                                {new Intl.NumberFormat('en-US').format(brigadeEstimate)}
                              </td>
                              <td className="distribution-list__total">
                                {new Intl.NumberFormat('en-US').format(brigadePayment)}
                              </td>
                            </tr>

                            {/* Строки с датами выплат для этой бригады */}
                            {brigade.payments
                              .sort((a, b) => new Date(a.date) - new Date(b.date))
                              .map((paymentDate) => (
                                <tr
                                  key={`payment-${paymentDate.id}`}
                                  className="distribution-list__payment-row">
                                  <td className="distribution-list__datePayment">
                                    <Moment format="DD/MM/YYYY">{paymentDate.date}</Moment>
                                  </td>
                                  <td></td>
                                  <td className="distribution-list__totalPayment">
                                    {new Intl.NumberFormat('en-US').format(paymentDate.sum)}
                                  </td>
                                </tr>
                              ))}
                          </React.Fragment>
                        );
                      })}
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
