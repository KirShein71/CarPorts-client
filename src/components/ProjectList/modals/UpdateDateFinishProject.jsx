import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { updateDateFinish } from '../../../http/projectApi';

const defaultValue = { date_finish: '' };
const defaultValid = {
  date_finish: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date_finish') result.date_finish = value.date_finish;
  }
  return result;
};

function UpdateDateFinishProject(props) {
  const { show, setShow, id, setChange } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleClosedModal = () => {
    setShow(false);
    setChange((state) => !state);
  };

  const handleUpdateDateFinishProject = async (event) => {
    event.preventDefault(); // Добавьте, если ещё нет

    const correct = isValid(value);
    setValid(correct);

    if (correct.date_finish) {
      // Исправленный формат даты для Safari
      const dateValue = new Date(value.date_finish);
      const formattedDate = dateValue.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const data = new FormData();
      data.append('date_finish', formattedDate);

      setIsLoading(true);

      try {
        const response = await updateDateFinish(id, data);
        const prod = {
          date_finish: response.date_finish,
        };
        setValue(prod);
        setValid(isValid(prod));

        handleClosedModal();
      } catch (error) {
        if (error.response?.data) {
          alert(error.response.data.message);
        } else {
          console.error('Error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClosedModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Внести дату закрытия проекта</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleUpdateDateFinishProject}>
          <Col className="mb-3">
            <Form.Control
              name="date_finish"
              value={value.date_finish}
              onChange={handleInputChange}
              isValid={valid.date_finish === true}
              isInvalid={valid.date_finish === false}
              placeholder="Дата закрытия"
              type="date"
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
}

export default UpdateDateFinishProject;
