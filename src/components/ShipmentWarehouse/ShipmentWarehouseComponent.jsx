import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { fetchAllShipmentWarehouse } from '../../http/shipmentWarehouseApi';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.scss';

function ShipmentWarehouseComponent() {
  const [shipmentWarehouses, setShipmentWarehouses] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    Promise.all([fetchAllShipmentWarehouse()])
      .then(([projectData]) => {
        setShipmentWarehouses(projectData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  React.useEffect(() => {
    const filteredProjects = shipmentWarehouses.filter((project) => {
      // Поиск ТОЛЬКО по названию проекта
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтрация по статусу проекта
      if (buttonActiveProject && buttonClosedProject) {
        // Если обе кнопки активны - показываем все проекты
        return matchesSearch;
      }

      if (buttonActiveProject) {
        return matchesSearch && project.project.finish === null;
      }

      if (buttonClosedProject) {
        return matchesSearch && project.project.finish === 'true';
      }

      return matchesSearch;
    });

    setFilteredProjects(filteredProjects);
  }, [shipmentWarehouses, buttonActiveProject, buttonClosedProject, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleActiveProjects = () => {
    setButtonActiveProject(true);
    setButtonClosedProject(false);
  };

  const handleToggleClosedProjects = () => {
    setButtonActiveProject(false);
    setButtonClosedProject(true);
  };

  const formatNumber = (number) => {
    if (!number && number !== 0) return '0';
    // Округляем до целого
    const rounded = Math.round(number);
    // Разделяем разряды пробелом
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const addToWarehouseProject = (projectId) => {
    navigate(`/warehouse-project/${projectId}`, { state: { from: location.pathname } });
  };

  return (
    <div className="shipment-warehouse">
      <Header title={'Отгрузка со склад'} />
      <div className="shipment-warehouse__filter">
        <button
          onClick={handleToggleActiveProjects}
          className={`shipment-warehouse__button-active ${
            buttonActiveProject === true ? 'active' : 'inactive'
          }`}>
          Активные
        </button>
        <button
          onClick={handleToggleClosedProjects}
          className={`shipment-warehouse__button-noactive ${
            buttonClosedProject === true ? 'active' : 'inactive'
          }`}>
          Завершенные
        </button>
        <input
          className="shipment-warehouse__search"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="shipment-warehouse__content">
        <div className="shipment-warehouse__container">
          <div className="shipment-warehouse__project">
            <Table bordered className="shipment-warehouse__project-table">
              <thead>
                <tr>
                  <th className="shipment-warehouse__project-th project">Проект</th>
                  <th className="shipment-warehouse__project-th data">Вес/Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((shipProject) => (
                  <tr key={shipProject.projectId}>
                    <td
                      className="shipment-warehouse__project-td project"
                      onClick={() => {
                        addToWarehouseProject(shipProject.projectId);
                      }}>
                      {shipProject.project.name} {shipProject.project.number}
                    </td>
                    <td className="shipment-warehouse__project-td data">
                      {formatNumber(shipProject.totalWeight)} кг /{' '}
                      {formatNumber(shipProject.totalCost)} руб
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShipmentWarehouseComponent;
