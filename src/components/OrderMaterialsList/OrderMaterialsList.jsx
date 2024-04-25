import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner, Button, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectMaterials, deleteProjectMaterials } from '../../http/projectMaterialsApi';
import CreateCheck from './modals/createCheck';
import moment from 'moment';
import Moment from 'react-moment';
import './OrderMaterialsList.styles.scss';
import CreateReadyDate from './modals/createReadyDate';
import CreateShippingDate from './modals/createShippingDate';
import CreatePaymentDate from './modals/createPaymentDate';
import CreateMaterial from './modals/createMaterial';

function OrderMaterialsList() {
  const [projectsMaterials, setProjectsMaterials] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [readyDateShow, setReadyDateShow] = React.useState(false);
  const [shippingDateShow, setShippingDateShow] = React.useState(false);
  const [paymentDateShow, setPaymentDateShow] = React.useState(false);
  const [createMaterial, setCreateMaterial] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [projectMaterials, setProjectMaterials] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjectMaterials, setFilteredProjectMaterials] = React.useState([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);

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

  const handleCreateMaterial = (project) => {
    setProject(project);
    setCreateMaterial(true);
  };

  React.useEffect(() => {
    fetchAllProjectMaterials()
      .then((data) => setProjectsMaterials(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDeleteProjectMaterials = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить материал?');
    if (confirmed) {
      deleteProjectMaterials(id)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
          console.log(id);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const filtered = projectsMaterials.filter((projectMaterials) =>
      projectMaterials.project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProjectMaterials(filtered);
  }, [projectsMaterials, searchQuery]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="ordermaterialslist">
      <Header title={'Заказы материалов'} />
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Col>
      <Link to="/procurement">
        <div style={{ fontSize: '18px', paddingTop: '10px', cursor: 'pointer', color: 'black' }}>
          &bull; Показать новые проекты
        </div>
      </Link>
      <CreateCheck
        id={projectMaterials}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreatePaymentDate
        id={projectMaterials}
        show={paymentDateShow}
        setShow={setPaymentDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateMaterial
        projectId={project}
        show={createMaterial}
        setShow={setCreateMaterial}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <>
        {filteredProjectMaterials.map((material) => (
          <div key={material.id}>
            <div className="table-scrollable">
              <div className="ordermaterialslist__top">
                <div className="ordermaterialslist__number">{material.project.number}</div>
                <div className="ordermaterialslist__project">{material.project.name}</div>
                <Button
                  size="sm"
                  className="ms-3"
                  variant="primary"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => handleCreateMaterial(material.project.id)}>
                  Добавить материал
                </Button>
              </div>
            </div>
            <div className="table-container">
              <Table striped bordered size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th className="production_column">Тип материала</th>
                    <th>Дедлайн производства</th>
                    <th>Счёт</th>
                    <th>Дата оплаты</th>
                    <th>Дата готовности</th>
                    <th>Даты отгрузки</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {material.props.map((prop) => {
                    return (
                      <tr key={prop.id}>
                        <td className="production_column">{prop.materialName}</td>
                        <td>
                          {moment(material.project.agreement_date, 'YYYY/MM/DD')
                            .businessAdd(material.project.expiration_date, 'days')
                            .businessAdd(material.project.design_period, 'days')
                            .format('DD.MM.YYYY')}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUpdateClick(prop.id)}>
                          {prop.check ? (
                            <>{prop.check}</>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePaymentDate(prop.id)}>
                          {prop.date_payment ? (
                            <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td style={{ cursor: 'pointer' }} onClick={() => hadleReadyDate(prop.id)}>
                          {prop.ready_date ? (
                            <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => hadleShippingDate(prop.id)}>
                          {prop.shipping_date ? (
                            <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
                          ) : (
                            <span
                              style={{
                                color: 'red',

                                fontWeight: 600,
                                cursor: 'pointer',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProjectMaterials(prop.id)}>
                            Удалить
                          </Button>
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
