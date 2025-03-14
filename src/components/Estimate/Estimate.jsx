import React from 'react';
import { getAllService } from '../../http/serviceApi';
import {
  createEstimate,
  getAllEstimateForProject,
  createEstimateBrigade,
  deleteEstimateBrigadeForProject,
  deleteEstimate,
} from '../../http/estimateApi';
import { fetchBrigades } from '../../http/bragadeApi';
import './style.scss';
import { Button, Table } from 'react-bootstrap';
import UpdateEstimatePrice from './modals/UpdateEstimatePrice';
import UpdateEstimateBrigade from './modals/UpdateEstimateBrigade';
import CheckboxInstallation from '../InstallationPage/checkbox/CheckboxInstallation';
import CreatePayment from './modals/CreatePayment';
import UpdatePaymentDate from './modals/UpdatePaymentDate';
import UpdatePaymentSum from './modals/UpdatePaymentSum';
import { deletePayment } from '../../http/paymentApi';
import Moment from 'react-moment';

function Estimate(props) {
  const { projectId, regionId } = props;
  const [services, setServices] = React.useState([]);
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [brigadeName, setBrigadeName] = React.useState('');
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [estimateBrigades, setEstimateBrigades] = React.useState([]);
  const [prices, setPrices] = React.useState({});
  const [openModalUpdatePrice, setOpenModalUpdatePrice] = React.useState(false);
  const [estimateColId, setEstimateColId] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [openModalUpdateBrigade, setOpenModalUpdateBrigade] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [checked, setChecked] = React.useState({});
  const [openModalCreatePayment, setOpenModalCreatePayment] = React.useState(false);
  const [openModalUpdatePaymentDate, setOpenModalUpdatePaymentDate] = React.useState(false);
  const [openModalUpdatePaymentSum, setOpenModalUpdatePaymentSum] = React.useState(false);
  const [paymentColId, setPaymentColId] = React.useState(null);

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
  }, [change, projectId]);

  React.useEffect(() => {
    getAllEstimateForProject(projectId).then((data) => {
      setEstimateBrigades(data);

      const initialChecked = {};
      data.map((col) => {
        col.estimates.forEach((colEst) => {
          initialChecked[colEst.id] = colEst.done === 'true' ? true : false;
        });
      });
      setChecked(initialChecked);
    });
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
        data.append('projectId', projectId);
        data.append('serviceId', serviceId);
        data.append('brigadeId', selectedBrigade);
        data.append('price', price);

        try {
          const response = await createEstimate(data);
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

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id], // Меняем состояние чекбокса по его id
    }));
  };

  const handleSaveDoneEstimate = (event) => {
    event.preventDefault();

    // Создаем плоский массив обновлений
    const updates = estimateBrigades.flatMap((col) =>
      col.estimates.map((colEst) => ({
        id: colEst.id,
        done: checked[colEst.id] ? 'true' : 'false',
      })),
    );

    // Отправляем данные на бэк
    Promise.all(
      updates.map((update) =>
        createEstimateBrigade(update.id, update.done)
          .then((response) => {
            setChange((state) => !state);
          })
          .catch((error) => {
            alert(error.response.data.message);
          }),
      ),
    ).then(() => {
      // Обработка успешного завершения всех запросов, если нужно
      console.log('Все изменения сохранены');
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

  const handleOpenModalCreatePayment = (id, projectId) => {
    setBrigadeId(id);
    setProject(projectId);
    setOpenModalCreatePayment(true);
  };

  const handleOpenModalUpdatePaymentDate = (id) => {
    setPaymentColId(id);
    setOpenModalUpdatePaymentDate(true);
  };

  const handleOpenModalUpdatePaymentSum = (id) => {
    setPaymentColId(id);
    setOpenModalUpdatePaymentSum(true);
  };

  const handleDeletePaymentColumn = (id) => {
    console.log(id);
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить строку выплаты по данной бригаде?',
    );
    if (confirmed) {
      deletePayment(id)
        .then((data) => {
          setChange(!change);
          alert(`Строка выплаты будет удалена`);
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
      <CreatePayment
        show={openModalCreatePayment}
        setShow={setOpenModalCreatePayment}
        project={projectId}
        brigade={brigadeId}
        setChange={setChange}
      />
      <UpdatePaymentDate
        show={openModalUpdatePaymentDate}
        setShow={setOpenModalUpdatePaymentDate}
        setChange={setChange}
        id={paymentColId}
      />
      <UpdatePaymentSum
        show={openModalUpdatePaymentSum}
        setShow={setOpenModalUpdatePaymentSum}
        setChange={setChange}
        id={paymentColId}
      />
      <div className="estimate__content">
        <div className="estimate-brigade">
          <div className="estimate-brigade__title">Сметы по проекту</div>
          <div className="estimate-brigade__content">
            {estimateBrigades?.map((estimateBrigade) => (
              <>
                <>
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
                            <th style={{ textAlign: 'center' }}>Выплаты</th>
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
                                return new Intl.NumberFormat('ru-RU').format(totalSum);
                              })()}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {(() => {
                                const totalSum = estimateBrigade.estimates
                                  .filter((esCol) => esCol.done === 'true')
                                  .reduce((acc, cur) => acc + Number(cur.price), 0);
                                return new Intl.NumberFormat('ru-RU').format(totalSum);
                              })()}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {(() => {
                                const totalSum = estimateBrigade.payments.reduce(
                                  (acc, cur) => acc + Number(cur.sum),
                                  0,
                                );
                                return new Intl.NumberFormat('ru-RU').format(totalSum);
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
                                {new Intl.NumberFormat('ru-RU').format(estimateCol.price)}
                              </td>
                              <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <CheckboxInstallation
                                  change={checked[estimateCol.id]} // Передаем состояние чекбокса
                                  handle={() => handleCheckboxChange(estimateCol.id)}
                                />
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
                    <div style={{ display: 'flex' }}>
                      <form className="estimate-done__form" onSubmit={handleSaveDoneEstimate}>
                        <Button
                          variant="dark"
                          size="sm"
                          type="submit"
                          className="me-3 mb-3 estimate__button">
                          Сохранить
                        </Button>
                      </form>
                      <Button
                        size="sm"
                        className="mb-3 me-2 estimate__button"
                        variant="dark"
                        onClick={() =>
                          handleOpenModalUpdateBrigade(estimateBrigade.brigadeId, projectId)
                        }>
                        Переназначить бригаду
                      </Button>
                      <Button
                        className="mb-3 estimate__button"
                        size="sm"
                        variant="dark"
                        onClick={() =>
                          handleDeleteEstimateBrigadeForProject(
                            estimateBrigade.brigadeId,
                            projectId,
                          )
                        }>
                        Удалить
                      </Button>
                    </div>
                  </>
                </>
                <div className="estimate-payment">
                  <div className="estimate-payment__title">Выплаты</div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>Дата</th>
                        <th style={{ textAlign: 'center' }}>Сумма выплаты</th>
                        <th style={{ textAlign: 'center' }}>Удалить строку</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateBrigade.payments?.map((payment) => (
                        <tr key={payment.id}>
                          <td
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleOpenModalUpdatePaymentDate(payment.id)}>
                            <Moment format="DD.MM.YYYY">{payment.date}</Moment>
                          </td>
                          <td
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleOpenModalUpdatePaymentSum(payment.id)}>
                            {new Intl.NumberFormat('ru-RU').format(payment.sum)}
                          </td>
                          <td
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => handleDeletePaymentColumn(payment.id)}>
                            <img src="../img/delete.png" alt="delete" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button
                    className="mt-1 mb-2 payment__button"
                    size="sm"
                    variant="dark"
                    onClick={() =>
                      handleOpenModalCreatePayment(estimateBrigade.brigadeId, projectId)
                    }>
                    Добавить выплату
                  </Button>
                </div>
              </>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
}

export default Estimate;
