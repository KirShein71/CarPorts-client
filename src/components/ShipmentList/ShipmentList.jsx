import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Col, Form } from 'react-bootstrap';
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

  React.useEffect(() => {
    fetchAllShipmentDetails()
      .then((data) => {
        setShipmentDetails(data);
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
  };

  const detailSums = nameDetails
    .sort((a, b) => a.id - b.id)
    .map((part) => {
      let sum = 0;
      shipmentDetails.forEach((shipment) => {
        const detail = shipment.props.find((el) => el.detailId === part.id);
        if (detail) {
          sum += detail.shipment_quantity;
        }
      });
      return sum;
    });

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
      <div className="table-container">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="shipment_column">Сумма</th>
              <th></th>
              <th></th>
              {detailSums.map((sum, index) => (
                <th key={index}>{sum}</th>
              ))}
              <th></th>
            </tr>
          </thead>
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
                <img styles={{ marginLeft: '5px' }} src="./img/sort.png" alt="icon_sort" />
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
            {sortedShipmentDetails
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
                                  shipment.shipment_date,
                                )
                          }>
                          {quantity}
                        </td>
                      );
                    })}
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => handleDeleteShipmentDetails(shipment.projectId)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ShipmentList;
