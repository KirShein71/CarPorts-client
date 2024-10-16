import React from 'react';
import { getAllService } from '../../http/serviceApi';
import {
  createEstimate,
  getAllEstimateForProject,
  deleteEstimateBrigadeForProject,
  deleteEstimate,
} from '../../http/estimateApi';
import { fetchBrigades } from '../../http/bragadeApi';
import './style.scss';
import { Button, Table } from 'react-bootstrap';
import UpdateEstimatePrice from './modals/UpdateEstimatePrice';
import UpdateEstimateBrigade from './modals/UpdateEstimateBrigade';

function Estimate(props) {
  const { projectId, regionId } = props;
  const [services, setServices] = React.useState([]);
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [brigadeName, setBrigadeName] = React.useState('');
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [estimateBrigades, setEstimateBrigades] = React.useState([]);
  const [prices, setPrices] = React.useState({}); // Состояние для хранения цен
  const [openModalUpdatePrice, setOpenModalUpdatePrice] = React.useState(false);
  const [estimateColId, setEstimateColId] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [openModalUpdateBrigade, setOpenModalUpdateBrigade] = React.useState(false);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, brigadesData, estimatesData] = await Promise.all([
          getAllService(),
          fetchBrigades(),
          getAllEstimateForProject(projectId),
        ]);

        setServices(servicesData);
        setBrigades(brigadesData);
        setEstimateBrigades(estimatesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [change, projectId]);

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
    const promises = Object.keys(prices).map((serviceId) => {
      const price = prices[serviceId];
      if (price) {
        const data = new FormData();
        data.append('projectId', projectId);
        data.append('serviceId', serviceId);
        data.append('brigadeId', selectedBrigade);
        data.append('price', price);

        return createEstimate(data)
          .then((response) => {
            setChange((state) => !state);
          })
          .catch((error) => alert(error.response.data.message));
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

  const handleOpenModalUpdatePrice = (id) => {
    setEstimateColId(id);
    setOpenModalUpdatePrice(true);
  };

  const handleOpenModalUpdateBrigade = (id, projectId) => {
    setBrigadeId(id);
    setProject(projectId);
    setOpenModalUpdateBrigade(true);
  };

  const handleDeleteEstimateBrigadeForProject = (id, project) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить смету по данной бригаде?');
    if (confirmed) {
      deleteEstimateBrigadeForProject(id, project)
        .then((data) => {
          setChange(!change);
          alert(`Смета будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleDeleteEstimateColumn = (id) => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить строку сметы по данной бригаде?',
    );
    if (confirmed) {
      deleteEstimate(id)
        .then((data) => {
          setChange(!change);
          alert(`Строка сметы будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <div className="estimate">
      <UpdateEstimatePrice
        show={openModalUpdatePrice}
        setShow={setOpenModalUpdatePrice}
        setChange={setChange}
        id={estimateColId}
      />
      <UpdateEstimateBrigade
        show={openModalUpdateBrigade}
        setShow={setOpenModalUpdateBrigade}
        setChange={setChange}
        id={brigadeId}
        regionId={regionId}
        project={project}
      />
      <div className="estimate__content">
        <form className="estimate__form" onSubmit={handleSave}>
          <div className="estimate__brigade">
            <div className="estimate__brigade-title" onClick={hadleOpenModalSelectedBrigade}>
              Назначить бригаду: {brigadeName}
            </div>
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
                      className="estimate__input"
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
        <div className="estimate-brigade">
          <div className="estimate-brigade__title">Сметы по проекту</div>
          <div className="estimate-brigade__content">
            {estimateBrigades?.map((estimateBrigade) => (
              <>
                <>
                  {brigades
                    .filter((brigadeName) => brigadeName.id === estimateBrigade.brigadeId)
                    .map((brigadeName) => (
                      <div className="estimate-brigade__name">Бригада: {brigadeName.name}</div>
                    ))}
                  <Table bordered className="estimate__table-sum">
                    <thead>
                      <tr>
                        <th></th>
                        <th style={{ textAlign: 'center' }}>Общая сумма</th>
                        <th style={{ textAlign: 'center' }}>Сумма выполенных работ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>Итого</td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalSum = estimateBrigade.estimates.reduce(
                              (acc, cur) => acc + Number(cur.price),
                              0,
                            );
                            return totalSum;
                          })()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(() => {
                            const totalSum = estimateBrigade.estimates
                              .filter((esCol) => esCol.done === 'true')
                              .reduce((acc, cur) => acc + Number(cur.price), 0);
                            return totalSum;
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Наименование</th>
                        <th>Стоимость</th>
                        <th>Выполнено</th>
                        <th>Удалить строку</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateBrigade.estimates.map((estimateCol) => (
                        <tr key={estimateCol.id}>
                          <td>{estimateCol.service?.name}</td>
                          <td
                            onClick={() => handleOpenModalUpdatePrice(estimateCol.id)}
                            style={{ cursor: 'pointer', textAlign: 'center' }}>
                            {estimateCol.price}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {estimateCol.done === 'true' ? (
                              <img src="../img/done.png" alt="done" />
                            ) : (
                              ''
                            )}
                          </td>
                          <td
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                            onClick={() => handleDeleteEstimateColumn(estimateCol.id)}>
                            <img src="../img/delete.png" alt="delete" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
                <div>
                  <Button
                    className="me-3 mb-3"
                    size="sm"
                    variant="dark"
                    onClick={() =>
                      handleDeleteEstimateBrigadeForProject(estimateBrigade.brigadeId, projectId)
                    }>
                    Удалить
                  </Button>
                  <Button
                    size="sm"
                    className="mb-3"
                    variant="dark"
                    onClick={() =>
                      handleOpenModalUpdateBrigade(estimateBrigade.brigadeId, projectId)
                    }>
                    Переназначить бригаду
                  </Button>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estimate;
