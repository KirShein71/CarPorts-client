import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';

const defaultValue = { designer: '', design_start: '', project_delivery: '' };
const defaultValid = {
  designer: null,
  design_start: null,
  project_delivery: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'designer') result.designer = value.designer.trim() !== '';
    if (key === 'design_start') result.design_start = value.design_start.trim() !== '';
    if (key === 'project_delivery') result.project_delivery = value.project_delivery.trim() !== '';
  }
  return result;
};

const CreateDesing = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            status: data.status.toString(),
            design_start: data.cadesign_start.toString(),
            project_delivery: data.project_delivery.toString(),
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
    if (correct.designer && correct.design_start && correct.project_delivery) {
      const data = new FormData();
      data.append('designer', value.designer.trim());
      data.append('design_start', value.design_start.trim());
      data.append('project_delivery', value.project_delivery);

      updateProject(id, data)
        .then((data) => {
          const prod = {
            designer: data.designer.toString(),
            design_start: data.cadesign_start.toString(),
            project_delivery: data.wiproject_delivery.toString(),
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
                name="designer"
                value={value.designer}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.designer === true}
                isInvalid={valid.designer === false}
                placeholder="Конструктор"
              />
            </Col>
            <Col>
              <Form.Control
                name="design_start"
                value={value.design_start}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.design_start === true}
                isInvalid={valid.design_start === false}
                placeholder="Дата начала проектирования"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
            <Col>
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

export default CreateDesing;
