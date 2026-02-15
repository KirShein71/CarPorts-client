import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createExecutorProjectTask, getOneProjectTask } from '../../../http/projectTaskApi';
import { getAllManagerSale } from '../../../http/managerSaleApi';
import { getAllManagerProject } from '../../../http/managerProjectApi';

const defaultValue = {
  executor: '',
  executor_name: '',
};
const defaultValid = {
  executor: null,
  executor_name: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'executor') result.executor = value.executor.trim() !== '';
    if (key === 'executor_name') result.executor_name = value.executor_name.trim() !== '';
  }
  return result;
};

const CreateExecutor = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [combinedManagers, setCombinedManagers] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      getOneProjectTask(id)
        .then((data) => {
          const prod = {
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
            console.log('Ошибка при загрузке задачи:', error);
          }
        });
    }
  }, [id]);

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
        ].filter((manager) => manager.id); // Фильтруем только тех, у кого есть ID

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

  const handleManagerSelect = (event) => {
    const selectedName = event.target.value;
    const selectedManager = combinedManagers.find((manager) => manager.name === selectedName);

    if (selectedManager) {
      const newValue = {
        executor: selectedManager.id,
        executor_name: selectedManager.name,
      };
      setValue(newValue);
      setValid(isValid(newValue));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    // Проверяем, что выбраны оба поля
    if (correct.executor && correct.executor_name) {
      const data = new FormData();
      data.append('executor', value.executor.trim());
      data.append('executor_name', value.executor_name.trim());
      setIsLoading(true);

      try {
        await createExecutorProjectTask(id, data);
        setChange((state) => !state);
        setShow(false);
        setValue(defaultValue);
        setValid(defaultValid);
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert('Произошла ошибка при сохранении');
          console.log('Ошибка при сохранении исполнителя:', error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Пожалуйста, выберите исполнителя');
    }
  };

  const handleClose = () => {
    setShow(false);
    setValue(defaultValue);
    setValid(defaultValid);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name"
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Выбрать исполнителя</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col>
            <Form.Select
              id="executor-select"
              value={value.executor_name}
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
          <Row className="mt-3">
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

export default CreateExecutor;
