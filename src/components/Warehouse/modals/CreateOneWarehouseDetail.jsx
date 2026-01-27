import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createProjectWarehouse } from '../../../http/projectWarehouseApi';

const defaultValue = {
  quantity: '',
  quantity_stat: '',
};
const defaultValid = {
  quantity: null,
  quantity_stat: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
    if (key === 'quantity_stat') result.quantity_stat = value.quantity_stat.trim() !== '';
  }
  return result;
};

const CreateOneWarehouseDetail = (props) => {
  const { show, setShow, setChange, warehouseAssortementId, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleSaveDetail = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.quantity) {
      const data = new FormData();
      data.append('quantity', value.quantity.trim());
      data.append('quantity_stat', value.quantity.trim());
      data.append('warehouse_assortement_id', warehouseAssortementId);
      data.append('projectId', projectId);

      setIsLoading(true);

      createProjectWarehouse(data)
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
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSaveDetail}>
          <Row className="mb-3 mt-4">
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

export default CreateOneWarehouseDetail;
