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
  const { id, show, setShow, setChange, scrollPosition, projectInfoPage } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  React.useEffect(() => {
    if (show) {
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
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    if (projectInfoPage) {
      setShow(false);
    } else {
      setShow(false);
      window.scrollTo(0, scrollPosition);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.date_payment) {
      const data = new FormData();
      data.append('date_payment', value.date_payment.trim());
      setIsLoading(true);
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
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deletePaymentDateProjectMaterials(id)
      .then(() => {
        setShow(false);
        setChange((state) => !state);
        setDeleteModal(false);
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Ошибка при удалении');
        setDeleteModal(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
  };

  return (
    <>
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
                <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button className="mb-3" variant="dark" onClick={() => handleDeleteClick()}>
                  Удалить
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        show={deleteModal}
        onHide={handleCancelDelete}
        aria-labelledby="delete-confirmation-modal"
        centered
        size="md"
        className="modal__delete-confirm">
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить дату платежа?</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="dark" onClick={handleCancelDelete}>
              Отмена
            </Button>
            <Button variant="dark" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreatePaymentDate;
