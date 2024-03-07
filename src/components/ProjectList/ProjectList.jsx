import React from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import { fetchAllProjects, deleteProject } from '../../http/projectApi';
import { Spinner, Table, Button, Col, Row, Pagination } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';

function ProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [createShow, setCreateShow] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 20;

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchAllProjects()
      .then((data) => {
        setProjects(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
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

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProjects = projects.slice().sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);

    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projects.length);
  const projectsToShow = sortedProjects.slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < projects.length) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          activeLabel=""
          onClick={() => handlePageClick(page)}>
          {page}
        </Pagination.Item>,
      );
    }
  }

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
            <th
              style={{ cursor: 'pointer', display: 'flex' }}
              onClick={() => handleSort('agreement_date')}>
              <div>Дата договора</div>{' '}
              <img
                style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                src="./sort.png"
                alt="icon_sort"
              />
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projectsToShow
            .sort((a, b) => {
              const dateA = new Date(a[sortField]);
              const dateB = new Date(b[sortField]);

              if (sortOrder === 'desc') {
                return dateB - dateA;
              } else {
                return dateA - dateB;
              }
            })
            .map((item) => (
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
      <Pagination>{pages}</Pagination>
    </div>
  );
}

export default ProjectList;
