import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { createDateFinish } from '../../../http/complaintApi';

function ClosedComplaint(props) {
  const { showModal, setShowModal, complaintId, setChange } = props;

  const handleFinishComplaint = () => {
    createDateFinish(complaintId, { date_finish: new Date().toISOString() })
      .then(() => {
        setChange((state) => !state);
        setShowModal(false);
      })
      .catch((error) => {
        setShowModal(false);
        alert(error.response.data.message);
      });
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <ModalTitle>Закрыть заявку</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотитет закрыть рекламационную заявку?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleFinishComplaint}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ClosedComplaint;
