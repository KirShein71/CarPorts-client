import React from 'react';
import { getAllManagerProject, deleteManagerProject } from '../../../http/managerProjectApi';
import { Button, Spinner, Table } from 'react-bootstrap';
import CreateManagerProject from './modals/CreateManagerProject';
import UpdatePasswordManagerProject from './modals/UpdatePasswordManagerProject';

function ManagerProject() {
  const [managerProjects, setManagerProjects] = React.useState([]);
  const [managerProject, setManagerProject] = React.useState(null);
  const [openCreateManagerProjectModal, setOpenCreateManagerProjectModal] = React.useState(false);
  const [openUpdatePasswordManagerProject, setOpenUpdatePasswordManagerProject] =
    React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    getAllManagerProject()
      .then((data) => setManagerProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleCreateManagerProject = () => {
    setOpenCreateManagerProjectModal(true);
  };

  const handeUpdateManagerProjectPassword = (id) => {
    setManagerProject(id);
    setOpenUpdatePasswordManagerProject(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить сотрудника?');
    if (confirmed) {
      deleteManagerProject(id)
        .then((data) => {
          setChange(!change);
          alert(`Сотрудник «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="manager-project">
      <CreateManagerProject
        show={openCreateManagerProjectModal}
        setShow={setOpenCreateManagerProjectModal}
        setChange={setChange}
      />
      <UpdatePasswordManagerProject
        show={openUpdatePasswordManagerProject}
        setShow={setOpenUpdatePasswordManagerProject}
        setChange={setChange}
        id={managerProject}
      />
      <div className="manager-sale__content">
        <h2 className="manager-sale__title">Менеджеры проектов</h2>
        <Button variant="dark" onClick={handleCreateManagerProject} className="mt-3">
          Добавить менеджера проекта
        </Button>
        <div className="table-container">
          <Table bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Имя сотрудника</th>
                <th>Телефон</th>
                <th>Пароль</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {managerProjects?.map((managerProject) => (
                <tr key={managerProject.id}>
                  <td>{managerProject.name}</td>
                  <td>{managerProject.phone}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handeUpdateManagerProjectPassword(managerProject.id)}>
                      {' '}
                      Изменить
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(managerProject.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ManagerProject;
