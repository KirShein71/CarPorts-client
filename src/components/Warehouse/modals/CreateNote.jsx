import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProjectWarehouse,
  createNote,
  deleteNote,
} from '../../../http/projectWarehouseApi';

const defaultValue = { note: '' };
const defaultValid = {
  note: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'note') result.note = value.note.trim() !== '';
  }
  return result;
};

const CreateNote = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectWarehouse(id)
        .then((data) => {
          const prod = {
            note: data.note ? data.note.toString() : '',
          };
          setValue(prod);
          setValid(isValid(prod));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          }
        });
    }
  }, [id]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.note) {
      const data = new FormData();
      data.append('note', value.note.trim());

      createNote(id, data)
        .then((data) => {
          const prod = {
            note: data.note.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          setShow(false);
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
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteNote(id)
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
        className="modal__name">
        <Modal.Header closeButton>
          <Modal.Title>Добавить комментарий</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={value.note}
                  onChange={handleInputChange}
                  isValid={valid.note === true}
                  isInvalid={valid.note === false}
                  placeholder="Комментарии"
                  style={{ minHeight: '200px', width: '100%' }}
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

      {/* Модальное окно для удаления */}
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
          <p>Вы уверены, что хотите удалить комментарий?</p>
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

export default CreateNote;
