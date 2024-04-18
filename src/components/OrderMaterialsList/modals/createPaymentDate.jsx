import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  createPaymentDateProjectMaterials,
  fetchOneProjectMaterials,
  deletePaymentDateProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { date_payment: '' };
const defaultValid = {
  date_payment: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date_payment') result.date_payment = value.date_payment;
  }
  return result;
};

const CreatePaymentDate = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            date_payment: data.date_payment.toString(),
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

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.date_payment) {
      const data = new FormData();
      data.append('date_payment', value.date_payment.trim());
      createPaymentDateProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            date_payment: data.date_payment.toString(),
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
    const confirmed = window.confirm('Вы уверены, что хотите удалить дату платежа?');
    if (confirmed) {
      deletePaymentDateProjectMaterials(id) // Передаем параметр id для удаления
        .then(() => {
          alert('Дата платежа была удален');
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="md"
      className="modal__readydate">
      <Modal.Header closeButton>
        <Modal.Title>Внести дату платежа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="date_payment"
                value={value.date_payment}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.date_payment === true}
                isInvalid={valid.date_payment === false}
                placeholder="Дата платежа"
                type="date"
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

export default CreatePaymentDate;
