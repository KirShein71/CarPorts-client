import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner, Button, Pagination, Row, Col, Form } from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 15;

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
      .then((data) => {
        setProjectsMaterials(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteProjectMaterials = (id) => {
    deleteProjectMaterials(id)
      .then((data) => {
        setChange(!change);
        alert(`Строка будет удалена`);
        console.log(id);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projectsMaterials.length);
  const projectsMaterialsToShow = projectsMaterials
    .filter((material) => material.project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < projectsMaterials.length) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          activeLabel=""
          onClick={() => handlePageClick(page)}>
          {page}
        </Pagination.Item>,
      );
    }
  }

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
      <CreateMaterial
        projectId={project}
        show={createMaterial}
        setShow={setCreateMaterial}
        setChange={setChange}
      />
      <>
        {projectsMaterialsToShow.map((material) => (
          <div key={material.id}>
            <div className="ordermaterialslist__top">
              <div className="ordermaterialslist__number">{material.project.number}</div>
              <div className="ordermaterialslist__project">{material.project.name}</div>
              <Button
                size="sm"
                className="ms-3"
                variant="primary"
                onClick={() => handleCreateMaterial(material.project.id)}>
                Добавить материал
              </Button>
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
                    <th></th>
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
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
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
      <Pagination>{pages}</Pagination>
    </div>
  );
}

export default OrderMaterialsList;
