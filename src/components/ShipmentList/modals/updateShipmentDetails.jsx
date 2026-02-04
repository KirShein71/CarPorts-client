import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import {
  fetchOneShipmentDetails,
  updateShipmentDetails,
  deleteOneShipmentDetail,
} from '../../../http/shipmentDetailsApi';
import './styles.scss';

const defaultValue = {
  shipment_quantity: '',
};
const defaultValid = {
  shipment_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'shipment_quantity')
      result.shipment_quantity = value.shipment_quantity.trim() !== '';
  }
  return result;
};

const UpdateShipmentDetails = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneShipmentDetails(id)
        .then((data) => {
          const prod = {
            shipment_quantity: data.shipment_quantity.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [id]);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.shipment_quantity) {
      const data = new FormData();
      data.append('shipment_quantity', value.shipment_quantity.trim());
      setIsLoading(true);
      updateShipmentDetails(id, data)
        .then((data) => {
          const prod = {
            shipment_quantity: data.shipment_quantity.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    setShow(false);
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteOneShipmentDetail(id)
      .then(() => {
        setShow(false);
        setChange((state) => !state);
        setDeleteModal(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Ошибка при удалении');
        setDeleteModal(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить количество детали</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Col>
              <Form.Control
                name="shipment_quantity"
                value={value.shipment_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipment_quantity === true}
                isInvalid={valid.shipment_quantity === false}
                placeholder="Количество деталей"
                className="mb-3"
              />
            </Col>
            <Row>
              <Col>
                <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button className="mb-3" variant="dark" onClick={() => handleDeleteClick()}>
                  Удалить
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={deleteModal}
        onHide={handleCancelDelete}
        aria-labelledby="delete-confirmation-modal"
        centered
        size="md"
        className="modal__delete-confirm">
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить?</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="dark" onClick={handleCancelDelete}>
              Отмена
            </Button>
            <Button variant="dark" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateShipmentDetails;
