import React from 'react';
import Header from '../Header/Header';
import {
  getAllProjectMaterialForLogistic,
  getAllMaterialProjectForLogistic,
} from '../../http/logisticApi';
import { Spinner } from 'react-bootstrap';
import LogisticProject from './LogisticProject';
import LogisticMaterial from './LogisticMaterial';

function Logistic() {
  const [logisticProjects, setLogisticPorjects] = React.useState([]);
  const [logisticMaterials, setLogisticMaterials] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('project');

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
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="logistic">
      <Header title={'Логистика'} />

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
      {activeTab === 'project' && <LogisticProject projects={logisticProjects} />}
      {activeTab === 'material' && <LogisticMaterial materials={logisticMaterials} />}
    </div>
  );
}

export default Logistic;
