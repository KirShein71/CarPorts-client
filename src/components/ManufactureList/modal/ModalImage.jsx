import React from 'react';
import { Modal, Col, Button } from 'react-bootstrap';

function ModalImage(props) {
  const { show, setShow, images } = props;

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
            </React.Fragment>
          ))}
      </Modal.Body>
    </Modal>
  );
}

export default ModalImage;
