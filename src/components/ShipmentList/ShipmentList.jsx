import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
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

  const handleCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setCreateOneShipmentDetailModal(true);
    console.log(shipmentDate);
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
                <td className="shipment_column">
                  {shipment.project ? shipment.project.number : ''}
                </td>
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
                      <td
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ShipmentList;
