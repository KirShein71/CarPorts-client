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

function OrderMaterialsList() {
  const [projectsMaterials, setProjectsMaterials] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [readyDateShow, setReadyDateShow] = React.useState(false);
  const [shippingDateShow, setShippingDateShow] = React.useState(false);
  const [projectMaterials, setProjectMaterials] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [clickPosition, setClickPosition] = React.useState({ y: 0 });

  const handleUpdateClick = (id, event) => {
    setProjectMaterials(id);
    if (event) {
      setClickPosition({ y: event.clientY });
    }
    setUpdateShow(true);
  };

  const hadleReadyDate = (id, event) => {
    setProjectMaterials(id);
    if (event) {
      setClickPosition({ y: event.clientY });
    }
    setReadyDateShow(true);
  };

  const hadleShippingDate = (id, event) => {
    setProjectMaterials(id);
    if (event) {
      setClickPosition({ y: event.clientY });
    }
    setShippingDateShow(true);
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
        clickPosition={clickPosition}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
        clickPosition={clickPosition}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
        clickPosition={clickPosition}
      />
      <>
        {projectsMaterials.map((material) => (
          <>
            <div key={material.id} className="ordermaterialslist__top">
              <div className="ordermaterialslist__number">{material.project.number}</div>
              <div className="ordermaterialslist__project">{material.project.name}</div>
            </div>
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
                      <td onClick={(event) => handleUpdateClick(prop.id, event)}>
                        {prop.check ? <>{prop.check}</> : 'Внесите счет'}
                      </td>
                      <td>
                        <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                      </td>
                      <td></td>
                      <td onClick={(event) => hadleReadyDate(prop.id, event)}>
                        {prop.ready_date ? (
                          <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                        ) : (
                          'Внести дату готовности'
                        )}
                      </td>
                      <td onClick={(event) => hadleShippingDate(prop.id, event)}>
                        {prop.shipping_date ? (
                          <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
                        ) : (
                          'Внести дату отгрузки'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ))}
      </>
    </div>
  );
}

export default OrderMaterialsList;
