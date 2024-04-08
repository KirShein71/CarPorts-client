import React from 'react';
import { Modal } from 'react-bootstrap';

function ModalImage(props) {
  const { show, setShow, images } = props;

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
              image.image.endsWith('.jpeg') ||
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
            </React.Fragment>
          ))}
      </Modal.Body>
    </Modal>
  );
}

export default ModalImage;
