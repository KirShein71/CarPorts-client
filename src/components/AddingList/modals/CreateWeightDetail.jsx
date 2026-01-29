import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchDetail, createWeight } from '../../../http/detailsApi';

const defaultValue = { weight: '' };
const defaultValid = {
  weight: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'weight') result.weight = value.weight.trim() !== '';
  }
  return result;
};

const CreateWeightDetail = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchDetail(id)
        .then((data) => {
          const prod = {
            weight: data.weight.toString(),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.weight) {
      const data = new FormData();

      data.append('weight', value.weight.trim());
      setIsLoading(true);
      createWeight(id, data)
        .then((data) => {
          const prod = {
            weight: data.weight.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
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
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__price">
      <Modal.Header closeButton>
        <Modal.Title>Введите вес детали</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="weight"
                value={value.weight}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.weight === true}
                isInvalid={valid.weight === false}
                placeholder="Вес детали"
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

export default CreateWeightDetail;
