import React from 'react';
import Header from '../Header/Header';
import {
  getAllProjectMaterialForLogistic,
  getAllMaterialProjectForLogistic,
  getPickupMaterialsForLogistic,
} from '../../http/logisticApi';
import { Spinner } from 'react-bootstrap';
import LogisticProject from './LogisticProject';
import LogisticMaterial from './LogisticMaterial';
import CreateDimensionsMaterial from './modals/CreateDimensionsMaterial';
import CreateWeightMaterial from './modals/CreateWeightMaterial';
import PickapLogistic from './modals/PickapLogistic';

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
    if (selectedDate) {
      getPickupMaterialsForLogistic(selectedDate)
        .then((data) => setPickapData(data))
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [selectedDate]);

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
        />
      )}
      {activeTab === 'material' && (
        <LogisticMaterial
          materials={logisticMaterials}
          handleOpenModalCreateDimensionsMaterial={handleOpenModalCreateDimensionsMaterial}
          handleOpenModalCreateWeightMaterial={handleOpenModalCreateWeightMaterial}
          handlePickapMaterialForLogistic={handlePickapMaterialForLogistic}
        />
      )}
    </div>
  );
}

export default Logistic;
