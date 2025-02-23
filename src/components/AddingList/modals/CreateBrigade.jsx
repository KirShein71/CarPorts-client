import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createBrigade } from '../../../http/bragadeApi';
import { getAllRegion } from '../../../http/regionApi';

const defaultValue = { name: '', phone: '', region: '', password: '' };
const defaultValid = {
  name: null,
  phone: null,
  region: null,
  password: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'phone') result.phone = value.phone.trim() !== '';
    if (key === 'password') result.password = value.password.trim() !== '';
    if (key === 'region') result.region = value.region;
  }
  return result;
};

const CreateBrigade = (props) => {
  const { show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [image, setImage] = React.useState(null);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);
  const [regions, setRegions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getAllRegion()
      .then((data) => setRegions(data))
      .catch((error) => console.error(error));
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.name && correct.phone) {
      const data = new FormData();
      data.append('name', value.name.trim());
      data.append('phone', value.phone.trim());
      data.append('password', value.password.trim());
      data.append('image', image);
      data.append('regionId', value.region);

      setIsLoading(true); // Устанавливаем состояние загрузки
      createBrigade(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message))
        .finally(() => {
          setIsLoading(false); // Сбрасываем состояние загрузки
        });
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
        <Modal.Title>Создание бригады</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={form} noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Введите название бригады"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="phone"
                value={clicked ? value.phone || '8' : ''}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.phone === true}
                isInvalid={valid.phone === false}
                placeholder="Введите номер телефона"
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
                placeholder="Введите пароль"
              />
            </Col>
          </Row>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="region"
                value={value.region}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.region === true}
                isInvalid={valid.region === false}>
                <option value="">Регион</option>
                {regions &&
                  regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.region}
                    </option>
                  ))}
              </Form.Select>
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

export default CreateBrigade;
