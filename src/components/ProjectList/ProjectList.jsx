import React from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import CreateStatus from '../Status/CreateStatus';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table, Button, Col, Row } from 'react-bootstrap';
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
      <Button className="mt-3">Все проекты</Button>
      <CreateProject show={createShow} setShow={setCreateShow} setChange={setChange} />
      <Row className="d-flex flex-column">
        <Col className="mt-3 align-items-start">
          <Button className="me-3 my-2" onClick={() => setCreateShow(true)}>
            Добавить проект
          </Button>
          <Link to="/desing">
            <Button className="me-3 my-2">Проектирование</Button>
          </Link>
          <Link to="/procurement">
            <Button className="me-3 my-2">Закупки</Button>
          </Link>
          <Link to="/createaccount">
            <Button className="my-2">Создать личный кабинет</Button>
          </Link>
        </Col>
      </Row>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер проекта</th>
            <th>Название</th>
            <th>Дата договора</th>
            <th>Статус</th>
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
