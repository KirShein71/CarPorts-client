import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProjectMaterials,
  createCheckProjectMaterials,
  deleteCheckProjectMaterials,
} from '../../../http/projectMaterialsApi';

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  React.useEffect(() => {
    if (show) {
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
  }, [show]);

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
      setIsLoading(true);
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
    deleteCheckProjectMaterials(id)
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
                <Button variant="dark" type="submit" className="me-3 mb-3" disabled={isLoading}>
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
          <p>Вы уверены, что хотите удалить счет?</p>
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

export default CreateCheck;
