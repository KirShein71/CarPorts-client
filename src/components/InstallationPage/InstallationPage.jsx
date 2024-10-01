import React from 'react';
import { getAllEstimateForBrigade, createEstimateBrigade } from '../../http/estimateApi';
import CheckboxInstallation from './checkbox/CheckboxInstallation';
import { Button } from 'react-bootstrap';

function InstallationPage() {
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [checked, setChecked] = React.useState({});

  React.useEffect(() => {
    getAllEstimateForBrigade().then((data) => {
      setServiceEstimate(data);
      const initialChecked = {};
      data.forEach((col) => {
        initialChecked[col.id] = col.done === 'true' ? true : false;
      });
      setChecked(initialChecked);
    });
  }, []);

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id], // Меняем состояние чекбокса по его id
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    const updates = serviceEstimate.map((col) => ({
      id: col.id,
      done: checked[col.id] ? 'true' : 'false',
    }));

    // Отправляем данные на бэк
    Promise.all(
      updates.map((update) =>
        createEstimateBrigade(update.id, update.done)
          .then((response) => {})
          .catch((error) => {
            alert(error.response.data.message);
          }),
      ),
    ).then(() => {
      // Обработка успешного завершения всех запросов, если нужно
      console.log('Все изменения сохранены');
    });
  };
  return (
    <div className="installation-page">
      <div className="installation-page__content">
        <form className="installation-page__form" onSubmit={handleSave}>
          {serviceEstimate.map((col) => (
            <div className="installation-page__item" style={{ display: 'flex' }} key={col.id}>
              <div className="installation-page__service" style={{ marginRight: '10px' }}>
                {col.service.name}
              </div>
              <div className="installation-page__price">{col.price}</div>
              <CheckboxInstallation
                change={checked[col.id]} // Передаем состояние чекбокса
                handle={() => handleCheckboxChange(col.id)} // Обработчик изменения состояния
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

export default InstallationPage;
