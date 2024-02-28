import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { deleteAntypical } from '../../http/antypicalApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import CreateOneProjectDetail from './modal/CreateOneProjectDetail';
import './styles.scss';
import CreateAntypical from './modal/CreateAntypical';
import ImageModal from './modal/ImageModal';

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

  React.useEffect(() => {
    fetchAllProjectDetails()
      .then((data) => setProjectDetails(data))
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

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionlist">
      <Header title={'Производство'} />
      <Link to="/productionchange">
        <Button>Внести данные в проект</Button>
      </Link>
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
              <th>Номер проекта</th>
              <th className="production_column">Проект</th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th>{part.name}</th>
                ))}
              <th>Нетипичные детали</th>
            </tr>
          </thead>
          <tbody>
            {projectDetails.map((detail) => (
              <tr key={detail.id}>
                <td>{detail.project ? detail.project.number : ''}</td>
                <td className="production_column">{detail.project ? detail.project.name : ''}</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => {
                    const detailProject = detail.props.find((prop) => prop.detailId === part.id);
                    const quantity = detailProject ? detailProject.quantity : '';
                    return (
                      <td
                        onClick={() =>
                          quantity
                            ? handleUpdateProjectDetailClick(detailProject.id)
                            : handleCreateOneDetail(part.id, detail.projectId)
                        }>
                        {quantity}
                      </td>
                    );
                  })}
                <td
                  onClick={() => {
                    if (detail.antypical.length > 0) {
                      handleOpenImage(detail.antypical);
                    } else {
                      handleCreateAntypical(detail.projectId);
                    }
                  }}>
                  {detail.antypical.length > 0 ? (
                    <span style={{ color: 'red', cursor: 'pointer' }}>Файлы</span>
                  ) : (
                    <span style={{ cursor: 'pointer' }}>Добавить файлы</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ProductionList;
