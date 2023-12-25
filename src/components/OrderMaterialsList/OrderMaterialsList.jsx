import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner, Tooltip } from 'react-bootstrap';
import { fetchAllProjectMaterials } from '../../http/projectMaterialsApi';
import Clue from './modals/Clue';
import CreateCheck from './modals/createCheck';
import moment from 'moment';
import Moment from 'react-moment';
import './OrderMaterialsList.styles.scss';

function OrderMaterialsList() {
  const [projectsMaterials, setProjectsMaterials] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [projectMaterials, setProjectMaterials] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [openClue, setOpenClue] = React.useState({});

  const handleUpdateClick = (id) => {
    setProjectMaterials(id);
    setUpdateShow(true);
  };

  const handleMouseEnter = (id) => {
    setOpenClue({ ...openClue, [id]: true });
  };

  const handleMouseLeave = (id) => {
    setOpenClue({ ...openClue, [id]: false });
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
                          .format('DD.MM.YYYY')}
                      </td>
                      <td
                        onMouseEnter={() => handleMouseEnter(prop.id)}
                        onMouseLeave={() => handleMouseLeave(prop.id)}
                        onClick={() => handleUpdateClick(prop.id)}>
                        {prop.check}
                        {openClue[prop.id] && <Clue />}
                      </td>
                      <td>
                        <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                      </td>
                      <td></td>
                      <td>
                        <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                      </td>
                      <td>
                        <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
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
