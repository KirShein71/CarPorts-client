import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneManagerProduction, updatePassword } from '../../../../http/managerProductionApi';

const defaultValue = { password: '' };
const defaultValid = {
  password: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'password') result.password = value.password;
  }
  return result;
};

const UpdatePasswordManagerProduction = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneManagerProduction(id)
        .then((data) => {
          const prod = {};
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
    if (correct.password) {
      const data = new FormData();
      data.append('password', value.password);
      updatePassword(id, data)
        .then((data) => {
          const prod = {
            password: data.password,
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
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить пароль</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="password"
                value={value.password}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.password === true}
                isInvalid={valid.password === false}
                placeholder="Введите пароль"
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

export default UpdatePasswordManagerProduction;
