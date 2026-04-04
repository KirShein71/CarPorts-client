import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createDateInShipmentOrderWithNoDate } from '../../../http/shipmentOrderApi';

function ModalCreateNewShipmentOrder(props) {
  const { show, setShow, setChange, projectId } = props;

  const handleCreateNewShipmentOrder = () => {
    const currentDate = new Date().toISOString();

    createDateInShipmentOrderWithNoDate(projectId, { shipment_date: currentDate })
      .then(() => {
        setChange((state) => !state);
        setShow(false);
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Сформировать заказ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Установить дату для всех незаполненных отгрузок?</p>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="dark" onClick={handleCreateNewShipmentOrder}>
            Да
          </Button>
          <Button onClick={() => setShow(false)} variant="dark">
            Нет
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCreateNewShipmentOrder;
