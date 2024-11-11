import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllNumberOfDaysBrigadeForRegion } from '../../http/brigadesDateApi';
import { getLastDeadlineForRegion } from '../../http/projectApi';

function InstallationBilling() {
  const [billingNumber, setBillingNumber] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const brigadeData = await getAllNumberOfDaysBrigadeForRegion();
        setBillingNumber(brigadeData);
      } catch (error) {
        console.error('Ошибка при получении данных по бригадам:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="installation-billing">
      <div className="installation-billing__content">
        <div className="installation-billing__title">Расчетный срок монтажный работ</div>
        <Table size="sm" bordered>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Регион</th>
              <th style={{ textAlign: 'center' }}>Дней</th>
              <th style={{ textAlign: 'center' }}>Последний дедлайн</th>
            </tr>
          </thead>

          <tbody>
            {billingNumber.map((billing) => (
              <tr key={billing.id}>
                <td style={{ textAlign: 'center' }}>{billing.regionId === 1 ? 'ЛО' : 'МО'}</td>
                <td style={{ textAlign: 'center' }}>
                  {billing.billingDay ? billing.billingDay - billing.workingDay : ''}
                </td>
                <td style={{ textAlign: 'center' }}>{billing.deadline}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default InstallationBilling;
