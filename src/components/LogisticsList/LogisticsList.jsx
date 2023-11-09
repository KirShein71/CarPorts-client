import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';

function LogisticsList() {
  return (
    <div className="logisticslist">
      <Header title={'Логостика'} />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Даты отгрузок</th>
            <th>Объекты</th>
            <th>Отгрузки</th>
            <th>Приемка</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default LogisticsList;
