import React from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { getAllExamination } from '../../../http/examinationApi';
import {
  getAllProjectBrigadeExamination,
  deleteProjectExanamination,
  updateResult,
} from '../../../http/projectExaminationApi';

const DetailsProjectExamination = (props) => {
  const { show, setShow, projectId, brigadeId } = props;
  const [examinationParagraphs, setExaminationParagraphs] = React.useState([]);
  const [examinations, setExaminations] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [examinationParagraphToDelete, setExaminationParagraphToDelete] = React.useState(null);
  const [examinationParagraphToEdit, setExaminationParagraphToEdit] = React.useState(null);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [sortOrderExaminationName, setSortOrderExaminationName] = React.useState('asc');
  const [sortExaminationName, setSortExaminationName] = React.useState('number');

  React.useEffect(() => {
    if (show && projectId && brigadeId) {
      const fetchExaminationData = async () => {
        try {
          const [examinationData, allExaminationsData] = await Promise.all([
            getAllProjectBrigadeExamination(projectId, brigadeId),
            getAllExamination(),
          ]);

          setExaminationParagraphs(examinationData);
          setExaminations(allExaminationsData);
        } catch (error) {
          console.error('Ошибка при загрузке данных проверок:', error);
        }
      };

      fetchExaminationData();
    }
  }, [show, projectId, brigadeId, change]);

  const handleDeleteClick = (id) => {
    const exam = examinationParagraphs.find((item) => item.id === id);
    setExaminationParagraphToDelete(exam);
    setDeleteModal(true);
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

  const handleResultChange = (value) => {
    setSelectedResult(value);
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
    // Находим соответствующие examination объекты
    const examA = examinations.find((exam) => exam.id === a.examinationId);
    const examB = examinations.find((exam) => exam.id === b.examinationId);

    // Получаем значения для сортировки
    const valA = examA?.number || 0;
    const valB = examB?.number || 0;

    const compareDecimalNumbers = (a, b) => {
      const partsA = String(a || 0).split('.');
      const partsB = String(b || 0).split('.');

      const intA = parseInt(partsA[0], 10);
      const intB = parseInt(partsB[0], 10);
      if (intA !== intB) return intA - intB;

      const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
      const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

      return decimalA - decimalB;
    };

    // Если одно из значений null/undefined, помещаем в конец
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;

    return sortOrderExaminationName === 'asc'
      ? compareDecimalNumbers(valA, valB)
      : compareDecimalNumbers(valB, valA);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="md"
        className="modal__planning"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Результаты</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered className="mt-3">
            <thead>
              <tr>
                <th onClick={() => handleSortExaminationName('number')}>
                  {' '}
                  <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
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
              {examinationParagraphs.sort(numericSortExaminationName).map((examParagraph) => (
                <tr key={examParagraph.id}>
                  {examinations

                    .filter((examName) => examName.id === examParagraph.examinationId)
                    .map((examName) => (
                      <td key={examName.id} style={{ textAlign: 'left' }}>
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
                    onClick={() => handleEditClick(examParagraph)}>
                    {examParagraph.result === 1 ? '+1' : examParagraph.result}
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                    <img
                      onClick={() => handleDeleteClick(examParagraph.id)}
                      src="./img/delete.png"
                      alt="delete"
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

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
                    onChange={() => handleResultChange(-1)}
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
                    onChange={() => handleResultChange(0)}
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
                    onChange={() => handleResultChange(+1)}
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
};

export default DetailsProjectExamination;
