import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createPlanStart, fetchOneProjectBrigades } from '../../../http/projectBrigadesApi';

const defaultValue = { plan_start: '' };
const defaultValid = {
  plan_start: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'plan_start') result.plan_start = value.plan_start;
  }
  return result;
};

const CreatePlanStartDate = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectBrigades(id)
        .then((data) => {
          const prod = {
            plan_start: data.plan_start.toString(),
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
    if (correct.plan_start) {
      const data = new FormData();
      data.append('plan_start', value.plan_start.trim());
      createPlanStart(id, data)
        .then((data) => {
          const prod = {
            plan_start: data.plan_start.toString(),
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
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="md"
      className="modal__readydate">
      <Modal.Header closeButton>
        <Modal.Title>Наш план начала работ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="plan_start"
                value={value.plan_start}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.plan_start === true}
                isInvalid={valid.plan_start === false}
                placeholder="Дата начала работ"
                type="date"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" className="me-3 mb-3" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePlanStartDate;
