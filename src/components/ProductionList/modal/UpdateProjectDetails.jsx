import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchOneProjectDetails, updateProjectDetails } from '../../../http/projectDetailsApi';

const defaultValue = {
  quantity: '',
};
const defaultValid = {
  quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
  }
  return result;
};

const UpdateProjectDetails = (props) => {
  const { show, setShow, setChange, id } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectDetails(id)
        .then((data) => {
          const prod = {
            quantity: data.quantity.toString(),
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
    if (correct.quantity) {
      const data = new FormData();
      data.append('quantity', value.quantity.trim());

      updateProjectDetails(id, data)
        .then((data) => {
          const prod = {
            quantity: data.quantity.toString(),
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
        });
    }
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить количество детали</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col>
            <Form.Control
              name="quantity"
              value={value.quantity}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.quantity === true}
              isInvalid={valid.quantity === false}
              placeholder="Количество деталей"
              className="mb-3"
            />
          </Col>
          <Row>
            <Col>
              <Button type="submit">Сохранить</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProjectDetails;
