import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateShipmentDetails from './modals/updateShipmentDetails';
import Moment from 'react-moment';

function ShipmentList() {
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [updateShipmentDetailsModal, setUpdateShipmentDetailsModal] = React.useState(false);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    fetchAllShipmentDetails()
      .then((data) => setShipmentDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const handleUpdateShipmentDetailClick = (id) => {
    setShipmentDetail(id);
    setUpdateShipmentDetailsModal(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="shipmentlist">
      <Header title={'Отгрузка деталей'} />
      <Link to="/shipmentchange">
        <Button>Внести данные на отгрузку</Button>
      </Link>
      <UpdateShipmentDetails
        id={shipmentDetail}
        show={updateShipmentDetailsModal}
        setShow={setUpdateShipmentDetailsModal}
        setChange={setChange}
      />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер проекта</th>
            <th>Отметка времени</th>
            {nameDetails
              .sort((a, b) => a.id - b.id)
              .map((part) => (
                <th>{part.name}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {shipmentDetails.map((shipment) => (
            <tr key={shipment.id}>
              <td>{shipment.project ? shipment.project.number : ''}</td>
              <td>
                <Moment format="DD.MM.YYYY">
                  {shipment.project ? shipment.project.shipment_date : ''}
                </Moment>
              </td>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => {
                  const detail = shipment.props.find((el) => el.detailId === part.id);
                  const quantity = detail ? detail.shipment_quantity : '';
                  return (
                    <td onClick={() => handleUpdateShipmentDetailClick(detail.id)}>{quantity}</td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ShipmentList;
