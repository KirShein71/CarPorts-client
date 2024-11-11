import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createProject } from '../../../http/projectApi';
import { createAccount } from '../../../http/userApi';
import { getAllRegion } from '../../../http/regionApi';
import './styles.scss';
const defaultValue = {
  name: '',
  number: '',
  agreement_date: '',
  design_period: '',
  expiration_date: '',
  installation_period: '',
  installation_billing: '',
  note: '',
  region: '',
  phone: '',
  password: '',
};
const defaultValid = {
  name: null,
  number: null,
  agreement_date: null,
  design_period: null,
  expiration_date: null,
  installation_period: null,
  installation_billing: null,
  note: null,
  region: null,
  phone: null,
  password: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'agreement_date') result.agreement_date = value.agreement_date.trim() !== '';
    if (key === 'design_period') result.design_period = value.design_period.trim() !== '';
    if (key === 'expiration_date') result.expiration_date = value.expiration_date.trim() !== '';
    if (key === 'installation_period')
      result.installation_period = value.installation_period.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'region') result.region = value.region;
    if (key === 'phone') result.phone = value.phone.trim() !== '';
    if (key === 'password') result.password = value.password.trim() !== '';
  }
  return result;
};

const CreateProject = (props) => {
  const { show, setShow, setChange } = props;
  const [regions, setRegions] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);
  const [projectId, setProjectId] = React.useState(null);

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

  const handleInputNumberChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const correct = isValid(value);
    setValid(correct);

    if (
      correct.name &&
      correct.number &&
      correct.agreement_date &&
      correct.design_period &&
      correct.expiration_date &&
      correct.installation_period
    ) {
      const data = new FormData();
      data.append('name', value.name.trim());
      data.append('number', value.number.trim());
      data.append('agreement_date', value.agreement_date.trim());
      data.append('design_period', value.design_period.trim());
      data.append('expiration_date', value.expiration_date.trim());
      data.append('installation_period', value.installation_period.trim());
      data.append('installation_billing', value.installation_billing.trim());
      data.append('note', value.note.trim());
      data.append('regionId', value.region);

      createProject(data)
        .then((data) => {
          // приводим форму в изначальное состояние
          setValue(defaultValue);
          setValid(defaultValid);
          setProjectId(data.id);

          // изменяем состояние, чтобы обновить список товаров
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleInputClick = () => {
    setClicked(true);
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.phone && correct.password) {
      const data = new FormData();
      data.append('phone', value.phone.trim());
      data.append('password', value.password.trim());
      data.append('projectId', projectId);

      createAccount(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
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
          <Col>
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
          <Form.Control
            name="name"
            value={value.name}
            onChange={(e) => handleInputChange(e)}
            isValid={valid.name === true}
            isInvalid={valid.name === false}
            placeholder="Название проекта"
          />
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
          <Row className="mb-3 flex-column flex-md-row">
            <Col md={3} className="my-3">
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
            <Col md={3} className="my-3">
              <Form.Control
                name="design_period"
                value={value.design_period}
                onChange={(e) => handleInputNumberChange(e)}
                isValid={valid.design_period === true}
                isInvalid={valid.design_period === false}
                placeholder="Срок проектирования"
              />
            </Col>
            <Col md={3} className="my-3">
              <Form.Control
                name="expiration_date"
                value={value.expiration_date}
                onChange={(e) => handleInputNumberChange(e)}
                isValid={valid.expiration_date === true}
                isInvalid={valid.expiration_date === false}
                placeholder="Срок производства"
              />
            </Col>
            <Col md={3} className="my-3">
              <Form.Control
                name="installation_period"
                value={value.installation_period}
                onChange={(e) => handleInputNumberChange(e)}
                isValid={valid.installation_period === true}
                isInvalid={valid.installation_period === false}
                placeholder="Срок монтажа"
              />
            </Col>
            <Col md={3} className="my-3">
              <Form.Control
                name="installation_billing"
                value={value.installation_billing}
                onChange={(e) => handleInputNumberChange(e)}
                isValid={valid.installation_billing === true}
                isInvalid={valid.installation_billing === false}
                placeholder="Расчетный срок монтажа"
              />
            </Col>
            <Col md={12} className="my-3">
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
          <Row>
            <Col>
              <Button variant="dark" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal.Title className="mt-3">Создать личный кабинет</Modal.Title>
        <Form ref={form} noValidate onSubmit={handleCreateAccount}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="phone"
                value={clicked ? value.phone || '8' : ''}
                onChange={(e) => handleInputChange(e)}
                onClick={handleInputClick}
                isValid={valid.phone === true}
                isInvalid={valid.phone === false}
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
