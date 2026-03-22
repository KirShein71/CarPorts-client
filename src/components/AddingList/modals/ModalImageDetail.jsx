import { Modal, Button } from 'react-bootstrap';
import { deleteImageDetail } from '../../../http/detailsApi';
import React from 'react';

function ModalImageDetail(props) {
  const { show, setShow, image, id, setChange } = props;
  const [deleteModal, setDeleteModal] = React.useState(false);
  const imageUrl = process.env.REACT_APP_IMG_URL + image;

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteImageDetail(id)
      .then(() => {
        setShow(false);
        setChange((state) => !state);
        setDeleteModal(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Ошибка при удалении');
        setDeleteModal(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
  };

  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изображения</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={imageUrl}
            alt="чертеж"
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
            }}
          />
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="dark" onClick={() => handleDeleteClick()}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        show={deleteModal}
        onHide={handleCancelDelete}
        aria-labelledby="delete-confirmation-modal"
        centered
        size="md"
        className="modal__delete-confirm">
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить изображение?</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="dark" onClick={handleCancelDelete}>
              Отмена
            </Button>
            <Button variant="dark" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalImageDetail;
