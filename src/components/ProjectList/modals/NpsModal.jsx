import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { getAllNpsChapter } from '../../../http/npsChapterApi';
import { getAllNpsQuestion } from '../../../http/npsQuestionApi';
import {
  createNpsProject,
  createNpsNote,
  getAllNpsForProject,
  getNoteForProject,
  deleteNpsProject,
  updateNpsProjectScore,
  updateNpsProjeNote,
  deleteNpsNote,
} from '../../../http/npsProjectApi';

import './styles.scss';

const defaultValue = {
  note: '',
};
const defaultValid = {
  note: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'note') result.note = value.note.trim() !== '';
  }
  return result;
};

function NpsModal(props) {
  const { show, setShow, projectId, nameProject, numberProject, setChangeProject } = props;
  const [npsChapters, setNpsChapters] = React.useState([]);
  const [npsQuestions, setNpsQuestions] = React.useState([]);
  const [npsProjectScores, setNpsProjectScores] = React.useState([]);
  const [npsNotesProject, setNpsNotesProject] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [scores, setScores] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [editNoteModal, setEditNoteModal] = React.useState(false);
  const [npsProjectToDelete, setNpsProjectToDelete] = React.useState(null);
  const [npsProjectToEdit, setNpsProjectToEdit] = React.useState(null);
  const [noteToEdit, setNoteToEdit] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [editScore, setEditScore] = React.useState(0);
  const [editNoteValue, setEditNoteValue] = React.useState('');
  const [npsNoteToDelete, setNpsNoteToDelete] = React.useState(null);
  const [deleteNoteModal, setDeleteNoteModal] = React.useState(false);

  React.useEffect(() => {
    if (show && projectId) {
      setFetching(true);
      setScores({});
      setValue(defaultValue);

      Promise.all([
        getAllNpsChapter(),
        getAllNpsQuestion(),
        getAllNpsForProject(projectId),
        getNoteForProject(projectId),
      ])
        .then(([chaptersData, questionsData, scoresData, notesData]) => {
          setNpsChapters(chaptersData);
          setNpsQuestions(questionsData);
          setNpsProjectScores(scoresData);
          setNpsNotesProject(notesData);

          if (scoresData && scoresData.length > 0) {
            const initialScores = {};
            scoresData.forEach((score) => {
              initialScores[score.nps_question_id] = score.score;
            });
            setScores(initialScores);
          }

          // Если есть заметки, устанавливаем первую как значение по умолчанию
          if (notesData && notesData.length > 0) {
            setValue({ note: notesData[0].note });
          }
        })
        .catch((error) => {
          console.error('Ошибка при загрузке данных:', error);
        })
        .finally(() => setFetching(false));
    }
  }, [show, projectId, change]);

  React.useEffect(() => {
    if (!show) {
      setValue(defaultValue);
      setValid(defaultValid);
    }
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleEditNoteChange = (event) => {
    setEditNoteValue(event.target.value);
  };

  const handleScoreChange = (questionId, score) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleDeleteClick = (id) => {
    const npsProject = npsProjectScores.find((item) => item.id === id);
    setNpsProjectToDelete(npsProject);
    setDeleteModal(true);
  };

  const handleEditClick = (id) => {
    const npsProject = npsProjectScores.find((item) => item.id === id);
    if (npsProject) {
      setNpsProjectToEdit(npsProject);
      setEditScore(npsProject.score);
      setEditModal(true);
    }
  };

  const handleDeleteNoteClick = (id) => {
    const npsNote = npsNotesProject.find((item) => item.id === id);
    setNpsNoteToDelete(npsNote);
    setDeleteNoteModal(true);
  };

  const confirmNoteDelete = () => {
    if (npsNoteToDelete) {
      deleteNpsNote(npsNoteToDelete.id)
        .then((data) => {
          // Удаляем заметку из локального состояния
          setNpsNotesProject((prev) => prev.filter((item) => item.id !== npsNoteToDelete.id));

          // Сбрасываем значение textarea
          setValue({ note: '' });

          setChange(!change);
          setDeleteNoteModal(false);
          setNpsNoteToDelete(null);
        })
        .catch((error) => {
          setDeleteNoteModal(false);
          setNpsNoteToDelete(null);
          alert(error.response?.data?.message || 'Произошла ошибка при удалении комментария');
        });
    }
  };

  const handleEditNoteClick = (note) => {
    setNoteToEdit(note);
    setEditNoteValue(note.note);
    setEditNoteModal(true);
  };

  const confirmDelete = () => {
    if (npsProjectToDelete) {
      deleteNpsProject(npsProjectToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setNpsProjectToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setNpsProjectToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const confirmEdit = () => {
    if (npsProjectToEdit) {
      const data = {
        score: editScore,
      };

      updateNpsProjectScore(npsProjectToEdit.id, data)
        .then((response) => {
          setScores((prev) => ({
            ...prev,
            [npsProjectToEdit.nps_question_id]: editScore,
          }));

          setNpsProjectScores((prev) =>
            prev.map((item) =>
              item.id === npsProjectToEdit.id ? { ...item, score: editScore } : item,
            ),
          );

          setEditModal(false);
          setNpsProjectToEdit(null);
          setChange(!change);
        })
        .catch((error) => {
          setEditModal(false);
          setNpsProjectToEdit(null);
          alert(error.response?.data?.message || 'Произошла ошибка при обновлении');
        });
    }
  };

  const confirmEditNote = () => {
    if (noteToEdit && editNoteValue.trim()) {
      const data = {
        note: editNoteValue.trim(),
      };

      updateNpsProjeNote(noteToEdit.id, data)
        .then((response) => {
          setNpsNotesProject((prev) =>
            prev.map((item) =>
              item.id === noteToEdit.id ? { ...item, note: editNoteValue.trim() } : item,
            ),
          );

          // Обновляем также значение в основном textarea
          setValue({ note: editNoteValue.trim() });

          setEditNoteModal(false);
          setNoteToEdit(null);
          setChange(!change);
        })
        .catch((error) => {
          setEditNoteModal(false);
          setNoteToEdit(null);
          alert(error.response?.data?.message || 'Произошла ошибка при обновлении заметки');
        });
    } else if (editNoteValue.trim() === '') {
      alert('Заметка не может быть пустой');
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setNpsProjectToDelete(null);
  };

  const cancelEdit = () => {
    setEditModal(false);
    setNpsProjectToEdit(null);
  };

  const cancelEditNote = () => {
    setEditNoteModal(false);
    setNoteToEdit(null);
    setEditNoteValue('');
  };

  const cancelDeleteNote = () => {
    setDeleteNoteModal(false);
    setNpsNoteToDelete(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const answeredQuestions = npsQuestions.filter((question) => scores[question.id] !== undefined);

    setSubmitting(true);

    try {
      const scorePromises = answeredQuestions.map((question) => {
        const score = scores[question.id];
        const existingScore = npsProjectScores.find((s) => s.nps_question_id === question.id);

        if (existingScore && existingScore.score === score) {
          return Promise.resolve();
        }

        const data = {
          projectId: projectId,
          nps_chapter_id: question.nps_chapter_id,
          nps_question_id: question.id,
          score: score,
        };

        return createNpsProject(data);
      });

      await Promise.all(scorePromises.filter((p) => p !== undefined));

      const noteText = value.note.trim();

      // Если есть текст заметки и нет существующих заметок - создаем новую
      if (noteText && npsNotesProject.length === 0) {
        const noteData = {
          projectId: projectId,
          note: noteText,
        };
        await createNpsNote(noteData);
      }
      // Если есть текст заметки и есть существующие заметки - обновляем первую
      else if (noteText && npsNotesProject.length > 0) {
        const noteData = {
          note: noteText,
        };
        await updateNpsProjeNote(npsNotesProject[0].id, noteData);
      }
      // Если текст заметки пустой и есть существующие заметки - удаляем все заметки
      else if (!noteText && npsNotesProject.length > 0) {
        // Удаляем все заметки
        const deletePromises = npsNotesProject.map((note) => deleteNpsNote(note.id));
        await Promise.all(deletePromises);
      }
      setChangeProject((state) => !state);
      setShow(false);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(error.response?.data?.message || 'Произошла ошибка при сохранении');
    } finally {
      setSubmitting(false);
    }
  };

  const getExistingScore = (questionId) => {
    const existingScore = npsProjectScores.find((score) => score.nps_question_id === questionId);
    return existingScore ? existingScore.score : null;
  };

  const renderScoreDisplay = (question) => {
    const existingScore = getExistingScore(question.id);
    const currentScore = scores[question.id] !== undefined ? scores[question.id] : existingScore;

    const npsProjectRecord = npsProjectScores.find(
      (score) => score.nps_question_id === question.id,
    );

    if (existingScore !== null) {
      return (
        <div className="nps-modal__existing-score">
          <div className="nps-modal__score-display">
            Оценка: <span className="nps-modal__score-value">{existingScore}</span>
          </div>
          <div
            className="nps-modal__update"
            onClick={() => npsProjectRecord && handleEditClick(npsProjectRecord.id)}>
            <img src="./img/update.png" alt="изменить" />
          </div>
          <div
            className="nps-modal__delete"
            onClick={() => npsProjectRecord && handleDeleteClick(npsProjectRecord.id)}>
            <img src="./img/delete-small.png" alt="удалить" />
          </div>
        </div>
      );
    }

    const scoresArray = [1, 2, 3, 4, 5];

    return (
      <div className="nps-modal__scores">
        {scoresArray.map((score) => (
          <button
            key={score}
            type="button"
            className={`nps-modal__scores-btn ${
              currentScore === score ? 'nps-modal__scores-btn--active' : ''
            }`}
            onClick={() => handleScoreChange(question.id, score)}>
            {score}
          </button>
        ))}
      </div>
    );
  };

  const renderNoteSection = () => {
    if (npsNotesProject.length === 0) {
      return (
        <textarea
          name="note"
          value={value.note}
          onChange={(e) => handleInputChange(e)}
          isValid={valid.note === true}
          isInvalid={valid.note === false}
          placeholder="Комментарий"
          style={{ height: '200px', width: '100%' }}
        />
      );
    } else {
      return (
        <div className="nps-modal__note-container">
          {npsNotesProject.map((noteProject) => (
            <div key={noteProject.id} className="nps-modal__note-with-controls">
              <textarea
                value={noteProject.note}
                readOnly
                style={{ height: '200px', width: '100%', marginBottom: '10px' }}
              />
              <div className="nps-modal__note-controls">
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => handleEditNoteClick(noteProject)}
                  style={{ marginRight: '10px' }}>
                  Редактировать
                </Button>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => handleDeleteNoteClick(noteProject.id)}>
                  {' '}
                  {/* Передаем ID */}
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      {/* Модальное окно удаления оценки */}
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>Вы уверены, что хотите удалить оценку?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно редактирования оценки */}
      <Modal
        show={editModal}
        onHide={cancelEdit}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Редактирование оценки</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          <div className="nps-modal__update">
            <p>Выберите новую оценку:</p>
            <div className="nps-modal__update-scores">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  className={`nps-modal__update-score ${
                    editScore === score ? 'nps-modal__update-score--active' : ''
                  }`}
                  onClick={() => setEditScore(score)}>
                  {score}
                </button>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelEdit}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmEdit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно удаления комментария */}
      <Modal
        show={deleteNoteModal}
        onHide={cancelDeleteNote}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить комментарий?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDeleteNote}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmNoteDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно редактирования комментария */}
      <Modal
        show={editNoteModal}
        onHide={cancelEditNote}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Редактирование заметки</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          <Form.Control
            as="textarea"
            value={editNoteValue}
            onChange={handleEditNoteChange}
            placeholder="Введите текст заметки"
            style={{ height: '200px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelEditNote}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmEditNote}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Основное модальное окно */}
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setChangeProject((state) => !state);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal__name">
        <Modal.Header closeButton>
          <Modal.Title className="nps-modal__nameProject">
            {numberProject} {nameProject}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {fetching ? (
              <div className="text-center p-3">Загрузка...</div>
            ) : (
              <div className="nps-modal">
                <div className="nps-modal__content">
                  {npsChapters.map((npsChapProj) => {
                    const chapterQuestions = npsQuestions.filter(
                      (npsQuesProj) => npsQuesProj.nps_chapter_id === npsChapProj.id,
                    );

                    if (chapterQuestions.length === 0) return null;

                    return (
                      <div key={npsChapProj.id} className="nps-modal__chapter">
                        <div className="nps-modal__chapter-title">
                          <strong>{npsChapProj.number}.</strong> {npsChapProj.name}
                        </div>

                        {chapterQuestions.map((npsQuesProj) => (
                          <div key={npsQuesProj.id} className="nps-modal__question">
                            <div className="nps-modal__question-title">{npsQuesProj.name}</div>
                            {renderScoreDisplay(npsQuesProj)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  <Row className="mb-3 mt-3">
                    <Col md={12}>{renderNoteSection()}</Col>
                  </Row>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => setShow(false)} disabled={submitting}>
              Отмена
            </Button>
            <Button variant="dark" type="submit" disabled={submitting || fetching}>
              {submitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default NpsModal;
