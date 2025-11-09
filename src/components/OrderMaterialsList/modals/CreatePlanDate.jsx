import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  createPlanDateProjectMaterials,
  deletePlanDateProjectMaterials,
  fetchOneProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { plan_date: '' };
const defaultValid = {
  plan_date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'plan_date') result.plan_date = value.plan_date;
  }
  return result;
};

const CreatePlanDate = (props) => {
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
            plan_date: data.plan_date.toString(),
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
    if (correct.plan_date) {
      const data = new FormData();
      data.append('plan_date', value.plan_date.trim());
      setIsLoading(true);
      createPlanDateProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            plan_date: data.plan_date.toString(),
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
    deletePlanDateProjectMaterials(id)
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
        className="modal__plandate">
        <Modal.Header closeButton>
          <Modal.Title>Добавьте плановую дату</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="plan_date"
                  value={value.plan_date}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.plan_date === true}
                  isInvalid={valid.plan_date === false}
                  placeholder="Плановая дата"
                  type="date"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button className="mb-3" variant="dark" onClick={handleDeleteClick}>
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
          <p>Вы уверены, что хотите удалить плановую дату?</p>
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

export default CreatePlanDate;
