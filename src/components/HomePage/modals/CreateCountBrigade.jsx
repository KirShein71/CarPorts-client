import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createBrigadeWork } from '../../../http/brigadeWorkApi';

const defaultValue = {
  count: '',
};
const defaultValid = {
  count: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'count') result.count = value.count !== '';
  }
  return result;
};

const CreateCountBrigade = (props) => {
  const { show, setShow, setChange, regionId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('count', value.count);
    data.append('regionId', regionId);

    createBrigadeWork(data)
      .then((data) => {
        setValue(defaultValue);
        setValid(defaultValid);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Количество бригад</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSave}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="count"
                value={value.count}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.count === true}
                isInvalid={valid.count === false}
                placeholder="Количество бригад"
                type="number"
              />
            </Col>
          </Row>
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

export default CreateCountBrigade;
