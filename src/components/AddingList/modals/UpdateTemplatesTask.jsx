import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateTemplatesTask, fetchOneTemplatesTask } from '../../../http/templatesTaskApi';
import { getAllManagerSale } from '../../../http/managerSaleApi';
import { getAllManagerProject } from '../../../http/managerProjectApi';

const defaultValue = {
  number: '',
  name: '',
  note: '',
  term: '',
  executor: '',
  executor_name: '',
};
const defaultValid = {
  number: null,
  name: null,
  note: null,
  term: null,
  executor: null,
  executor_name: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'term') result.term = value.term.trim() !== '';
    if (key === 'executor') result.executor = value.executor.trim() !== '';
    if (key === 'executor_name') result.executor_name = value.executor_name.trim() !== '';
  }
  return result;
};

const UpdateTemplatesTask = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [combinedManagers, setCombinedManagers] = React.useState([]);

  // Сброс формы при открытии/закрытии модального окна
  React.useEffect(() => {
    if (!show) {
      setValue(defaultValue);
      setValid(defaultValid);
    }
  }, [show]);

  React.useEffect(() => {
    if (show && id) {
      fetchOneTemplatesTask(id)
        .then((data) => {
          const prod = {
            name: data.name?.toString() || '',
            note: data.note?.toString() || '',
            term: data.term?.toString() || '',
            number: data.number?.toString() || '',
            executor: data.executor?.toString() || '',
            executor_name: data.executor_name?.toString() || '',
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
  }, [show, id]);

  React.useEffect(() => {
    const fetchExecutorData = async () => {
      try {
        const [managerSales, managerProjects] = await Promise.all([
          getAllManagerSale(),
          getAllManagerProject(),
        ]);

        // Объединяем менеджеров из обоих источников
        const combined = [
          ...(managerSales || []).map((manager) => ({
            id: manager.id?.toString(),
            name:
              manager.name ||
              `${manager.first_name || ''} ${manager.last_name || ''}`.trim() ||
              'Менеджер по продажам',
            type: 'sale',
          })),
          ...(managerProjects || []).map((manager) => ({
            id: manager.id?.toString(),
            name:
              manager.name ||
              `${manager.first_name || ''} ${manager.last_name || ''}`.trim() ||
              'Менеджер по проектам',
            type: 'project',
          })),
        ].filter((manager) => manager.id);

        setCombinedManagers(combined);
      } catch (error) {
        console.error('Ошибка при загрузке списка менеджеров:', error);
        alert('Не удалось загрузить список менеджеров');
      }
    };

    if (show) {
      fetchExecutorData();
    }
  }, [show]);

  const handleInputChange = (event) => {
    const { name, value: inputValue } = event.target;
    setValue((prev) => {
      const newValue = { ...prev, [name]: inputValue };
      setValid(isValid(newValue));
      return newValue;
    });
  };

  const handleManagerSelect = (event) => {
    const selectedName = event.target.value;
    const selectedManager = combinedManagers.find((manager) => manager.name === selectedName);

    setValue((prev) => {
      const newValue = {
        ...prev,
        executor: selectedManager?.id || '',
        executor_name: selectedManager?.name || '',
      };
      setValid(isValid(newValue));
      return newValue;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    // Проверяем все обязательные поля
    const allFieldsValid = Object.values(correct).every((field) => field === true);

    if (allFieldsValid) {
      const data = new FormData();
      data.append('number', value.number.trim());
      data.append('name', value.name.trim());
      data.append('note', value.note.trim());
      data.append('term', value.term.trim());
      data.append('executor', value.executor.trim());
      data.append('executor_name', value.executor_name.trim());

      setIsLoading(true);

      try {
        await updateTemplatesTask(id, data);
        setChange((state) => !state);
        setShow(false);
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          console.log('An error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Пожалуйста, заполните все обязательные поля');
    }
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
        <Modal.Title>Редактирование шаблона</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="number"
                value={value.number || ''}
                onChange={handleInputChange}
                isValid={valid.number === true}
                isInvalid={valid.number === false}
                placeholder="Номер"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name || ''}
                onChange={handleInputChange}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                as="textarea"
                name="note"
                value={value.note || ''}
                onChange={handleInputChange}
                isValid={valid.note === true}
                isInvalid={valid.note === false}
                placeholder="Текст"
                style={{ minHeight: '200px', width: '100%' }}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="term"
                value={value.term || ''}
                onChange={handleInputChange}
                isValid={valid.term === true}
                isInvalid={valid.term === false}
                placeholder="Срок"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Select
                id="executor-select"
                value={value.executor_name || ''}
                onChange={handleManagerSelect}
                isInvalid={valid.executor_name === false}
                disabled={isLoading}
                aria-label="Выберите исполнителя">
                <option value="">Выберите исполнителя</option>
                {combinedManagers.map((manager) => (
                  <option key={`${manager.type}-${manager.name}`} value={manager.name}>
                    {manager.name} (
                    {manager.type === 'sale' ? 'Менеджер по продажам' : 'Менеджер по проектам'})
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

export default UpdateTemplatesTask;
