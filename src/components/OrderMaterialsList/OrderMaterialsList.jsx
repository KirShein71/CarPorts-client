import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner, Button, Pagination, Col, Form } from 'react-bootstrap';
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
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [currentPageUrl, setCurrentPageUrl] = React.useState(currentPage);

  const handleUpdateClick = (id) => {
    setProjectMaterials(id);
    setCurrentPageUrl(currentPage);
    setUpdateShow(true);
  };

  const hadleReadyDate = (id) => {
    setProjectMaterials(id);
    setCurrentPageUrl(currentPage);
    setReadyDateShow(true);
  };

  const hadleShippingDate = (id) => {
    setProjectMaterials(id);
    setCurrentPageUrl(currentPage);
    setShippingDateShow(true);
  };

  const handlePaymentDate = (id) => {
    setProjectMaterials(id);
    setCurrentPageUrl(currentPage);
    setPaymentDateShow(true);
  };

  const handleCreateMaterial = (project) => {
    setProject(project);
    setCurrentPageUrl(currentPage);
    setCreateMaterial(true);
  };

  React.useEffect(() => {
    fetchAllProjectMaterials()
      .then((data) => {
        setProjectsMaterials(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      })
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
        scrollPosition={scrollPosition}
        currentPageUrl={currentPageUrl}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
        currentPageUrl={currentPageUrl}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
        currentPageUrl={currentPageUrl}
      />
      <CreatePaymentDate
        id={projectMaterials}
        show={paymentDateShow}
        setShow={setPaymentDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
        currentPageUrl={currentPageUrl}
      />
      <CreateMaterial
        projectId={project}
        show={createMaterial}
        setShow={setCreateMaterial}
        setChange={setChange}
        scrollPosition={scrollPosition}
        currentPageUrl={currentPageUrl}
      />
      <>
        {projectsMaterialsToShow.map((material) => (
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
            <div className="table-scrollable">
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
      <Pagination style={{ marginTop: '20px' }}>{pages}</Pagination>
    </div>
  );
}

export default OrderMaterialsList;
