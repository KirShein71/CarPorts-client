import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchDetail, updateDetail } from '../../../http/detailsApi';

const defaultValue = { name: '', price: '' };
const defaultValid = {
  name: null,
  price: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'price') result.price = value.price.trim() !== '';
  }
  return result;
};

const UpdateDetail = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchDetail(id)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            price: data.price.toString(),
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
    if (correct.name && correct.price) {
      const data = new FormData();
      data.append('name', value.name.trim());
      data.append('price', value.price.trim());
      setIsLoading(true);
      updateDetail(id, data)
        .then((data) => {
          const prod = {
            name: data.name.toString(),
            price: data.price.toString(),
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
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Введите название детали</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название детали"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="price"
                value={value.price}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.price === true}
                isInvalid={valid.price === false}
                placeholder="Себестоимость"
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

export default UpdateDetail;
