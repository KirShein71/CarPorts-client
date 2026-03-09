import { Modal, Button } from 'react-bootstrap';

function ModalImage(props) {
  const { show, setShow, image } = props;

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

  const imageUrl = process.env.REACT_APP_IMG_URL + image;

  return (
    <Modal show={show} onHide={() => setShow(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Чертеж</Modal.Title>
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
        <Button variant="dark" onClick={() => handleDownloadFile(imageUrl)}>
          Скачать
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalImage;
