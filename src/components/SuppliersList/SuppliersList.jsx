import React from 'react';
import Header from '../Header/Header';

import { Button, Table } from 'react-bootstrap';

function SuppliersList() {
  return (
    <div className="supplierslist">
      <Header title={'Поставщики'} />
      <Button>Внести изменения</Button>
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Материалы</th>
            <th>Дерево</th>
            <th>Профлист</th>
            <th>Ворота</th>
            <th>ЛСТК</th>
            <th>Сроки оплат</th>
            <th>Сроки готовности</th>
            <th>Сроки отгрузок</th>
            <th>Объекты</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default SuppliersList;
