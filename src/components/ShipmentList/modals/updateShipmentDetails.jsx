import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchOneShipmentDetails, updateShipmentDetails } from '../../../http/shipmentDetailsApi';
import '../style.scss';

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

  React.useEffect(() => {
    if (id) {
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
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.shipment_quantity) {
      const data = new FormData();
      data.append('shipment_quantity', value.shipment_quantity.trim());

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
        });
    }
    setShow(false);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="sm">
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
              <Button type="submit">Сохранить</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateShipmentDetails;
