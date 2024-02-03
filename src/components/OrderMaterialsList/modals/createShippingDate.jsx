import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  createShippingDateProjectMaterials,
  fetchOneProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { shipping_date: '' };
const defaultValid = {
  shipping_date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'shipping_date') result.shipping_date = value.shipping_date;
  }
  return result;
};

const CreateShippingDate = (props) => {
  const { id, show, setShow, setChange, clickPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            shipping_date: data.shipping_date.toString(),
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
    if (correct.shipping_date) {
      const data = new FormData();
      data.append('shipping_date', value.shipping_date.trim());
      createShippingDateProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            shipping_date: data.shipping_date.toString(),
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
    <Modal
      show={show}
      onHide={() => setShow(false)}
      style={{ top: clickPosition.y }}
      size="md"
      className="modal__shippingdate">
      <Modal.Header closeButton>
        <Modal.Title>Добавьте дату отгрузки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
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

export default CreateShippingDate;
