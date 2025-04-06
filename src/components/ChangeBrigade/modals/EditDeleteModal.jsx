import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

function EditDeleteModal({
  show,
  setShow,
  id,
  handleOpenModalUpdateBrigadeDate,
  handleOpenModalDeleteBrigadeDateData,
}) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Button
              variant="dark"
              type="submit"
              className="me-3 mb-3"
              onClick={() => {
                handleOpenModalUpdateBrigadeDate(id);
                setShow(false);
              }}>
              Редактировать
            </Button>
            <Button
              className="mb-3"
              variant="dark"
              onClick={() => {
                handleOpenModalDeleteBrigadeDateData(id);
                setShow(false);
              }}>
              Удалить
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default EditDeleteModal;
