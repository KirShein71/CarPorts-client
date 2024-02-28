import React from 'react';
import { Modal, Col, Button } from 'react-bootstrap';
import { deleteAntypical } from '../../../http/antypicalApi';

function ImageModal(props) {
  const { show, setShow, images, setImages, setChange, change } = props;

  const handleDeleteAntypical = (id) => {
    deleteAntypical(id)
      .then((data) => {
        setChange(!change);
        // Удалить удаленное изображение из списка images
        const updatedImages = images.filter((image) => image.id !== id);
        setImages(updatedImages);
        alert('Изображение удалено');
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Изображения</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Array.isArray(images) &&
          images.map((image, index) => (
            <React.Fragment key={index}>
              <img
                style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                src={process.env.REACT_APP_IMG_URL + image.image}
                alt={'Нетипичная деталь'}
              />
              <Col>
                <Button variant="danger" size="sm" onClick={() => handleDeleteAntypical(image.id)}>
                  Удалить
                </Button>
              </Col>
            </React.Fragment>
          ))}
      </Modal.Body>
    </Modal>
  );
}

export default ImageModal;
