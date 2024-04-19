import React from 'react';
import { getFinishProject } from '../../http/projectApi';
import { Spinner, Table, Button, Col, Form } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Moment from 'react-moment';

function FinishProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    getFinishProject()
      .then((data) => {
        setProjects(data);
      })
      .finally(() => setFetching(false));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="projectlist">
      <div className="header">
        <Link to="/project">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Завершенные проекты</h1>
      </div>
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search"
          />
        </Form>
      </Col>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="production_column">Номер проекта</th>
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
            </tr>
          </thead>
          <tbody>
            {filteredProjects
              .slice()
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
                  <td className="production_column">{item.number}</td>
                  <td>{item.name}</td>
                  <td>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
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
    </div>
  );
}

export default FinishProjectList;
