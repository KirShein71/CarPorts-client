import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllShipmentDetails, deleteShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateShipmentDetails from './modals/updateShipmentDetails';
import CreateOneShipmentDetail from './modals/createOneShipmentDetail';
import Moment from 'react-moment';
import { AppContext } from '../../context/AppContext';
import './modals/styles.scss';

function ShipmentList() {
  const { user } = React.useContext(AppContext);
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [updateShipmentDetailsModal, setUpdateShipmentDetailsModal] = React.useState(false);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [createOneShipmentDetailModal, setCreateOneShipmentDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [sortField, setSortField] = React.useState('shipment_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);

  console.log(createOneShipmentDetailModal);

  React.useEffect(() => {
    fetchAllShipmentDetails()
      .then((data) => {
        setShipmentDetails(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
    };

    const filteredProjects = shipmentDetails.filter((project) => {
      // Условие для поиска по имени
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.project.date_finish === null
        : filters.isClosed
        ? project.project.date_finish !== null
        : true; // Если ни одна кнопка не активна, показываем все проекты

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        // Если обе кнопки активны, показываем все проекты, если оба региона неактивны
        return matchesSearch;
      }

      // Если одна из кнопок активна (либо только активные, либо только закрытые)
      return matchesSearch && isActiveProject;
    });

    setFilteredProjects(filteredProjects);
  }, [shipmentDetails, buttonActiveProject, buttonClosedProject, searchQuery]);

  const handleUpdateShipmentDetailClick = (id) => {
    setShipmentDetail(id);
    setUpdateShipmentDetailsModal(true);
  };

  const handleCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setCreateOneShipmentDetailModal(true);
  };

  const handleButtonActiveProject = () => {
    const newButtonActiveProject = !buttonActiveProject;
    setButtonActiveProject(newButtonActiveProject);

    if (!newButtonActiveProject) {
      setButtonClosedProject(true);
    }
  };

  const handleButtonClosedProject = () => {
    const newButtonClosedProject = !buttonClosedProject;
    setButtonClosedProject(newButtonClosedProject);

    if (!newButtonClosedProject) {
      setButtonActiveProject(true);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const detailSums = nameDetails
    .sort((a, b) => a.id - b.id)
    .map((part) => {
      let sum = 0;
      shipmentDetails.forEach((shipment) => {
        const detail = shipment.props.find((el) => el.detailId === part.id);
        if (detail) {
          sum += detail.shipment_quantity;
        }
      });
      return sum;
    });

  const handleDeleteShipmentDetails = (projectId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить?');
    if (confirmed) {
      deleteShipmentDetails(projectId)
        .then((data) => {
          setChange(!change);
          alert('Строка будет удалена');
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('строка удалена');
          }
        });
    }
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
    <div className="shipmentlist">
      <Header title={'Отгрузка деталей'} />
      <div style={{ display: 'flex' }}>
        <Link to="/shipmentchange">
          <button className="button__shipment">Внести данные</button>
        </Link>

        <button
          className={`button__shipment-active ${
            buttonActiveProject === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonActiveProject}>
          Активные
        </button>
        <button
          className={`button__shipment-noactive ${
            buttonClosedProject === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonClosedProject}>
          Завершенные
        </button>
        <input
          class="shipment__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <UpdateShipmentDetails
        id={shipmentDetail}
        show={updateShipmentDetailsModal}
        setShow={setUpdateShipmentDetailsModal}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={project}
        shipmentDate={shipmentDate}
        show={createOneShipmentDetailModal}
        setShow={setCreateOneShipmentDetailModal}
        setChange={setChange}
      />
      <div className="table-container">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="shipment_column">Сумма</th>
              <th></th>
              <th></th>
              {detailSums.map((sum, index) => (
                <th key={index}>{sum}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th className="shipment_column">Номер проекта</th>
              <th>Название проекта</th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleSort('shipment_date');
                }}>
                Отметка времени{' '}
                <img styles={{ marginLeft: '5px' }} src="./img/sort.png" alt="icon_sort" />
              </th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th key={part.id}>{part.name}</th>
                ))}
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
              .map((shipment) => (
                <tr
                  key={shipment.id}
                  style={{
                    color: shipment.project.date_finish !== null ? '#808080' : 'black',
                  }}>
                  <td className="shipment_column">
                    {shipment.project ? shipment.project.number : ''}
                  </td>
                  <td>{shipment.project ? shipment.project.name : ''}</td>
                  <td>
                    <Moment format="DD.MM.YYYY">{shipment.shipment_date}</Moment>
                  </td>
                  {nameDetails
                    .sort((a, b) => a.id - b.id)
                    .map((part) => {
                      const detail = shipment.props.find((el) => el.detailId === part.id);
                      const quantity = detail ? detail.shipment_quantity : '';
                      return (
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            user.isProjectManager || user.isAdmin
                              ? undefined
                              : () =>
                                  quantity
                                    ? handleUpdateShipmentDetailClick(detail.id)
                                    : handleCreateOneShipmentDetail(
                                        part.id,
                                        shipment.projectId,
                                        shipment.shipment_date,
                                      )
                          }>
                          {quantity}
                        </td>
                      );
                    })}
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => handleDeleteShipmentDetails(shipment.projectId)}>
                      Удалить
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

export default ShipmentList;
