import React from 'react';
import Header from '../Header/Header';
import {
  getAllProjectMaterialForLogistic,
  getAllMaterialProjectForLogistic,
  getPickupMaterialsForLogistic,
  getUnloadingForProject,
} from '../../http/logisticApi';
import { Spinner } from 'react-bootstrap';
import LogisticProject from './LogisticProject';
import LogisticMaterial from './LogisticMaterial';
import CreateDimensionsMaterial from './modals/CreateDimensionsMaterial';
import CreateWeightMaterial from './modals/CreateWeightMaterial';
import PickapLogistic from './modals/PickapLogistic';
import CreateLogisticProject from '../ProjectInfoList/modals/CreateLogisticProject';

function Logistic() {
  const [logisticProjects, setLogisticPorjects] = React.useState([]);
  const [logisticMaterials, setLogisticMaterials] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('project');
  const [modalCreateDimensionsMaterial, setModalCreateDimensionsMaterial] = React.useState(false);
  const [modalCreateWeightMaterial, setModalCreateWeightMaterial] = React.useState(false);
  const [projectMaterialId, setProjectMaterialId] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [pickapData, setPickapData] = React.useState([]);
  const [modalPickapLogistic, setModalPickapLogistic] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectedProjectsId, setSelectedProjectsId] = React.useState([]);
  const [unloadingProjects, setUnloadingProjects] = React.useState([]);
  const [createLogisticProjectModal, setCreateLogisticProjectModal] = React.useState(false);
  const [projectId, setProjectId] = React.useState(null);

  React.useEffect(() => {
    setFetching(true);

    Promise.all([getAllProjectMaterialForLogistic(), getAllMaterialProjectForLogistic()])
      .then(([projectsData, materialsData]) => {
        setLogisticPorjects(projectsData);
        setLogisticMaterials(materialsData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [change]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDate && modalPickapLogistic) {
          if (selectedDate && selectedItems.length > 0) {
            const materialsData = await getPickupMaterialsForLogistic(selectedDate, selectedItems);
            setPickapData(materialsData);
          } else {
            setPickapData([]);
          }
        } else {
          setPickapData([]);
        }

        if (modalPickapLogistic && selectedProjectsId.length > 0) {
          const unloadingData = await getUnloadingForProject(selectedProjectsId);
          setUnloadingProjects(unloadingData);
        } else {
          setUnloadingProjects([]);
        }
      } catch (error) {
        if (error.response?.data) {
          alert(error.response.data.message);
        } else {
          console.error('An error occurred:', error);
        }
      }
    };

    fetchData();
  }, [selectedDate, selectedItems, selectedProjectsId, modalPickapLogistic, change]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenModalCreateDimensionsMaterial = (id) => {
    setProjectMaterialId(id);
    setModalCreateDimensionsMaterial(true);
  };

  const handleOpenModalCreateWeightMaterial = (id) => {
    setProjectMaterialId(id);
    setModalCreateWeightMaterial(true);
  };

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  const handlePickapMaterialForLogistic = (date) => {
    setSelectedDate(date);
    setModalPickapLogistic(true);
  };

  const handleOpenCreateLogisticProjectModal = (id) => {
    setProjectId(id);
    setCreateLogisticProjectModal(true);
  };

  const handleCheckboxChange = (id, isChecked) => {
    setSelectedItems((prev) =>
      isChecked ? [...prev, id] : prev.filter((itemId) => itemId !== id),
    );
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="logistic">
      <Header title={'Логистика'} />
      <CreateDimensionsMaterial
        show={modalCreateDimensionsMaterial}
        setShow={setModalCreateDimensionsMaterial}
        id={projectMaterialId}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateWeightMaterial
        show={modalCreateWeightMaterial}
        setShow={setModalCreateWeightMaterial}
        id={projectMaterialId}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <PickapLogistic
        show={modalPickapLogistic}
        setShow={setModalPickapLogistic}
        pickapData={pickapData}
        unloadingProjects={unloadingProjects}
        handleOpenCreateLogisticProjectModal={handleOpenCreateLogisticProjectModal}
      />
      <CreateLogisticProject
        id={projectId}
        show={createLogisticProjectModal}
        setShow={setCreateLogisticProjectModal}
        setChange={setChange}
      />

      <div className="ordermaterialslist__filter">
        <div
          className={`ordermaterialslist__filter-item ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => handleTabClick('project')}>
          Проекты
        </div>
        <div
          className={`ordermaterialslist__filter-item ${activeTab === 'material' ? 'active' : ''}`}
          onClick={() => handleTabClick('material')}>
          Материалы
        </div>
      </div>
      {activeTab === 'project' && (
        <LogisticProject
          projects={logisticProjects}
          handleOpenModalCreateDimensionsMaterial={handleOpenModalCreateDimensionsMaterial}
          handleOpenModalCreateWeightMaterial={handleOpenModalCreateWeightMaterial}
          handlePickapMaterialForLogistic={handlePickapMaterialForLogistic}
          selectedItems={selectedItems}
          selectedProjectsId={selectedProjectsId}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
      {activeTab === 'material' && (
        <LogisticMaterial
          materials={logisticMaterials}
          handleOpenModalCreateDimensionsMaterial={handleOpenModalCreateDimensionsMaterial}
          handleOpenModalCreateWeightMaterial={handleOpenModalCreateWeightMaterial}
          handlePickapMaterialForLogistic={handlePickapMaterialForLogistic}
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
    </div>
  );
}

export default Logistic;
