import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';

function TeamList() {
  return (
    <div className="teamlist">
      <Header title={'Бригады'} />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Объекты</th>
            <th>Сметы</th>
            <th>Локация</th>
            <th>Сроки монтажа</th>
            <th>Дата начала</th>
            <th>Дата сдачи</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default TeamList;
