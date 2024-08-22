import React from 'react';
import { getAllWithNoMaterials } from '../../http/projectApi';
import { Spinner, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateProcurement from './modals/CreateProcurement';

function ProcurementList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    getAllWithNoMaterials()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateClick = (project) => {
    setProject(project);
    setUpdateShow(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="procurementlist">
      <div className="header">
        <Link to="/ordermaterials">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Новые проекты</h1>
      </div>
      <CreateProcurement
        projectId={project}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      <div className="table-container">
        <Table striped bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((project) => project.date_finish === null)
              .map((project) => (
                <tr key={project.id}>
                  <td>{project.number}</td>
                  <td>{project.name}</td>
                  <td>
                    <Button
                      size="sm"
                      className="ms-3"
                      variant="primary"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => handleUpdateClick(project.id)}>
                      Добавить материал
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

export default ProcurementList;
