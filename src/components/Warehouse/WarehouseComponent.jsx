import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner } from 'react-bootstrap';
import WarehouseChange from './change/WarehouseChange';
import { getAllActiveWarehouseAssortement } from '../../http/warehouseAssortmentApi';
import { fetchAllProjectWarehouse } from '../../http/projectWarehouseApi';
import UpdateWarehouseDetail from './modals/UpdateWarehouseDetail';
import CreateOneWarehouseDetail from './modals/CreateOneWarehouseDetail';

import './style.scss';

function WarehouseComponent() {
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [warehouseAssortements, setWarehouseAssortements] = React.useState([]);
  const [projectWarehouses, setProjectWarehouses] = React.useState([]);
  const [buttonActiveProject, setButtonActiveProject] = React.useState(true);
  const [buttonClosedProject, setButtonClosedProject] = React.useState(false);
  const [warehouseChangeComponent, setWarehouseChangeComponent] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [openModalUpdateWarehouseDetail, setOpenModalUpdateWarehouseDetail] = React.useState(false);
  const [oneProjectWarehouse, setOneProjectWarehouse] = React.useState(null);
  const [projectId, setProjectId] = React.useState(null);
  const [warehouseAssortementId, setWarehouseAssortementId] = React.useState(null);
  const [openModalCreateOneWarehouseDetail, setOpenModalCreateOneWarehouseDetail] =
    React.useState(false);
  const [showAllRows, setShowAllRows] = React.useState({});

  React.useEffect(() => {
    setFetching(true);

    Promise.all([getAllActiveWarehouseAssortement(), fetchAllProjectWarehouse()])
      .then(([warehouseData, projectData]) => {
        setWarehouseAssortements(warehouseData);
        setProjectWarehouses(projectData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [change]);

  React.useEffect(() => {
    const filteredProjects = projectWarehouses.filter((project) => {
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
  }, [projectWarehouses, buttonActiveProject, buttonClosedProject, searchQuery]);

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

  const handleToggleShowAllRows = (projectId) => {
    setShowAllRows((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleClickToWarehouseChange = () => {
    setWarehouseChangeComponent(true);
  };

  const handleClickToMainWarehouse = () => {
    setWarehouseChangeComponent(false);
    setChange((state) => !state);
  };

  const handleOpenModalOneCreateWarehouseDetail = (id, projectId) => {
    setWarehouseAssortementId(id);
    setProjectId(projectId);
    setOpenModalCreateOneWarehouseDetail(true);
  };

  const handleOpenModalUpdateWareouseDetail = (id) => {
    setOneProjectWarehouse(id);
    setOpenModalUpdateWarehouseDetail(true);
  };

  // Получаем warehouse details для конкретного проекта
  const getWarehouseDetailsForProject = (proWarehouse) => {
    // Получаем все warehouse assortments отсортированные по номеру
    const allAssortments = warehouseAssortements.sort((a, b) => a.number - b.number);

    // Сопоставляем с данными проекта
    let details = allAssortments.map((wareAssortName) => {
      const warehouseProject = proWarehouse.props?.find(
        (prop) => prop.warehouse_assortement_id === wareAssortName.id,
      );
      const quantity = warehouseProject ? warehouseProject.quantity : '';
      const warehouseProjectId = warehouseProject ? warehouseProject.id : null;

      return {
        ...wareAssortName,
        quantity,
        warehouseProjectId,
        hasData: !!warehouseProject,
      };
    });

    // Получаем ID проекта
    const projectId = proWarehouse.projectId || proWarehouse.id;

    // Ограничиваем показ 4 строками, если не нажата кнопка "Показать все" для этого проекта
    const shouldShowAll = showAllRows[projectId];
    return shouldShowAll ? details : details.slice(0, 4);
  };

  // Проверяем, нужно ли показывать кнопку "Показать все/Скрыть" для проекта
  const shouldShowToggleButton = (proWarehouse) => {
    return warehouseAssortements.length > 4;
  };

  // Проверяем, есть ли данные для отображения в проекте
  const hasDataInProject = (proWarehouse) => {
    return warehouseAssortements.length > 0;
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="warehouse">
      <Header title={'Заказы на склад'} />
      <CreateOneWarehouseDetail
        show={openModalCreateOneWarehouseDetail}
        setShow={setOpenModalCreateOneWarehouseDetail}
        warehouseAssortementId={warehouseAssortementId}
        projectId={projectId}
        setChange={setChange}
      />
      <UpdateWarehouseDetail
        show={openModalUpdateWarehouseDetail}
        setShow={setOpenModalUpdateWarehouseDetail}
        setChange={setChange}
        id={oneProjectWarehouse}
      />
      <div className="warehouse__filter">
        {warehouseChangeComponent ? (
          <button
            onClick={handleClickToMainWarehouse}
            className="warehouse-button___production-main">
            Главная
          </button>
        ) : (
          <>
            <button
              onClick={handleClickToWarehouseChange}
              className={`warehouse-button___production ${
                warehouseChangeComponent === true ? 'active' : 'inactive'
              }`}>
              Внести данные
            </button>
            <button
              onClick={handleToggleActiveProjects}
              className={`warehouse-button___production-active ${
                buttonActiveProject === true ? 'active' : 'inactive'
              }`}>
              Активные
            </button>
            <button
              onClick={handleToggleClosedProjects}
              className={`warehouse-button___production-noactive ${
                buttonClosedProject === true ? 'active' : 'inactive'
              }`}>
              Завершенные
            </button>
            <input
              className="warehouse__search"
              placeholder="Поиск"
              value={searchQuery}
              onChange={handleSearch}
            />
          </>
        )}
      </div>
      {warehouseChangeComponent ? (
        <WarehouseChange />
      ) : (
        <div className="warehouse__content">
          {filteredProjects.map((proWarehouse) => {
            const warehouseDetails = getWarehouseDetailsForProject(proWarehouse);
            const hasData = hasDataInProject(proWarehouse);
            const projectId = proWarehouse.projectId || proWarehouse.id; // Уникальный ID проекта

            if (!hasData) {
              return null;
            }

            return (
              <Table key={projectId} className="warehouse-table">
                <thead>
                  <tr>
                    <th className="warehouse-table__th">
                      {proWarehouse.project.name} {proWarehouse.project.number}
                    </th>
                    <th className="warehouse-table__th quantity">Кол-во</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseDetails.map((wareAssortName) => (
                    <tr key={`${projectId}-${wareAssortName.id}`}>
                      <td className="warehouse-table__td">{wareAssortName.name}</td>
                      <td
                        className="warehouse-table__td quantity"
                        onClick={() =>
                          wareAssortName.hasData
                            ? handleOpenModalUpdateWareouseDetail(wareAssortName.warehouseProjectId)
                            : handleOpenModalOneCreateWarehouseDetail(
                                wareAssortName.id,
                                proWarehouse.projectId,
                              )
                        }>
                        {wareAssortName.quantity || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {shouldShowToggleButton(proWarehouse) && (
                  <tfoot>
                    <tr>
                      <td colSpan="2">
                        <div
                          className="warehouse-button__show"
                          onClick={() => handleToggleShowAllRows(projectId)}>
                          {showAllRows[projectId] ? 'Скрыть' : 'Показать все'}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </Table>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WarehouseComponent;
