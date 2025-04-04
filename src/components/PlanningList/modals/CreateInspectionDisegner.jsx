import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';
import { useNavigate } from 'react-router-dom';

const defaultValue = { inspection_designer: '' };
const defaultValid = {
  inspection_designer: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'inspection_designer') result.inspection_designer = value.inspection_designer;
  }
  return result;
};

const CreateInspectionDesigner = (props) => {
  const { id, show, setShow, setChange, scrollPosition, planningPage } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            inspection_designer: data.inspection_designer.toString(),
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
    if (planningPage) {
      setShow(false);
      window.scrollTo(0, scrollPosition);
    } else {
      setShow(false);
    }
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
    if (correct.inspection_designer) {
      const data = new FormData();
      data.append('inspection_designer', value.inspection_designer.trim());
      setIsLoading(true);
      updateProject(id, data)
        .then((data) => {
          const prod = {
            inspection_designer: data.inspection_designer.toString(),
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

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавь проверяющего</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="inspection_designer"
              value={value.inspection_designer}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.inspection_designer === true}
              isInvalid={valid.inspection_designer === false}
              placeholder="Проверяющий"
              type="text"
            />
          </Col>
          <Row>
            <Col>
              <Button variant="dark" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateInspectionDesigner;
