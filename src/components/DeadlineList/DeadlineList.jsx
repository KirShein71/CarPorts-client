import React from 'react';
import Header from '../Header/Header';
import { Button, Table } from 'react-bootstrap';

function DeadLineList() {
  return (
    <div className="deadLinelist">
      <Header title={'Сроки'} />
      <Button>Создать</Button>
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Договор</th>
            <th>Сроки по договору</th>
            <th>Дедлайны</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default DeadLineList;
