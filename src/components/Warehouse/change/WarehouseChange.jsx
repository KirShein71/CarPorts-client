import React from 'react';
import { getAllWithNoWarehouseOrder } from '../../../http/projectApi';
import { addToProduction } from '../../../http/projectWarehouseApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import CreateWarehouseProject from '../modals/CreateWarehouseProject';

import Moment from 'react-moment';

function WarehouseChange() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [openModalCreateWarehouseModal, setOpenCreateWarehouseModal] = React.useState(false);

  React.useEffect(() => {
    getAllWithNoWarehouseOrder()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const AddToProduction = (project) => {
    const data = new FormData();
    data.append('projectId', project);

    addToProduction(data)
      .then((data) => {
        // приводим форму в изначальное состояние
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleClickAddToProduction = (project) => {
    AddToProduction(project);
  };

  const handleOpenCreateWarehouseProjectModal = (project) => {
    setProject(project);
    setOpenCreateWarehouseModal(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="warehouse-change">
      <CreateWarehouseProject
        projectId={project}
        show={openModalCreateWarehouseModal}
        setShow={setOpenCreateWarehouseModal}
        setChange={setChange}
      />
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('agreement_date')}>
                Дата договора{' '}
                <img styles={{ marginLeft: '5px' }} src="./img/sort.png" alt="icon_sort" />
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((item) => item.finish === null)
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
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleClickAddToProduction(item.id)}>
                      Добавить
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleOpenCreateWarehouseProjectModal(item.id)}>
                      Внести детали
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

export default WarehouseChange;
