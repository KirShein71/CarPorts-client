import React from 'react';
import Header from '../Header/Header';
import CreateTechSupervision from './modals/CreateTechSupervision';
import DetailsProjectExamination from './modals/DetailsProjectExamination';
import {
  getAllProjectExamination,
  deleteAllProjectBrigade,
} from '../../http/projectExaminationApi';
import { Button, Table, Modal } from 'react-bootstrap';

import './style.scss';

function TechSupervisionComponent() {
  const [projectExaminations, setProjectExaminations] = React.useState([]);
  const [change, setChange] = React.useState(false);
  const [modalCreateTechSupervision, setModalCreateTechSupervision] = React.useState(false);
  const [modalDetailExamination, setModalDetailExamination] = React.useState(false);
  const [projectId, setProjectId] = React.useState(null);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [examinationToDelete, setExaminationToDelete] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const projectExaminationsData = await getAllProjectExamination();
        setProjectExaminations(projectExaminationsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [change]);

  const handleOpenModalCreateTechSupervision = () => {
    setModalCreateTechSupervision(true);
  };

  const handleOpenModalDetailExamination = (projectId, brigadeId) => {
    setProjectId(projectId);
    setBrigadeId(brigadeId);
    setModalDetailExamination(true);
  };

  const handleDeleteClick = (projectId, brigadeId) => {
    // Находим любой элемент с этими projectId и brigadeId для отображения в модалке
    const exam = projectExaminations.find(
      (item) => item.projectId === projectId && item.brigadeId === brigadeId,
    );
    setExaminationToDelete(exam);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (examinationToDelete) {
      deleteAllProjectBrigade(examinationToDelete.projectId, examinationToDelete.brigadeId)
        .then((data) => {
          // Локально удаляем данные из состояния
          setProjectExaminations((prev) =>
            prev.filter(
              (item) =>
                !(
                  item.projectId === examinationToDelete.projectId &&
                  item.brigadeId === examinationToDelete.brigadeId
                ),
            ),
          );
          setDeleteModal(false);
          setExaminationToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setExaminationToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setExaminationToDelete(null);
  };

  return (
    <>
      <div className="tech-supervision">
        <CreateTechSupervision
          show={modalCreateTechSupervision}
          setShow={setModalCreateTechSupervision}
          setChange={setChange}
        />
        <DetailsProjectExamination
          show={modalDetailExamination}
          setShow={setModalDetailExamination}
          projectId={projectId}
          brigadeId={brigadeId}
          setChange={setChange}
        />
        <Header title={'Технадзор'} />

        <div className="tech-supervision__content">
          <button
            className="tech-supervision__button"
            onClick={() => handleOpenModalCreateTechSupervision()}>
            Добавить проверку
          </button>
          <Table bordered size="sm" className="mt-3">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Номер</th>
                <th style={{ textAlign: 'center' }}>Проект</th>
                <th style={{ textAlign: 'center' }}>Бригада</th>
                <th style={{ textAlign: 'center' }}>Результат</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projectExaminations.reduce((acc, proExam, index, array) => {
                const isFirstOfProject =
                  index === 0 || proExam.projectId !== array[index - 1].projectId;

                if (isFirstOfProject) {
                  const projectBrigades = array.filter(
                    (item) => item.projectId === proExam.projectId,
                  );

                  // Добавляем первую строку с проектом
                  acc.push(
                    <tr key={`project-${proExam.projectId}`}>
                      <td style={{ textAlign: 'center' }} rowSpan={projectBrigades.length}>
                        {proExam.project.number}
                      </td>
                      <td rowSpan={projectBrigades.length}>{proExam.project.name}</td>
                      <td style={{ textAlign: 'center' }}>{proExam.brigade.name}</td>
                      <td style={{ textAlign: 'center' }}>{proExam.averagePercentage}</td>
                      <td style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          size="sm"
                          variant="dark"
                          onClick={() =>
                            handleOpenModalDetailExamination(proExam.projectId, proExam.brigadeId)
                          }>
                          Подробнее
                        </Button>
                      </td>
                      <td>
                        <img
                          onClick={() => handleDeleteClick(proExam.projectId, proExam.brigadeId)}
                          style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                          src="./img/delete.png"
                          alt="delete"
                        />
                      </td>
                    </tr>,
                  );

                  // Добавляем остальные бригады этого проекта
                  for (let i = 1; i < projectBrigades.length; i++) {
                    acc.push(
                      <tr key={`brigade-${projectBrigades[i].id}`}>
                        <td style={{ textAlign: 'center' }}>{projectBrigades[i].brigade.name}</td>
                        <td style={{ textAlign: 'center' }}>
                          {projectBrigades[i].averagePercentage}
                        </td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button
                            size="sm"
                            variant="dark"
                            onClick={() =>
                              handleOpenModalDetailExamination(
                                projectBrigades[i].projectId,
                                projectBrigades[i].brigadeId,
                              )
                            }>
                            Подробнее
                          </Button>
                        </td>
                        <td>
                          <img
                            onClick={() =>
                              handleDeleteClick(
                                projectBrigades[i].projectId,
                                projectBrigades[i].brigadeId,
                              )
                            }
                            style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                            src="./img/delete.png"
                            alt="delete"
                          />
                        </td>
                      </tr>,
                    );
                  }
                }

                return acc;
              }, [])}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Модальное окно удаления */}
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить пункт проверки?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TechSupervisionComponent;
