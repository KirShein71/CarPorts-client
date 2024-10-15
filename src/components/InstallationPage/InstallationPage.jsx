import React from 'react';
import { getAllEstimateForBrigade, createEstimateBrigade } from '../../http/estimateApi';
import { getAllNumberOfDaysBrigade } from '../../http/brigadesDateApi';
import { logout } from '../../http/bragadeApi';
import CheckboxInstallation from './checkbox/CheckboxInstallation';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ProjectInfo from './ProjectInfo';

import './style.scss';

function InstallationPage() {
  const { user } = React.useContext(AppContext);
  const [serviceEstimate, setServiceEstimate] = React.useState([]);
  const [checked, setChecked] = React.useState({});
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [days, setDays] = React.useState();
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');
    getAllEstimateForBrigade(brigadeId).then((data) => {
      setServiceEstimate(data);
      const initialChecked = {};
      data.map((col) => {
        col.estimates.forEach((colEst) => {
          initialChecked[colEst.id] = colEst.done === 'true' ? true : false;
        });
      });
      setChecked(initialChecked);
    });
  }, [change]);

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');
    const projectId = selectedProject;

    if (projectId !== null) {
      getAllNumberOfDaysBrigade(brigadeId, projectId).then((data) => setDays(data));
    }
  }, [selectedProject, change]);

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id], // Меняем состояние чекбокса по его id
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    // Создаем плоский массив обновлений
    const updates = serviceEstimate.flatMap((col) =>
      col.estimates.map((colEst) => ({
        id: colEst.id,
        done: checked[colEst.id] ? 'true' : 'false',
      })),
    );

    // Отправляем данные на бэк
    Promise.all(
      updates.map((update) =>
        createEstimateBrigade(update.id, update.done)
          .then((response) => {
            setChange((state) => !state);
          })
          .catch((error) => {
            alert(error.response.data.message);
          }),
      ),
    ).then(() => {
      // Обработка успешного завершения всех запросов, если нужно
      console.log('Все изменения сохранены');
    });
  };

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="installation-page">
      <div className="installation-page__content">
        <div className="installation-page__projects">
          {serviceEstimate.map((estimateProject) => (
            <div
              key={estimateProject.id}
              className={`installation-page__project ${
                estimateProject.projectId === selectedProject ? 'active' : ''
              }`}
              onClick={() => setSelectedProject(estimateProject.projectId)}>
              {estimateProject.projectName}
            </div>
          ))}
        </div>
        {selectedProject && (
          <>
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th className="installation-page__head">Наименование</th>
                  <th className="installation-page__head">Стоимость</th>
                  <th className="installation-page__head">Выполнение</th>
                </tr>
              </thead>
              <tbody>
                {serviceEstimate.map((col) =>
                  col.estimates
                    .filter(
                      (estimateForProject) => estimateForProject.projectId === selectedProject,
                    )
                    .map((estimateForProject) => (
                      <tr key={estimateForProject.id}>
                        <td className="installation-page__body">
                          {estimateForProject.service.name}
                        </td>
                        <td className="installation-page__body">{estimateForProject.price}</td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <CheckboxInstallation
                            change={checked[estimateForProject.id]} // Передаем состояние чекбокса
                            handle={() => handleCheckboxChange(estimateForProject.id)} // Обработчик изменения состояния
                          />
                        </td>
                      </tr>
                    )),
                )}
              </tbody>
            </Table>
            <form className="installation-page__form" onSubmit={handleSave}>
              <Button variant="dark" size="sm" type="submit">
                Сохранить
              </Button>
            </form>
            <div className="installation-page__money">
              {(() => {
                const totalPrice = serviceEstimate.reduce((total, sumEst) => {
                  const projectTotal = sumEst.estimates
                    .filter(
                      (estimateForProject) =>
                        estimateForProject.done === 'true' &&
                        estimateForProject.projectId === selectedProject,
                    )
                    .reduce((accumulator, current) => accumulator + Number(current.price), 0);
                  return total + projectTotal;
                }, 0);

                return (
                  <>
                    <div className="installation-page__money-general">
                      Общая сумма: {totalPrice}₽
                    </div>
                    <div className="installation-page__money-daily">
                      Заработок за день: {days > 0 ? Math.ceil(totalPrice / days) : 0}₽
                    </div>
                  </>
                );
              })()}{' '}
            </div>
          </>
        )}
        <ProjectInfo projectId={selectedProject} />
        <div className="installation-page__logout" onClick={handleLogout}>
          {' '}
          Выйти
        </div>
      </div>
    </div>
  );
}

export default InstallationPage;
