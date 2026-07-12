import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { getAllActiveWarehouseAssortement } from '../../../http/warehouseAssortmentApi';
import { createWarehouseDetails } from '../../../http/addWarehouseApi';

const defaultValue = {
  warehouse_assortement: '',
  warehouse_assortement_name: '',
  quantity: '',
  unit: 'шт', // Добавляем единицу измерения
  date: '',
};
const defaultValid = {
  warehouse_assortement: null,
  warehouse_assortement_name: null,
  quantity: null,
  unit: null,
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
    if (key === 'unit') result.unit = value.unit !== '';
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
    const regex = /^[0-9]*\.?[0-9]*$/; // Разрешаем десятичные дроби для кг
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleUnitChange = (event) => {
    setValue({ ...value, unit: event.target.value });
    setValid(isValid({ ...value, unit: event.target.value }));
  };

  const handleAddWarehouseDetail = () => {
    // Проверяем, что все обязательные поля заполнены
    if (
      value.warehouse_assortement &&
      value.warehouse_assortement_name &&
      value.quantity &&
      value.unit
    ) {
      // Находим выбранную деталь для получения веса
      const selectedDetail = warehouseDetails.find(
        (item) => item.id === parseInt(value.warehouse_assortement),
      );

      let finalQuantity = parseFloat(value.quantity);

      // Если единица измерения "кг", пересчитываем в штуки
      if (value.unit === 'кг' && selectedDetail && selectedDetail.weight) {
        // weight в граммах, переводим в кг и делим
        const weightInKg = selectedDetail.weight / 1000;
        finalQuantity = Math.round(value.quantity / weightInKg);
      } else {
        finalQuantity = parseInt(value.quantity, 10);
      }

      const newDetail = {
        warehouse_assortement_id: value.warehouse_assortement,
        warehouse_assortement_name: value.warehouse_assortement_name,
        quantity: finalQuantity,
        original_quantity: value.quantity, // Сохраняем исходное значение для отображения
        unit: value.unit,
      };
      setSelectedWarehouseDetails((prev) => [...prev, newDetail]);

      // Сбрасываем форму
      setValue({ ...defaultValue, unit: 'шт' });
      setValid(defaultValid);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  const handleSaveDetails = () => {
    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const data = selectedWarehouseDetails.map((detail) => {
      const formData = new FormData();
      formData.append('quantity', detail.quantity);
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
    const selectedOption = e.target.options[e.target.selectedIndex];
    const warehouse_assortement_name = selectedOption.text;

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
        <Form autoComplete="off">
          <Col>
            <Form.Select
              name="warehouse_assortement"
              value={value.warehouse_assortement}
              onChange={handleDetailChange}
              isValid={valid.warehouse_assortement === true}
              isInvalid={valid.warehouse_assortement === false}>
              <option value="">Выберите деталь</option>
              {warehouseDetails &&
                warehouseDetails
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.weight ? `(вес: ${item.weight}г)` : ''}
                    </option>
                  ))}
            </Form.Select>
          </Col>

          <Row className="mb-3 mt-4">
            <Col md={6}>
              <Form.Select
                name="unit"
                value={value.unit}
                onChange={handleUnitChange}
                isValid={valid.unit === true}
                isInvalid={valid.unit === false}
                className="mb-3">
                <option value="шт">Штуки (шт)</option>
                <option value="кг">Килограммы (кг)</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Control
                name="quantity"
                value={value.quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.quantity === true}
                isInvalid={valid.quantity === false}
                placeholder={value.unit === 'шт' ? 'Количество (шт)' : 'Вес (кг)'}
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
                  <Form.Control
                    disabled
                    value={
                      detail.unit === 'кг'
                        ? `${detail.original_quantity} кг (${detail.quantity} шт)`
                        : `${detail.quantity} шт`
                    }
                    className="mb-3"
                  />
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
