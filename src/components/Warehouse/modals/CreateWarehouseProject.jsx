import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { getAllActiveWarehouseAssortement } from '../../../http/warehouseAssortmentApi';
import { createProjectWarehouse } from '../../../http/projectWarehouseApi';

const defaultValue = {
  warehouse_assortement: '',
  warehouse_assortement_name: '',
  quantity: '',
  quantity_stat: '',
};
const defaultValid = {
  warehouse_assortement: null,
  warehouse_assortement_name: null,
  quantity: null,
  quantity_stat: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'warehouse_assortement')
      result.warehouse_assortement = value.warehouse_assortement.trim() !== '';
    if (key === 'warehouse_assortement_name')
      result.warehouse_assortement_name = value.warehouse_assortement_name.trim() !== '';
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
    if (key === 'quantity_stat') result.quantity_stat = value.quantity_stat.trim() !== '';
  }
  return result;
};

const CreateWarehouseProject = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [warehouseDetails, setWarehouseDetails] = React.useState([]); // Исправлено: null на []
  const [selectedWarehouseDetails, setSelectedWarehouseDetails] = React.useState([]);

  React.useEffect(() => {
    if (show) {
      getAllActiveWarehouseAssortement().then((data) => setWarehouseDetails(data || []));
    }
  }, [show]);

  const handleInputChange = (event) => {
    // Валидация только для поля quantity (должны быть только цифры)
    if (event.target.name === 'quantity') {
      const regex = /^[0-9]*$/;
      if (regex.test(event.target.value) || event.target.value === '') {
        const newValue = { ...value, [event.target.name]: event.target.value };
        setValue(newValue);
        setValid(isValid(newValue));
      }
    } else {
      const newValue = { ...value, [event.target.name]: event.target.value };
      setValue(newValue);
      setValid(isValid(newValue));
    }
  };

  const handleAddWarehouseDetail = () => {
    // Проверяем, что все обязательные поля заполнены
    if (value.warehouse_assortement && value.warehouse_assortement_name && value.quantity) {
      const newDetail = {
        warehouse_assortement_id: value.warehouse_assortement, // Исправлено: было warehouse_assortement
        warehouse_assortement_name: value.warehouse_assortement_name,
        quantity: value.quantity,
      };
      setSelectedWarehouseDetails((prev) => [...prev, newDetail]);
      setValue(defaultValue);
      setValid(defaultValid);
    } else {
      // Можно добавить уведомление пользователю
      alert('Пожалуйста, заполните все поля');
    }
  };

  const handleSaveDetails = async () => {
    if (selectedWarehouseDetails.length === 0) {
      alert('Нет деталей для сохранения');
      return;
    }

    try {
      // Создаем массив промисов для всех запросов
      const promises = selectedWarehouseDetails.map((detail) => {
        const formData = new FormData();
        formData.append('quantity', detail.quantity.trim());
        formData.append('quantity_stat', detail.quantity.trim());
        formData.append('warehouse_assortement_name', detail.warehouse_assortement_name);
        formData.append('warehouse_assortement_id', detail.warehouse_assortement_id); // Исправлено: было warehouse_assortement
        formData.append('projectId', projectId);

        return createProjectWarehouse(formData);
      });

      // Ждем выполнения всех запросов
      await Promise.all(promises);

      // Сбрасываем состояние после успешного сохранения
      setSelectedWarehouseDetails([]);
      setShow(false);
      setChange((state) => !state);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(error.response?.data?.message || 'Произошла ошибка при сохранении');
    }
  };

  const handleDetailChange = (e) => {
    const warehouse_assortement_id = e.target.value;
    const warehouse_assortement_name = e.target.options[e.target.selectedIndex].text;

    const newValue = {
      ...value,
      warehouse_assortement: warehouse_assortement_id,
      warehouse_assortement_name: warehouse_assortement_name,
    };

    setValue(newValue);
    setValid(isValid(newValue));
  };

  const handleRemoveWarehouseDetail = (index) => {
    setSelectedWarehouseDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllWarehouseDetails = () => {
    setSelectedWarehouseDetails([]);
  };

  // Закрытие модалки и сброс состояния
  const handleClose = () => {
    setValue(defaultValue);
    setValid(defaultValid);
    setSelectedWarehouseDetails([]);
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Select
                name="warehouse_assortement"
                value={value.warehouse_assortement}
                onChange={handleDetailChange}
                isValid={valid.warehouse_assortement === true}
                isInvalid={valid.warehouse_assortement === false}>
                <option value="">Детали</option>
                {warehouseDetails
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Control
                name="quantity"
                value={value.quantity}
                onChange={handleInputChange}
                isValid={valid.quantity === true}
                isInvalid={valid.quantity === false}
                placeholder="Количество деталей"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Button variant="dark" onClick={handleAddWarehouseDetail}>
                Добавить
              </Button>
            </Col>
          </Row>

          {/* Список выбранных деталей */}
          {selectedWarehouseDetails.map((warehouseDetail, index) => (
            <Row key={index} className="mb-2 align-items-center">
              <Col xs={5}>
                <Form.Control disabled value={warehouseDetail.warehouse_assortement_name || ''} />
              </Col>
              <Col xs={3}>
                <Form.Control disabled value={warehouseDetail.quantity || ''} />
              </Col>
              <Col xs={4}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveWarehouseDetail(index)}>
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}

          {selectedWarehouseDetails.length > 0 && (
            <Row className="mt-3">
              <Col>
                <Button variant="dark" className="me-2" onClick={handleSaveDetails}>
                  Сохранить все детали ({selectedWarehouseDetails.length})
                </Button>
                <Button variant="outline-dark" onClick={handleRemoveAllWarehouseDetails}>
                  Удалить все
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateWarehouseProject;
