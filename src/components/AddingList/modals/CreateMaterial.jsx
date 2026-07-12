import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createMaterial } from '../../../http/materialsApi';
import { fetchSuppliers } from '../../../http/supplierApi';

const defaultValue = { name: '', supplier: '' };
const defaultValid = {
  name: null,
  supplier: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'supplier') result.supplier = value.supplier;
  }
  return result;
};

const CreateMaterial = (props) => {
  const { show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!show) return;

      try {
        const data = await fetchSuppliers();

        if (!data) {
          throw new Error('Не получены данные от сервера');
        }

        if (!Array.isArray(data)) {
          throw new Error('Ожидался массив поставщиков');
        }

        const isValidData = data.every(
          (item) =>
            item.id && item.name && typeof item.id === 'number' && typeof item.name === 'string',
        );

        if (!isValidData) {
          throw new Error('Некорректная структура данных поставщиков');
        }

        setSuppliers(data);
      } catch (err) {
        console.error('Ошибка при загрузке поставщиков:', err);
      }
    };

    fetchData();
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.name) {
      const data = new FormData();
      data.append('name', value.name.trim());
      data.append('supplierId', value.supplier);
      setIsLoading(true);
      createMaterial(data)
        .then((data) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message))
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
      size="lg"
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Введите название материала</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Введите название материала"
              />
            </Col>
          </Row>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="supplier"
                value={value.supplier}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.supplier === true}
                isInvalid={valid.supplier === false}>
                <option value="">Поставщик</option>
                {suppliers &&
                  suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
              </Form.Select>
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

export default CreateMaterial;
