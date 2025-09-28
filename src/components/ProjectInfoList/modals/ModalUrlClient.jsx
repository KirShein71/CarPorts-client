import React from 'react';
import { Modal, Col, Row } from 'react-bootstrap';

function ModalUrlClient(props) {
  const { show, setShow, personalAccountLink } = props;

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton className="new-project__title">
        Ссылка на лк клиента
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div
              style={{
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                display: 'block',
              }}>
              {personalAccountLink}
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ModalUrlClient;
