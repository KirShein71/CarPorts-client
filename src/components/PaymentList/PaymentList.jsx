import React from 'react';
import Header from '../Header/Header';
import { Button, Table } from 'react-bootstrap';

function PaymentList() {
  return (
    <div className="paymentlist">
      <Header title={'Оплата'} />
      <Button>Внести изменения</Button>
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Материалы</th>
            <th>Даты оплат</th>
            <th>Объекты</th>
            <th>Поставщики</th>
            <th>Производство</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
}

export default PaymentList;
