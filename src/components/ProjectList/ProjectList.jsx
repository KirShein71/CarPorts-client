import React from 'react';
import Header from '../Header/Header';
import './Projectlist.styles.scss';
import CreateProject from './modals/CreateProject';
import CreateStatus from '../Status/CreateStatus';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';

function ProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [createShow, setCreateShow] = React.useState(false);
  const [createStatus, setCreateStatus] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUpdateStatus = (id) => {
    setProject(id);
    setCreateStatus(true);
  };

  React.useEffect(() => {
    fetchAllProjects()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="projectlist">
      <Header title={'Проекты '} />
      <button className="projectlist__button">Все проекты</button>
      <CreateProject show={createShow} setShow={setCreateShow} setChange={setChange} />
      <div className="projectlist__buttons">
        <button onClick={() => setCreateShow(true)} className="projectlist__button">
          Добавить проект
        </button>
        <Link to="/desing">
          <button className="projectlist__button">Проектирование</button>
        </Link>
        <Link to="/procurement">
          <button className="projectlist__button">Закупки</button>
        </Link>
      </div>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата договора</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
              </td>
              <CreateStatus
                id={project}
                show={createStatus}
                setShow={setCreateStatus}
                setChange={setChange}
              />
              <td>
                <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(item.id)}>
                  {item.status}
                </Button>
              </td>
              <td>
                <Button variant="success" size="sm" onClick={() => addToInfo(item.id)}>
                  Подробнее
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProjectList;
