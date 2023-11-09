import React from 'react';
import Header from '../Header/Header';
import { Button, Table } from 'react-bootstrap';

function ProductionList() {
  return (
    <div className="productionlist">
      <Header title={'Производство'} />
      <Button>Внести изменения</Button>
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Материалы</th>
            <th>Колонны</th>
            <th>Кронштейны</th>
            <th>Оголовки</th>
            <th>Рамки</th>
            <th>Калитки</th>
            <th>Объекты</th>
            <th>Дата заказа</th>
            <th>Дата отгрузки</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default ProductionList;
