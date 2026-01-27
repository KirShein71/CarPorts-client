import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { fetchBrigades } from '../../http/bragadeApi';
import { getAllActiveService } from '../../http/serviceApi';
import {
  createComplaintEstimate,
  getAllEstimateForComplaint,
  createComplaintEstimateBrigade,
} from '../../http/complaintEstimateApi';
import UpdateComplaintEstimatePrice from './modals/UpdateComplaintEstimatePrice';
import UpdateComplaintEstimateBriagde from './modals/UpdateComplaintEstimateBrigade';
import CreateComplaintPayment from './modals/CreateComplaintPayment';
import UpdateComplaintPaymentDate from './modals/UpdateComplaintPaymentDate';
import UpdateComplaintPaymentSum from './modals/UpdateComplaintPaymentSum';
import CheckboxInstallation from '../InstallationPage/checkbox/CheckboxInstallation';
import DeleteComplaintEstimateBrigade from './modals/DeleteComplaintEstimateBrigade';
import DeleteComplaintColEstimate from './modals/DeleteComplaintColEstimate';
import DelteComplaintPayment from './modals/DeleteComplaintPayment';
import Moment from 'react-moment';
import DeleteComplaintPayment from './modals/DeleteComplaintPayment';

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
  const [modalUpdateComplaintEstimatePrice, setModalUpdateComplaintEstimatePrice] =
    React.useState(false);
  const [complaintEstimateColId, setComplaintEstimateColId] = React.useState(null);
  const [modalUpdateComplaintEstimateBrigade, setModalUpdateComplaintEstimateBrigade] =
    React.useState(false);
  const [complaint, setComplaint] = React.useState(null);
  const [modalCreateComplaintPayment, setModalCreateComplaintPayment] = React.useState(false);
  const [modalUpdateComplaintPaymentDate, setModalUpdateComplaintPaymentDate] =
    React.useState(false);
  const [complaintPaymentColId, setComplaintPaymentColId] = React.useState(null);
  const [modalUpdateComplaintPaymentSum, setModalUpdateComplaintPaymentSum] = React.useState(false);
  const [checked, setChecked] = React.useState({});
  const [modalDeleteCompaintEstimateBrigade, setModalDeleteComplaintEstimateBrigade] =
    React.useState(false);
  const [colEstimate, setColEstimate] = React.useState(null);
  const [modalDeleteColEstimate, setModalDeleteColEstimate] = React.useState(false);
  const [paymentId, setPaymentId] = React.useState(null);
  const [modalDeletePayment, setModalDeletePayment] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [sortOrderServiceName, setSortOrderServiceName] = React.useState('asc');
  const [sortField, setSortField] = React.useState('service.number');
  const [sortServiceName, setSortServiceName] = React.useState('number');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, brigadesData] = await Promise.all([
          getAllActiveService(),
          fetchBrigades(),
        ]);

        setServices(servicesData);
        setBrigades(brigadesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [change]);

  React.useEffect(() => {
    getAllEstimateForComplaint(complaintId).then((data) => {
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
        createComplaintEstimateBrigade(update.id, update.done)
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

  const handleOpenModalUpdateComplaintEstimatePrice = (id) => {
    setComplaintEstimateColId(id);
    setModalUpdateComplaintEstimatePrice(true);
  };

  const handleOpenModalUpdateComplaintEstimateBrigade = (id, complaintId) => {
    setBrigadeId(id);
    setComplaint(complaintId);
    setModalUpdateComplaintEstimateBrigade(true);
  };

  const handleOpenModalDeleteComplaintEstimateBrigade = (id, complaintId) => {
    setBrigadeId(id);
    setComplaint(complaintId);
    setModalDeleteComplaintEstimateBrigade(true);
  };

  const handleOpenModalDeleteColEstimate = (id) => {
    setColEstimate(id);
    setModalDeleteColEstimate(true);
  };

  const handleOpenModalDeletePayment = (id) => {
    setPaymentId(id);
    setModalDeletePayment(true);
  };

  const handleOpenModalCreateComplaintPayment = (id, complaintId) => {
    setBrigadeId(id);
    setComplaint(complaintId);
    setModalCreateComplaintPayment(true);
  };

  const handleOpenModalUpdateComplaintPaymentDate = (id) => {
    setComplaintPaymentColId(id);
    setModalUpdateComplaintPaymentDate(true);
  };

  const handleOpenModalUpdateComplaintPaymentSum = (id) => {
    setComplaintPaymentColId(id);
    setModalUpdateComplaintPaymentSum(true);
  };

  const handleSortService = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const numericSort = (a, b) => {
    const getValue = (obj) => {
      const path = sortField.split('.');
      let value = obj;
      for (const key of path) {
        value = value?.[key];
        if (value === undefined) return null;
      }
      return value;
    };

    const compareDecimalNumbers = (a, b) => {
      // Разбиваем числа на целую и десятичную части
      const partsA = String(a || 0).split('.');
      const partsB = String(b || 0).split('.');

      // Сравниваем целые части
      const intA = parseInt(partsA[0], 10);
      const intB = parseInt(partsB[0], 10);
      if (intA !== intB) return intA - intB;

      // Если целые части равны, сравниваем десятичные
      const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
      const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

      return decimalA - decimalB;
    };

    const valA = getValue(a);
    const valB = getValue(b);

    // Если одно из значений null/undefined, помещаем в конец
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return sortOrder === 'asc'
      ? compareDecimalNumbers(valA, valB)
      : compareDecimalNumbers(valB, valA);
  };

  const handleSortServiceName = (field) => {
    if (field === sortServiceName) {
      setSortOrderServiceName(sortOrderServiceName === 'asc' ? 'desc' : 'asc');
    } else {
      setSortServiceName(field);
      setSortOrderServiceName('asc');
    }
  };

  const numericSortServiceName = (a, b) => {
    const getValue = (obj) => {
      const path = sortServiceName.split('.');
      let value = obj;
      for (const key of path) {
        value = value?.[key];
        if (value === undefined) return null;
      }
      return value;
    };

    const compareDecimalNumbers = (a, b) => {
      // Разбиваем числа на целую и десятичную части
      const partsA = String(a || 0).split('.');
      const partsB = String(b || 0).split('.');

      // Сравниваем целые части
      const intA = parseInt(partsA[0], 10);
      const intB = parseInt(partsB[0], 10);
      if (intA !== intB) return intA - intB;

      // Если целые части равны, сравниваем десятичные
      const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
      const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

      return decimalA - decimalB;
    };

    const valA = getValue(a);
    const valB = getValue(b);

    // Если одно из значений null/undefined, помещаем в конец
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return sortOrderServiceName === 'asc'
      ? compareDecimalNumbers(valA, valB)
      : compareDecimalNumbers(valB, valA);
  };

  return (
    <div className="complaint-estimate">
      <UpdateComplaintEstimatePrice
        show={modalUpdateComplaintEstimatePrice}
        setShow={setModalUpdateComplaintEstimatePrice}
        setChange={setChange}
        id={complaintEstimateColId}
      />
      <UpdateComplaintEstimateBriagde
        show={modalUpdateComplaintEstimateBrigade}
        setShow={setModalUpdateComplaintEstimateBrigade}
        setChange={setChange}
        id={brigadeId}
        regionId={regionId}
        complaint={complaintId}
      />
      <CreateComplaintPayment
        show={modalCreateComplaintPayment}
        setShow={setModalCreateComplaintPayment}
        complaint={complaintId}
        brigade={brigadeId}
        setChange={setChange}
      />
      <UpdateComplaintPaymentDate
        show={modalUpdateComplaintPaymentDate}
        setShow={setModalUpdateComplaintPaymentDate}
        setChange={setChange}
        id={complaintPaymentColId}
      />
      <UpdateComplaintPaymentSum
        show={modalUpdateComplaintPaymentSum}
        setShow={setModalUpdateComplaintPaymentSum}
        setChange={setChange}
        id={complaintPaymentColId}
      />
      <DeleteComplaintEstimateBrigade
        show={modalDeleteCompaintEstimateBrigade}
        setShow={setModalDeleteComplaintEstimateBrigade}
        setChange={setChange}
        complaint={complaint}
        brigadeId={brigadeId}
      />
      <DeleteComplaintColEstimate
        show={modalDeleteColEstimate}
        setShow={setModalDeleteColEstimate}
        setChange={setChange}
        colEstimate={colEstimate}
      />
      <DeleteComplaintPayment
        show={modalDeletePayment}
        setShow={setModalDeletePayment}
        setChange={setChange}
        paymentId={paymentId}
      />
      <div className="complaint-estimate__content">
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
                          <th onClick={() => handleSortService('service.number')}>
                            <div style={{ cursor: 'pointer', display: 'flex' }}>
                              {' '}
                              Наименование
                              <img
                                style={{
                                  marginLeft: '10px',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                }}
                                src="../img/sort.png"
                                alt="icon_sort"
                              />
                            </div>
                          </th>
                          <th>Стоимость</th>
                          <th>Выполнено</th>
                          <th>Удалить строку</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimateBrigade.estimates.sort(numericSort).map((estimateCol) => (
                          <tr key={estimateCol.id}>
                            <td>
                              {estimateCol.service?.number != null
                                ? `${estimateCol.service.number}. ${
                                    estimateCol.service?.name ?? ''
                                  }`
                                : (estimateCol.service?.name ?? '')}
                            </td>
                            <td
                              onClick={() =>
                                handleOpenModalUpdateComplaintEstimatePrice(estimateCol.id)
                              }
                              style={{ cursor: 'pointer', textAlign: 'center' }}>
                              {new Intl.NumberFormat('ru-RU').format(estimateCol.price)}
                            </td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                              <CheckboxInstallation
                                change={checked[estimateCol.id]}
                                handle={() => handleCheckboxChange(estimateCol.id)}
                              />
                            </td>
                            <td
                              style={{ cursor: 'pointer', textAlign: 'center' }}
                              onClick={() => handleOpenModalDeleteColEstimate(estimateCol.id)}>
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
                        handleOpenModalUpdateComplaintEstimateBrigade(
                          estimateBrigade.brigadeId,
                          complaintId,
                        )
                      }>
                      Переназначить бригаду
                    </Button>
                    <Button
                      className="mb-3 estimate__button"
                      size="sm"
                      variant="dark"
                      onClick={() =>
                        handleOpenModalDeleteComplaintEstimateBrigade(
                          estimateBrigade.brigadeId,
                          complaintId,
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
                          onClick={() => handleOpenModalUpdateComplaintPaymentDate(payment.id)}>
                          <Moment format="DD.MM.YYYY">{payment.date}</Moment>
                        </td>
                        <td
                          style={{ textAlign: 'center', cursor: 'pointer' }}
                          onClick={() => handleOpenModalUpdateComplaintPaymentSum(payment.id)}>
                          {new Intl.NumberFormat('ru-RU').format(payment.sum)}
                        </td>
                        <td
                          style={{ textAlign: 'center', cursor: 'pointer' }}
                          onClick={() => handleOpenModalDeletePayment(payment.id)}>
                          <img src="../img/delete.png" alt="delete" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                  <Button
                    className="mt-1 mb-5 payment__button"
                    size="sm"
                    variant="dark"
                    onClick={() =>
                      handleOpenModalCreateComplaintPayment(estimateBrigade.brigadeId, complaintId)
                    }>
                    Добавить выплату
                  </Button>
                </div>
              </div>
            </>
          ))}
        </div>
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
                <th onClick={() => handleSortServiceName('number')}>
                  <div style={{ cursor: 'pointer', display: 'flex' }}>
                    {' '}
                    Наименование
                    <img
                      style={{
                        marginLeft: '10px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                      }}
                      src="../img/sort.png"
                      alt="icon_sort"
                    />
                  </div>
                </th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {services.sort(numericSortServiceName).map((service) => (
                <tr key={service.id}>
                  <td>
                    {service?.number != null
                      ? `${service.number}. ${service?.name ?? ''}`
                      : (service?.name ?? '')}
                  </td>
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
  );
}

export default ComplaintEstimate;
