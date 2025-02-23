import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { getOneStockDetails, updateStockDetails } from '../../../http/stockDetailsApi';
import './style.scss';

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

const UpdateStockDetails = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getOneStockDetails(id)
        .then((data) => {
          const prod = {
            stock_quantity: data.stock_quantity.toString(),
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
    if (correct.stock_quantity) {
      const data = new FormData();
      data.append('stock_quantity', value.stock_quantity.trim());
      setIsLoading(true);
      updateStockDetails(id, data)
        .then((data) => {
          const prod = {
            stock_quantity: data.stock_quantity.toString(),
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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
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
            <Button variant="dark" type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateStockDetails;
