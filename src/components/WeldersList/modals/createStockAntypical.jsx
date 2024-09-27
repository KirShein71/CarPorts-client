import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createStockAntypical } from '../../../http/stockAntypical';

const defaultValue = {
  antypical_quantity: '',
};
const defaultValid = {
  antypical_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'antypical_quantity')
      result.antypical_quantity = value.antypical_quantity.trim() !== '';
  }
  return result;
};

const CreateStockAntypical = (props) => {
  const { show, setShow, setChange, stockDate } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

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
    if (correct.antypical_quantity) {
      const data = new FormData();
      data.append('antypical_quantity', value.antypical_quantity.trim());
      data.append('stock_date', stockDate);

      createStockAntypical(data)
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
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Ввести сумму</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSaveDetail}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="antypical_quantity"
                value={value.antypical_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.antypical_quantity === true}
                isInvalid={valid.antypical_quantity === false}
                placeholder="Сумма"
                className="mb-3"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateStockAntypical;
