import React from 'react';
import Header from '../Header/Header';
import { Spinner, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  fetchAllProjectMaterials,
  deleteProjectMaterials,
  getAllMaterialProject,
} from '../../http/projectMaterialsApi';
import CreateCheck from './modals/createCheck';
import './OrderMaterialsList.styles.scss';
import CreateReadyDate from './modals/createReadyDate';
import CreateShippingDate from './modals/createShippingDate';
import CreatePaymentDate from './modals/createPaymentDate';
import CreateMaterial from './modals/createMaterial';
import CreateColor from './modals/createColor';
import MaterialProject from './MaterialProject';
import ProjectMaterial from './ProjectMaterial';
import Checkbox from '../Checkbox/Checkbox';

function OrderMaterialsList() {
  const [projectsMaterials, setProjectsMaterials] = React.useState([]);
  const [materialProjects, setMaterialProjects] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [readyDateShow, setReadyDateShow] = React.useState(false);
  const [shippingDateShow, setShippingDateShow] = React.useState(false);
  const [paymentDateShow, setPaymentDateShow] = React.useState(false);
  const [createMaterial, setCreateMaterial] = React.useState(false);
  const [createColor, setCreateColor] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [projectMaterials, setProjectMaterials] = React.useState(null);
  const [fetching, setFetching] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjectMaterials, setFilteredProjectMaterials] = React.useState([]);
  const [filteredMaterialProjects, setFilteredMaterialProjects] = React.useState([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('project');
  const [projectNoDatePaymentCheckbox, setProjectNoDatePaymentCheckbox] = React.useState(false);
  const [projectNoColorCheckbox, setProjectNoColorCheckbox] = React.useState(false);

  React.useEffect(() => {
    Promise.all([fetchAllProjectMaterials(), getAllMaterialProject()])
      .then(([projectMaterialsData, materialProjectsData]) => {
        setProjectsMaterials(projectMaterialsData);
        setMaterialProjects(materialProjectsData);
      })
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateClick = (id) => {
    setProjectMaterials(id);
    setUpdateShow(true);
  };

  const hadleReadyDate = (id) => {
    setProjectMaterials(id);
    setReadyDateShow(true);
  };

  const hadleShippingDate = (id) => {
    setProjectMaterials(id);
    setShippingDateShow(true);
  };

  const handlePaymentDate = (id) => {
    setProjectMaterials(id);
    setPaymentDateShow(true);
  };

  const handleCreateMaterial = (project) => {
    setProject(project);
    setCreateMaterial(true);
  };

  const handleCreateColor = (id) => {
    setProjectMaterials(id);
    setCreateColor(true);
  };

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDeleteProjectMaterials = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить материал?');
    if (confirmed) {
      deleteProjectMaterials(id)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
          console.log(id);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const filtered = projectsMaterials.filter((projectMaterials) =>
      projectMaterials.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const filteredMaterial = materialProjects.filter((projectMaterials) =>
      projectMaterials.materialName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProjectMaterials(filtered);
    setFilteredMaterialProjects(filteredMaterial);
  }, [projectsMaterials, searchQuery]);

  const handleNoDatePaymentCheckboxChange = () => {
    const updatedValue = !projectNoDatePaymentCheckbox;
    setProjectNoDatePaymentCheckbox(updatedValue);

    const filtered = updatedValue
      ? projectsMaterials.filter((projectMaterial) =>
          projectMaterial.props.some((prop) => prop.date_payment === null),
        )
      : projectsMaterials;

    const filteredMaterial = updatedValue
      ? materialProjects.filter((materialProject) =>
          materialProject.props.some((prop) => prop.date_payment === null),
        )
      : materialProjects;

    setFilteredProjectMaterials(filtered);
    setFilteredMaterialProjects(filteredMaterial);
  };

  const handleNoColorCheckboxChange = () => {
    const updatedValue = !projectNoColorCheckbox;
    setProjectNoColorCheckbox(updatedValue);

    const filtered = updatedValue
      ? projectsMaterials.filter((projectMaterial) =>
          projectMaterial.props.some((prop) => prop.color === null),
        )
      : projectsMaterials;

    const filteredMaterial = updatedValue
      ? materialProjects.filter((materialProject) =>
          materialProject.props.some((prop) => prop.color === null),
        )
      : materialProjects;

    setFilteredProjectMaterials(filtered);
    setFilteredMaterialProjects(filteredMaterial);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <CreateCheck
        id={projectMaterials}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateReadyDate
        id={projectMaterials}
        show={readyDateShow}
        setShow={setReadyDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateShippingDate
        id={projectMaterials}
        show={shippingDateShow}
        setShow={setShippingDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreatePaymentDate
        id={projectMaterials}
        show={paymentDateShow}
        setShow={setPaymentDateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateMaterial
        projectId={project}
        show={createMaterial}
        setShow={setCreateMaterial}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateColor
        id={projectMaterials}
        show={createColor}
        setShow={setCreateColor}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <div className="ordermaterialslist">
        <Header title={'Заказы материалов'} />

        <div className="ordermaterialslist__filter">
          <div
            className={`ordermaterialslist__filter-item ${activeTab === 'project' ? 'active' : ''}`}
            onClick={() => handleTabClick('project')}>
            Проекты
          </div>
          <div
            className={`ordermaterialslist__filter-item ${
              activeTab === 'material' ? 'active' : ''
            }`}
            onClick={() => handleTabClick('material')}>
            Материалы
          </div>
        </div>
        <Link to="/procurement">
          <div style={{ fontSize: '18px', paddingTop: '10px', cursor: 'pointer', color: 'black' }}>
            &bull; Показать новые проекты
          </div>
        </Link>
        <Col className="mt-3 mb-3" sm={2}>
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
        <Checkbox
          change={projectNoDatePaymentCheckbox}
          handle={handleNoDatePaymentCheckboxChange}
          name={'Неоплаченные'}
          label={'chbxNoDatePayment'}
        />
        <Checkbox
          change={projectNoColorCheckbox}
          handle={handleNoColorCheckboxChange}
          name={'Без цвета'}
          label={'chbxNoColor'}
        />
        {activeTab === 'project' && (
          <>
            {filteredProjectMaterials.map((material) => (
              <ProjectMaterial
                key={material.id}
                {...material}
                handleUpdateClick={handleUpdateClick}
                handlePaymentDate={handlePaymentDate}
                hadleReadyDate={hadleReadyDate}
                hadleShippingDate={hadleShippingDate}
                handleDeleteProjectMaterials={handleDeleteProjectMaterials}
                handleCreateMaterial={handleCreateMaterial}
                handleCreateColor={handleCreateColor}
                projectNoDatePaymentCheckbox={projectNoDatePaymentCheckbox}
                projectNoColorCheckbox={projectNoColorCheckbox}
              />
            ))}
          </>
        )}
        {activeTab === 'material' && (
          <>
            {filteredMaterialProjects.map((materialProject) => (
              <MaterialProject
                key={materialProject.id}
                {...materialProject}
                handleUpdateClick={handleUpdateClick}
                handlePaymentDate={handlePaymentDate}
                hadleReadyDate={hadleReadyDate}
                hadleShippingDate={hadleShippingDate}
                handleDeleteProjectMaterials={handleDeleteProjectMaterials}
                handleCreateColor={handleCreateColor}
                projectNoDatePaymentCheckbox={projectNoDatePaymentCheckbox}
                projectNoColorCheckbox={projectNoColorCheckbox}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default OrderMaterialsList;
