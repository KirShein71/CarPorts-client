import React from 'react';
import CreateTemplatesTask from './modals/CreateTemplatesTask';
import UpdateTemplatesTask from './modals/UpdateTemplatesTask';
import { Table, Button, Spinner, Modal } from 'react-bootstrap';
import {
  fetchAllTemplatesTasks,
  updateActiveTemplatesTask,
  deleteTemplatesTask,
} from '../../http/templatesTaskApi';

const defaultValue = { active: '' };
const defaultValid = {
  active: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'active') result.active = value.active.trim() !== '';
  }
  return result;
};

function TemplatesTask() {
  const [templatesTasks, setTemplatesTasks] = React.useState([]);
  const [templatesTask, setTemplatesTask] = React.useState(null);
  const [createTemplatesTaskModal, setCreateTemplatesTaskModal] = React.useState(false);
  const [updateTemplatesTaskModal, setUpdateTemplatesTaskModal] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [templatesTaskToDelete, setTemplatesTaskToDelete] = React.useState(null);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    fetchAllTemplatesTasks()
      .then((data) => setTemplatesTasks(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    const templatesTask = templatesTasks.find((item) => item.id === id);
    setTemplatesTaskToDelete(templatesTask);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (templatesTaskToDelete) {
      deleteTemplatesTask(templatesTaskToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setTemplatesTaskToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setTemplatesTaskToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setTemplatesTaskToDelete(null);
  };

  const handleCreateTemplatesTask = () => {
    setCreateTemplatesTaskModal(true);
  };

  const handleUpdateTemplatesTask = (id) => {
    setTemplatesTask(id);
    setUpdateTemplatesTaskModal(true);
  };

  const handleInactiveTemplatesTask = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'false');

    updateActiveTemplatesTask(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleActiveTemplatesTask = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'true');

    updateActiveTemplatesTask(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="templates-task">
      <h2 className="templates-task__title">Шаблоны задач</h2>
      <CreateTemplatesTask
        show={createTemplatesTaskModal}
        setShow={setCreateTemplatesTaskModal}
        setChange={setChange}
      />
      <UpdateTemplatesTask
        show={updateTemplatesTaskModal}
        setShow={setUpdateTemplatesTaskModal}
        setChange={setChange}
        id={templatesTask}
      />
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>Вы уверены, что хотите удалить шаблон?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="dark" onClick={handleCreateTemplatesTask} className="mt-3">
        Создать шаблон
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Наименование</th>
              <th>Текст</th>
              <th>Срок</th>
              <th>Исполнитель</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {templatesTasks
              .sort((a, b) => a.number - b.number)
              .map((templatesTask) => (
                <tr key={templatesTask.id}>
                  <td>{templatesTask.number}</td>
                  <td>{templatesTask.name}</td>
                  <td>{templatesTask.note}</td>
                  <td>{templatesTask.term}</td>
                  <td>{templatesTask.executor_name}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handleUpdateTemplatesTask(templatesTask.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    {templatesTask.active === 'true' ? (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/active.png"
                        alt="active"
                        onClick={() => handleInactiveTemplatesTask(templatesTask.id)}
                      />
                    ) : (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/inactive.png"
                        alt="inactive"
                        onClick={() => handleActiveTemplatesTask(templatesTask.id)}
                      />
                    )}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(templatesTask.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default TemplatesTask;
