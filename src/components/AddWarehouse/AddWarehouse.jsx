import React from 'react';
import Header from '../Header/Header';
import AddWarehouseDetail from './modals/AddWarehouseDetail';
import { getAllWarehouseDetail } from '../../http/addWarehouseApi';
import { getAllActiveWarehouseAssortement } from '../../http/warehouseAssortmentApi';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import AddOneWarehouseDetail from './modals/AddOneWarehouseDetail';
import UpdateWarehouseDetail from './modals/UpdateWarehouseDetail';

import './style.scss';

function AddWarehouse() {
  const [warehouseDetails, setWarehouseDetails] = React.useState([]);
  const [warehouseAssortements, setWarehouseAssortements] = React.useState([]);
  const [modalAddWarehouseDetail, setModalAddWarehouseDetail] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [modalAddOneWarehouseDetail, setModalOneWarehouseDetail] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [warehouseAssortementId, setWarehouseAssortementId] = React.useState(null);
  const [modalUpdateWarehouseDetail, setModalUpdateWarehouseDetail] = React.useState(false);
  const [warehouseDetailId, setWarehouseDetailId] = React.useState(null);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [warehouseDetailsData, warehouseAssortementData] = await Promise.all([
          getAllWarehouseDetail(),
          getAllActiveWarehouseAssortement(),
        ]);

        setWarehouseDetails(warehouseDetailsData);
        setWarehouseAssortements(warehouseAssortementData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, [change]);

  const handleOpenModalAddWarehouseDetail = () => {
    setModalAddWarehouseDetail(true);
  };

  const handleOpenModalAddOneWarehouseDetail = (id, date) => {
    setWarehouseAssortementId(id);
    setDate(date);
    setModalOneWarehouseDetail(true);
    console.log(id);
  };

  const handleOpenModalUpdateWarehouseDetail = (id) => {
    setWarehouseDetailId(id);
    setModalUpdateWarehouseDetail(true);
  };

  return (
    <div className="add-warehouse">
      <Header title={'Склад'} />
      <AddWarehouseDetail
        show={modalAddWarehouseDetail}
        setShow={setModalAddWarehouseDetail}
        setChange={setChange}
      />
      <AddOneWarehouseDetail
        show={modalAddOneWarehouseDetail}
        setShow={setModalOneWarehouseDetail}
        warehouseAssortementId={warehouseAssortementId}
        date={date}
        setChange={setChange}
      />
      <UpdateWarehouseDetail
        show={modalUpdateWarehouseDetail}
        setShow={setModalUpdateWarehouseDetail}
        id={warehouseDetailId}
        setChange={setChange}
      />
      <div className="add-warehouse__header">
        <button onClick={handleOpenModalAddWarehouseDetail} className="add-warehouse__header-add">
          Внести детали
        </button>
      </div>
      <div className="add-warehouse__content">
        <Table bordered className="add-warehouse__table">
          <thead>
            <tr>
              <th>Деталь</th>
              {warehouseDetails.map((warehouseDate) => (
                <th className="add-warehouse__table-th date" key={warehouseDate.id}>
                  <Moment format="DD.MM.YY">{warehouseDate.date}</Moment>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {warehouseAssortements
              .sort((a, b) => a.id - b.id)
              .map((assortementName) => (
                <tr key={assortementName.id}>
                  <td>{assortementName.name}</td>
                  {warehouseDetails.map((warehouseDetail) => {
                    const detail = warehouseDetail.props?.find(
                      (el) => el.warehouse_assortement_id === assortementName.id,
                    );
                    const quantity = detail ? detail.quantity : '';
                    return (
                      <td
                        className="add-warehouse__table-td quantity"
                        key={warehouseDetail.id}
                        onClick={() =>
                          quantity
                            ? handleOpenModalUpdateWarehouseDetail(detail.id)
                            : handleOpenModalAddOneWarehouseDetail(
                                assortementName.id,
                                warehouseDetail.date,
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

export default AddWarehouse;
