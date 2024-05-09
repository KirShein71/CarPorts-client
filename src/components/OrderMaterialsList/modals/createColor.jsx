import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProjectMaterials,
  createColorProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { color: '' };
const defaultValid = {
  color: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'color') result.color = value.color.trim() !== '';
  }
  return result;
};

const CreateColor = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            color: data.color.toString(),
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
    if (correct.color) {
      const data = new FormData();
      data.append('color', value.color.trim());

      createColorProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            color: data.color.toString(),
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__color">
      <Modal.Header closeButton>
        <Modal.Title>Цвет</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="color"
                value={value.color}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.color === true}
                isInvalid={valid.color === false}
                placeholder="Цвет"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="me-3 mb-3" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateColor;
