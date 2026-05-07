import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneBrigade, updateBrigade } from '../../../http/bragadeApi';

const defaultValue = {
  name: '',
  phone: '',
  full_name: '',
  seria_number: '',
  issue_date: '',
  issued_by: '',
  car_brand: '',
  car_color: '',
  license_plate: '',
};

const defaultValid = {
  name: null,
  phone: null,
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
    // Остальные поля необязательные
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

const UpdateBrigade = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [image, setImage] = React.useState(null);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Сброс формы при закрытии
  const resetForm = () => {
    setValue(defaultValue);
    setValid(defaultValid);
    setImage(null);
    setClicked(false);
  };

  // Загрузка данных при открытии
  React.useEffect(() => {
    if (show && id) {
      fetchOneBrigade(id)
        .then((data) => {
          const prod = {
            name: data.name || '',
            phone: data.phone || '',
            full_name: data.full_name || '',
            seria_number: data.seria_number || '',
            issue_date: data.issue_date || '',
            issued_by: data.issued_by || '',
            car_brand: data.car_brand || '',
            car_color: data.car_color || '',
            license_plate: data.license_plate || '',
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
    } else if (!show) {
      // Сбрасываем форму при закрытии
      resetForm();
    }
  }, [show, id]);

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

      // Необязательные поля - отправляем только если они заполнены
      if (value.full_name && value.full_name.trim()) {
        data.append('full_name', value.full_name.trim());
      } else {
        data.append('full_name', ''); // Отправляем пустую строку для удаления
      }

      if (value.seria_number && value.seria_number.trim()) {
        data.append('seria_number', value.seria_number.trim());
      } else {
        data.append('seria_number', '');
      }

      if (value.issue_date && value.issue_date.trim()) {
        data.append('issue_date', value.issue_date.trim());
      } else {
        data.append('issue_date', '');
      }

      if (value.issued_by && value.issued_by.trim()) {
        data.append('issued_by', value.issued_by.trim());
      } else {
        data.append('issued_by', '');
      }

      if (value.car_brand && value.car_brand.trim()) {
        data.append('car_brand', value.car_brand.trim());
      } else {
        data.append('car_brand', '');
      }

      if (value.car_color && value.car_color.trim()) {
        data.append('car_color', value.car_color.trim());
      } else {
        data.append('car_color', '');
      }

      if (value.license_plate && value.license_plate.trim()) {
        data.append('license_plate', value.license_plate.trim());
      } else {
        data.append('license_plate', '');
      }

      if (image) {
        data.append('image', image);
      }

      setIsLoading(true);
      updateBrigade(id, data)
        .then((data) => {
          resetForm();
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response?.data?.message || 'Ошибка при обновлении'))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Форматирование даты для отображения
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        setShow(false);
      }}
      size="lg"
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Редактирование бригады</Modal.Title>
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
                placeholder="Название бригады *"
                required
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="phone"
                value={clicked ? value.phone || '8' : value.phone}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.phone === true}
                isInvalid={valid.phone === false}
                placeholder="Телефон *"
                minLength="10"
                maxLength="11"
                required
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="image"
                type="file"
                onChange={handleImageChange}
                placeholder="Изображение"
              />
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
                value={formatDateForInput(value.issue_date)}
                onChange={(e) => handleInputChange(e)}
                placeholder="Когда выдан"
                type="date"
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

export default UpdateBrigade;
