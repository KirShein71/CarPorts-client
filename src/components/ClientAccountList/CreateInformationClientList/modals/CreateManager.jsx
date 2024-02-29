import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createManager, getOneAccount } from '../../../../http/userApi';
import { useParams } from 'react-router-dom';

const defaultValue = { manager: '', manager_phone: '' };
const defaultValid = {
  manager: null,
  manager_phone: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'manager') result.manager = value.manager.trim() !== '';
    if (key === 'manager_phone') result.manager_phone = value.manager_phone.trim() !== '';
  }
  return result;
};

const CreateManager = (props) => {
  const { show, setShow, setChange } = props;
  const { id } = useParams();
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      getOneAccount(id)
        .then((res) => {
          const prod = {
            manager: res.manager.toString(),
            phone_manager: res.phone_manager,
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
    const res = { ...value, [event.target.name]: event.target.value };
    setValue(res);
    setValid(isValid(res));
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.manager && correct.manager_phone) {
      const res = new FormData();
      res.append('manager', value.manager.trim());
      res.append('manager_phone', value.manager_phone.trim());

      createManager(id, res)
        .then((res) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Назначить менеджера</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={form} noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="manager"
                value={value.manager}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.manager === true}
                isInvalid={valid.manager === false}
                placeholder="Введите имя"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                name="manager_phone"
                value={clicked ? value.manager_phone || '8' : ''}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.manager_phone === true}
                isInvalid={valid.manager_phone === false}
                placeholder="Ввидите номер телефона"
                minLength="10"
                maxLength="11"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="mt-3" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateManager;
