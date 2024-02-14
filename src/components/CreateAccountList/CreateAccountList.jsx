import React from 'react';
import Header from '../Header/Header';
import { getAllWithNoAccount } from '../../http/projectApi';
import { Table, Button, Spinner } from 'react-bootstrap';
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
      <Header title={'Создать личный кабинет'} />
      <CreateAccountModal projectId={project} show={show} setShow={setShow} setChange={setChange} />
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название</th>
            <th>Личный кабинет</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.number}</td>
              <td>{project.name}</td>
              <td>{project.account}</td>
              <td>
                <Button
                  variant="success"
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
