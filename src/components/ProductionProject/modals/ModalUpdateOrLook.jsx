import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateName from './CreateName';
import ModalImage from './ModalImage';

function ModalUpdateOrLook(props) {
  const { show, setShow, id, setChange, scrollPosition, image } = props;
  const [openModalCreateAntypicalName, setOpenModalCreateAntypicalName] = React.useState(false);
  const [openModalImage, setOpenModalImage] = React.useState(false);

  const handleCreateAntypicalName = () => {
    setOpenModalCreateAntypicalName(true);
    setShow(false);
  };

  const handleOpenModalImage = () => {
    setOpenModalImage(true);
    setShow(false);
  };

  return (
    <>
      <CreateName
        show={openModalCreateAntypicalName}
        setShow={setOpenModalCreateAntypicalName}
        setChange={setChange}
        id={id}
        scrollPosition={scrollPosition}
      />
      <ModalImage show={openModalImage} setShow={setOpenModalImage} image={image} />
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Footer className="justify-content-center">
          <Button variant="dark" onClick={handleCreateAntypicalName}>
            Редактировать
          </Button>
          <Button variant="dark" onClick={handleOpenModalImage}>
            Посмотреть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateOrLook;
