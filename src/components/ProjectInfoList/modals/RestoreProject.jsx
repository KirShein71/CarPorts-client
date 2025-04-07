import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { restoreProject } from '../../../http/projectApi';

function RestoreProject(props) {
  const { show, setShow, id, setChange } = props;

  const handleRestoreProject = () => {
    restoreProject(id)
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
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <ModalTitle>Восстановить проект</ModalTitle>
      </Modal.Header>
      <Modal.Body>
        <p className="modal__text">Вы уверены, что хотите восстановить проект?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Нет
        </Button>
        <Button variant="primary" onClick={handleRestoreProject}>
          Да
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RestoreProject;
