import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getOne, updatePhone } from '../../../http/userApi';

const defaultValue = { phone: '' };
const defaultValid = {
  phone: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'phone') result.phone = value.phone.trim() !== '';
  }
  return result;
};

const UpdatePhoneClient = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      getOne(id)
        .then((data) => {
          const prod = {
            phone: data.phone.toString(),
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
  }, [show, id]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.phone) {
      const data = new FormData();
      data.append('phone', value.phone.trim());
      setIsLoading(true);
      updatePhone(id, data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message))
        .finally(() => {
          setIsLoading(false);
        });
    }
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
        <Modal.Title>Изменить номер</Modal.Title>
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

export default UpdatePhoneClient;
