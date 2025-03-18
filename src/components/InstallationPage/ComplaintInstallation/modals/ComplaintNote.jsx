import React from 'react';
import { Modal } from 'react-bootstrap';

function ComplaintNote(props) {
  const { showNote, setShowNote, note } = props;

  return (
    <Modal
      show={showNote}
      onHide={() => setShowNote(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="md">
      <Modal.Header closeButton>
        <Modal.Title>Смета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: '18px', color: '#000000', textAlign: 'left', width: '100%' }}>
          {note ? note : ''}
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default ComplaintNote;
