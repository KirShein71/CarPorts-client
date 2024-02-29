import React from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import { fetchAllProjects, deleteProject } from '../../http/projectApi';
import { Spinner, Table, Button, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';

function ProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [createShow, setCreateShow] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchAllProjects()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    deleteProject(id)
      .then((data) => {
        setChange(!change);
        alert(`Личный кабинет «${data.name}» будет удален`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="projectlist">
      <Header title={'Проекты '} />
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
        </Col>
      </Row>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер проекта</th>
            <th>Название</th>
            <th>Дата договора</th>
            <th></th>
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
                <Button variant="success" size="sm" onClick={() => addToInfo(item.id)}>
                  Подробнее
                </Button>
              </td>
              <td>
                <Button variant="success" size="sm" onClick={() => handleDeleteClick(item.id)}>
                  Удалить
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
