import React from 'react';
import { Button, Table, Spinner } from 'react-bootstrap';
import { getAllWithNoInstallers } from '../../http/projectApi';
import CreateBrigade from './modals/CreateBrigade';
import { Link } from 'react-router-dom';

function AppointBrigade() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    getAllWithNoInstallers()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateClick = (project) => {
    setProject(project);
    setShow(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="appointbrigade">
      <div className="header">
        <Link to="/installation">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Назначить бригаду</h1>
      </div>
      <CreateBrigade projectId={project} show={show} setShow={setShow} setChange={setChange} />
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-5">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
              .sort((a, b) => a.id - b.id)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>
                    <Button variant="success" size="sm" onClick={() => handleUpdateClick(item.id)}>
                      Назначить бригаду
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

export default AppointBrigade;
