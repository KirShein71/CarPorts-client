import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createWarehouseDetails } from '../../../http/addWarehouseApi';
import { getAllActiveWarehouseAssortement } from '../../../http/warehouseAssortmentApi';

const defaultValue = {
  quantity: '',
  unit: 'шт',
};
const defaultValid = {
  quantity: null,
  unit: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
    if (key === 'unit') result.unit = value.unit !== '';
  }
  return result;
};

const AddOneWarehouseDetail = (props) => {
  const { show, setShow, setChange, warehouseAssortementId, date } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [warehouseDetail, setWarehouseDetail] = React.useState(null);

  React.useEffect(() => {
    if (show && warehouseAssortementId) {
      // Получаем информацию о детали для получения веса
      getAllActiveWarehouseAssortement()
        .then((data) => {
          const detail = data.find((item) => item.id === parseInt(warehouseAssortementId));
          setWarehouseDetail(detail);
        })
        .catch((error) => console.error('Ошибка загрузки детали:', error));
    }
  }, [show, warehouseAssortementId]);

  const handleInputChange = (event) => {
    let regex;
    if (value.unit === 'кг') {
      // Для кг разрешаем десятичные дроби с точкой
      regex = /^[0-9]*\.?[0-9]*$/;
    } else {
      // Для шт только целые числа
      regex = /^[0-9]*$/;
    }

    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleUnitChange = (event) => {
    setValue({ ...value, unit: event.target.value, quantity: '' });
    setValid(isValid({ ...value, unit: event.target.value, quantity: '' }));
  };

  const handleSaveDetail = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    if (correct.quantity) {
      let finalQuantity = parseFloat(value.quantity);

      // Если единица измерения "кг", пересчитываем в штуки
      if (value.unit === 'кг' && warehouseDetail && warehouseDetail.weight) {
        // weight в граммах, переводим в кг и делим
        const weightInKg = warehouseDetail.weight / 1000;
        finalQuantity = Math.round(parseFloat(value.quantity) / weightInKg);
      } else {
        finalQuantity = parseInt(value.quantity, 10);
      }

      const data = new FormData();
      data.append('quantity', finalQuantity);
      data.append('warehouse_assortement_id', warehouseAssortementId);
      data.append('date', date);

      setIsLoading(true);
      createWarehouseDetails(data)
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

  // Форматируем отображение веса
  const getWeightDisplay = () => {
    if (warehouseDetail && warehouseDetail.weight) {
      const weightInKg = warehouseDetail.weight / 1000;
      return ` (вес: ${weightInKg} кг / ${warehouseDetail.weight} г)`;
    }
    return '';
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
        <Modal.Title>Добавить деталь{warehouseDetail && `: ${warehouseDetail.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSaveDetail}>
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
                onChange={handleInputChange}
                isValid={valid.quantity === true}
                isInvalid={valid.quantity === false}
                placeholder={value.unit === 'шт' ? 'Количество (шт)' : 'Вес (кг)'}
              />
            </Col>
          </Row>

          {warehouseDetail && warehouseDetail.weight && (
            <Row className="mb-3">
              <Col>
                <Form.Text className="text-muted">
                  Вес одной детали: {warehouseDetail.weight / 1000} кг ({warehouseDetail.weight} г)
                  <br />
                  {value.unit === 'кг' && value.quantity && (
                    <span>
                      Результат: ~
                      {Math.round(parseFloat(value.quantity) / (warehouseDetail.weight / 1000))} шт
                    </span>
                  )}
                </Form.Text>
              </Col>
            </Row>
          )}

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

export default AddOneWarehouseDetail;
