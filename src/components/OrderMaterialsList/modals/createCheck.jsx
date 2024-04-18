import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProjectMaterials,
  createCheckProjectMaterials,
  deleteCheckProjectMaterials,
} from '../../../http/projectMaterialsApi';
import { useNavigate } from 'react-router-dom';

const defaultValue = { check: '' };
const defaultValid = {
  check: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'check') result.check = value.check.trim() !== '';
  }
  return result;
};

const CreateCheck = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            check: data.check.toString(),
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
  }, [id]);

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.check) {
      const data = new FormData();
      data.append('check', value.check.trim());

      createCheckProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            check: data.check.toString(),
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

  const handleDeleteClick = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить номер счёта?');
    if (confirmed) {
      deleteCheckProjectMaterials(id) // Передаем параметр id для удаления
        .then(() => {
          alert('Счёт был удален');
          setShow(false);
          setChange((state) => !state);
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
      className="modal__check">
      <Modal.Header closeButton>
        <Modal.Title>Ввести номер счета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="check"
                value={value.check}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.check === true}
                isInvalid={valid.check === false}
                placeholder="Номер счета"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="me-3 mb-3" type="submit">
                Сохранить
              </Button>
              <Button className="mb-3" variant="danger" onClick={() => handleDeleteClick()}>
                Удалить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCheck;
