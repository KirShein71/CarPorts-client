import React from 'react';
import { getAllWithNoDetails } from '../../http/projectApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateDetails from './modals/createDetails';
import Moment from 'react-moment';

function ProductionChangeList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');

  React.useEffect(() => {
    getAllWithNoDetails()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateClick = (project) => {
    setProject(project);
    setShow(true);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionchange">
      <div className="header">
        <Link to="/production">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Производственные детали</h1>
      </div>
      <CreateDetails projectId={project} show={show} setShow={setShow} setChange={setChange} />
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('agreement_date')}>
                Дата договора{' '}
                <img styles={{ marginLeft: '5px' }} src="../sort.png" alt="icon_sort" />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
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

export default ProductionChangeList;
