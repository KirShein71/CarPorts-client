import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneAntypical, createAntypicalsDeliveryQuantity } from '../../../http/antypicalApi';

const defaultValue = { antypicals_delivery_quantity: '' };
const defaultValid = {
  antypicals_delivery_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'antypicals_delivery_quantity')
      result.antypicals_delivery_quantity = value.antypicals_delivery_quantity.trim() !== '';
  }
  return result;
};

const CreateAntypicalsDeliveryQuantity = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneAntypical(id)
        .then((data) => {
          const prod = {
            antypicals_delivery_quantity: data.antypicals_delivery_quantity.toString(),
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

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.antypicals_delivery_quantity) {
      const data = new FormData();
      data.append('antypicals_delivery_quantity', value.antypicals_delivery_quantity.trim());
      setIsLoading(true);
      createAntypicalsDeliveryQuantity(id, data)
        .then((data) => {
          const prod = {
            antypicals_delivery_quantity: data.antypicals_delivery_quantity.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);

          handleCloseModal();
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
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__antypicals_delivery_quantity">
      <Modal.Header closeButton>
        <Modal.Title>Количество</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="antypicals_delivery_quantity"
                value={value.antypicals_delivery_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.antypicals_delivery_quantity === true}
                isInvalid={valid.antypicals_delivery_quantity === false}
                placeholder="Количество"
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

export default CreateAntypicalsDeliveryQuantity;
