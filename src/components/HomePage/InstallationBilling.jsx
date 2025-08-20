import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllNumberOfDaysBrigadeForRegion } from '../../http/brigadesDateApi';
import CreateCountBrigade from './modals/CreateCountBrigade';
import UpdateCountBrigade from './modals/UpdateCountBrigade';

function InstallationBilling() {
  const [billingNumber, setBillingNumber] = React.useState([]);
  const [modalCreateCount, setModalCreateCount] = React.useState(false);
  const [modalUpdateCount, setModalUpdateCount] = React.useState(false);
  const [regionId, setRegionId] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [brigadeWorkId, setBrigadeWorkId] = React.useState(null);

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
  }, [change]);

  const handleCreateCountBrigade = (regionId) => {
    setModalCreateCount(true);
    setRegionId(regionId);
  };

  const handleUpdateCountBrigade = (id) => {
    setModalUpdateCount(true);
    setBrigadeWorkId(id);
  };

  const formatFutureDate = (daysToAdd) => {
    const today = new Date();
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysToAdd);

    const day = String(resultDate.getDate()).padStart(2, '0');
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const year = resultDate.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    const num = typeof number === 'string' ? parseFloat(number) : number;

    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="installation-billing">
      <CreateCountBrigade
        show={modalCreateCount}
        setShow={setModalCreateCount}
        setChange={setChange}
        regionId={regionId}
      />
      <UpdateCountBrigade
        show={modalUpdateCount}
        setShow={setModalUpdateCount}
        setChange={setChange}
        id={brigadeWorkId}
      />
      <div className="installation-billing__content">
        <div className="installation-billing__title">Расчетный срок монтажный работ</div>
        <Table borderless className="installation-billing__table">
          <thead>
            <tr>
              <th></th>
              <th style={{ textAlign: 'center' }}>МО</th>
              <th style={{ textAlign: 'center' }}>ЛО</th>
            </tr>
          </thead>
          {billingNumber.map((billing) => (
            <>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Планируемое кол-во дней монтажа</td>
                  <td style={{ textAlign: 'center' }}>{billing.billingMskDay}</td>
                  <td style={{ textAlign: 'center' }}>{billing.billingSpbDay}</td>
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Отработанных дней</td>
                  <td style={{ textAlign: 'center' }}>{billing.workingMskDay}</td>
                  <td style={{ textAlign: 'center' }}>{billing.workingSpbDay}</td>
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Осталось отработать</td>
                  <td style={{ textAlign: 'center' }}>{billing.remainderMsk}</td>
                  <td style={{ textAlign: 'center' }}>{billing.remainderSpb}</td>
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Количество бригад с учетом вых.</td>
                  {billing.countWorkMsk ? (
                    <td
                      style={{ textAlign: 'center', cursor: 'pointer' }}
                      onClick={() => handleUpdateCountBrigade(billing.regionMsk)}>
                      {formatNumber(billing.countWorkMsk)}
                    </td>
                  ) : (
                    <td onClick={() => handleCreateCountBrigade(billing.regionMsk)}></td>
                  )}
                  {billing.countWorkSpb ? (
                    <td
                      style={{ textAlign: 'center', cursor: 'pointer' }}
                      onClick={() => handleUpdateCountBrigade(billing.regionSpb)}>
                      {formatNumber(billing.countWorkSpb)}
                    </td>
                  ) : (
                    <td onClick={() => handleCreateCountBrigade(billing.regionSpb)}></td>
                  )}
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Остаток/Количество бригад</td>
                  <td style={{ textAlign: 'center' }}>{billing.workPerBrigadeMsk}</td>
                  <td style={{ textAlign: 'center' }}>{billing.workPerBrigadeSpb}</td>
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Прогноз завершения работ</td>
                  {billing.countWorkMsk && billing.remainderMsk ? (
                    <td style={{ textAlign: 'center' }}>
                      {formatFutureDate(Math.round(billing.remainderMsk / billing.countWorkMsk))}
                    </td>
                  ) : (
                    <td style={{ textAlign: 'center' }}>Нет данных</td>
                  )}
                  {billing.countWorkSpb && billing.remainderSpb ? (
                    <td style={{ textAlign: 'center' }}>
                      {formatFutureDate(Math.round(billing.remainderSpb / billing.countWorkSpb))}
                    </td>
                  ) : (
                    <td style={{ textAlign: 'center' }}>Нет данных</td>
                  )}
                </tr>
              </tbody>
              <tbody>
                <tr key={billing.id}>
                  <td style={{ textAlign: 'left' }}>Загрузка</td>
                  <td style={{ textAlign: 'center' }}>{billing.LoadProcentMsk}%</td>
                  <td style={{ textAlign: 'center' }}>{billing.LoadProcentSpb}%</td>
                  <td></td>
                </tr>
              </tbody>
            </>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default InstallationBilling;
