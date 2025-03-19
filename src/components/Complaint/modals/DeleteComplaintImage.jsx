import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { deleteComplaintImage } from '../../../http/complaintImageApi';

function DeleteComplaintImage(props) {
  const { show, setShow, setChange, imageId } = props;

  const handleDeleteComplaintImage = () => {
    deleteComplaintImage(imageId)
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
          <ModalTitle>Удаление изображения</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p className="modal__text">Вы уверены, что хотите удалить изображение?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleDeleteComplaintImage}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComplaintImage;
