import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteBrigadesDate } from '../../../http/brigadesDateApi';

function DeleteBrigadesData(props) {
  const { showDeleteModal, setShowDeleteModal, setChange, id } = props;

  const handleDeleteBrigadesDate = () => {
    deleteBrigadesDate(id)
      .then((data) => {
        setChange((state) => !state);
        setShowDeleteModal(false);
      })
      .catch((error) => {
        setShowDeleteModal(false);
        alert(error.response.data.message);
      });
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <ModalTitle>Удаление данных</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотитет удалить данные?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteBrigadesDate}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteBrigadesData;
