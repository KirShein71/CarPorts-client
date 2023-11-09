import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';

function StockList() {
  return (
    <div className="stocklist">
      <Header title={'Склад'} />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Крепеж</th>
            <th>Электрика</th>
            <th>Расходники</th>
            <th>Светильники</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default StockList;
