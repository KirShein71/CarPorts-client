import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  createReadyDateProjectMaterials,
  deleteReadyDateProjectMaterials,
  fetchOneProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { ready_date: '' };
const defaultValid = {
  ready_date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'ready_date') result.ready_date = value.ready_date;
  }
  return result;
};

const CreateReadyDate = (props) => {
  const { id, show, setShow, setChange, scrollPosition, projectInfoPage } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            ready_date: data.ready_date.toString(),
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
    if (correct.ready_date) {
      const data = new FormData();
      data.append('ready_date', value.ready_date.trim());
      setIsLoading(true);
      createReadyDateProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            ready_date: data.ready_date.toString(),
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

  const handleDeleteReadyDate = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить дату готовности?');
    if (confirmed) {
      deleteReadyDateProjectMaterials(id) // Передаем параметр id для удаления
        .then(() => {
          alert('Дата готовности была удалена');
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
        <Modal.Title>Внести дату готовности</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="ready_date"
                value={value.ready_date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.ready_date === true}
                isInvalid={valid.ready_date === false}
                placeholder="Дата готовности"
                type="date"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button className="mb-3" variant="dark" onClick={() => handleDeleteReadyDate()}>
                Удалить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReadyDate;
