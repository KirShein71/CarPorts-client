import React from 'react';
import Header from '../Header/Header';
import { Spinner } from 'react-bootstrap';
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
import { AppContext } from '../../context/AppContext';

function OrderMaterialsList() {
  const { user } = React.useContext(AppContext);
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
  const [buttonNoDatePaymentProject, setButtonNoDatePaymentProject] = React.useState(false);
  const [buttonNoColorProject, setButtonNoColorProject] = React.useState(false);

  React.useEffect(() => {
    Promise.all([fetchAllProjectMaterials(), getAllMaterialProject()])
      .then(([projectMaterialsData, materialProjectsData]) => {
        setProjectsMaterials(projectMaterialsData);

        setMaterialProjects(materialProjectsData);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isNoPayment: buttonNoDatePaymentProject,
      isNoColor: buttonNoColorProject,
    };

    const filteredProjects = projectsMaterials.filter((projectMaterials) => {
      // Условие для поиска по имени
      const matchesSearchProject = projectMaterials.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Проверяем, есть ли хотя бы одно свойство, соответствующее фильтрам
      const hasMatchingProps = projectMaterials.props.some((prop) => {
        const matchesNoPayment = filters.isNoPayment ? prop.date_payment === null : true;
        const matchesNoColor = filters.isNoColor ? prop.color === null : true;
        return matchesNoPayment && matchesNoColor;
      });

      return (
        matchesSearchProject && (filters.isNoPayment || filters.isNoColor ? hasMatchingProps : true)
      );
    });

    const filteredMaterialProjects = materialProjects.filter((materialProject) => {
      // Условие для поиска по имени
      const matchesSearchProject = materialProject.materialName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Проверяем, есть ли хотя бы одно свойство, соответствующее фильтрам
      const hasMatchingProps = materialProject.props.some((prop) => {
        const matchesNoPayment = filters.isNoPayment ? prop.date_payment === null : true;
        const matchesNoColor = filters.isNoColor ? prop.color === null : true;
        return matchesNoPayment && matchesNoColor;
      });

      return (
        matchesSearchProject && (filters.isNoPayment || filters.isNoColor ? hasMatchingProps : true)
      );
    });

    setFilteredProjectMaterials(filteredProjects);
    setFilteredMaterialProjects(filteredMaterialProjects);
  }, [projectsMaterials, buttonNoColorProject, buttonNoDatePaymentProject, searchQuery]);

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

  const handleButtonNoPaymentProject = () => {
    const newButtonNoPaymentProject = !buttonNoDatePaymentProject;
    setButtonNoDatePaymentProject(newButtonNoPaymentProject);
  };

  const handleButtonNoColorProject = () => {
    const newButtonNoColorProject = !buttonNoColorProject;
    setButtonNoColorProject(newButtonNoColorProject);
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

        {user.isManagerProduction ? (
          ''
        ) : (
          <div style={{ display: 'flex' }}>
            <Link to="/procurement">
              <button className="button__projectmaterial">Новые</button>
            </Link>

            <button
              className={`button__projectmaterial-nopayment ${
                buttonNoDatePaymentProject === true ? 'active' : 'inactive'
              }`}
              onClick={handleButtonNoPaymentProject}>
              Неоплаченные
            </button>
            <button
              className={`button__projectmaterial-nocolor ${
                buttonNoColorProject === true ? 'active' : 'inactive'
              }`}
              onClick={handleButtonNoColorProject}>
              Без цвета
            </button>
            <input
              class="projectmaterial__search"
              placeholder="Поиск"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}
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
                user={user}
                buttonNoColorProject={buttonNoColorProject}
                buttonNoDatePaymentProject={buttonNoDatePaymentProject}
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
                buttonNoColorProject={buttonNoColorProject}
                buttonNoDatePaymentProject={buttonNoDatePaymentProject}
                user={user}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default OrderMaterialsList;
