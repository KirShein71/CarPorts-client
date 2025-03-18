import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  getOneComplaintPaymentColumn,
  updateComplaintPaymentDate,
} from '../../../http/complaintPaymentApi';

const defaultValue = { date: '' };
const defaultValid = {
  date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date') result.date = value.date;
  }
  return result;
};

const UpdateComplaintPaymentDate = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getOneComplaintPaymentColumn(id)
        .then((data) => {
          const prod = {
            date: data.date,
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
    if (correct.date) {
      const data = new FormData();
      data.append('date', value.date);
      setIsLoading(true);
      updateComplaintPaymentDate(id, data)
        .then((data) => {
          const prod = {
            date: data.date,
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
        <Modal.Title>Изменить дату</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="date"
                value={value.date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.date === true}
                isInvalid={valid.date === false}
                placeholder="Введите дату"
                type="date"
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

export default UpdateComplaintPaymentDate;
