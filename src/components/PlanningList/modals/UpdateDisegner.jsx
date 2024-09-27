import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';
import { useNavigate } from 'react-router-dom';

const defaultValue = { designer: '' };
const defaultValid = {
  designer: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'designer') result.designer = value.designer;
  }
  return result;
};

const UpdateDesigner = (props) => {
  const { id, show, setShow, setChange, scrollPosition, currentPageUrl } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            designer: data.designer.toString(),
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
    navigate(currentPageUrl); // Восстанавливаем текущую страницу после закрытия модального окна
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.designer) {
      const data = new FormData();
      data.append('designer', value.designer.trim());
      updateProject(id, data)
        .then((data) => {
          const prod = {
            designer: data.designer.toString(),
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

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить проектировщика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="designer"
              value={value.designer}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.designer === true}
              isInvalid={valid.designer === false}
              placeholder="Проектировщик"
              type="text"
            />
          </Col>
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

export default UpdateDesigner;
