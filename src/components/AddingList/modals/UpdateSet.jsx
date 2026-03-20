import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateSet, getOneSet } from '../../../http/setApi';
import { getAllRegion } from '../../../http/regionApi';

const defaultValue = {
  name: '',
  number: '',
  region: '',
  active: '',
};
const defaultValid = {
  name: null,
  number: null,
  region: null,
  active: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'region') result.region = value.region;
  }
  return result;
};

const UpdateSet = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [regions, setRegions] = React.useState([]);
  const [initialRegionId, setInitialRegionId] = React.useState(null); // сохраняем первоначальный регион

  React.useEffect(() => {
    if (show) {
      getAllRegion()
        .then((data) => setRegions(data))
        .catch((error) => console.error(error));
    }
  }, [show]);

  React.useEffect(() => {
    if (show && id) {
      getOneSet(id)
        .then((data) => {
          const prod = {
            name: data.name?.toString() || '',
            number: data.number?.toString() || '',
            region: data.regionId?.toString() || '', // меняем regionId на region для соответствия с name в select
          };
          setValue(prod);
          setInitialRegionId(data.regionId?.toString() || ''); // сохраняем первоначальный регион
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('name', value.name.trim());
    data.append('number', value.number.trim());

    // Если регион не изменился, отправляем initialRegionId, иначе отправляем выбранный
    const regionToSend = value.region || initialRegionId;
    data.append('regionId', regionToSend);

    setIsLoading(true);

    try {
      await updateSet(id, data);
      setChange((state) => !state);
      setShow(false);
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        console.log('An error occurred');
      }
    } finally {
      setIsLoading(false);
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
        <Modal.Title>Редактирование комплекта</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="number"
                value={value.number}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.number === true}
                isInvalid={valid.number === false}
                placeholder="Номер"
              />
            </Col>
          </Row>
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
                    <option key={region.id} value={region.id.toString()}>
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

export default UpdateSet;
