import { Modal, Button } from 'react-bootstrap';

function ModalImage(props) {
  const { show, setShow, image } = props;

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
    </Modal>
  );
}

export default ModalImage;
