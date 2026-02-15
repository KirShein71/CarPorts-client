import React from 'react';
import Header from '../Header/Header';
import { getAllManagerSale } from '../../http/managerSaleApi';
import { getAllManagerProject } from '../../http/managerProjectApi';
import { updateActiveProjectTask, getAllActiveTaskProject } from '../../http/projectTaskApi';
import CreateExecutor from '../ProjectTask/modals/CreateExecutor';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';

import './style.scss';

function TaskBookComponent() {
  const { user } = React.useContext(AppContext);
  const [activeProjectTask, setActiveProjectTask] = React.useState([]);
  const [combinedManagers, setCombinedManagers] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [modalCreateExecutor, setModalCreateExecutor] = React.useState(false);
  const [projectTaskId, setProjectTaskId] = React.useState(null);
  const [selectedExecutorName, setSelectedExecutorName] = React.useState(null);
  const [openModalSelectedExecutor, setOpenModalSelectedExecutor] = React.useState(false);
  const modalExecutorRef = React.useRef();

  // Устанавливаем начальное значение фильтра при загрузке
  React.useEffect(() => {
    if (user.isAdmin) {
      console.log('Пользователь админ, показываем все задачи');
      setSelectedExecutorName(null);
    } else if (user.isManagerSale || user.isManagerProject) {
      console.log('Пользователь менеджер, устанавливаем фильтр:', user.name);
      setSelectedExecutorName(user.name);
    }
  }, [user.isAdmin, user.name, user.isManagerSale, user.isManagerProject]);

  React.useEffect(() => {
    getAllActiveTaskProject()
      .then((data) => {
        setActiveProjectTask(data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке активных задач:', error);
      });
  }, [change]);

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

    fetchExecutorData();
  }, []);

  const handleActiveProjectTask = (id) => {
    const data = new FormData();
    data.append('done', 'true');

    updateActiveProjectTask(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleOpenModalCreateExecutor = (id) => {
    setProjectTaskId(id);
    setModalCreateExecutor(true);
  };

  const hadleOpenModalSelectedExecutor = () => {
    setOpenModalSelectedExecutor(!openModalSelectedExecutor);
  };

  const handleSelectExecutor = (executorName) => {
    setSelectedExecutorName(executorName);
    setOpenModalSelectedExecutor(false);
  };

  const handleResetExecutor = () => {
    setSelectedExecutorName(null);
    setOpenModalSelectedExecutor(false);
  };

  // Функция для безопасного сравнения строк
  const compareExecutorNames = (name1, name2) => {
    if (!name1 || !name2) return false;

    // Убираем лишние пробелы и приводим к одному регистру
    const normalized1 = name1.trim().toLowerCase();
    const normalized2 = name2.trim().toLowerCase();

    return normalized1 === normalized2;
  };

  return (
    <div className="task-book">
      <CreateExecutor
        show={modalCreateExecutor}
        setShow={setModalCreateExecutor}
        setChange={setChange}
        id={projectTaskId}
      />
      <Header title={'Задачник'} />

      <div className="task-book__dropdown" ref={modalExecutorRef}>
        <button className="task-book__dropdown-executors" onClick={hadleOpenModalSelectedExecutor}>
          {selectedExecutorName ? (
            <div>
              {selectedExecutorName}
              <img src="./img/arrow-down.png" alt="arrow down" />
            </div>
          ) : (
            <div>
              {user.isAdmin ? 'Исполнитель' : user.name || 'Исполнитель'}
              <img src="./img/arrow-down.png" alt="arrow down" />
            </div>
          )}
        </button>
        {openModalSelectedExecutor && (
          <div className="task-book__dropdown-modal">
            <div className="task-book__dropdown-content">
              <div className="task-book__dropdown-items">
                <div
                  className="task-book__dropdown-item planning__dropdown-item--reset"
                  onClick={handleResetExecutor}>
                  <div>Сбросить</div>
                </div>
                {combinedManagers.map((manager) => (
                  <div key={manager.id}>
                    <div
                      className="task-book__dropdown-item"
                      onClick={() => handleSelectExecutor(manager.name)}>
                      {manager.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="task-book__content">
        {activeProjectTask
          .filter((activeTask) => {
            // Если фильтр не выбран, показываем все задачи
            if (!selectedExecutorName) {
              return true;
            }

            // Фильтруем задачи по выбранному исполнителю с безопасным сравнением
            const hasMatch = activeTask.props.some((taskProp) =>
              compareExecutorNames(taskProp.executor_name, selectedExecutorName),
            );

            return hasMatch;
          })
          .sort((a, b) => a.number - b.number)
          .map((activeTask) => (
            <div className="task-book__table-content">
              <div className="task-book__projectName">{activeTask.project.name || ''}</div>
              <div className="task-book__table-container">
                <Table bordered hover size="sm" key={activeTask.id}>
                  <thead>
                    <tr>
                      <th className="task-book__th number">Номер</th>
                      <th className="task-book__th mobile">Наименование</th>
                      <th className="task-book__th note">Текст</th>
                      <th className="task-book__th term">Срок</th>
                      <th className="task-book__th executor">Исполнитель</th>
                      <th className="task-book__th done"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTask.props
                      .filter((propsTask) => {
                        // Если фильтр не выбран, показываем все подзадачи
                        if (!selectedExecutorName) return true;

                        // Если фильтр выбран, показываем только подзадачи с нужным исполнителем
                        return compareExecutorNames(propsTask.executor_name, selectedExecutorName);
                      })
                      .map((propsTask) => (
                        <tr key={propsTask.id}>
                          <td>{propsTask.number}</td>
                          <td className="task-book__td mobile">{propsTask.name}</td>
                          <td>{propsTask.note}</td>
                          <td>{propsTask.term}</td>
                          <td
                            className="task-book__td executor"
                            onClick={() => handleOpenModalCreateExecutor(propsTask.id)}>
                            {propsTask.executor_name}
                          </td>
                          <td
                            className="project-task__td-done"
                            onClick={() => handleActiveProjectTask(propsTask.id)}></td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ))}

        {/* Показываем сообщение, если нет задач после фильтрации */}
        {activeProjectTask.filter((activeTask) => {
          if (!selectedExecutorName) return true;
          return activeTask.props.some((taskProp) =>
            compareExecutorNames(taskProp.executor_name, selectedExecutorName),
          );
        }).length === 0 &&
          activeProjectTask.length > 0 && (
            <div className="task-book__no-tasks">Нет задач для выбранного исполнителя</div>
          )}
      </div>
    </div>
  );
}

export default TaskBookComponent;
