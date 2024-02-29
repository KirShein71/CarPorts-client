import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner, Tooltip } from 'react-bootstrap';
import { fetchAllProjectMaterials } from '../../http/projectMaterialsApi';
import CreateCheck from './modals/createCheck';
import moment from 'moment';
import Moment from 'react-moment';
import './OrderMaterialsList.styles.scss';
import CreateReadyDate from './modals/createReadyDate';
import CreateShippingDate from './modals/createShippingDate';
import CreatePaymentDate from './modals/createPaymentDate';

function OrderMaterialsList() {
  const [projectsMaterials, setProjectsMaterials] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [readyDateShow, setReadyDateShow] = React.useState(false);
  const [shippingDateShow, setShippingDateShow] = React.useState(false);
  const [paymentDateShow, setPaymentDateShow] = React.useState(false);
  const [projectMaterials, setProjectMaterials] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);

  const handleUpdateClick = (id) => {
    setProjectMaterials(id);
    setUpdateShow(true);
  };

  const hadleReadyDate = (id) => {
    setProjectMaterials(id);
    setReadyDateShow(true);
  };

  const hadleShippingDate = (id) => {
    setProjectMaterials(id);
    setShippingDateShow(true);
  };

  const handlePaymentDate = (id) => {
    setProjectMaterials(id);
    setPaymentDateShow(true);
  };

  React.useEffect(() => {
    fetchAllProjectMaterials()
      .then((data) => setProjectsMaterials(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="ordermaterialslist">
      <Header title={'Заказы материалов'} />
      <CreateCheck
        id={projectMaterials}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
      />
      <CreatePaymentDate
        id={projectMaterials}
        show={paymentDateShow}
        setShow={setPaymentDateShow}
        setChange={setChange}
      />
      <>
        {projectsMaterials.map((material) => (
          <div key={material.id}>
            <div className="ordermaterialslist__top">
              <div className="ordermaterialslist__number">{material.project.number}</div>
              <div className="ordermaterialslist__project">{material.project.name}</div>
            </div>
            <div className="table-scrollable">
              <Table striped bordered size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Тип материала</th>
                    <th>Дедлайн производства</th>
                    <th>Счёт</th>
                    <th>Дата оплаты</th>
                    <th>Сумма</th>
                    <th>Дата готовности</th>
                    <th>Даты отгрузки</th>
                  </tr>
                </thead>
                <tbody>
                  {material.props.map((prop) => {
                    return (
                      <tr key={prop.id}>
                        <td>{prop.materialName}</td>
                        <td>
                          {moment(material.project.agreement_date, 'YYYY/MM/DD')
                            .businessAdd(material.project.expiration_date, 'days')
                            .businessAdd(material.project.design_period, 'days')
                            .format('DD.MM.YYYY')}
                        </td>
                        <td onClick={() => handleUpdateClick(prop.id)}>
                          {prop.check ? (
                            <>{prop.check}</>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600 }}>
                              Внесите номер счёта
                            </span>
                          )}
                        </td>
                        <td onClick={() => handlePaymentDate(prop.id)}>
                          {prop.date_payment ? (
                            <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600 }}>
                              Ввидите дату оплаты
                            </span>
                          )}
                        </td>
                        <td></td>
                        <td onClick={() => hadleReadyDate(prop.id)}>
                          {prop.ready_date ? (
                            <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600 }}>
                              Введите дату готовности
                            </span>
                          )}
                        </td>
                        <td onClick={() => hadleShippingDate(prop.id)}>
                          {prop.shipping_date ? (
                            <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600 }}>
                              Введите дату отгрузки
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        ))}
      </>
    </div>
  );
}

export default OrderMaterialsList;
