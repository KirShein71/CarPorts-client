import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createStockDetails } from '../../../http/stockDetailsApi';

const defaultValue = {
  stock_quantity: '',
};
const defaultValid = {
  stock_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'stock_quantity') result.stock_quantity = value.stock_quantity.trim() !== '';
  }
  return result;
};

const CreateOneStockDetail = (props) => {
  const { show, setShow, setChange, detailId, stockDate } = props;
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
    if (correct.stock_quantity) {
      const data = new FormData();
      data.append('stock_quantity', value.stock_quantity.trim());
      data.append('detailId', detailId);
      data.append('stock_date', stockDate);

      createStockDetails(data)
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
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSaveDetail}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="stock_quantity"
                value={value.stock_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.stock_quantity === true}
                isInvalid={valid.stock_quantity === false}
                placeholder="Количество деталей"
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

export default CreateOneStockDetail;
