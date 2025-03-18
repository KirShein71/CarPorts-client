import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import Moment from 'react-moment';

function ComplaintPayment(props) {
  const { showPayment, setShowPayment, brigadeId, complaintPayments, complaint } = props;

  return (
    <Modal
      show={showPayment}
      onHide={() => setShowPayment(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="md"
      className="modal__readydate">
      <Modal.Header closeButton>
        <Modal.Title>Выплаты</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {complaintPayments
              .filter(
                (comPay) =>
                  comPay.complaintId === complaint && comPay.brigadeId === Number(brigadeId),
              )
              .map((comPay) => (
                <tr key={comPay.id}>
                  <td>
                    <Moment format="DD.MM.YYYY">{comPay.date}</Moment>
                  </td>
                  <td>{new Intl.NumberFormat('ru-RU').format(comPay.sum)}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default ComplaintPayment;
