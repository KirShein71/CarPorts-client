import React from 'react';
import { getAllService } from '../../http/serviceApi';
import { createEstimate } from '../../http/estimateApi';
import './style.scss';
import { Button } from 'react-bootstrap';

function Estimate(props) {
  const { projectId } = props;
  const [services, setServices] = React.useState([]);
  const [prices, setPrices] = React.useState({}); // Состояние для хранения цен

  React.useEffect(() => {
    getAllService().then((data) => setServices(data));
  }, []);

  const handlePriceChange = (serviceId, value) => {
    setPrices((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Отправляем запросы для каждой услуги с установленной ценой
    Object.keys(prices).forEach((serviceId) => {
      const price = prices[serviceId];
      if (price) {
        // Проверяем, что цена указана
        const data = new FormData();
        data.append('projectId', projectId);
        data.append('serviceId', serviceId);
        data.append('price', price);

        createEstimate(data)
          .then((response) => {})
          .catch((error) => alert(error.response.data.message));
      }
    });
  };

  return (
    <div className="estimate">
      <div className="estimate__content">
        <form className="estimate__form" onSubmit={handleSave}>
          {services.map((service) => (
            <div className="estimate__item" key={service.id}>
              <div className="estimate__service">{service.name}</div>
              <input
                className="estimate__input"
                placeholder="Стоимость"
                type="number"
                onChange={(e) => handlePriceChange(service.id, e.target.value)}
              />
            </div>
          ))}
          <Button variant="dark" type="submit">
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Estimate;
