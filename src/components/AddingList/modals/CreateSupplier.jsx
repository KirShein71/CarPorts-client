import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createSupplier } from '../../../http/supplierApi';
import { getAllRegion } from '../../../http/regionApi';

const defaultValue = {
  name: '',
  contact: '',
  address: '',
  shipment: '',
  navigator: '',
  note: '',
  coordinates: '',
  region: '',
};
const defaultValid = {
  name: null,
  contact: null,
  address: null,
  shipment: null,
  navigator: null,
  note: null,
  coordinates: null,
  region: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'contact') result.contact = value.contact.trim() !== '';
    if (key === 'address') result.address = value.address.trim() !== '';
    if (key === 'shipment') result.shipment = value.shipment.trim() !== '';
    if (key === 'navigator') result.navigator = value.navigator.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'coordinates') result.coordinates = value.coordinates.trim() !== '';
    if (key === 'region') result.region = value.region;
  }
  return result;
};

const CreateSupplier = (props) => {
  const { show, setShow, setChange } = props;
  const [regions, setRegions] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      getAllRegion()
        .then((data) => setRegions(data))
        .catch((error) => console.error(error));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.name) {
      const data = new FormData();
      data.append('name', value.name.trim());
      data.append('contact', value.contact.trim());
      data.append('address', value.address.trim());
      data.append('shipment', value.shipment.trim());
      data.append('navigator', value.navigator.trim());
      data.append('note', value.note.trim());
      data.append('coordinates', value.coordinates.trim());
      data.append('regionId', value.region);

      setIsLoading(true);
      createSupplier(data)
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
        <Modal.Title>Создание поставщика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название"
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
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="contact"
                value={value.contact}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.contact === true}
                isInvalid={valid.contact === false}
                placeholder="Контактное лицо"
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
                name="shipment"
                value={value.shipment}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipment === true}
                isInvalid={valid.shipment === false}
                placeholder="Вид погрузки"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="note"
                value={value.note}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.note === true}
                isInvalid={valid.note === false}
                placeholder="Примечание"
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
                placeholder="Ссылка на навигатор"
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

export default CreateSupplier;
