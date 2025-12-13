import React from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { fetchBrigades } from '../../../http/bragadeApi';
import { getAllActiveWithDateFinishProject } from '../../../http/projectApi';
import { getAllExamination } from '../../../http/examinationApi';
import { createProjectExanamination } from '../../../http/projectExaminationApi';

const CreateTechSupervision = (props) => {
  const { show, setShow, setChange } = props;
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState('');
  const [brigades, setBrigades] = React.useState([]);
  const [selectedBrigade, setSelectedBrigade] = React.useState('');
  const [examinations, setExaminations] = React.useState([]);
  const [results, setResults] = React.useState({});
  const [sortOrderExaminationName, setSortOrderExaminationName] = React.useState('asc');
  const [sortExaminationName, setSortExaminationName] = React.useState('number');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, brigadesData, examinationsData] = await Promise.all([
          getAllActiveWithDateFinishProject(),
          fetchBrigades(),
          getAllExamination(),
        ]);

        setProjects(projectsData);
        setBrigades(brigadesData);
        setExaminations(examinationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleResultChange = (examinationId, value) => {
    setResults((prev) => ({
      ...prev,
      [examinationId]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // Проверяем, что выбраны проект и бригада
    if (!selectedProject) {
      return alert('Выберите проект');
    }
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
        data.append('projectId', selectedProject);
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
      setSelectedProject('');
      setSelectedBrigade('');

      // Закрываем модальное окно
      setShow(false);
    } catch (error) {
      console.error('Error saving data:', error);
      // Безопасная обработка ошибки
      const errorMessage =
        error.response?.data?.message || error.message || 'Произошла ошибка при сохранении';
      alert(errorMessage);
    }
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

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Заполнить чек лист</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSave}>
          {/* Выбор проекта */}
          <div className="mb-3">
            <label htmlFor="project-select" className="form-label">
              Проект
            </label>
            <select
              id="project-select"
              className="form-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              required>
              <option value="">Выберите проект</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор бригады */}
          <div className="mb-3">
            <label htmlFor="brigade-select" className="form-label">
              Бригада
            </label>
            <select
              id="brigade-select"
              className="form-select"
              value={selectedBrigade}
              onChange={(e) => setSelectedBrigade(e.target.value)}
              required>
              <option value="">Выберите бригаду</option>
              {brigades.map((brigade) => (
                <option key={brigade.id} value={brigade.id}>
                  {brigade.name}
                </option>
              ))}
            </select>
          </div>

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
              </tr>
            </thead>
            <tbody>
              {examinations.sort(numericSortExaminationName).map((examination) => (
                <tr key={examination.id}>
                  <td style={{ textAlign: 'left' }}>
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
      </Modal.Body>
    </Modal>
  );
};

export default CreateTechSupervision;
