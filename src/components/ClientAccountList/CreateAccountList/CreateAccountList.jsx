import React from 'react';
import { getAllWithNoAccount } from '../../../http/projectApi';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateAccountModal from './modal/CreateAccauntModal';

function CreateAccountList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    getAllWithNoAccount()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const HadleCreateAccountModal = (project) => {
    setProject(project);
    setShow(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="createaccount">
      <div className="header">
        <Link to="/clientaccount">
          <img className="header__icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Создать личный кабинет</h1>
      </div>
      <CreateAccountModal projectId={project} show={show} setShow={setShow} setChange={setChange} />
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects
            .filter((project) => project.finish === null)
            .map((project) => (
              <tr key={project.id}>
                <td>{project.number}</td>
                <td>{project.name}</td>
                <td>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => HadleCreateAccountModal(project.id)}>
                    Создать
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CreateAccountList;
