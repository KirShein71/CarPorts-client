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
  const [clickPosition, setClickPosition] = React.useState({ top: 0, left: 0 });

  const handleUpdateClick = (id, e) => {
    setProjectMaterials(id);
    if (e) {
      setClickPosition({ top: e.clientY, left: e.clientX });
    }
    setUpdateShow(true);
  };

  const hadleReadyDate = (id, e) => {
    setProjectMaterials(id);
    if (e) {
      setClickPosition({ top: e.clientY, left: e.clientX });
    }
    setReadyDateShow(true);
  };

  const hadleShippingDate = (id, e) => {
    setProjectMaterials(id);
    if (e) {
      setClickPosition({ top: e.clientY, left: e.clientX });
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
        top={clickPosition.top}
        left={clickPosition.left}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
        top={clickPosition.top}
        left={clickPosition.left}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
        top={clickPosition.top}
        left={clickPosition.left}
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
                      <td onClick={(e) => handleUpdateClick(prop.id, e)}>
                        {prop.check ? <>{prop.check}</> : 'Внесите счет'}
                      </td>
                      <td>
                        <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                      </td>
                      <td></td>
                      <td onClick={(e) => hadleReadyDate(prop.id, e)}>
                        {prop.ready_date ? (
                          <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                        ) : (
                          'Внести дату готовности'
                        )}
                      </td>
                      <td onClick={(e) => hadleShippingDate(prop.id, e)}>
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
