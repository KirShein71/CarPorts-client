import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProject,
  reviseProjectNameAndNumberAndInstallationBilling,
  deleteProject,
} from '../../../http/projectApi';

const defaultValue = { number: '', name: '', installation_billing: '' };
const defaultValid = {
  number: null,
  name: null,
  installation_billing: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
  }
  return result;
};

const GearModal = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            number: data.number?.toString() || '',
            name: data.name?.toString() || '',
            installation_billing: data.installation_billing?.toString() || '',
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

  const handleInputNumberChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    if (correct.number && correct.name) {
      const data = {
        number: value.number?.trim() || '',
        name: value.name?.trim() || '',
        installation_billing: value.installation_billing?.trim() || null,
      };

      try {
        const response = await reviseProjectNameAndNumberAndInstallationBilling(id, data);
        const prod = {
          number: response.number?.toString() || '',
          name: response.name?.toString() || '',
          installation_billing: response.installation_billing || null,
        };
        setValue(prod);
        setValid(isValid(prod));
        setChange((state) => !state);
        handleCloseModal();
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          console.log('An error occurred');
        }
      }
    }
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить проект?');
    if (confirmed) {
      deleteProject(id)
        .then((data) => {
          setChange((state) => !state);
          alert(`Проект «${data.name}» был удален`);
          handleCloseModal();
        })
        .catch((error) => alert(error.response.data.message));
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
        <Modal.Title>Внести изменения</Modal.Title>
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
                placeholder="Номер проекта"
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
                placeholder="Название проекта"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="installation_billing"
                value={value.installation_billing}
                onChange={(e) => handleInputNumberChange(e)}
                isValid={valid.installation_billing === true}
                isInvalid={valid.installation_billing === false}
                placeholder="Расчетный срок монтажа"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" className="me-3" type="submit">
                Сохранить
              </Button>
              <Button variant="dark" onClick={() => handleDeleteClick(id)}>
                Удалить проект
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GearModal;
