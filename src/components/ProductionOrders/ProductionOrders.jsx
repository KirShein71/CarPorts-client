import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
import { getAllWeightAndPrice } from '../../http/projectDetailsApi';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.scss';

function ProductionOrders() {
  const [projectsData, setProjectsData] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [projectsData] = await Promise.all([getAllWeightAndPrice()]);

        setProjectsData(projectsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchAllData();
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveProject,
      isClosed: buttonClosedProject,
      searchQuery: searchQuery, // добавим поиск в фильтры
    };

    const filteredProjects = projectsData.filter((project) => {
      // Проверяем поиск по названию проекта
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Если есть поисковый запрос и название не подходит - сразу исключаем
      if (searchQuery && !matchesSearch) {
        return false;
      }

      // Проверяем статус проекта (активный/завершенный)
      const isActiveProject = filters.isActive
        ? project.project.finish === null
        : filters.isClosed
          ? project.project.finish === 'true'
          : true;

      // Если обе кнопки активны - показываем все проекты
      if (filters.isActive && filters.isClosed) {
        return true;
      }

      return isActiveProject;
    });

    setFilteredProjects(filteredProjects);
  }, [projectsData, buttonActiveProject, buttonClosedProject, searchQuery]);

  const handleButtonActiveProject = () => {
    setButtonActiveProject(true);
    setButtonClosedProject(false);
  };

  const handleButtonClosedProject = () => {
    setButtonActiveProject(false);
    setButtonClosedProject(true);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatNumber = (number) => {
    if (!number && number !== 0) return '0';
    // Округляем до целого
    const rounded = Math.round(number);
    // Разделяем разряды пробелом
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const addToProductionProject = (projectId) => {
    navigate(`/production-project/${projectId}`, { state: { from: location.pathname } });
  };

  return (
    <div className="production-orders">
      <Header title={'Заказы на производство'} />

      <>
        <div className="production-orders__filter">
          <button
            className={`production-orders__button-active ${
              buttonActiveProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonActiveProject}>
            Активные
          </button>
          <button
            className={`production-orders__button-noactive ${
              buttonClosedProject === true ? 'active' : 'inactive'
            }`}
            onClick={handleButtonClosedProject}>
            Завершенные
          </button>
          <input
            class="production-orders__search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="production-orders__project">
          <Table bordered className="production-orders__project-table">
            <thead>
              <tr>
                <th className="production-orders__project-th project">Проект</th>
                <th className="production-orders__project-th data">Вес/Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((dataProject) => (
                <tr key={dataProject.projectId}>
                  <td
                    className="production-orders__project-td project"
                    onClick={() => {
                      addToProductionProject(dataProject.projectId);
                    }}>
                    {dataProject.project.name} {dataProject.project.number}
                  </td>
                  <td className="production-orders__project-td data">
                    {formatNumber(dataProject.totalWeight)} кг /{' '}
                    {formatNumber(dataProject.totalCost)} руб
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    </div>
  );
}

export default ProductionOrders;
