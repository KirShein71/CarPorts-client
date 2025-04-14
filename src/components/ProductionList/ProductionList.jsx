import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, deleteProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import CreateOneProjectDetail from './modal/CreateOneProjectDetail';
import './styles.scss';
import CreateAntypical from './modal/CreateAntypical';
import ImageModal from './modal/ImageModal';
import { AppContext } from '../../context/AppContext';

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
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);

  React.useEffect(() => {
    fetchAllProjectDetails().then((data) => {
      setProjectDetails(data);
    });
    fetchAllShipmentDetails()
      .then((data) => setShipmentDetails(data))
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
        // Если обе кнопки активны, показываем все проекты, если оба региона неактивны
        return matchesSearch;
      }

      // Если одна из кнопок активна (либо только активные, либо только закрытые)
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
          <Table bordered size="md">
            <thead>
              <tr>
                <th className="production-th">Номер проекта</th>
                <th className="production-th mobile">Проект</th>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <th className="production-th" key={part.id}>
                      {part.name}
                    </th>
                  ))}
                <th className="production-th">Нетиповые</th>
                <th className="production-th"></th>
              </tr>
            </thead>
            {filteredProjects.map((projectDetail) => {
              const correspondingShipment = shipmentDetails.find(
                (shipment) => shipment.projectId === projectDetail.projectId,
              );
              return (
                <tbody key={projectDetail.id}>
                  <tr style={correspondingShipment ? { borderBottomColor: '#ffff' } : {}}>
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
                      .sort((a, b) => a.id - b.id)
                      .map((part) => {
                        const detailProject = projectDetail.props.find(
                          (prop) => prop.detailId === part.id,
                        );

                        const quantity = detailProject ? detailProject.quantity : '';
                        return (
                          <td
                            key={part.id}
                            style={{
                              cursor: 'pointer',
                              color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                            }}
                            onClick={
                              user.isManagerProduction
                                ? undefined
                                : () =>
                                    quantity
                                      ? handleUpdateProjectDetailClick(detailProject.id)
                                      : handleCreateOneDetail(part.id, projectDetail.projectId)
                            }>
                            {quantity}
                          </td>
                        );
                      })}
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                          onClick={
                            user.isManagerProduction
                              ? undefined
                              : () => handleCreateAntypical(projectDetail.projectId)
                          }
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
                    <td>
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
                    <tr>
                      <td></td>
                      <td
                        style={{
                          color: projectDetail.project.finish === 'true' ? '#808080' : 'black',
                        }}
                        className="production__td production">
                        Отгрузка
                      </td>
                      {nameDetails
                        .sort((a, b) => a.id - b.id)
                        .map((part) => {
                          const detail = correspondingShipment.props.find(
                            (el) => el.detailId === part.id,
                          );
                          const quantity = detail ? detail.shipment_quantity : '';
                          return (
                            <td
                              style={{
                                color:
                                  projectDetail.project.finish === 'true' ? '#808080' : 'black',
                              }}
                              key={part.id}>
                              {quantity}
                            </td>
                          );
                        })}
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductionList;
