import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  updateWarehouseAssortment,
  fetchOneWarehouseAssortment,
} from '../../../http/warehouseAssortmentApi';

const defaultValue = { number: '', name: '', cost_price: '', shipment_price: '', weight: '' };
const defaultValid = {
  number: null,
  name: null,
  cost_price: null,
  shipment_price: null,
  weight: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'cost_price') result.cost_price = value.cost_price.trim() !== '';
    if (key === 'shipment_price') result.shipment_price = value.shipment_price.trim() !== '';
    if (key === 'weight') result.weight = value.weight.trim() !== '';
  }
  return result;
};

const UpdateWarehouseAssortment = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchOneWarehouseAssortment(id)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            cost_price: data.cost_price.toString(),
            shipment_price: data.shipment_price.toString(),
            weight: data.weight.toString(),
            number: data.number.toString(),
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
    if (correct.name) {
      const data = new FormData();
      data.append('number', value.number.trim());
      data.append('name', value.name.trim());
      data.append('cost_price', value.cost_price.trim());
      data.append('shipment_price', value.shipment_price.trim());
      data.append('weight', value.weight.trim());
      setIsLoading(true);
      updateWarehouseAssortment(id, data)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            cost_price: data.cost_price.toString(),
            shipment_price: data.shipment_price.toString(),
            weight: data.weight.toString(),
            number: data.number.toString(),
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
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Введите название детали</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Введите наименование"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="cost_price"
                value={value.cost_price}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.cost_price === true}
                isInvalid={valid.cost_price === false}
                placeholder="Введите себестоимость"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="shipment_price"
                value={value.shipment_price}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipment_price === true}
                isInvalid={valid.shipment_price === false}
                placeholder="Введите цену отгрузки"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="weight"
                value={value.weight}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.weight === true}
                isInvalid={valid.weight === false}
                placeholder="Введите вес(гр)"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="number"
                value={value.number}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.number === true}
                isInvalid={valid.number === false}
                placeholder="Введите номер"
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

export default UpdateWarehouseAssortment;
