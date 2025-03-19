import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteComplaintPayment } from '../../../http/complaintPaymentApi';

function DeleteComplaintPayment(props) {
  const { show, setShow, setChange, paymentId } = props;

  const handleDeleteComplaintPaymentColumn = () => {
    deleteComplaintPayment(paymentId)
      .then((data) => {
        setChange((state) => !state);
        setShow(false);
      })
      .catch((error) => {
        setShow(false);
        alert(error.response.data.message);
      });
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <ModalTitle>Удаление выплаты</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотите выплату?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteComplaintPaymentColumn}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComplaintPayment;
