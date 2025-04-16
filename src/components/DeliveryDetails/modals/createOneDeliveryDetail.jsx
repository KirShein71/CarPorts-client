import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createDeliveryDetails } from '../../../http/deliveryDetailsApi';

const defaultValue = {
  delivery_quantity: '',
};
const defaultValid = {
  delivery_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'delivery_quantity')
      result.delivery_quantity = value.delivery_quantity.trim() !== '';
  }
  return result;
};

const CreateOneDeliveryDetail = (props) => {
  const { show, setShow, setChange, detailId, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleSaveDetail = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.delivery_quantity) {
      const data = new FormData();
      data.append('delivery_quantity', value.delivery_quantity.trim());
      data.append('detailId', detailId);
      data.append('projectId', projectId);

      setIsLoading(true);
      createDeliveryDetails(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="sm"
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
                name="delivery_quantity"
                value={value.delivery_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.delivery_quantity === true}
                isInvalid={valid.delivery_quantity === false}
                placeholder="Количество деталей"
                className="mb-3"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateOneDeliveryDetail;
