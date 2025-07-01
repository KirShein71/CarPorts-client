import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { closedProject, createDateFinish } from '../../../http/projectApi';

const defaultValue = { date_finish: '', finish: '' };
const defaultValid = {
  date_finish: null,
  finish: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date_finish') result.date_finish = value.date_finish;
    if (key === 'finish') result.finish = value.finish;
  }
  return result;
};

function ClosedProject(props) {
  const { show, setShow, id, setChange, dateFinish } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  console.log(dateFinish);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleClosedProject = () => {
    closedProject(id, { finish: 'true' })
      .then((data) => {
        setChange((state) => !state);
        setShow(false);
      })
      .catch((error) => {
        setShow(false);
        alert(error.response.data.message);
      });
  };

  const handleFinishProject = async (event) => {
    const correct = isValid(value);
    setValid(correct);
    if (correct.date_finish) {
      const data = new FormData();
      data.append('date_finish', value.date_finish.trim());
      data.append('finish', (value.finish = true));
      setIsLoading(true);
      createDateFinish(id, data)
        .then((data) => {
          const prod = {
            date_finish: data.date_finish.toString(),
            finish: data.finish.toString(),
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
  };

  const handleClosedModal = () => {
    setShow(false);
    setChange((state) => !state);
  };

  return (
    <Modal show={show} onHide={handleClosedModal} centered>
      {dateFinish === null ? (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Внести дату закрытия проекта</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={handleFinishProject}>
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
        </>
      ) : (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Закрыть проект</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="modal__text">Вы уверены, что хотите закрыть проект?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosedModal}>
              Нет
            </Button>
            <Button variant="primary" onClick={handleClosedProject}>
              Да
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export default ClosedProject;
