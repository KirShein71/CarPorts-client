import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import {
  getAllTaskForProject,
  deleteTask,
  updateActiveProjectTask,
  createTasksFromTemplates,
} from '../../http/projectTaskApi';
import CreateProjectTask from './modals/CreateProjectTask';
import UpdateProjectTask from './modals/UpdateProjectTask';
import CreateExecutor from './modals/CreateExecutor';

import './style.scss';

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

function ProjectTask(props) {
  const { projectId } = props;
  const [projectTasks, setProjectTasks] = React.useState([]);
  const [projectTaskId, setProjectTaskId] = React.useState(null);
  const [modalCreateProjectTask, setModalCreateProjectTask] = React.useState(false);
  const [modalUpdateProjectTask, setModalUpdateProjectTask] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteTaskModal, setDeleteTaskModal] = React.useState(false);
  const [projectTaskToDelete, setProjectTaskToDelete] = React.useState(null);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [modalCreateExecutor, setModalCreateExecutor] = React.useState(false);

  React.useEffect(() => {
    getAllTaskForProject(projectId).then((data) => {
      setProjectTasks(data);
    });
  }, [change]);

  const handleOpenModalCreateProjectTask = () => {
    setModalCreateProjectTask(true);
  };

  const handleOpenModalUpdateProjectTask = (id) => {
    setProjectTaskId(id);
    setModalUpdateProjectTask(true);
  };

  const handleOpenModalCreateExecutor = (id) => {
    setProjectTaskId(id);
    setModalCreateExecutor(true);
  };

  const handleInactiveProjectTask = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('done', 'false');

    updateActiveProjectTask(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleActiveProjectTask = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('done', 'true');

    updateActiveProjectTask(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleCreateFromTemplates = () => {
    createTasksFromTemplates(projectId)
      .then(() => {
        setChange((prev) => !prev); // обновляем список задач
      })
      .catch((error) => {
        alert(error.response?.data?.message || 'Ошибка при создании задач из шаблонов');
      });
  };

  const handleDeleteProjectTask = (id) => {
    const projectTask = projectTasks.find((item) => item.id === id);
    setProjectTaskToDelete(projectTask);
    setDeleteTaskModal(true);
  };

  const confirmDeleteProjectTask = () => {
    if (projectTaskToDelete) {
      deleteTask(projectTaskToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteTaskModal(false);
          setProjectTaskToDelete(null);
        })
        .catch((error) => {
          setDeleteTaskModal(false);
          setProjectTaskToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDeleteProjectTask = () => {
    setDeleteTaskModal(false);
    setProjectTaskToDelete(null);
  };

  return (
    <div className="project-task">
      <CreateProjectTask
        show={modalCreateProjectTask}
        setShow={setModalCreateProjectTask}
        setChange={setChange}
        project={projectId}
      />
      <CreateExecutor
        show={modalCreateExecutor}
        setShow={setModalCreateExecutor}
        setChange={setChange}
        id={projectTaskId}
      />
      <UpdateProjectTask
        show={modalUpdateProjectTask}
        setShow={setModalUpdateProjectTask}
        setChange={setChange}
        id={projectTaskId}
      />
      <Modal
        show={deleteTaskModal}
        onHide={cancelDeleteProjectTask}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>Вы уверены, что хотите удалить задачу?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDeleteProjectTask}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDeleteProjectTask}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="project-task__content">
        <div className="project-task__table-container">
          <div className="project-task__table-wrapper">
            <Table bordered hover size="sm" className="mt-3">
              <thead>
                <tr>
                  <th className="project-task__th">Номер</th>
                  <th className="project-task__th mobile">Наименование</th>
                  <th className="project-task__th">Текст</th>
                  <th className="project-task__th term">Срок</th>
                  <th className="project-task__th executor">Исполнитель</th>
                  <th className="project-task__th done"></th>
                  <th className="project-task__th"></th>
                </tr>
              </thead>
              <tbody>
                {projectTasks
                  .sort((a, b) => a.number - b.number)
                  .map((projectTask) => (
                    <tr key={projectTask.id}>
                      <td
                        className="project-task__td-number"
                        onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                        {projectTask.number}
                      </td>
                      <td
                        className="project-task__td mobile"
                        onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                        {projectTask.name}
                      </td>
                      <td
                        className="project-task__td-note"
                        onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                        {projectTask.note}
                      </td>
                      <td
                        className="project-task__td-term"
                        onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                        {projectTask.term}
                      </td>
                      <td
                        className="project-task__td-executor"
                        onClick={() => handleOpenModalCreateExecutor(projectTask.id)}>
                        {projectTask.executor_name}
                      </td>
                      {projectTask.done === 'true' ? (
                        <td
                          className="project-task__td-done"
                          onClick={() => handleInactiveProjectTask(projectTask.id)}>
                          <img src="../img/done.png" alt="Сделано" />
                        </td>
                      ) : (
                        <td
                          className="project-task__td-done"
                          onClick={() => handleActiveProjectTask(projectTask.id)}></td>
                      )}
                      <td
                        className="project-task__td-delete"
                        onClick={() => handleDeleteProjectTask(projectTask.id)}>
                        <img src="../img/delete.png" alt="Удалить" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="project-task__buttons">
          <button
            onClick={() => handleOpenModalCreateProjectTask()}
            className="project-task__buttons-added">
            Добавить
          </button>
          {projectTasks.length > 0 ? (
            ''
          ) : (
            <button onClick={handleCreateFromTemplates} className="project-task__buttons-templates">
              Добавить из шаблона
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectTask;
