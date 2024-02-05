import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllStockDetails } from '../../http/stockDetailsApi';
import CreateStockDetails from './modals/createStockDetails';
import Moment from 'react-moment';
import UpdateStockDetails from './modals/updateStockDetails';
import CreateOneStockDetail from './modals/createOneStockDetail';
import './modals/styles.scss';

function WeldersList() {
  const [nameDetails, setNameDetails] = React.useState([]);
  const [stockDetails, setStockDetails] = React.useState([]);
  const [stockDetail, setStockDetail] = React.useState(null);
  const [createDetailsModal, setCreateDetailsModal] = React.useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = React.useState(false);
  const [createOneStockDetailModal, setCreateOneStockDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [stockDate, setStockDate] = React.useState(null);
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

  const handleCreateOneStockDetail = (detailId, stockDate) => {
    setDetailId(detailId);
    setStockDate(stockDate);
    setCreateOneStockDetailModal(true);
    console.log(detailId, stockDate);
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
      <CreateOneStockDetail
        detailId={detailId}
        stockDate={stockDate}
        show={createOneStockDetailModal}
        setShow={setCreateOneStockDetailModal}
        setChange={setChange}
      />
      <div className="table-scrollable">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="welders_column">Отметка времени</th>
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
                <td className="welders_column">
                  <Moment format="DD.MM.YYYY">{stock.stock_date}</Moment>
                </td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => {
                    const detail = stock.props.find((el) => el.detailId === part.id);
                    const quantity = detail ? detail.stock_quantity : '';
                    return (
                      <td
                        onClick={() =>
                          quantity
                            ? handleUpdateDetailClick(detail.id)
                            : handleCreateOneStockDetail(part.id, stock.stock_date)
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

export default WeldersList;
