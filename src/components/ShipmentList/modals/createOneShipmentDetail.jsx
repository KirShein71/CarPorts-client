import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createShipmentDetails } from '../../../http/shipmentDetailsApi';

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

const CreateOneShipmentDetail = (props) => {
  const { show, setShow, setChange, detailId, projectId, shipmentDate } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSaveDetail = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.shipment_quantity) {
      const data = new FormData();
      data.append('shipment_quantity', value.shipment_quantity.trim());
      data.append('detailId', detailId);
      data.append('projectId', projectId);
      data.append('shipment_date', shipmentDate);

      createShipmentDetails(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSaveDetail}>
          <Row className="mb-3 mt-4">
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
          </Row>
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

export default CreateOneShipmentDetail;
