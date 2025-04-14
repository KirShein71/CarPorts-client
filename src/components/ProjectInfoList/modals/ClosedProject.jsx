import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { closedProject, createDateFinish } from '../../../http/projectApi';

function ClosedProject(props) {
  const { show, setShow, id, setChange, dateFinish } = props;

  const handleClosedProject = () => {
    closedProject(id, { finish: 'true' })
      .then((data) => {
        setChange((state) => !state);
        setShow(false);
      })
      .catch((error) => {
        setShow(false);
        alert(error.response.data.message);
      });
  };

  const handleFinishProject = () => {
    createDateFinish(id, { date_finish: new Date().toISOString(), finish: 'true' })
      .then((data) => {
        setChange((state) => !state);
        setShow(false);
      })
      .catch((error) => {
        setShow(false);
        alert(error.response.data.message);
      });
  };

  const handleClosedModal = () => {
    setShow(false);
    setChange((state) => !state);
  };

  return (
    <Modal show={show} onHide={handleClosedModal} centered>
      <Modal.Header closeButton>
        <ModalTitle>Закрыть проект</ModalTitle>
      </Modal.Header>
      <Modal.Body>
        <p className="modal__text">Вы уверены, что хотите закрыть проект?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosedModal}>
          Нет
        </Button>
        <Button
          variant="primary"
          onClick={dateFinish !== null ? handleClosedProject : handleFinishProject}>
          Да
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClosedProject;
