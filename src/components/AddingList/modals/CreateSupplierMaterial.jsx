import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchMaterial, createSupplier } from '../../../http/materialsApi';
import { fetchSuppliers } from '../../../http/supplierApi';

const defaultValue = { supplier: '' };
const defaultValid = {
  supplier: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'supplier') result.supplier = value.supplier;
  }
  return result;
};

const CreateSupplierMaterial = (props) => {
  const { id, show, setShow, setChange } = props;
  const [suppliers, setSuppliers] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      Promise.all([fetchMaterial(id), fetchSuppliers()])
        .then(([materialData, suppliersData]) => {
          const prod = {
            supplierId: materialData.supplierId,
          };
          setValue(prod);
          setValid(isValid(prod));
          setSuppliers(suppliersData);
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

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.supplier) {
      const data = new FormData();
      data.append('supplierId', value.supplier);
      setIsLoading(true);
      createSupplier(id, data)
        .then((data) => {
          const prod = {
            supplier: data.supplier,
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          setShow(false);
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
        <Modal.Title>Добавить поставщика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
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

export default CreateSupplierMaterial;
