import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  fetchOneProjectMaterials,
  createDimensionsMaterial,
} from '../../../http/projectMaterialsApi';

const defaultValue = { dimensions: '' };
const defaultValid = {
  dimensions: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'dimensions') result.dimensions = value.dimensions.trim() !== '';
  }
  return result;
};

const CreateDimensionsMaterial = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            dimensions: data.dimensions.toString(),
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
    if (correct.dimensions) {
      const data = new FormData();
      data.append('dimensions', value.dimensions.trim());
      setIsLoading(true);
      createDimensionsMaterial(id, data)
        .then((data) => {
          const prod = {
            dimensions: data.dimensions.toString(),
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__dimensions">
      <Modal.Header closeButton>
        <Modal.Title>Ввести габариты</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="dimensions"
                value={value.dimensions}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.dimensions === true}
                isInvalid={valid.dimensions === false}
                placeholder="Габариты"
              />
            </Col>
          </Row>
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

export default CreateDimensionsMaterial;
