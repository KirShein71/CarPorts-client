import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getOnePaymentColumn, updatePaymentSum } from '../../../http/paymentApi';

const defaultValue = { sum: '' };
const defaultValid = {
  sum: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'sum') result.sum = value.sum;
  }
  return result;
};

const UpdatePaymentSum = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getOnePaymentColumn(id)
        .then((data) => {
          const prod = {
            sum: data.sum,
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
    if (correct.sum) {
      const data = new FormData();
      data.append('sum', value.sum);
      setIsLoading(true);
      updatePaymentSum(id, data)
        .then((data) => {
          const prod = {
            sum: data.sum,
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          setShow(false);
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
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить сумму</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="sum"
                value={value.sum}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.sum === true}
                isInvalid={valid.sum === false}
                placeholder="Введите сумму"
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

export default UpdatePaymentSum;
