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
import UpdateMaterialId from './modals/updateMaterialId';
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
  const [buttonNoReadyDateProject, setButtonNoReadyDateProject] = React.useState(false);
  const [buttonNoShippingDateProject, setButtonNoShippingDateProject] = React.useState(false);
  const [modalUpdateMaterialId, setModalUpdateMaterialId] = React.useState(false);

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
      isNoReady: buttonNoReadyDateProject,
      isNoShipping: buttonNoShippingDateProject,
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
        const matchesNoReady = filters.isNoReady ? prop.ready_date === null : true;
        const matchesNoShipping = filters.isNoShipping ? prop.shipping_date === null : true;
        return matchesNoPayment && matchesNoColor && matchesNoReady && matchesNoShipping;
      });

      return (
        matchesSearchProject &&
        (filters.isNoPayment || filters.isNoColor || filters.isNoReady || filters.isNoShipping
          ? hasMatchingProps
          : true)
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
        const matchesNoReady = filters.isNoReady ? prop.ready_date === null : true;
        const matchesNoShipping = filters.isNoShipping ? prop.shipping_date === null : true;
        return matchesNoPayment && matchesNoColor && matchesNoReady && matchesNoShipping;
      });

      return (
        matchesSearchProject &&
        (filters.isNoPayment || filters.isNoColor || filters.isNoReady || filters.isNoShipping
          ? hasMatchingProps
          : true)
      );
    });

    setFilteredProjectMaterials(filteredProjects);
    setFilteredMaterialProjects(filteredMaterialProjects);
  }, [
    projectsMaterials,
    buttonNoColorProject,
    buttonNoDatePaymentProject,
    buttonNoReadyDateProject,
    buttonNoShippingDateProject,
    searchQuery,
  ]);

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

  const handleOpenModalUpdateMaterialId = (id) => {
    setProjectMaterials(id);
    setModalUpdateMaterialId(true);
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

  const handleButtonNoReadyDateProject = () => {
    const newButtonNoReadyDateProject = !buttonNoReadyDateProject;
    setButtonNoReadyDateProject(newButtonNoReadyDateProject);
  };

  const handleButtonNoShippingDateProject = () => {
    const newButtonNoShippingDateProject = !buttonNoShippingDateProject;
    setButtonNoShippingDateProject(newButtonNoShippingDateProject);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const holidays = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-08',
    '2024-02-23',
    '2024-03-08',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-09',
    '2024-05-10',
    '2024-06-12',
    '2024-11-04',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',
    '2025-01-06',
    '2025-01-07',
    '2025-01-08',
    '2025-05-01',
    '2025-05-02',
    '2025-05-08',
    '2025-05-09',
    '2025-06-12',
    '2025-06-13',
    '2025-11-03',
    '2025-11-04',
  ].map((date) => new Date(date));

  // Функция для проверки, является ли дата выходным или праздничным днем
  function isWorkingDay(date) {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const isHoliday = holidays.some((holiday) => {
      const holidayString = holiday.toDateString();
      const dateString = date.toDateString();
      return holidayString === dateString;
    });

    return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
  }
  // Функция для добавления рабочих дней к дате
  function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
      if (isWorkingDay(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  // Функция для форматирования даты в формате ДД.ММ.ГГГГ
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Исправлено: добавлены кавычки для шаблонной строки
  }

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
      <UpdateMaterialId
        id={projectMaterials}
        show={modalUpdateMaterialId}
        setShow={setModalUpdateMaterialId}
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
          <>
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
                className={`button__projectmaterial-noready ${
                  buttonNoReadyDateProject === true ? 'active' : 'inactive'
                }`}
                onClick={handleButtonNoReadyDateProject}>
                Неготовые
              </button>
              <button
                className={`button__projectmaterial-noshipping ${
                  buttonNoShippingDateProject === true ? 'active' : 'inactive'
                }`}
                onClick={handleButtonNoShippingDateProject}>
                Неотгруженные
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
            <div className="projectmaterial__filter-mobile">
              <button
                className={`button__projectmaterial-noshippingm ${
                  buttonNoShippingDateProject === true ? 'active' : 'inactive'
                }`}
                onClick={handleButtonNoShippingDateProject}>
                Неотгруженные
              </button>
              <button
                className={`button__projectmaterial-nocolorm ${
                  buttonNoColorProject === true ? 'active' : 'inactive'
                }`}
                onClick={handleButtonNoColorProject}>
                Без цвета
              </button>
              <input
                class="projectmaterial__searchm"
                placeholder="Поиск"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </>
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
                handleOpenModalUpdateMaterialId={handleOpenModalUpdateMaterialId}
                user={user}
                buttonNoColorProject={buttonNoColorProject}
                buttonNoDatePaymentProject={buttonNoDatePaymentProject}
                buttonNoReadyDateProject={buttonNoReadyDateProject}
                buttonNoShippingDateProject={buttonNoShippingDateProject}
                addWorkingDays={addWorkingDays}
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
                handleOpenModalUpdateMaterialId={handleOpenModalUpdateMaterialId}
                buttonNoColorProject={buttonNoColorProject}
                buttonNoDatePaymentProject={buttonNoDatePaymentProject}
                buttonNoReadyDateProject={buttonNoReadyDateProject}
                buttonNoShippingDateProject={buttonNoShippingDateProject}
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
