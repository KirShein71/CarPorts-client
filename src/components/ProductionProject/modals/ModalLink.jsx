import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

function ModalLink(props) {
  const { show, setShow, projectId, date } = props;
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    if (show && projectId && date) {
      const encodedDate = encodeURIComponent(date);
      const baseUrl = process.env.FRONTEND_URL || window.location.origin;
      const fullLink = `${baseUrl}/shipment-order?projectId=${projectId}&date=${encodedDate}`;
      setLink(fullLink);
    }
  }, [show, projectId, date]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log('Ссылка скопирована в буфер обмена');
      })
      .catch(() => {
        alert('Ошибка при копировании ссылки');
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ссылка на покраску</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2">
            <Form.Control type="text" value={link} readOnly className="bg-light" />
            <Button variant="dark" onClick={handleCopyLink}>
              Копировать
            </Button>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button variant="dark" onClick={() => setShow(false)}>
            Закрыть
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLink;
