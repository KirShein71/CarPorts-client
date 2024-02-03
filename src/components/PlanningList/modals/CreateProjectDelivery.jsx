import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';
import './styles.scss';

const defaultValue = { project_delivery: '' };
const defaultValid = {
  project_delivery: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'project_delivery') result.project_delivery = value.project_delivery;
  }
  return result;
};

const CreateProjectDelivery = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            project_delivery: data.project_delivery.toString(),
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
    if (correct.project_delivery) {
      const data = new FormData();
      data.append('project_delivery', value.project_delivery.trim());
      updateProject(id, data)
        .then((data) => {
          const prod = {
            project_delivery: data.project_delivery.toString(),
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
    <Modal show={show} onHide={() => setShow(false)} size="md" className="modal__planning">
      <Modal.Header closeButton>
        <Modal.Title>Добавь дату сдачи проекта</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="project_delivery"
              value={value.project_delivery}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.project_delivery === true}
              isInvalid={valid.project_delivery === false}
              placeholder="Дата сдачи проекта"
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
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

export default CreateProjectDelivery;
