import React from 'react';
import { getAllWithNoMaterials } from '../../http/projectApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateProcurement from './modals/CreateProcurement';
import Moment from 'react-moment';

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
        <Link to="/project">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Закупки</h1>
      </div>
      <CreateProcurement
        projectId={project}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th>Дата договора</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr key={item.id}>
                <td>{item.number}</td>
                <td>{item.name}</td>
                <td>
                  <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                </td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleUpdateClick(item.id)}>
                    Внести изменения
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
