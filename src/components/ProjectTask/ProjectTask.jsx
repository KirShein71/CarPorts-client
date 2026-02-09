import React from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import {
  getAllTaskForProject,
  deleteTask,
  updateActiveProjectTask,
} from '../../http/projectTaskApi';
import CreateProjectTask from './modals/CreateProjectTask';
import UpdateProjectTask from './modals/UpdateProjectTask';

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
          <Table bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Наименование</th>
                <th>Текст</th>
                <th>Срок</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projectTasks
                .sort((a, b) => a.number - b.number)
                .map((projectTask) => (
                  <tr key={projectTask.id}>
                    <td onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                      {projectTask.number}
                    </td>
                    <td onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                      {projectTask.name}
                    </td>
                    <td onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                      {projectTask.note}
                    </td>
                    <td onClick={() => handleOpenModalUpdateProjectTask(projectTask.id)}>
                      {projectTask.term}
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
                    <td onClick={() => handleDeleteProjectTask(projectTask.id)}>
                      <img src="../img/delete.png" alt="Удалить" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <button onClick={() => handleOpenModalCreateProjectTask()} className="project-task__button">
          Добавить
        </button>
      </div>
    </div>
  );
}

export default ProjectTask;
