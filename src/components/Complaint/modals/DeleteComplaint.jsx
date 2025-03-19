import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteComplaint } from '../../../http/complaintApi';

function DeleteComplaint(props) {
  const { showModal, setShowModal, complaintId, setChange } = props;

  const handleDeleteComplaint = () => {
    deleteComplaint(complaintId)
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <ModalTitle>Удаление рекламации</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотитет удалить рекламационную заявку?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteComplaint}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComplaint;
