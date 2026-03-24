import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import {
  fetchOneProjectWarehouse,
  updateProjectWarehouse,
} from '../../../http/projectWarehouseApi';

const defaultValue = {
  quantity: '',
};
const defaultValid = {
  quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
  }
  return result;
};

const UpdateQuantityWarehouseDetail = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneProjectWarehouse(id)
        .then((data) => {
          const prod = {
            quantity: data.quantity.toString(),
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
  }, [show]);

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
    if (correct.quantity) {
      const data = new FormData();
      data.append('quantity', value.quantity.trim());
      setIsLoading(true);
      updateProjectWarehouse(id, data)
        .then((data) => {
          const prod = {
            quantity: data.quantity.toString(),
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

  return (
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
              name="quantity"
              value={value.quantity}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.quantity === true}
              isInvalid={valid.quantity === false}
              placeholder="Количество деталей"
              className="mb-3"
            />
          </Col>
          <Row>
            <Col>
              <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateQuantityWarehouseDetail;
