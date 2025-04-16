import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchOneDeliveryDetails, updateDeliveryDetails } from '../../../http/deliveryDetailsApi';

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

const UpdateDeliveryDetails = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchOneDeliveryDetails(id)
        .then((data) => {
          const prod = {
            delivery_quantity: data.delivery_quantity.toString(),
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
    if (correct.delivery_quantity) {
      const data = new FormData();
      data.append('delivery_quantity', value.delivery_quantity.trim());
      setIsLoading(true);
      updateDeliveryDetails(id, data)
        .then((data) => {
          const prod = {
            delivery_quantity: data.delivery_quantity.toString(),
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
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить количество детали</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
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

export default UpdateDeliveryDetails;
