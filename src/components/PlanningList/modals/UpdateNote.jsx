import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';

const defaultValue = { note: '' };
const defaultValid = {
  note: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'note') result.note = value.note;
  }
  return result;
};

const UpdateNote = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            note: data.note.toString(),
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
    if (correct.note) {
      const data = new FormData();
      data.append('note', value.note.trim());
      updateProject(id, data)
        .then((data) => {
          const prod = {
            note: data.note.toString(),
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
        });
    }
    setShow(false);
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
        <Modal.Title>Редактирование</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="note"
              value={value.note}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.note === true}
              isInvalid={valid.note === false}
              placeholder="Примечание"
              type="text"
            />
          </Col>
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

export default UpdateNote;
