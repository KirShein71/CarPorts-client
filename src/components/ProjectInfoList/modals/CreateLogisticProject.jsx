import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, createLogisticProject } from '../../../http/projectApi';

const defaultValue = { contact: '', address: '', navigator: '', coordinates: '' };
const defaultValid = {
  contact: null,
  address: null,
  navigator: null,
  coordinates: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'contact') result.contact = value.contact.trim() !== '';
    if (key === 'address') result.address = value.address.trim() !== '';
    if (key === 'navigator') result.navigator = value.navigator.trim() !== '';
    if (key === 'coordinates') result.coordinates = value.coordinates.trim() !== '';
  }
  return result;
};

const CreateLogisticProject = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            contact: data.contact.toString(),
            address: data.address.toString(),
            navigator: data.navigator.toString(),
            coordinates: data.coordinates.toString(),
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
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.contact) {
      const data = new FormData();
      data.append('contact', value.contact.trim());
      data.append('address', value.address.trim());
      data.append('navigator', value.navigator.trim());
      data.append('coordinates', value.coordinates.trim());

      createLogisticProject(id, data)
        .then((data) => {
          const prod = {
            contact: data.contact.toString(),
            address: data.address.toString(),
            navigator: data.navigator.toString(),
            coordinates: data.coordinates.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          handleCloseModal();
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Добавить данные</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="contact"
                value={value.contact}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.contact === true}
                isInvalid={valid.contact === false}
                placeholder="Контакты"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="address"
                value={value.address}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.address === true}
                isInvalid={valid.address === false}
                placeholder="Адрес"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="navigator"
                value={value.navigator}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.navigator === true}
                isInvalid={valid.navigator === false}
                placeholder="Навигатор"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="coordinates"
                value={value.coordinates}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.coordinates === true}
                isInvalid={valid.coordinates === false}
                placeholder="Координаты"
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

export default CreateLogisticProject;
