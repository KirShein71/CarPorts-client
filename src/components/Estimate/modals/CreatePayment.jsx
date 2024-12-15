import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createPayment } from '../../../http/paymentApi';

const defaultValue = { date: '', sum: '', project: '', brigade: '' };
const defaultValid = {
  date: null,
  sum: null,
  project: null,
  brigade: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date') result.date = value.date;
    if (key === 'sum') result.sum = value.sum;
  }
  return result;
};

const CreatePayment = (props) => {
  const { project, brigade, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.date && correct.sum) {
      const data = new FormData();
      data.append('date', value.date.trim());
      data.append('sum', value.sum.trim());
      data.append('projectId', project);
      data.append('brigadeId', brigade);
      createPayment(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
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
        <Modal.Title>Добавь выплаты</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="date"
              value={value.date}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.date === true}
              isInvalid={valid.date === false}
              placeholder="Дата выплаты"
              type="date"
            />
          </Col>
          <Col className="mb-3">
            <Form.Control
              name="sum"
              value={value.sum}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.sum === true}
              isInvalid={valid.sum === false}
              placeholder="Сумма выплаты"
            />
          </Col>
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

export default CreatePayment;
