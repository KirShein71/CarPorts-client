import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllStockDetails } from '../../http/stockDetailsApi';
import CreateStockDetails from './modals/createStockDetails';
import Moment from 'react-moment';
import UpdateStockDetails from './modals/updateStockDetails';

function WeldersList() {
  const [nameDetails, setNameDetails] = React.useState([]);
  const [stockDetails, setStockDetails] = React.useState([]);
  const [stockDetail, setStockDetail] = React.useState(null);
  const [createDetailsModal, setCreateDetailsModal] = React.useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchAllStockDetails()
      .then((data) => setStockDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const handleUpdateDetailClick = (id) => {
    setStockDetail(id);
    setUpdateDetailsModal(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="welderslist">
      <Header title={'Произведено'} />
      <Button onClick={() => setCreateDetailsModal(true)}>Внести детали</Button>
      <CreateStockDetails
        show={createDetailsModal}
        setShow={setCreateDetailsModal}
        setChange={setChange}
      />
      <UpdateStockDetails
        id={stockDetail}
        show={updateDetailsModal}
        setShow={setUpdateDetailsModal}
        setChange={setChange}
      />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Отметка времени</th>
            {nameDetails
              .sort((a, b) => a.id - b.id)
              .map((part) => (
                <th>{part.name}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {stockDetails.map((stock) => (
            <tr>
              <td>
                <Moment format="DD.MM.YYYY">{stock.stock_date}</Moment>
              </td>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => {
                  const detail = stock.props.find((el) => el.detailId === part.id);
                  const quantity = detail ? detail.stock_quantity : '';
                  return <td onClick={() => handleUpdateDetailClick(detail.id)}>{quantity}</td>;
                })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default WeldersList;
