import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAccountEmployee } from '../../../http/employeeApi';

const defaultValue = { phone: '', name: '', speciality: '', password: '' };
const defaultValid = {
  phone: null,
  name: null,
  speciality: null,
  password: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'phone') result.phone = value.phone.trim() !== '';
    if (key === 'password') result.password = value.password.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'speciality') result.speciality = value.speciality.trim() !== '';
  }
  return result;
};

const CreateEmployee = (props) => {
  const { show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.phone && correct.password && correct.name && correct.speciality) {
      const data = new FormData();
      data.append('phone', value.phone.trim());
      data.append('password', value.password.trim());
      data.append('name', value.name.trim());
      data.append('speciality', value.speciality.trim());
      createAccountEmployee(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Ввидите данные сотрудника</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={form} noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="phone"
                value={clicked ? value.phone || '8' : ''}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.phone === true}
                isInvalid={valid.phone === false}
                placeholder="Ввидите номер телефона"
                minLength="10"
                maxLength="11"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="password"
                value={value.password}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.password === true}
                isInvalid={valid.password === false}
                placeholder="Ввидите пароль"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Ввидите имя сотрудника"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="speciality"
                value={value.speciality}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.speciality === true}
                isInvalid={valid.speciality === false}
                placeholder="Ввидете должность"
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

export default CreateEmployee;
