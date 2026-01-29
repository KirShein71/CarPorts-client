import React from 'react';
import Header from '../Header/Header';
import { Table } from 'react-bootstrap';
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

  // Кэш для деталей каждого проекта, чтобы избежать полного рендера
  const [projectDetailsCache, setProjectDetailsCache] = React.useState({});

  React.useEffect(() => {
    Promise.all([getAllActiveWarehouseAssortement(), fetchAllProjectWarehouse()])
      .then(([warehouseData, projectData]) => {
        setWarehouseAssortements(warehouseData);
        setProjectWarehouses(projectData);

        // Инициализируем кэш деталей
        const initialCache = {};
        projectData.forEach((proWarehouse) => {
          const projectId = proWarehouse.projectId || proWarehouse.id;
          const details = getWarehouseDetailsForProject(
            proWarehouse,
            warehouseData,
            showAllRows[projectId],
          );
          initialCache[projectId] = details;
        });
        setProjectDetailsCache(initialCache);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, [change]);

  React.useEffect(() => {
    const filteredProjects = projectWarehouses.filter((project) => {
      const matchesSearch = project.project.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (buttonActiveProject && buttonClosedProject) {
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

    // Обновляем кэш для конкретного проекта
    const proWarehouse = projectWarehouses.find((p) => (p.projectId || p.id) === projectId);
    if (proWarehouse) {
      const shouldShowAll = !showAllRows[projectId];
      const details = getWarehouseDetailsForProject(
        proWarehouse,
        warehouseAssortements,
        shouldShowAll,
      );
      setProjectDetailsCache((prev) => ({
        ...prev,
        [projectId]: details,
      }));
    }
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

  // Функция для получения деталей проекта
  const getWarehouseDetailsForProject = (proWarehouse, assortments, shouldShowAll) => {
    const allAssortments = [...assortments].sort((a, b) => a.number - b.number);

    // Получаем все детали с данными
    const allDetails = allAssortments.map((wareAssortName) => {
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

    // Фильтруем: по умолчанию показываем только детали с количеством
    const detailsWithQuantity = allDetails.filter((detail) => detail.quantity !== '');

    if (shouldShowAll) {
      // Если показать все - возвращаем все детали
      return allDetails;
    } else {
      // Иначе возвращаем только детали с количеством (не более 4)
      return detailsWithQuantity.slice(0, 4);
    }
  };

  // Функция для обновления кэша после изменения детали
  const updateProjectCache = (updatedDetail) => {
    // Находим проект, к которому принадлежит обновленная деталь
    const project = projectWarehouses.find((p) =>
      p.props?.some((prop) => prop.id === updatedDetail.id),
    );

    if (!project) return;

    const projectId = project.projectId || project.id;

    // Обновляем props в проекте
    const updatedProjects = projectWarehouses.map((p) => {
      if ((p.projectId || p.id) === projectId) {
        const updatedProps = p.props
          ? p.props.map((prop) => (prop.id === updatedDetail.id ? updatedDetail : prop))
          : [];
        return { ...p, props: updatedProps };
      }
      return p;
    });

    setProjectWarehouses(updatedProjects);

    // Обновляем кэш для этого проекта
    const details = getWarehouseDetailsForProject(
      updatedProjects.find((p) => (p.projectId || p.id) === projectId),
      warehouseAssortements,
      showAllRows[projectId],
    );

    setProjectDetailsCache((prev) => ({
      ...prev,
      [projectId]: details,
    }));
  };

  // Проверяем, нужно ли показывать кнопку "Показать все/Скрыть" для проекта
  const shouldShowToggleButton = (proWarehouse) => {
    const projectId = proWarehouse.projectId || proWarehouse.id;
    const shouldShowAll = showAllRows[projectId];

    if (shouldShowAll) {
      return true; // Всегда показываем кнопку "Скрыть" когда показаны все детали
    }

    // Получаем все детали для проекта
    const allDetails = warehouseAssortements.map((wareAssortName) => {
      const warehouseProject = proWarehouse.props?.find(
        (prop) => prop.warehouse_assortement_id === wareAssortName.id,
      );
      return {
        quantity: warehouseProject ? warehouseProject.quantity : '',
      };
    });

    // Детали с количеством
    const detailsWithQuantity = allDetails.filter((detail) => detail.quantity !== '');

    // Показываем кнопку если:
    // 1. Есть детали без количества (которые не показываются по умолчанию)
    // 2. Или деталей с количеством больше 4
    const hasEmptyDetails = allDetails.some((detail) => detail.quantity === '');
    return hasEmptyDetails || detailsWithQuantity.length > 4;
  };

  return (
    <div className="warehouse">
      <Header title={'Заказы на склад'} />
      <CreateOneWarehouseDetail
        show={openModalCreateOneWarehouseDetail}
        setShow={setOpenModalCreateOneWarehouseDetail}
        warehouseAssortementId={warehouseAssortementId}
        projectId={projectId}
        setChange={setChange}
        onDetailCreated={updateProjectCache} // Передаем функцию для обновления кэша
      />
      <UpdateWarehouseDetail
        show={openModalUpdateWarehouseDetail}
        setShow={setOpenModalUpdateWarehouseDetail}
        setChange={setChange}
        id={oneProjectWarehouse}
        onDetailUpdated={updateProjectCache} // Передаем функцию для обновления кэша
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
            const projectId = proWarehouse.projectId || proWarehouse.id;
            const warehouseDetails = projectDetailsCache[projectId] || [];
            const shouldShowAll = showAllRows[projectId];

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
                  {warehouseDetails.length > 0 ? (
                    warehouseDetails.map((wareAssortName) => (
                      <tr key={`${projectId}-${wareAssortName.id}`}>
                        <td className="warehouse-table__td">{wareAssortName.name}</td>
                        <td
                          className="warehouse-table__td quantity"
                          onClick={() =>
                            wareAssortName.hasData
                              ? handleOpenModalUpdateWareouseDetail(
                                  wareAssortName.warehouseProjectId,
                                )
                              : handleOpenModalOneCreateWarehouseDetail(
                                  wareAssortName.id,
                                  proWarehouse.projectId,
                                )
                          }>
                          {wareAssortName.quantity || ''}
                        </td>
                      </tr>
                    ))
                  ) : !shouldShowAll ? (
                    // Показываем сообщение только если не открыт полный список
                    <tr></tr>
                  ) : null}
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
