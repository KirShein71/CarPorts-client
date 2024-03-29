import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Pagination, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, deleteProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 20;

  React.useEffect(() => {
    fetchAllProjectDetails()
      .then((data) => {
        setProjectDetails(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
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

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projectDetails.length);
  const projectDetailsToShow = projectDetails
    .filter((detail) => detail.project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < projectDetails.length) {
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
              <th>Номер проекта</th>
              <th className="production_column">Проект</th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th key={part.id}>{part.name}</th>
                ))}
              <th>Нетипичные детали</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projectDetailsToShow.map((detail) => (
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
                        style={{ cursor: 'pointer' }}
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
                    <span style={{ cursor: 'pointer', color: 'red' }}>Добавить файлы</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleDeleteProjectDetails(detail.projectId)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {projectDetails.length > 15 ? (
        <Pagination style={{ marginTop: '15px' }}>{pages}</Pagination>
      ) : (
        ''
      )}
    </div>
  );
}

export default ProductionList;
