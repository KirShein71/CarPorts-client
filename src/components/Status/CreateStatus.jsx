import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../http/projectApi';

const defaultValue = { status: '' };
const defaultValid = {
  status: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'status') result.status = value.status.trim() !== '';
  }
  return result;
};

const CreateStatus = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            status: data.status.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
        })
        .catch((error) => alert(error.response.data.message));
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
    if (correct.status) {
      const data = new FormData();
      data.append('status', value.status.trim());

      updateProject(id, data)
        .then((data) => {
          const prod = {
            status: data.status.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
    setShow(false);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Проектирование</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="status"
                value={value.status}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.status === true}
                isInvalid={valid.status === false}
                placeholder="Статус"
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

export default CreateStatus;
