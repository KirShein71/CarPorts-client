import { Button, Modal } from 'react-bootstrap';
import { createShipmentOrder } from '../../../http/shipmentOrderApi';

function ModalCreateOrder(props) {
  const { show, setShow, setChange, projectId, setNewColumnShipmentOrder, flag } = props;
  const date = new Date();

  const handlePlaceShipmentOrder = (projectId) => {
    createShipmentOrder(date, projectId)
      .then(() => {
        setChange((prev) => !prev);
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Ошибка при создании задач из шаблонов');
      });
  };

  const handleAddedNewColumnShipmentOrder = () => {
    setNewColumnShipmentOrder(true);
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Сформировать заказ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {flag === 'false' ? (
          <div className="d-flex justify-content-center gap-2">
            <Button variant="dark" onClick={() => handlePlaceShipmentOrder(projectId)}>
              С текущими данными
            </Button>
            <Button onClick={handleAddedNewColumnShipmentOrder} variant="dark">
              С новыми данными
            </Button>
          </div>
        ) : (
          <Button onClick={handleAddedNewColumnShipmentOrder} variant="dark">
            С новыми данными
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ModalCreateOrder;
