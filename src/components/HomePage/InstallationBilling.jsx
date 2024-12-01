import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllNumberOfDaysBrigadeForRegion } from '../../http/brigadesDateApi';
import { getAllBrigadeWork } from '../../http/brigadeWorkApi';
import CreateCountBrigade from './modals/CreateCountBrigade';
import UpdateCountBrigade from './modals/UpdateCountBrigade';

function InstallationBilling() {
  const [billingNumber, setBillingNumber] = React.useState([]);
  const [brigadeWorks, setBrigadeWorks] = React.useState([]);
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
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const brigadeData = await getAllBrigadeWork();
        setBrigadeWorks(brigadeData);
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
        <Table size="sm" bordered>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Регион</th>
              <th style={{ textAlign: 'center' }}>Ло</th>
            </tr>
          </thead>
          {billingNumber
            .filter((billing) => billing.regionId === 1)
            .map((billing) => (
              <>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Расчетный срок монтажа</td>
                    <td style={{ textAlign: 'center' }}>{billing.billingDay}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Фактически завершенные дни</td>
                    <td style={{ textAlign: 'center' }}>{billing.workingDay}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Остаток</td>
                    <td style={{ textAlign: 'center' }}>{billing.remainder}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Количество бригад</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWorks) => brigadeWorks.regionId === billing.regionId)
                        .map((brigadeWork, index) => (
                          <td
                            key={index}
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleUpdateCountBrigade(brigadeWork.id)}>
                            {brigadeWork ? brigadeWork.count : 1}
                          </td>
                        ))
                    ) : (
                      <td onClick={() => handleCreateCountBrigade(billing.regionId)}></td>
                    )}
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Остаток/Количество бригад</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWork) => brigadeWork.regionId === billing.regionId)
                        .map((brigadeWork, index) => (
                          <td key={index} style={{ textAlign: 'center' }}>
                            {brigadeWork.count
                              ? Math.round(billing.remainder / brigadeWork.count)
                              : ''}
                          </td>
                        ))
                    ) : (
                      <td style={{ textAlign: 'center' }}></td>
                    )}
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Дата завершения работ</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWork) => brigadeWork.regionId === billing.regionId)
                        .map((brigadeWork, index) => {
                          const daysToAdd = Math.round(billing.remainder / brigadeWork.count);
                          const today = new Date();
                          const resultDate = new Date(today);
                          resultDate.setDate(today.getDate() + daysToAdd); // Изменяем дату на daysToAdd

                          // Форматирование даты в дд.мм.гггг
                          const day = String(resultDate.getDate()).padStart(2, '0');
                          const month = String(resultDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
                          const year = resultDate.getFullYear();

                          const formattedDate = `${day}.${month}.${year}`; // Форматируем дату

                          return (
                            <td key={index} style={{ textAlign: 'center' }}>
                              {formattedDate}
                            </td>
                          );
                        })
                    ) : (
                      <td style={{ textAlign: 'center' }}>Нет данных</td> // Добавил сообщение о том, что нет данных
                    )}
                  </tr>
                </tbody>
              </>
            ))}
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>Регион</th>
              <th style={{ textAlign: 'center' }}>МО</th>
            </tr>
          </thead>
          {billingNumber
            .filter((billing) => billing.regionId === 2)
            .map((billing) => (
              <>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Расчетный срок монтажа</td>
                    <td style={{ textAlign: 'center' }}>{billing.billingDay}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Фактически завершенные дни</td>
                    <td style={{ textAlign: 'center' }}>{billing.workingDay}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Остаток</td>
                    <td style={{ textAlign: 'center' }}>{billing.remainder}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Количество бригад</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWorks) => brigadeWorks.regionId === billing.regionId)
                        .map((brigadeWork, index) => (
                          <td
                            key={index}
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleUpdateCountBrigade(brigadeWork.id)}>
                            {brigadeWork ? brigadeWork.count : 1}
                          </td>
                        ))
                    ) : (
                      <td onClick={() => handleCreateCountBrigade(billing.regionId)}></td>
                    )}
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Остаток/Количество бригад</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWork) => brigadeWork.regionId === billing.regionId)
                        .map((brigadeWork, index) => (
                          <td key={index} style={{ textAlign: 'center' }}>
                            {brigadeWork.count
                              ? Math.round(billing.remainder / brigadeWork.count)
                              : ''}
                          </td>
                        ))
                    ) : (
                      <td style={{ textAlign: 'center' }}></td> // Пустая ячейка, если нет данных
                    )}
                  </tr>
                </tbody>
                <tbody>
                  <tr key={billing.id}>
                    <td style={{ textAlign: 'center' }}>Дата завершения работ</td>
                    {brigadeWorks && brigadeWorks.length > 0 ? (
                      brigadeWorks
                        .filter((brigadeWork) => brigadeWork.regionId === billing.regionId)
                        .map((brigadeWork, index) => {
                          const daysToAdd = Math.round(billing.remainder / brigadeWork.count);
                          const today = new Date();
                          const resultDate = new Date(today);
                          resultDate.setDate(today.getDate() + daysToAdd); // Изменяем дату на daysToAdd

                          // Форматирование даты в дд.мм.гггг
                          const day = String(resultDate.getDate()).padStart(2, '0');
                          const month = String(resultDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
                          const year = resultDate.getFullYear();

                          const formattedDate = `${day}.${month}.${year}`; // Форматируем дату

                          return (
                            <td key={index} style={{ textAlign: 'center' }}>
                              {formattedDate}
                            </td>
                          );
                        })
                    ) : (
                      <td style={{ textAlign: 'center' }}>Нет данных</td> // Добавил сообщение о том, что нет данных
                    )}
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
