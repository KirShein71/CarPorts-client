import React from 'react';
import Header from '../Header/Header';
import { getTotalWarehouseData } from '../../http/totalWarehouseApi';
import { getAllActiveWarehouseAssortement } from '../../http/warehouseAssortmentApi';
import { Table } from 'react-bootstrap';

import './style.scss';

function TotalWarehouseComponent() {
  const [warehouseAssortements, setWarehouseAssortements] = React.useState([]);
  const [warehouseTotalData, setWarehouseTotalData] = React.useState([]);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [totalData, warehouseAssortementData] = await Promise.all([
          getTotalWarehouseData(),
          getAllActiveWarehouseAssortement(),
        ]);

        setWarehouseTotalData(totalData);
        setWarehouseAssortements(warehouseAssortementData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, []);

  // Создаем Set с ID ассортиментов, которые есть в warehouseTotalData
  const existingAssortementIds = new Set(
    warehouseTotalData.map((item) => item.warehouse_assortement_id),
  );

  // Фильтруем ассортименты, оставляя только те, что есть в warehouseTotalData
  const filteredAssortements = warehouseAssortements.filter((assortement) =>
    existingAssortementIds.has(assortement.id),
  );

  return (
    <div className="total-warehouse">
      <Header title={'Итоговая склад'} />
      <div className="total-warehouse__content">
        <Table bordered className="total-warehouse__table">
          <thead>
            <tr>
              <th className="total-warehouse__table-th detail">Деталь</th>
              <th className="total-warehouse__table-th">Внесли</th>
              <th className="total-warehouse__table-th">Заказ</th>
              <th className="total-warehouse__table-th">Отгрузка</th>
              <th className="total-warehouse__table-th">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssortements
              .sort((a, b) => a.id - b.id)
              .map((assortementName) => (
                <tr key={assortementName.id}>
                  <td className="total-warehouse__table-td detail">{assortementName.name}</td>
                  {warehouseTotalData
                    .filter(
                      (wareTotalData) =>
                        wareTotalData.warehouse_assortement_id === assortementName.id,
                    )
                    .map((wareTotalData) => (
                      <React.Fragment key={wareTotalData.warehouse_assortement_id}>
                        <td className="total-warehouse__table-td">{wareTotalData.add_warehouse}</td>
                        <td className="total-warehouse__table-td">
                          {wareTotalData.order_warehouse}
                        </td>
                        <td className="total-warehouse__table-td">
                          {wareTotalData.shipment_warehouse}
                        </td>
                        <td className="total-warehouse__table-td">
                          {wareTotalData.remainder_warehouse}
                        </td>
                      </React.Fragment>
                    ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TotalWarehouseComponent;
