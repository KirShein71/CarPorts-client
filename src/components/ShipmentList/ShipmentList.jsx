import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Pagination, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllShipmentDetails, deleteShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateShipmentDetails from './modals/updateShipmentDetails';
import CreateOneShipmentDetail from './modals/createOneShipmentDetail';
import Moment from 'react-moment';
import './modals/styles.scss';

function ShipmentList() {
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [updateShipmentDetailsModal, setUpdateShipmentDetailsModal] = React.useState(false);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [createOneShipmentDetailModal, setCreateOneShipmentDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [sortField, setSortField] = React.useState('shipment_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 15;

  React.useEffect(() => {
    fetchAllShipmentDetails()
      .then((data) => {
        setShipmentDetails(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const handleUpdateShipmentDetailClick = (id) => {
    setShipmentDetail(id);
    setUpdateShipmentDetailsModal(true);
  };

  const handleCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setCreateOneShipmentDetailModal(true);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteShipmentDetails = (projectId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить?');
    if (confirmed) {
      deleteShipmentDetails(projectId)
        .then((data) => {
          setChange(!change);
          alert('Строка будет удалена');
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('строка удалена');
          }
        });
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedShipmentDetails = shipmentDetails.slice().sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);

    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, shipmentDetails.length);
  const stockDetailsToShow = sortedShipmentDetails.slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < shipmentDetails.length) {
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
    <div className="shipmentlist">
      <Header title={'Отгрузка деталей'} />
      <Link to="/shipmentchange">
        <Button>Внести данные на отгрузку</Button>
      </Link>
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
      <UpdateShipmentDetails
        id={shipmentDetail}
        show={updateShipmentDetailsModal}
        setShow={setUpdateShipmentDetailsModal}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={project}
        shipmentDate={shipmentDate}
        show={createOneShipmentDetailModal}
        setShow={setCreateOneShipmentDetailModal}
        setChange={setChange}
      />
      <div className="table-scrollable">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="shipment_column">Номер проекта</th>
              <th>Название проекта</th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleSort('shipment_date');
                }}>
                Отметка времени{' '}
                <img styles={{ marginLeft: '5px' }} src="./sort.png" alt="icon_sort" />
              </th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th key={part.id}>{part.name}</th>
                ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stockDetailsToShow
              .filter((shipment) =>
                shipment.project.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((shipment) => (
                <tr key={shipment.id}>
                  <td className="shipment_column">
                    {shipment.project ? shipment.project.number : ''}
                  </td>
                  <td>{shipment.project ? shipment.project.name : ''}</td>
                  <td>
                    <Moment format="DD.MM.YYYY">{shipment.shipment_date}</Moment>
                  </td>
                  {nameDetails
                    .sort((a, b) => a.id - b.id)
                    .map((part) => {
                      const detail = shipment.props.find((el) => el.detailId === part.id);
                      const quantity = detail ? detail.shipment_quantity : '';
                      return (
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            quantity
                              ? handleUpdateShipmentDetailClick(detail.id)
                              : handleCreateOneShipmentDetail(
                                  part.id,
                                  shipment.projectId,
                                  shipment.project.shipment_date,
                                )
                          }>
                          {quantity}
                        </td>
                      );
                    })}
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleDeleteShipmentDetails(shipment.projectId)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {shipmentDetails.length > 15 ? <Pagination>{pages}</Pagination> : ''}
      </div>
    </div>
  );
}

export default ShipmentList;
