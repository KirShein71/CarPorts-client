import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { fetchBrigades } from '../../http/bragadeApi';
import { getAllService } from '../../http/serviceApi';
import { createComplaintEstimate } from '../../http/complaintEstimateApi';

function ComplaintEstimate(props) {
  const { complaintId, regionId } = props;
  const [services, setServices] = React.useState([]);
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [brigadeName, setBrigadeName] = React.useState('');
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [estimateBrigades, setEstimateBrigades] = React.useState([]);
  const [prices, setPrices] = React.useState({});
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, brigadesData] = await Promise.all([getAllService(), fetchBrigades()]);

        setServices(servicesData);
        setBrigades(brigadesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [change]);

  const handlePriceChange = (serviceId, value) => {
    setPrices((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Проверяем, выбрана ли бригада
    if (selectedBrigade === null) {
      alert('Вы забыли выбрать бригаду');
      return; // Выходим из функции, если бригада не выбрана
    }

    // Отправляем запросы для каждой услуги с установленной ценой
    const promises = Object.keys(prices).map(async (serviceId) => {
      const price = prices[serviceId];
      if (price) {
        const data = new FormData();
        data.append('complaintId', complaintId);
        data.append('serviceId', serviceId);
        data.append('brigadeId', selectedBrigade);
        data.append('price', price);

        try {
          const response = await createComplaintEstimate(data);
          setChange((state) => !state);
        } catch (error) {
          return alert(error.response.data.message);
        }
      }
      return Promise.resolve(); // Возвращаем resolved Promise, если цена не указана
    });

    // Ждем, пока все запросы завершатся
    Promise.all(promises).then(() => {
      // Сбрасываем значения input после успешного сохранения
      setPrices({});
    });
  };

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  return (
    <div className="complaint-estimate">
      <div className="complaint-estimate__content">
        <form className="complaint-estimate__form" onSubmit={handleSave}>
          <div className="complaint-estimate__brigade">
            <Button size="sm" variant="dark" onClick={hadleOpenModalSelectedBrigade}>
              Назначить бригаду: {brigadeName}
            </Button>
            {openModalSelectedBrigade && (
              <div className="dropdown__modal">
                <div className="dropdown__modal-content">
                  <ul className="dropdown__modal-items">
                    <div
                      className="dropdown__modal-item"
                      onClick={() => {
                        setBrigadeName('');
                        setSelectedBrigade(null);
                        setOpenModalSelectedBrigade(false);
                      }}></div>
                    {brigades
                      .filter((brigadesName) => brigadesName.regionId === regionId)
                      .map((brigadesName) => (
                        <div key={brigadesName.id}>
                          <li
                            className="dropdown__modal-item"
                            onClick={() => {
                              setBrigadeName(brigadesName.name);
                              setSelectedBrigade(brigadesName.id);
                              setOpenModalSelectedBrigade(false);
                            }}>
                            {brigadesName.name}
                          </li>
                        </div>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <Table bordered className="mt-3">
            <thead>
              <tr>
                <th>Наименование</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>
                    <input
                      className="complaint-estimate__input"
                      placeholder="Стоимость"
                      value={prices[service.id] || ''}
                      onChange={(e) => handlePriceChange(service.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button size="sm" variant="dark" type="submit">
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ComplaintEstimate;
