import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchMaterials } from '../../../http/materialsApi';
import { createProperty } from '../../../http/projectApi';

const defaultValue = {
  date_payment: '',
  expiration_date: '',
  ready_date: '',
  shipping_date: '',
  material: '',
  materialName: '',
};
const defaultValid = {
  date_payment: null,
  expiration_date: null,
  ready_date: null,
  shipping_date: null,
  material: null,
  materialName: null,
};

const isValid = (value) => {
  const result = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === 'date_payment') result.date_payment = value.date_payment.trim() !== '';
    if (key === 'expiration_date') result.expiration_date = value.expiration_date.trim() !== '';
    if (key === 'ready_date') result.ready_date = value.ready_date.trim() !== '';
    if (key === 'shipping_date') result.shipping_date = value.shipping_date.trim() !== '';
    if (key === 'material') result.material = pattern.test(value.material);
    if (key === 'materialName') result.materialName = pattern.test(value.materialName);
  }
  return result;
};

const CreateProcurement = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [materials, setMaterials] = React.useState(null);

  React.useEffect(() => {
    fetchMaterials().then((data) => setMaterials(data));
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (
      correct.date_payment &&
      correct.expiration_date &&
      correct.ready_date &&
      correct.shipping_date &&
      correct.material
    ) {
      const data = new FormData();
      data.append('date_payment', value.date_payment.trim());
      data.append('expiration_date', value.expiration_date.trim());
      data.append('ready_date', value.ready_date.trim());
      data.append('shipping_date', value.shipping_date.trim());
      data.append('materialId', value.material);
      data.append('materialName', value.materialName);
      data.append('projectId', projectId);

      createProperty(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleMaterialChange = (e) => {
    const materialId = e.target.value;
    const materialName = e.target.options[e.target.selectedIndex].text;
    setValue((prevValue) => ({
      ...prevValue,
      material: materialId,
      materialName: materialName,
    }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Добавить материал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col>
            <Form.Select
              name="material"
              value={value.material}
              onChange={handleMaterialChange}
              isValid={valid.material === true}
              isInvalid={valid.material === false}>
              <option value="">Материалы</option>
              {materials &&
                materials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="date_payment"
                value={value.date_payment}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.date_payment === true}
                isInvalid={valid.date_payment === false}
                placeholder="Дата платежа"
                className="mb-3"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
            <Col>
              <Form.Control
                name="expiration_date"
                value={value.expiration_date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.expiration_date === true}
                isInvalid={valid.expiration_date === false}
                placeholder="Срок производства"
              />
            </Col>
            <Col>
              <Form.Control
                name="ready_date"
                value={value.ready_date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.ready_date === true}
                isInvalid={valid.ready_date === false}
                placeholder="Дата готовности"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
            <Col>
              <Form.Control
                name="shipping_date"
                value={value.shipping_date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipping_date === true}
                isInvalid={valid.shipping_date === false}
                placeholder="Дата отгрузки"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
            <Col>
              <Button type="submit">Сохранить</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProcurement;
