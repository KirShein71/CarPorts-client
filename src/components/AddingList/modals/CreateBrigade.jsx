import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createBrigade } from '../../../http/bragadeApi';
import { getAllRegion } from '../../../http/regionApi';

const defaultValue = {
  name: '',
  phone: '',
  password: '',
  region: '',
  full_name: '',
  seria_number: '',
  issue_date: '',
  issued_by: '',
  car_brand: '',
  car_color: '',
  license_plate: '',
  active: 'true',
};

const defaultValid = {
  name: null,
  phone: null,
  password: null,
  region: null,
  full_name: null,
  seria_number: null,
  issue_date: null,
  issued_by: null,
  car_brand: null,
  car_color: null,
  license_plate: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'phone') result.phone = value.phone.trim() !== '';
    if (key === 'password') result.password = value.password.trim() !== '';
    if (key === 'region') result.region = value.region !== '';

    if (key === 'full_name') result.full_name = true;
    if (key === 'seria_number') result.seria_number = true;
    if (key === 'issue_date') result.issue_date = true;
    if (key === 'issued_by') result.issued_by = true;
    if (key === 'car_brand') result.car_brand = true;
    if (key === 'car_color') result.car_color = true;
    if (key === 'license_plate') result.license_plate = true;
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

    // Проверяем только обязательные поля
    if (correct.name && correct.phone) {
      const data = new FormData();

      // Обязательные поля
      data.append('name', value.name.trim());
      data.append('phone', value.phone.trim());
      data.append('password', value.password.trim());
      data.append('active', 'true');
      data.append('regionId', value.region);

      // Необязательные поля - отправляем только если они заполнены
      if (value.full_name && value.full_name.trim()) {
        data.append('full_name', value.full_name.trim());
      }

      if (value.seria_number && value.seria_number.trim()) {
        data.append('seria_number', value.seria_number.trim());
      }

      if (value.issue_date && value.issue_date.trim()) {
        data.append('issue_date', value.issue_date.trim());
      }

      if (value.issued_by && value.issued_by.trim()) {
        data.append('issued_by', value.issued_by.trim());
      }

      if (value.car_brand && value.car_brand.trim()) {
        data.append('car_brand', value.car_brand.trim());
      }

      if (value.car_color && value.car_color.trim()) {
        data.append('car_color', value.car_color.trim());
      }

      if (value.license_plate && value.license_plate.trim()) {
        data.append('license_plate', value.license_plate.trim());
      }

      // Изображение
      if (image) {
        data.append('image', image);
      }

      setIsLoading(true);
      createBrigade(data)
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
                placeholder="Название бригады"
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
                placeholder="Номер телефона"
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
                isValid={valid.password === true}
                isInvalid={valid.password === false}
                placeholder="Пароль"
                type="password"
              />
            </Col>
          </Row>
          <Row className="mb-3">
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

          <h6>Паспортные данные</h6>

          <Row className="mb-3">
            <Col>
              <Form.Control
                name="full_name"
                value={value.full_name}
                onChange={(e) => handleInputChange(e)}
                placeholder="ФИО"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="seria_number"
                value={value.seria_number}
                onChange={(e) => handleInputChange(e)}
                placeholder="Серия номер"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="issued_by"
                value={value.issued_by}
                onChange={(e) => handleInputChange(e)}
                placeholder="Кем выдан"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="issue_date"
                value={value.issue_date}
                onChange={(e) => handleInputChange(e)}
                placeholder="Когда выдан"
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </Col>
          </Row>

          <h6>Автомобиль</h6>

          <Row className="mb-3">
            <Col>
              <Form.Control
                name="car_brand"
                value={value.car_brand}
                onChange={(e) => handleInputChange(e)}
                placeholder="Модель/марка"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="car_color"
                value={value.car_color}
                onChange={(e) => handleInputChange(e)}
                placeholder="Цвет"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="license_plate"
                value={value.license_plate}
                onChange={(e) => handleInputChange(e)}
                placeholder="Гос номер"
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

export default CreateBrigade;
