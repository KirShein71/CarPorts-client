import React from 'react';
import { fetchBrigades } from '../../http/bragadeApi';
import { getAllExamination } from '../../http/examinationApi';
import {
  createProjectExanamination,
  getAllExaminationForProject,
  deleteProjectExanamination,
  updateResult,
  deleteAllProjectBrigade,
} from '../../http/projectExaminationApi';
import { Table, Button, Modal } from 'react-bootstrap';

function TechExamination(props) {
  const { projectId, regionId } = props;
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [brigadeName, setBrigadeName] = React.useState('');
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [examinations, setExaminations] = React.useState([]);
  const [results, setResults] = React.useState({});
  const [change, setChange] = React.useState(true);
  const [examinationBrigades, setExaminationBrigades] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [examinationParagraphToDelete, setExaminationParagraphToDelete] = React.useState(null);
  const [examinationParagraphToEdit, setExaminationParagraphToEdit] = React.useState(null);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [sortOrderExaminationName, setSortOrderExaminationName] = React.useState('asc');
  const [sortField, setSortField] = React.useState('examination.number');
  const [sortExaminationName, setSortExaminationName] = React.useState('number');
  const [deleteAllModal, setDeleteAllModal] = React.useState(false);
  const [examinationBrigadeToDelete, setExaminationBrigadeToDelete] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [examinationsData, brigadesData] = await Promise.all([
          getAllExamination(),
          fetchBrigades(),
        ]);

        setExaminations(examinationsData);
        setBrigades(brigadesData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [change]);

  React.useEffect(() => {
    getAllExaminationForProject(projectId).then((data) => {
      setExaminationBrigades(data);
    });
  }, [change]);

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  const handleResultChange = (examinationId, value) => {
    setResults((prev) => ({
      ...prev,
      [examinationId]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedBrigade) {
      return alert('Выберите бригаду');
    }

    try {
      // Фильтруем проверки с результатами
      const examinationsWithResults = Object.keys(results).filter(
        (examinationId) => results[examinationId] !== undefined && results[examinationId] !== '',
      );

      // Если нет ни одного результата
      if (examinationsWithResults.length === 0) {
        return alert('Выберите хотя бы один результат для проверок');
      }

      // Отправляем запросы для каждой услуги с установленным результатом
      const promises = examinationsWithResults.map(async (examinationId) => {
        const result = results[examinationId];
        const data = new FormData();
        data.append('projectId', projectId);
        data.append('brigadeId', selectedBrigade);
        data.append('examinationId', examinationId);
        data.append('result', result);

        return await createProjectExanamination(data);
      });

      // Ждем, пока все запросы завершатся
      await Promise.all(promises);

      // Обновляем состояние
      setChange((state) => !state);

      // Сбрасываем значения после успешного сохранения
      setResults({});
      setSelectedBrigade('');
    } catch (error) {
      console.error('Error saving data:', error);
      // Безопасная обработка ошибки
      const errorMessage =
        error.response?.data?.message || error.message || 'Произошла ошибка при сохранении';
      alert(errorMessage);
    }
  };

  const handleDeleteClick = (id) => {
    // Ищем во всех бригадах
    let examToDelete = null;

    examinationBrigades.forEach((brigade) => {
      if (!examToDelete) {
        const exam = brigade.examinations?.find((item) => item.id === id);
        if (exam) {
          examToDelete = exam;
        }
      }
    });

    if (examToDelete) {
      setExaminationParagraphToDelete(examToDelete);
      setDeleteModal(true);
      console.log('Найденный элемент для удаления:', examToDelete);
    } else {
      console.log('Элемент не найден');
    }
  };

  const handleEditClick = (examParagraph) => {
    setExaminationParagraphToEdit(examParagraph);
    setSelectedResult(examParagraph.result);
    setEditModal(true);
  };

  const confirmDelete = () => {
    if (examinationParagraphToDelete) {
      deleteProjectExanamination(examinationParagraphToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setExaminationParagraphToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setExaminationParagraphToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const confirmEdit = () => {
    if (examinationParagraphToEdit && selectedResult !== null) {
      updateResult(examinationParagraphToEdit.id, selectedResult)
        .then((data) => {
          setChange(!change);
          setEditModal(false);
          setExaminationParagraphToEdit(null);
          setSelectedResult(null);
        })
        .catch((error) => {
          setEditModal(false);
          setExaminationParagraphToEdit(null);
          setSelectedResult(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setExaminationParagraphToDelete(null);
  };

  const cancelEdit = () => {
    setEditModal(false);
    setExaminationParagraphToEdit(null);
    setSelectedResult(null);
  };

  const handleResultChangeUpdate = (value) => {
    setSelectedResult(value);
  };

  const handleSortExamination = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const numericSort = (a, b) => {
    const getValue = (obj) => {
      const path = sortField.split('.');
      let value = obj;
      for (const key of path) {
        value = value?.[key];
        if (value === undefined) return null;
      }
      return value;
    };

    const compareDecimalNumbers = (a, b) => {
      // Разбиваем числа на целую и десятичную части
      const partsA = String(a || 0).split('.');
      const partsB = String(b || 0).split('.');

      // Сравниваем целые части
      const intA = parseInt(partsA[0], 10);
      const intB = parseInt(partsB[0], 10);
      if (intA !== intB) return intA - intB;

      // Если целые части равны, сравниваем десятичные
      const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
      const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

      return decimalA - decimalB;
    };

    const valA = getValue(a);
    const valB = getValue(b);

    // Если одно из значений null/undefined, помещаем в конец
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return sortOrder === 'asc'
      ? compareDecimalNumbers(valA, valB)
      : compareDecimalNumbers(valB, valA);
  };

  const handleSortExaminationName = (field) => {
    if (field === sortExaminationName) {
      setSortOrderExaminationName(sortOrderExaminationName === 'asc' ? 'desc' : 'asc');
    } else {
      setSortExaminationName(field);
      setSortOrderExaminationName('asc');
    }
  };

  const numericSortExaminationName = (a, b) => {
    const getValue = (obj) => {
      const path = sortExaminationName.split('.');
      let value = obj;
      for (const key of path) {
        value = value?.[key];
        if (value === undefined) return null;
      }
      return value;
    };

    const compareDecimalNumbers = (a, b) => {
      // Разбиваем числа на целую и десятичную части
      const partsA = String(a || 0).split('.');
      const partsB = String(b || 0).split('.');

      // Сравниваем целые части
      const intA = parseInt(partsA[0], 10);
      const intB = parseInt(partsB[0], 10);
      if (intA !== intB) return intA - intB;

      // Если целые части равны, сравниваем десятичные
      const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
      const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

      return decimalA - decimalB;
    };

    const valA = getValue(a);
    const valB = getValue(b);

    // Если одно из значений null/undefined, помещаем в конец
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return sortOrderExaminationName === 'asc'
      ? compareDecimalNumbers(valA, valB)
      : compareDecimalNumbers(valB, valA);
  };

  const handleDeleteAllClick = (brigadeId) => {
    // Находим бригаду для отображения в модалке
    const brigade = examinationBrigades.find((item) => item.brigadeId === brigadeId);
    if (brigade) {
      setExaminationBrigadeToDelete(brigade);
      setDeleteAllModal(true);
    }
  };

  // Функция подтверждения удаления всех проверок
  const confirmDeleteAll = () => {
    if (examinationBrigadeToDelete) {
      deleteAllProjectBrigade(projectId, examinationBrigadeToDelete.brigadeId)
        .then((data) => {
          // Локально обновляем состояние
          setExaminationBrigades((prev) =>
            prev.filter(
              (item) =>
                !(
                  item.projectId === examinationBrigadeToDelete.projectId &&
                  item.brigadeId === examinationBrigadeToDelete.brigadeId
                ),
            ),
          );
          setDeleteAllModal(false);
          setExaminationBrigadeToDelete(null);
        })
        .catch((error) => {
          setDeleteAllModal(false);
          setExaminationBrigadeToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  // Функция отмены удаления всех проверок
  const cancelDeleteAll = () => {
    setDeleteAllModal(false);
    setExaminationBrigadeToDelete(null);
  };

  return (
    <>
      <div className="tech-examination">
        <div className="tech-examination__content">
          {examinationBrigades?.map((examBrigade) => {
            const brigadeName = brigades.find((brigade) => brigade.id === examBrigade.brigadeId);

            return (
              <div key={examBrigade.id}>
                {brigadeName && (
                  <div className="tech-examination__brigade-name">Бригада: {brigadeName.name}</div>
                )}
                <Table bordered className="mt-3">
                  <thead>
                    <tr>
                      <th onClick={() => handleSortExamination('examination.number')}>
                        <div style={{ cursor: 'pointer', display: 'flex' }}>
                          {' '}
                          Наименование
                          <img
                            style={{
                              marginLeft: '10px',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                            }}
                            src="../img/sort.png"
                            alt="icon_sort"
                          />
                        </div>
                      </th>
                      <th>Результат</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {examBrigade.examinations.sort(numericSort).map((examResult) => (
                      <tr key={examResult.id}>
                        {examinations
                          .filter((examName) => examName.id === examResult.examinationId)
                          .map((examName) => (
                            <td key={examName.id}>
                              {examName?.number != null
                                ? `${examName.number}. ${examName?.name ?? ''}`
                                : examName?.name ?? ''}
                            </td>
                          ))}
                        <td
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                          onClick={() => handleEditClick(examResult)}>
                          {examResult.result === 1 ? '+1' : examResult.result}
                        </td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <img
                            onClick={() => handleDeleteClick(examResult.id)}
                            src="../img/delete.png"
                            alt="delete"
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Исправленная кнопка - используем examBrigade.projectId вместо projectId из пропсов */}
                <Button
                  onClick={() => handleDeleteAllClick(examBrigade.brigadeId)}
                  variant="dark"
                  size="sm"
                  className="mb-3">
                  Удалить
                </Button>
              </div>
            );
          })}

          <form className="tech-examination__form" onSubmit={handleSave}>
            <div className="tech-examination__brigade">
              <div
                className="tech-examination__brigade-title"
                onClick={hadleOpenModalSelectedBrigade}>
                Назначить бригаду: {brigadeName}
              </div>
              {openModalSelectedBrigade && (
                <div className="dropdown__modal">
                  <div className="dropdown__modal-content">
                    <ul className="dropdown__modal-items">
                      <div
                        className="dropdown__modal-item"
                        onClick={() => {
                          setBrigadeName('');
                          setSelectedBrigade(null);
                          setOpenModalSelectedBrigade(false);
                        }}></div>
                      {brigades
                        .filter((brigadesName) => brigadesName.regionId === regionId)
                        .map((brigadesName) => (
                          <div key={brigadesName.id}>
                            <li
                              className="dropdown__modal-item"
                              onClick={() => {
                                setBrigadeName(brigadesName.name);
                                setSelectedBrigade(brigadesName.id);
                                setOpenModalSelectedBrigade(false);
                              }}>
                              {brigadesName.name}
                            </li>
                          </div>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th onClick={() => handleSortExaminationName('number')}>
                    {' '}
                    <div style={{ cursor: 'pointer', display: 'flex' }}>
                      {' '}
                      Наименование
                      <img
                        style={{
                          marginLeft: '10px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                        }}
                        src="../img/sort.png"
                        alt="icon_sort"
                      />
                    </div>
                  </th>
                  <th>Результат</th>
                </tr>
              </thead>
              <tbody>
                {examinations.sort(numericSortExaminationName).map((examination) => (
                  <tr key={examination.id}>
                    <td>
                      {examination?.number != null
                        ? `${examination.number}. ${examination?.name ?? ''}`
                        : examination?.name ?? ''}
                    </td>
                    <td>
                      <div className="d-flex gap-3">
                        {/* Чекбокс -1 */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`examination-${examination.id}`}
                            id={`${examination.id}-minus`}
                            value={-1}
                            checked={results[examination.id] === -1}
                            onChange={() => handleResultChange(examination.id, -1)}
                          />
                          <label className="form-check-label" htmlFor={`${examination.id}-minus`}>
                            -1
                          </label>
                        </div>

                        {/* Чекбокс 0 */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`examination-${examination.id}`}
                            id={`${examination.id}-zero`}
                            value={0}
                            checked={results[examination.id] === 0}
                            onChange={() => handleResultChange(examination.id, 0)}
                          />
                          <label className="form-check-label" htmlFor={`${examination.id}-zero`}>
                            0
                          </label>
                        </div>

                        {/* Чекбокс 1 */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`examination-${examination.id}`}
                            id={`${examination.id}-plus`}
                            value={1}
                            checked={results[examination.id] === +1}
                            onChange={() => handleResultChange(examination.id, +1)}
                          />
                          <label className="form-check-label" htmlFor={`${examination.id}-plus`}>
                            +1
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button size="sm" variant="dark" type="submit">
              Сохранить
            </Button>
          </form>
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

      {/* Новое модальное окно удаления всех проверок бригады */}
      <Modal
        show={deleteAllModal}
        onHide={cancelDeleteAll}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления всех проверок</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          {examinationBrigadeToDelete && (
            <>
              <p>Вы уверены, что хотите удалить ВСЕ проверки?</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDeleteAll}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDeleteAll}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно редактирования результата */}
      <Modal
        show={editModal}
        onHide={cancelEdit}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Изменение результата</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          {examinationParagraphToEdit && (
            <>
              <p style={{ marginBottom: '20px' }}>
                <strong>Пункт проверки:</strong>{' '}
                {
                  examinations.find((exam) => exam.id === examinationParagraphToEdit.examinationId)
                    ?.name
                }
              </p>

              <div className="d-flex justify-content-around mb-3">
                {/* Чекбокс -1 */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="resultRadio"
                    id="result-minus"
                    value={-1}
                    checked={selectedResult === -1}
                    onChange={() => handleResultChangeUpdate(-1)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="result-minus"
                    style={{ fontWeight: 'bold' }}>
                    -1
                  </label>
                </div>

                {/* Чекбокс 0 */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="resultRadio"
                    id="result-zero"
                    value={0}
                    checked={selectedResult === 0}
                    onChange={() => handleResultChangeUpdate(0)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="result-zero"
                    style={{ fontWeight: 'bold' }}>
                    0
                  </label>
                </div>

                {/* Чекбокс 1 */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="resultRadio"
                    id="result-plus"
                    value={1}
                    checked={selectedResult === +1}
                    onChange={() => handleResultChangeUpdate(+1)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="result-plus"
                    style={{ fontWeight: 'bold' }}>
                    +1
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                Текущий результат: <strong>{examinationParagraphToEdit.result}</strong>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelEdit}>
            Отмена
          </Button>
          <Button
            variant="dark"
            onClick={confirmEdit}
            disabled={
              selectedResult === null || selectedResult === examinationParagraphToEdit?.result
            }>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TechExamination;
