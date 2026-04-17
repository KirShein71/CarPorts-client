import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { getAllActiveWarehouseAssortement } from '../../../http/warehouseAssortmentApi';
import { createWarehouseDetails } from '../../../http/addWarehouseApi';

const defaultValue = {
  warehouse_assortement: '',
  warehouse_assortement_name: '',
  quantity: '',
  date: '',
};
const defaultValid = {
  warehouse_assortement: null,
  warehouse_assortement_name: null,
  quantity: null,
  date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'warehouse_assortement')
      result.warehouse_assortement = value.warehouse_assortement.trim() !== '';
    if (key === 'warehouse_assortement_name')
      result.warehouse_assortement_name = value.warehouse_assortement_name.trim() !== '';
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
    if (key === 'date') result.date = value.date.trim() !== '';
  }
  return result;
};

const AddWarehouseDetail = (props) => {
  const { show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [warehouseDetails, setWarehouseDetails] = React.useState([]);
  const [selectedWarehouseDetails, setSelectedWarehouseDetails] = React.useState([]);

  React.useEffect(() => {
    if (show) {
      getAllActiveWarehouseAssortement().then((data) => setWarehouseDetails(data));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleAddWarehouseDetail = () => {
    // Проверяем, что все обязательные поля заполнены
    if (value.warehouse_assortement && value.warehouse_assortement_name && value.quantity) {
      const newDetail = {
        warehouse_assortement_id: value.warehouse_assortement,
        warehouse_assortement_name: value.warehouse_assortement_name,
        quantity: value.quantity,
      };
      setSelectedWarehouseDetails((prev) => [...prev, newDetail]);

      // Сбрасываем форму
      setValue(defaultValue);
      setValid(defaultValid);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  const handleSaveDetails = () => {
    const newData = selectedWarehouseDetails.filter((detail) => !detail.id);

    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const data = newData.map((detail) => {
      const formData = new FormData();
      formData.append('quantity', detail.quantity.trim());
      formData.append('warehouse_assortement_name', detail.warehouse_assortement_name);
      formData.append('warehouse_assortement_id', detail.warehouse_assortement_id);
      formData.append('date', getCurrentDate());
      return formData;
    });

    Promise.all(data.map(createWarehouseDetails))
      .then(() => {
        setSelectedWarehouseDetails([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleDetailChange = (e) => {
    const warehouse_assortement_id = e.target.value;
    const warehouse_assortement_name = e.target.options[e.target.selectedIndex].text;
    setValue((prevValue) => ({
      ...prevValue,
      warehouse_assortement: warehouse_assortement_id,
      warehouse_assortement_name: warehouse_assortement_name,
      date: new Date().toISOString().slice(0, 10),
    }));
  };

  const handleRemoveDetail = (index) => {
    setSelectedWarehouseDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllDetails = () => {
    setSelectedWarehouseDetails([]);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Col>
            <Form.Select
              name="warehouse_assortement"
              value={value.warehouse_assortement}
              onChange={handleDetailChange}
              isValid={valid.warehouse_assortement === true}
              isInvalid={valid.warehouse_assortement === false}>
              <option value="">Детали</option>
              {warehouseDetails &&
                warehouseDetails
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
            </Form.Select>
          </Col>
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
          <Col>
            <Button variant="dark" className="mb-3" onClick={handleAddWarehouseDetail}>
              Добавить
            </Button>
          </Col>
          {selectedWarehouseDetails.map((detail, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    disabled
                    value={detail.warehouse_assortement_name}
                    className="mb-3"
                  />
                </Col>
                <Col>
                  <Form.Control disabled value={detail.quantity} className="mb-3" />
                </Col>
                <Col>
                  <Button variant="dark" onClick={() => handleRemoveDetail(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedWarehouseDetails.length > 0 && (
            <>
              <Button variant="dark" className="me-3" onClick={handleSaveDetails}>
                Сохранить все детали
              </Button>
              <Button variant="dark" onClick={handleRemoveAllDetails}>
                Удалить все
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddWarehouseDetail;
