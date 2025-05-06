import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, deleteProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllDeliveryDetails } from '../../http/deliveryDetailsApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import CreateOneProjectDetail from './modal/CreateOneProjectDetail';
import CreateAntypical from './modal/CreateAntypical';
import ImageModal from './modal/ImageModal';
import { AppContext } from '../../context/AppContext';
import UpdateShipmentDetails from '../ShipmentList/modals/updateShipmentDetails';
import CreateOneShipmentDetail from '../ShipmentList/modals/createOneShipmentDetail';
import UpdateDeliveryDetail from '../DeliveryDetails/modals/updateDeliveryDetail';
import CreateOneDeliveryDetail from '../DeliveryDetails/modals/createOneDeliveryDetail';

import './styles.scss';

function ProductionList() {
  const { user } = React.useContext(AppContext);
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [projectDetail, setProjectDetail] = React.useState(null);
  const [updateProjectDetailsModal, setUpdateProjectDetailsModal] = React.useState(false);
  const [createOneDetailModal, setCreateOneDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [createAntypical, setCreateAntypical] = React.useState(false);
  const [imageModal, setImageModal] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [shipmentDetails, setShipmentDetails] = React.useState([]);
  const [deliveryDetails, setDeliveryDetails] = React.useState([]);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [modalUpdateShimpentDetails, setModalUpdateShimpentDetails] = React.useState(false);
  const [modalCreateOneShipmentDetails, setModalCreateOneShipmentDetails] = React.useState(false);
  const [shipmentDetail, setShipmentDetail] = React.useState(null);
  const [shipmentDate, setShipmentDate] = React.useState(null);
  const [modalUpdateDeliveryDetails, setModalUpdateDeliveryDetails] = React.useState(false);
  const [modalCreateOneDeliveryDetails, setModalCreateOneDeliveryDetails] = React.useState(false);
  const [deliveryDetail, setDeliveryDetail] = React.useState(null);
  const [hoveredColumn, setHoveredColumn] = React.useState(null);
  const [hoveredRowShipment, setHoveredRowShipment] = React.useState(null);
  const [hoveredRowDelivery, setHoveredRowDelivery] = React.useState(null);
  const [hoveredRowDetails, setHoveredRowDetails] = React.useState(null);

  React.useEffect(() => {
    fetchAllProjectDetails().then((data) => {
      setProjectDetails(data);
    });
    fetchAllShipmentDetails()
      .then((data) => setShipmentDetails(data))
      .finally(() => setFetching(false));
    fetchAllDeliveryDetails()
      .then((data) => setDeliveryDetails(data))
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

    const filteredProjects = projectDetails.filter((project) => {
      // Условие для поиска по имени
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Проверяем активные проекты в зависимости от состояния кнопок
      const isActiveProject = filters.isActive
        ? project.project.finish === null
        : filters.isClosed
        ? project.project.finish === 'true'
        : true; // Если ни одна кнопка не активна, показываем все проекты

      // Логика фильтрации
      if (filters.isActive && filters.isClosed) {
        return matchesSearch;
      }

      return matchesSearch && isActiveProject;
    });

    setFilteredProjects(filteredProjects);
  }, [projectDetails, buttonActiveProject, buttonClosedProject, searchQuery]);

  const handleUpdateProjectDetailClick = (id) => {
    setProjectDetail(id);
    setUpdateProjectDetailsModal(true);
  };

  const handleCreateOneDetail = (detailId, project) => {
    setDetailId(detailId);
    setProject(project);
    setCreateOneDetailModal(true);
  };

  const handleCreateAntypical = (project) => {
    setProject(project);
    setCreateAntypical(true);
  };

  const handleOpenImage = (images, id) => {
    setImages(images, id);
    setImageModal(true);
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

  const handleOpenModalUpdateShipmentDetails = (id) => {
    setShipmentDetail(id);
    setModalUpdateShimpentDetails(true);
  };

  const handleOpenModalCreateOneShipmentDetail = (detailId, project, shipmentDate) => {
    setDetailId(detailId);
    setProject(project);
    setShipmentDate(shipmentDate);
    setModalCreateOneShipmentDetails(true);
  };

  const handleOpenModalUpdateDeliveryDetails = (id) => {
    setDeliveryDetail(id);
    setModalUpdateDeliveryDetails(true);
  };

  const handleOpenModalCreateOneDeliveryDetail = (detailId, project) => {
    setDetailId(detailId);
    setProject(project);

    setModalCreateOneDeliveryDetails(true);
  };

  const handleDeleteProjectDetails = (projectId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить?');
    if (confirmed) {
      deleteProjectDetails(projectId)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
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

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionlist">
      <Header title={'Производство'} />
      {user.isManagerProduction ? (
        ''
      ) : (
        <div style={{ display: 'flex' }}>
          <Link to="/productionchange">
            <button className="button__production">Внести данные</button>
          </Link>

          <button
            className={`button__production-active ${
              buttonActiveProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonActiveProject}>
            Активные
          </button>
          <button
            className={`button__production-noactive ${
              buttonClosedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonClosedProject}>
            Завершенные
          </button>
          <input
            class="production__search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      )}
      <UpdateProjectDetails
        id={projectDetail}
        show={updateProjectDetailsModal}
        setShow={setUpdateProjectDetailsModal}
        setChange={setChange}
      />
      <CreateOneProjectDetail
        detailId={detailId}
        projectId={project}
        show={createOneDetailModal}
        setShow={setCreateOneDetailModal}
        setChange={setChange}
      />
      <CreateOneShipmentDetail
        detailId={detailId}
        projectId={project}
        shipmentDate={shipmentDate}
        show={modalCreateOneShipmentDetails}
        setShow={setModalCreateOneShipmentDetails}
        setChange={setChange}
      />
      <UpdateShipmentDetails
        id={shipmentDetail}
        show={modalUpdateShimpentDetails}
        setShow={setModalUpdateShimpentDetails}
        setChange={setChange}
      />
      <CreateOneDeliveryDetail
        detailId={detailId}
        projectId={project}
        show={modalCreateOneDeliveryDetails}
        setShow={setModalCreateOneDeliveryDetails}
        setChange={setChange}
      />
      <UpdateDeliveryDetail
        id={deliveryDetail}
        show={modalUpdateDeliveryDetails}
        setShow={setModalUpdateDeliveryDetails}
        setChange={setChange}
      />
      <CreateAntypical
        projectId={project}
        show={createAntypical}
        setShow={setCreateAntypical}
        setChange={setChange}
      />
      <ImageModal
        show={imageModal}
        images={images}
        setImages={setImages}
        setShow={setImageModal}
        setChange={setChange}
        change={change}
      />
      <div className="production-table-container">
        <div className="production-table-wrapper">
          <Table bordered size="md" className="production-table">
            <thead className="production-table__thead">
              <tr>
                <th className="production-th stat">Номер проекта</th>
                <th className="production-th mobile">Проект</th>
                {nameDetails
                  .sort((a, b) => a.number - b.number)
                  .map((part) => (
                    <th
                      className="production-th"
                      key={part.id}
                      onMouseEnter={() => setHoveredColumn(part.id)}
                      onMouseLeave={() => setHoveredColumn(null)}
                      style={{
                        backgroundColor: hoveredColumn === part.id ? '#d6d4d4' : '#ffffff',
                      }}>
                      {part.name}
                    </th>
                  ))}
                <th className="production-th stat">Нетиповые</th>
                <th className="production-th stat"></th>
              </tr>
            </thead>

            {filteredProjects.map((projectDetail, index) => {
              const correspondingShipment = shipmentDetails.find(
                (shipment) => shipment.projectId === projectDetail.projectId,
              );

              const correspondingDelivery = deliveryDetails.find(
                (delivery) => delivery.projectId === projectDetail.projectId,
              );

              return (
                <React.Fragment key={projectDetail.id}>
                  <tbody className="production-table__tbody">
                    <tr
                      className="production-table__row"
                      style={{
                        ...(correspondingDelivery ? { borderBottomColor: '#ffff' } : {}),
                        backgroundColor:
                          hoveredRowDetails === projectDetail.projectId ? '#d6d4d4' : 'transparent',
                      }}>
                      <td
                        style={{
                          color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                        }}>
                        {projectDetail.project ? projectDetail.project.number : ''}
                      </td>
                      <td
                        style={{
                          color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                        }}
                        className="production__td mobile">
                        {projectDetail.project ? projectDetail.project.name : ''}
                      </td>

                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => {
                          const detailProject = projectDetail.props.find(
                            (prop) => prop.detailId === part.id,
                          );
                          const quantity = detailProject ? detailProject.quantity : '';

                          return (
                            <td
                              key={part.id}
                              className="production-detail"
                              onMouseEnter={() => {
                                setHoveredColumn(part.id);
                                setHoveredRowDetails(projectDetail.projectId);
                              }}
                              onMouseLeave={() => {
                                setHoveredColumn(null);
                                setHoveredRowDetails(null);
                              }}
                              style={{
                                cursor: 'pointer',
                                color:
                                  projectDetail.project.finish === 'true' ? '#808080' : 'black',
                                backgroundColor:
                                  hoveredColumn === part.id ? '#d6d4d4' : 'transparent',
                              }}
                              onClick={() =>
                                quantity
                                  ? handleUpdateProjectDetailClick(detailProject.id)
                                  : handleCreateOneDetail(part.id, projectDetail.projectId)
                              }>
                              {quantity}
                            </td>
                          );
                        })}

                      <td className="production-actions">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div
                            onClick={() => handleCreateAntypical(projectDetail.projectId)}
                            style={{
                              cursor: 'pointer',
                              color: 'red',
                              fontWeight: 600,
                              paddingRight: '15px',
                            }}>
                            +
                          </div>
                          <div
                            onClick={() => handleOpenImage(projectDetail.antypical)}
                            className="production__eye">
                            {projectDetail.antypical.length > 0 ? (
                              <img src="./img/eye.png" alt="eye" />
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="production-delete">
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={
                            user.isManagerProduction
                              ? undefined
                              : () => handleDeleteProjectDetails(projectDetail.projectId)
                          }>
                          Удалить
                        </Button>
                      </td>
                    </tr>

                    {correspondingShipment && (
                      <tr
                        className="production-table__row"
                        style={{
                          backgroundColor:
                            hoveredRowShipment === correspondingShipment.projectId
                              ? '#d6d4d4'
                              : 'transparent',
                        }}>
                        <td></td>
                        <td
                          style={{
                            color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                          }}
                          className="production__td mobile"></td>
                        {nameDetails
                          .sort((a, b) => a.number - b.number)
                          .map((part) => {
                            const detail = correspondingShipment.props.find(
                              (el) => el.detailId === part.id,
                            );
                            const quantity = detail ? detail.shipment_quantity : '';

                            const detailProject = projectDetail.props.find(
                              (prop) => prop.detailId === part.id,
                            );
                            const quantityDetail = detailProject ? detailProject.quantity : '';

                            return (
                              <td
                                className="production-detailShipment"
                                onMouseEnter={() => {
                                  setHoveredColumn(part.id);
                                  setHoveredRowShipment(correspondingShipment.projectId);
                                }}
                                onMouseLeave={() => {
                                  setHoveredColumn(null);
                                  setHoveredRowShipment(null);
                                }}
                                style={{
                                  color:
                                    projectDetail.project.finish === 'true'
                                      ? '#808080'
                                      : quantityDetail > quantity
                                      ? '#f12c4d'
                                      : '#808080',
                                  backgroundColor:
                                    hoveredColumn === part.id
                                      ? '#d6d4d4'
                                      : quantity
                                      ? quantityDetail > quantity
                                        ? '#ffc0cb'
                                        : 'transparent'
                                      : 'transparent',
                                }}
                                key={part.id}
                                onClick={() =>
                                  quantity
                                    ? handleOpenModalUpdateShipmentDetails(detail.id)
                                    : handleOpenModalCreateOneShipmentDetail(
                                        part.id,
                                        correspondingShipment.projectId,
                                        correspondingShipment.shipment_date,
                                      )
                                }>
                                {quantity}
                              </td>
                            );
                          })}
                        <td></td>
                        <td></td>
                      </tr>
                    )}

                    {correspondingDelivery && (
                      <tr
                        className="production-table__row"
                        style={{
                          backgroundColor:
                            hoveredRowDelivery === correspondingDelivery.projectId
                              ? '#d6d4d4'
                              : 'transparent',
                        }}>
                        <td></td>
                        <td
                          style={{
                            color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                          }}
                          className="production__td mobile"></td>

                        {nameDetails
                          .sort((a, b) => a.number - b.number)
                          .map((part) => {
                            const detail = correspondingDelivery.props.find(
                              (el) => el.detailId === part.id,
                            );
                            const quantity = detail ? detail.delivery_quantity : '';

                            const detailProject = projectDetail.props.find(
                              (prop) => prop.detailId === part.id,
                            );
                            const quantityDetail = detailProject ? detailProject.quantity : '';

                            return (
                              <td
                                className="production-detailDelivery"
                                onMouseEnter={() => {
                                  setHoveredColumn(part.id);
                                  setHoveredRowDelivery(correspondingShipment.projectId);
                                }}
                                onMouseLeave={() => {
                                  setHoveredColumn(null);
                                  setHoveredRowDelivery(null);
                                }}
                                style={{
                                  color:
                                    projectDetail.project.finish === 'true'
                                      ? '#808080'
                                      : quantityDetail > quantity
                                      ? '#f12c4d'
                                      : '#000000',
                                  backgroundColor:
                                    hoveredColumn === part.id
                                      ? '#d6d4d4'
                                      : quantity
                                      ? quantityDetail > quantity
                                        ? '#ffc0cb'
                                        : 'transparent'
                                      : 'transparent',
                                }}
                                key={part.id}
                                onClick={() =>
                                  quantity
                                    ? handleOpenModalUpdateDeliveryDetails(detail.id)
                                    : handleOpenModalCreateOneDeliveryDetail(
                                        part.id,
                                        correspondingDelivery.projectId,
                                      )
                                }>
                                {quantity}
                              </td>
                            );
                          })}

                        <td></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                  <tbody style={{ borderColor: 'transparent' }}>
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                </React.Fragment>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductionList;
