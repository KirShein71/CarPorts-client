import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import {
  updateTemplatesTask,
  fetchOneTemplatesTask,
  fetchAllTemplatesTasks,
} from '../../../http/templatesTaskApi';
import { getAllManagerSale } from '../../../http/managerSaleApi';
import { getAllManagerProject } from '../../../http/managerProjectApi';

const defaultValue = {
  number: '',
  name: '',
  note: '',
  term: '',
  active: '',
  executor: '',
  executor_name: '',
  previous_task: '',
  term_integer: '',
};
const defaultValid = {
  number: null,
  name: null,
  note: null,
  term: null,
  active: null,
  executor: null,
  executor_name: null,
  previous_task: null,
  term_integer: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'number') result.number = value.number.trim() !== '';
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'term') result.term = value.term.trim() !== '';
    if (key === 'executor') result.executor = value.executor;
    if (key === 'executor_name') result.executor_name = value.executor_name;
    if (key === 'previous_task') result.previous_task = value.previous_task;
    if (key === 'term_integer') result.term_integer = value.term_integer.trim() !== '';
  }
  return result;
};

const UpdateTemplatesTask = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [combinedManagers, setCombinedManagers] = React.useState([]);
  const [templatesTasks, setTemplatesTasks] = React.useState([]);

  React.useEffect(() => {
    const fetchExecutorData = async () => {
      try {
        const [managerSales, managerProjects, templatesTasks] = await Promise.all([
          getAllManagerSale(),
          getAllManagerProject(),
          fetchAllTemplatesTasks(),
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
        setTemplatesTasks(templatesTasks);
      } catch (error) {
        console.error('Ошибка при загрузке списка менеджеров:', error);
        alert('Не удалось загрузить список менеджеров');
      }
    };

    if (show) {
      fetchExecutorData();
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
            previous_task: data.previous_task?.toString() || '',
            term_integer: data.term_integer?.toString() || '',
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

  const handleTemplatesTaskSelect = (event) => {
    const selectedTaskNumber = event.target.value;

    setValue((prev) => {
      const newValue = {
        ...prev,
        previous_task: selectedTaskNumber,
      };
      return newValue;
    });

    setValid((prev) => ({
      ...prev,
      previous_task: isValid({ ...value, previous_task: selectedTaskNumber }).previous_task,
    }));
  };

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('number', value.number.trim());
    data.append('name', value.name.trim());
    data.append('note', value.note.trim());
    data.append('term', value.term.trim());
    data.append('executor', value.executor.trim());
    data.append('executor_name', value.executor_name.trim());
    data.append('previous_task', value.previous_task);
    data.append('term_integer', value.term_integer);

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
              <Form.Select
                id="previous-task-select"
                value={value.previous_task || ''}
                onChange={handleTemplatesTaskSelect}
                isInvalid={valid.previous_task === false}
                disabled={isLoading}
                aria-label="Выберите задачу, после которой должна выполняться создаваемая задача">
                <option value="">
                  Выберите задачу, после которой должна выполняться создаваемая задача
                </option>
                {templatesTasks
                  .sort((a, b) => a.number - b.number)
                  .map((tempTask) => (
                    <option key={`${tempTask.number}-${tempTask.name}`} value={tempTask.number}>
                      {tempTask.number} - {tempTask.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="term"
                value={value.term}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.term === true}
                isInvalid={valid.term === false}
                placeholder="Срок(описание)"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="term_integer"
                value={value.term_integer}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.term_integer === true}
                isInvalid={valid.term_integer === false}
                placeholder="Срок(через сколько дней после завершения предедущей задачи)"
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
