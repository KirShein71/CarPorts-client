import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  createShippingDateProjectMaterials,
  deleteShippingDateProjectMaterials,
  fetchOneProjectMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = { shipping_date: '' };
const defaultValid = {
  shipping_date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'shipping_date') result.shipping_date = value.shipping_date;
  }
  return result;
};

const CreateShippingDate = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            shipping_date: data.shipping_date.toString(),
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.shipping_date) {
      const data = new FormData();
      data.append('shipping_date', value.shipping_date.trim());
      setIsLoading(true);
      createShippingDateProjectMaterials(id, data)
        .then((data) => {
          const prod = {
            shipping_date: data.shipping_date.toString(),
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

  const handleDeleteShippingDate = () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить дату отгрузки?');
    if (confirmed) {
      deleteShippingDateProjectMaterials(id) // Передаем параметр id для удаления
        .then(() => {
          alert('Дата отгрузки была удалена');
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
      className="modal__shippingdate">
      <Modal.Header closeButton>
        <Modal.Title>Добавьте дату отгрузки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="shipping_date"
                value={value.shipping_date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipping_date === true}
                isInvalid={valid.shipping_date === false}
                placeholder="Дата отгрузки"
                type="date"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" className="me-3 mb-3" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button className="mb-3" variant="dark" onClick={() => handleDeleteShippingDate()}>
                Удалить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateShippingDate;
