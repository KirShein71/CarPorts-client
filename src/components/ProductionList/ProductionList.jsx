import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, deleteProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllShipmentDetails } from '../../http/shipmentDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import CreateOneProjectDetail from './modal/CreateOneProjectDetail';
import './styles.scss';
import CreateAntypical from './modal/CreateAntypical';
import ImageModal from './modal/ImageModal';
import { Events } from 'react-scroll';

function ProductionList() {
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
      <Link to="/productionchange">
        <Button>Внести данные в проект</Button>
      </Link>
      <Col className="mt-3" sm={3}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Col>
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
      <div className="table-scrollable">
        <Table bordered size="md" className="mt-3">
          <thead>
            <tr>
              <th className="thead_column">Номер проекта</th>
              <th className="production_column">Проект</th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th className="thead_column" key={part.id}>
                    {part.name}
                  </th>
                ))}
              <th className="thead_column">Нетипичные детали</th>
              <th className="thead_column"></th>
            </tr>
          </thead>
          {projectDetails.map((projectDetail) => {
            const correspondingShipment = shipmentDetails.find(
              (shipment) => shipment.projectId === projectDetail.projectId,
            );
            return (
              <tbody key={projectDetail.id}>
                <tr style={correspondingShipment ? { borderBottomColor: '#ffff' } : {}}>
                  <td>{projectDetail.project ? projectDetail.project.number : ''}</td>
                  <td className="production_td">
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
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
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
                        <img src="./eye.png" alt="eye" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleDeleteProjectDetails(projectDetail.projectId)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
                {correspondingShipment && (
                  <tr>
                    <td></td>
                    <td className="production_td">Отгрузка</td>
                    {nameDetails
                      .sort((a, b) => a.id - b.id)
                      .map((part) => {
                        const detail = correspondingShipment.props.find(
                          (el) => el.detailId === part.id,
                        );
                        const quantity = detail ? detail.shipment_quantity : '';
                        return <td key={part.id}>{quantity}</td>;
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
  );
}

export default ProductionList;
