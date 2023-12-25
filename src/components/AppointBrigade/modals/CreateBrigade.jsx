import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchInstallers } from '../../../http/installersApi';
import { createProjectInstallers } from '../../../http/projectInstallersApi';

const defaultValue = {
  installer: '',
  plan_start: '',
  plan_finish: '',
};
const defaultValid = {
  installer: null,
  plan_start: null,
  plan_finish: null,
};

const isValid = (value) => {
  const result = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === 'installer') result.installer = pattern.test(value.installer);
    if (key === 'plan_start') result.plan_start = value.plan_start;
    if (key === 'plan_finish') result.plan_finish = value.plan_finish;
  }
  return result;
};

const CreateBrigade = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [installers, setInstallers] = React.useState(null);

  React.useEffect(() => {
    fetchInstallers().then((data) => setInstallers(data));
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.installer && correct.plan_start && correct.plan_finish) {
      const data = new FormData();
      data.append('plan_start', value.plan_start);
      data.append('plan_finish', value.plan_finish);
      data.append('installerId', value.installer);
      data.append('projectId', projectId);

      createProjectInstallers(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleInstallerChange = (e) => {
    const installerId = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      installer: installerId,
    }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Добавить материал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col>
            <Form.Select
              name="installer"
              value={value.installer}
              onChange={handleInstallerChange}
              isValid={valid.installer === true}
              isInvalid={valid.installer === false}>
              <option value="">Бригады</option>
              {installers &&
                installers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="plan_start"
                value={value.plan_start}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.plan_start === true}
                isInvalid={valid.plan_start === false}
                placeholder="Наш план начала работ"
                className="mb-3"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
            <Col>
              <Form.Control
                name="plan_finish"
                value={value.plan_finish}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.plan_finish === true}
                isInvalid={valid.plan_finish === false}
                placeholder="Наш план окончания работ"
                className="mb-3"
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

export default CreateBrigade;
