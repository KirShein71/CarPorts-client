import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { getAllEstimatesForAllProjects } from '../../http/estimateApi';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';

import './style.scss';

function DistributionList() {
  const [calculations, setCalculations] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getAllEstimatesForAllProjects().then((data) => setCalculations(data));
  }, []);

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="distribution-list">
      <div className="container">
        <Header title={'Сметы'} />
        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th className="head-distribution">Проекты, бригады, даты</th>
              <th>Суммы</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calculation) => (
              <tr key={calculation.id}>
                <td>
                  <div className="project-name" onClick={() => addToInfo(calculation.projectId)}>
                    {calculation.projectName}
                  </div>
                  {calculation.brigades.map((brigadeName) => (
                    <>
                      <div key={brigadeName.id} className="brigade-name">
                        {brigadeName.brigadeName}
                      </div>

                      {brigadeName.payments.map((paymentDate) => (
                        <div key={paymentDate.id} className="brigade-date">
                          <Moment format="DD.MM.YYYY">{paymentDate.date}</Moment>
                        </div>
                      ))}
                    </>
                  ))}
                </td>
                <td>
                  <div className="project-sum">
                    Сумма смет: {new Intl.NumberFormat('ru-RU').format(calculation.totalPriceDone)}
                    /Сумма выплат:{' '}
                    {new Intl.NumberFormat('ru-RU').format(calculation.totalPaymentSum)}
                  </div>
                  {calculation.brigades.map((brigade) => (
                    <>
                      <div className="brigade-sum">
                        Сумма сметы:
                        {(() => {
                          const totalSum = brigade.estimates
                            .filter((esCol) => esCol.done === 'true')
                            .reduce((acc, cur) => acc + Number(cur.price), 0);
                          return new Intl.NumberFormat('ru-RU').format(totalSum);
                        })()}
                        /Сумма выплаты:{' '}
                        {(() => {
                          const totalSum = brigade.payments.reduce(
                            (acc, cur) => acc + Number(cur.sum),
                            0,
                          );
                          return new Intl.NumberFormat('ru-RU').format(totalSum);
                        })()}
                      </div>

                      {brigade.payments.map((brigadePayment) => (
                        <div key={brigadePayment.id} className="brigade-payment">
                          {new Intl.NumberFormat('ru-RU').format(brigadePayment.sum)}
                        </div>
                      ))}
                    </>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default DistributionList;
