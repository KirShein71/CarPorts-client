import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteComplaintEstimate } from '../../../http/complaintEstimateApi';

function DeleteComplaintColEstimate(props) {
  const { show, setShow, setChange, colEstimate } = props;

  const handleDeleteComplaintEstimateColumn = () => {
    deleteComplaintEstimate(colEstimate)
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
          <ModalTitle>Удаление строки сметы</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотите удалить строку сметы?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteComplaintEstimateColumn}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComplaintColEstimate;
