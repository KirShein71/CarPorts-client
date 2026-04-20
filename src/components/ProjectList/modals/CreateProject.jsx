import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createProject } from '../../../http/projectApi';
import { getAllRegion } from '../../../http/regionApi';
import './styles.scss';

const defaultValue = {
  name: '',
  number: '',
  agreement_date: '',
  design_period: '',
  expiration_date: '',
  installation_billing: '',
  price: '',
  note: '',
  region: '',
  contact: '',
  address: '',
  navigator: '',
  coordinates: '',
};
const defaultValid = {
  name: null,
  number: null,
  agreement_date: null,
  design_period: null,
  expiration_date: null,
  installation_billing: null,
  price: null,
  note: null,
  region: null,
  contact: null,
  address: null,
  navigator: null,
  coordinates: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'agreement_date') result.agreement_date = value.agreement_date.trim() !== '';
    if (key === 'design_period') result.design_period = value.design_period.trim() !== '';
    if (key === 'expiration_date') result.expiration_date = value.expiration_date.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'region') result.region = value.region;
  }
  return result;
};

const CreateProject = (props) => {
  const { show, setShow, setChange } = props;
  const [regions, setRegions] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [clicked, setClicked] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 800);

  React.useEffect(() => {
    getAllRegion()
      .then((data) => setRegions(data))
      .catch((error) => console.error(error));
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleInputNumberChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const fetchDefaultImage = async () => {
    try {
      const response = await fetch('/img/fon.jpg');
      const blob = await response.blob();
      return new File([blob], 'default.jpg', { type: 'image/jpeg' });
    } catch (error) {
      console.error('Ошибка загрузки изображения по умолчанию:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const correct = isValid(value);
    setValid(correct);

    if (
      correct.name &&
      correct.number &&
      correct.agreement_date &&
      correct.design_period &&
      correct.expiration_date
    ) {
      try {
        const data = new FormData();
        // Данные проекта
        data.append('name', value.name.trim());
        data.append('number', value.number.trim());
        data.append('agreement_date', value.agreement_date.trim());
        data.append('design_period', value.design_period.trim());
        data.append('expiration_date', value.expiration_date.trim());
        data.append('installation_billing', value.installation_billing.trim());
        data.append('price', value.price.trim());
        data.append('note', value.note.trim());
        data.append('regionId', value.region);
        data.append('contact', value.contact.trim());
        data.append('address', value.address.trim());
        data.append('navigator', value.navigator.trim());
        data.append('coordinates', value.coordinates.trim());

        if (image) {
          data.append('image', image, image.name);
        } else {
          // Если изображение не загружено, используем изображение по умолчанию
          const defaultImage = await fetchDefaultImage();
          data.append('image', defaultImage, 'default.jpg');
        }

        const response = await createProject(data);

        if (response.success) {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        }
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    }
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setChange((state) => !state);
      }}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      className="modal__project">
      <Modal.Header closeButton>
        <Modal.Title>Добавить проект</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          {isMobile ? (
            <>
              <Col md={3}>
                <Form.Control
                  name="number"
                  value={value.number}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.number === true}
                  isInvalid={valid.number === false}
                  placeholder="Номер проекта"
                  className="mb-3"
                />
              </Col>
              <Col>
                <Form.Control
                  name="name"
                  value={value.name}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.name === true}
                  isInvalid={valid.name === false}
                  placeholder="Название проекта"
                />
              </Col>
              <Col md={3} className="mt-3">
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
              <Col md={3} className="mt-3">
                {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                  <>
                    <label for="agreement_date">Дата договора</label>
                    <Form.Control
                      id="agreement_date"
                      name="agreement_date"
                      value={value.agreement_date}
                      onChange={(e) => handleInputChange(e)}
                      isValid={valid.agreement_date === true}
                      isInvalid={valid.agreement_date === false}
                      type="date"
                    />
                  </>
                ) : (
                  <Form.Control
                    name="agreement_date"
                    value={value.agreement_date}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.agreement_date === true}
                    isInvalid={valid.agreement_date === false}
                    placeholder="Дата договора"
                    type="text"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                  />
                )}
              </Col>
              <Col md={3} className="mt-3">
                <Form.Control
                  name="design_period"
                  value={value.design_period}
                  onChange={(e) => handleInputNumberChange(e)}
                  isValid={valid.design_period === true}
                  isInvalid={valid.design_period === false}
                  placeholder="Срок проектирования"
                />
              </Col>
              <Col md={3} className="mt-3">
                <Form.Control
                  name="expiration_date"
                  value={value.expiration_date}
                  onChange={(e) => handleInputNumberChange(e)}
                  isValid={valid.expiration_date === true}
                  isInvalid={valid.expiration_date === false}
                  placeholder="Срок производства"
                />
              </Col>
              <Col md={3} className="mt-3">
                <Form.Control
                  name="price"
                  value={value.price}
                  onChange={(e) => handleInputNumberChange(e)}
                  isValid={valid.price === true}
                  isInvalid={valid.price === false}
                  placeholder="Стоимость работ"
                />
              </Col>
              <Col className="mt-3">
                <Form.Control
                  name="contact"
                  value={value.contact}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.contact === true}
                  isInvalid={valid.contact === false}
                  placeholder="Телефон"
                />
              </Col>
              <Col className="mt-3">
                <Form.Control
                  name="address"
                  value={value.address}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.address === true}
                  isInvalid={valid.address === false}
                  placeholder="Адрес"
                />
              </Col>
              <Col className="mt-3">
                <Form.Control
                  name="navigator"
                  value={value.navigator}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.navigator === true}
                  isInvalid={valid.navigator === false}
                  placeholder="Навигатор"
                />
              </Col>
              <Col className="mt-3">
                <Form.Control
                  name="coordinates"
                  value={value.coordinates}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.coordinates === true}
                  isInvalid={valid.coordinates === false}
                  placeholder="Координаты"
                />
              </Col>

              <Col className="mt-3">
                <Form.Control
                  name="image"
                  type="file"
                  onChange={(e) => handleImageChange(e)}
                  placeholder="Изображение..."
                />
              </Col>
              <Col md={12} className="mt-3 mb-3">
                <textarea
                  name="note"
                  value={value.note}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.note === true}
                  isInvalid={valid.note === false}
                  placeholder="Примечание"
                  style={{ height: '200px', width: '100%' }}
                />
              </Col>
            </>
          ) : (
            <>
              <Row>
                <Col md={3}>
                  <Form.Control
                    name="number"
                    value={value.number}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.number === true}
                    isInvalid={valid.number === false}
                    placeholder="Номер проекта"
                    className="mb-3"
                  />
                </Col>
                <Col>
                  <Form.Control
                    name="name"
                    value={value.name}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.name === true}
                    isInvalid={valid.name === false}
                    placeholder="Название проекта"
                  />
                </Col>
              </Row>
              <Row>
                <Col md={3}>
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
                <Col>
                  <Form.Control
                    name="contact"
                    value={value.contact}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.contact === true}
                    isInvalid={valid.contact === false}
                    placeholder="Телефон"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={3}>
                  {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                    <>
                      <label for="agreement_date">Дата договора</label>
                      <Form.Control
                        id="agreement_date"
                        name="agreement_date"
                        value={value.agreement_date}
                        onChange={(e) => handleInputChange(e)}
                        isValid={valid.agreement_date === true}
                        isInvalid={valid.agreement_date === false}
                        type="date"
                      />
                    </>
                  ) : (
                    <Form.Control
                      name="agreement_date"
                      value={value.agreement_date}
                      onChange={(e) => handleInputChange(e)}
                      isValid={valid.agreement_date === true}
                      isInvalid={valid.agreement_date === false}
                      placeholder="Дата договора"
                      type="text"
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => (e.target.type = 'text')}
                    />
                  )}
                </Col>
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
              <Row className="mt-3">
                <Col md={3}>
                  <Form.Control
                    name="design_period"
                    value={value.design_period}
                    onChange={(e) => handleInputNumberChange(e)}
                    isValid={valid.design_period === true}
                    isInvalid={valid.design_period === false}
                    placeholder="Срок проектирования"
                  />
                </Col>
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
              <Row className="mt-3">
                <Col md={3}>
                  <Form.Control
                    name="expiration_date"
                    value={value.expiration_date}
                    onChange={(e) => handleInputNumberChange(e)}
                    isValid={valid.expiration_date === true}
                    isInvalid={valid.expiration_date === false}
                    placeholder="Срок производства"
                  />
                </Col>
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
              <Row className="mt-3">
                <Col md={3}>
                  <Form.Control
                    name="price"
                    value={value.price}
                    onChange={(e) => handleInputNumberChange(e)}
                    isValid={valid.price === true}
                    isInvalid={valid.price === false}
                    placeholder="Стоимость работ"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form.Control
                    name="image"
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                    placeholder="Изображение..."
                  />
                </Col>
              </Row>
              <Row className="mb-3 mt-3">
                <Col md={12}>
                  <textarea
                    name="note"
                    value={value.note}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.note === true}
                    isInvalid={valid.note === false}
                    placeholder="Примечание"
                    style={{ height: '200px', width: '100%' }}
                  />
                </Col>
              </Row>
            </>
          )}
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

export default CreateProject;
