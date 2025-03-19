import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteEstimateBrigadeForComplaint } from '../../../http/complaintEstimateApi';

function DeleteComplaintEstimateBrigade(props) {
  const { show, setShow, complaint, brigadeId, setChange } = props;

  const handleDeleteComplaintEstimateBrigadeForCompaint = () => {
    deleteEstimateBrigadeForComplaint(brigadeId, complaint)
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
          <ModalTitle>Удаление сметы бригады</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотите удалить смету по данной бригаде?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteComplaintEstimateBrigadeForCompaint}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComplaintEstimateBrigade;
