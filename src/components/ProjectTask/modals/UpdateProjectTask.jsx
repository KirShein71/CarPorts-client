import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateProjectTask, getOneProjectTask } from '../../../http/projectTaskApi';

const defaultValue = {
  number: '',
  name: '',
  note: '',
  term: '',
};
const defaultValid = {
  number: null,
  name: null,
  note: null,
  term: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'term') result.term = value.term.trim() !== '';
  }
  return result;
};

const UpdateProjectTask = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getOneProjectTask(id)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            note: data.note.toString(),
            term: data.term.toString(),
            number: data.number.toString(),
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
    if (correct.name) {
      const data = new FormData();
      data.append('number', value.number.trim());
      data.append('name', value.name.trim());
      data.append('note', value.note.trim());
      data.append('term', value.term.trim());
      setIsLoading(true);
      updateProjectTask(id, data)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            note: data.note.toString(),
            term: data.term.toString(),
            number: data.number.toString(),
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
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование задачи</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="number"
                value={value.number}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.number === true}
                isInvalid={valid.number === false}
                placeholder="Номер"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                as="textarea"
                name="note"
                value={value.note}
                onChange={handleInputChange}
                isValid={valid.note === true}
                isInvalid={valid.note === false}
                placeholder="Текст"
                style={{ minHeight: '200px', width: '100%' }}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="term"
                value={value.term}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.term === true}
                isInvalid={valid.term === false}
                placeholder="Срок"
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

export default UpdateProjectTask;
