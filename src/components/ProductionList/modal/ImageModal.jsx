import React from 'react';
import { Modal, Col, Button } from 'react-bootstrap';
import { deleteAntypical } from '../../../http/antypicalApi';

function ImageModal(props) {
  const { show, setShow, images, setImages, setChange, change } = props;

  const handleDownloadFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error('Ошибка при скачивании файла:', error));
  };

  const handleDeleteAntypical = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить изображение?');
    if (confirmed) {
      deleteAntypical(id)
        .then((data) => {
          setChange(!change);
          const updatedImages = images.filter((image) => image.id !== id);
          setImages(updatedImages);
          alert('Изображение удалено');
        })
        .catch((error) => alert(error.response.data.message));
    }
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
              {image.image.endsWith('.png') ||
              image.image.endsWith('.jpg') ||
              image.image.endsWith('.svg') ? (
                <img
                  style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}
                  src={process.env.REACT_APP_IMG_URL + image.image}
                  alt={'Нетипичная деталь'}
                />
              ) : (
                <div>
                  <p
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDownloadFile(process.env.REACT_APP_IMG_URL + image.image)}>
                    {image.image}
                  </p>
                </div>
              )}
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
