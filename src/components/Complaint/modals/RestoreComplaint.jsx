import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteDateFinish } from '../../../http/complaintApi';

function RestoreComplaint(props) {
  const { showModal, setShowModal, complaintId, setChange } = props;

  const handleRestoreComplaint = () => {
    deleteDateFinish(complaintId)
      .then((data) => {
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
          <ModalTitle>Восстановление рекламации</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотитет восстановить рекламационную заявку?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleRestoreComplaint}>
            Восстановить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RestoreComplaint;
