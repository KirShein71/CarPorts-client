import React from 'react';
import Header from '../Header/Header';
import { getAllGroupByBrigade } from '../../http/projectExaminationApi';
import { fetchBrigades } from '../../http/bragadeApi';
import { Table } from 'react-bootstrap';
import DetailsProjectExamination from '../TechSupervision/modals/DetailsProjectExamination';

import './style.scss';

function ResultSupervisionComponent() {
  const [brigadeExaminations, setBrigadeExaminations] = React.useState([]);
  const [modalDetailExamination, setModalDetailExamination] = React.useState(false);
  const [projectId, setProjectId] = React.useState(null);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [selectedBrigadeName, setSelectedBrigadeName] = React.useState(null);
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const modalRef = React.useRef();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 460);

  React.useEffect(() => {
    Promise.all([getAllGroupByBrigade(), fetchBrigades()])
      .then(([brigadeExaminationsData, brigadesData]) => {
        setBrigadeExaminations(brigadeExaminationsData);
        setBrigades(brigadesData);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 460);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenModalDetailExamination = (projectId, brigadeId) => {
    setProjectId(projectId);
    setBrigadeId(brigadeId);
    setModalDetailExamination(true);
  };

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  return (
    <div className="result-supervision">
      <DetailsProjectExamination
        show={modalDetailExamination}
        setShow={setModalDetailExamination}
        projectId={projectId}
        brigadeId={brigadeId}
      />
      <Header title={'Итого Технадзора'} />
      <div className="dropdown" ref={modalRef}>
        <div className="dropdown__title" onClick={hadleOpenModalSelectedBrigade}>
          <button
            className="calendar-brigade__dropdown-brigade"
            onClick={hadleOpenModalSelectedBrigade}>
            {selectedBrigadeName ? (
              selectedBrigadeName
            ) : (
              <div>
                Бригада <img src="./img/arrow-down.png" alt="arrow down" />
              </div>
            )}
          </button>
        </div>
        {openModalSelectedBrigade && (
          <div className="dropdown__modal">
            <div className="dropdown__modal-content">
              <ul className="dropdown__modal-items">
                <li
                  className="dropdown__modal-item"
                  onClick={() => {
                    setSelectedBrigadeName(''); // Пустая строка
                    setSelectedBrigade(null);
                    setOpenModalSelectedBrigade(false);
                  }}>
                  Сбросить
                </li>
                {brigades.map((brigadesName) => (
                  <li
                    key={brigadesName.id}
                    className="dropdown__modal-item"
                    onClick={() => {
                      setSelectedBrigadeName(brigadesName.name);
                      setSelectedBrigade(brigadesName.id);
                      setOpenModalSelectedBrigade(false);
                    }}>
                    {brigadesName.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="result-supervision__content">
        {brigadeExaminations
          .sort((a, b) => b.brigadeAverage - a.brigadeAverage)
          .filter((brigExam) => {
            // Если бригада не выбрана, показываем все проекты
            if (!selectedBrigade) return true;

            // Проверяем, есть ли в проекте выбранная бригада
            return brigExam.brigadeId === selectedBrigade;
          })
          .map((brigExam) => (
            <Table
              key={brigExam.brigadeId}
              borderless
              style={{
                width: '100%',
                minWidth: '200px',
              }}>
              <thead>
                <tr>
                  <th
                    width={150}
                    className="result-supervision__brigade"
                    style={{ padding: isMobile ? '0px' : '.5rem .5rem' }} // ← условие
                  >
                    {brigExam.brigade}
                  </th>
                  <th
                    width={50}
                    className="result-supervision__brigRes"
                    style={{ padding: isMobile ? '0px' : '.5rem .5rem' }} // ← условие
                  >
                    {brigExam.brigadeAverage}
                  </th>
                </tr>
              </thead>
              <tbody>
                {brigExam.projects.map((proResult) => (
                  <tr key={proResult.projectId}>
                    <td
                      onClick={() =>
                        handleOpenModalDetailExamination(proResult.projectId, brigExam.brigadeId)
                      }
                      className="result-supervision__project"
                      style={{ padding: isMobile ? '0px' : '.5rem .5rem' }} // ← условие
                    >
                      {proResult.project}
                    </td>
                    <td
                      className="result-supervision__proRes"
                      style={{ padding: isMobile ? '0px' : '.5rem .5rem' }} // ← условие
                    >
                      {proResult.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
      </div>
    </div>
  );
}

export default ResultSupervisionComponent;
