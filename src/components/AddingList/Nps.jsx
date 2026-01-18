import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { getAllNpsChapter, deleteNpsChapter } from '../../http/npsChapterApi';
import { getAllNpsQuestion, deleteNpsQuestion } from '../../http/npsQuestionApi';
import CreateNpsChapter from './modals/CreateNpsChapter';
import CreateNameNpsChapter from './modals/CreateNameNpsChapter';
import CreateNumberNpsChapter from './modals/CreateNumberNpsChapter';
import CreateNpsQuestion from './modals/CreateNpsQuestion';
import CreateNameNpsQuestion from './modals/CreateNameNpsQuestion';
import CreateChapterNpsQuestion from './modals/CreateChapterNpsQuestion';

function Nps() {
  const [npsChapters, setNpsChapters] = React.useState([]);
  const [npsChapter, setNpsChapter] = React.useState(null);
  const [npsQuestions, setNpsQuestions] = React.useState([]);
  const [npsQuestion, setNpsQuestion] = React.useState(null);
  const [createModalNpsChapter, setCreateModalNpsChapter] = React.useState(false);
  const [createModalNameNpsChapter, setCreateModalNameNpsChapter] = React.useState(false);
  const [createModalNumberNpsChapter, setCreateModalNumberNpsChapter] = React.useState(false);
  const [createModalNpsQuestion, setCreateModalNpsQuestion] = React.useState(false);
  const [createModalNameNpsQuestion, setCreateModalNameNpsQuestion] = React.useState(false);
  const [createModalChapterNpsQuestion, setCreateModalChapterNpsQuestion] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteChapterModal, setDeleteChapterModal] = React.useState(false);
  const [chapterToDelete, setChapterToDelete] = React.useState(null);
  const [deleteQuestionModal, setDeleteQuestionModal] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    let isCancelled = false;

    const fetchData = async () => {
      try {
        // Выполняем запросы параллельно для ускорения
        const [chaptersResponse, questionsResponse] = await Promise.all([
          getAllNpsChapter(),
          getAllNpsQuestion(),
        ]);

        if (!isMounted || isCancelled) return;

        setNpsChapters(chaptersResponse);
        setNpsQuestions(questionsResponse);
      } catch (error) {
        console.error('Ошибка при загрузке NPS данных:', error);

        if (!isMounted || isCancelled) return;

        // Логирование ошибки или показ уведомления
        if (error.response) {
          console.error('Статус ошибки:', error.response.status);
          console.error('Данные ошибки:', error.response.data);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      isCancelled = true;
    };
  }, [change]);

  const handleOpenModalCreateNpsChapter = () => {
    setCreateModalNpsChapter(true);
  };

  const handleOpenModalCreateNameNpsChapter = (id) => {
    setNpsChapter(id);
    setCreateModalNameNpsChapter(true);
  };

  const handleOpenModalCreateNumberNpsChapter = (id) => {
    setNpsChapter(id);
    setCreateModalNumberNpsChapter(true);
  };

  const handleOpenModalCreateNpsQuestion = () => {
    setCreateModalNpsQuestion(true);
  };

  const handleOpenModalCreateNameNpsQuestion = (id) => {
    setNpsQuestion(id);
    setCreateModalNameNpsQuestion(true);
  };

  const handleOpenModalCreateChapterNpsQuestion = (id) => {
    setNpsQuestion(id);
    setCreateModalChapterNpsQuestion(true);
  };

  const handleDeleteChapterClick = (id) => {
    const chapter = npsChapters.find((item) => item.id === id);
    setChapterToDelete(chapter);
    setDeleteChapterModal(true);
  };

  const confirmChapterDelete = () => {
    if (chapterToDelete) {
      deleteNpsChapter(chapterToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteChapterModal(false);
          setChapterToDelete(null);
        })
        .catch((error) => {
          setDeleteChapterModal(false);
          setChapterToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelChapterDelete = () => {
    setDeleteChapterModal(false);
    setChapterToDelete(null);
  };

  const handleDeleteQuestionClick = (id) => {
    const question = npsQuestions.find((item) => item.id === id);
    setQuestionToDelete(question);
    setDeleteQuestionModal(true);
  };

  const confirmQuestionDelete = () => {
    if (questionToDelete) {
      deleteNpsQuestion(questionToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteQuestionModal(false);
          setQuestionToDelete(null);
        })
        .catch((error) => {
          setDeleteQuestionModal(false);
          setQuestionToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelQuestionDelete = () => {
    setDeleteQuestionModal(false);
    setQuestionToDelete(null);
  };

  return (
    <div className="service">
      <h2 className="service__title">Обратная связь</h2>
      <CreateNpsChapter
        show={createModalNpsChapter}
        setShow={setCreateModalNpsChapter}
        setChange={setChange}
      />
      <CreateNameNpsChapter
        show={createModalNameNpsChapter}
        setShow={setCreateModalNameNpsChapter}
        id={npsChapter}
        setChange={setChange}
      />
      <CreateNumberNpsChapter
        show={createModalNumberNpsChapter}
        setShow={setCreateModalNumberNpsChapter}
        id={npsChapter}
        setChange={setChange}
      />
      <CreateNpsQuestion
        show={createModalNpsQuestion}
        setShow={setCreateModalNpsQuestion}
        setChange={setChange}
      />
      <CreateNameNpsQuestion
        show={createModalNameNpsQuestion}
        setShow={setCreateModalNameNpsQuestion}
        id={npsQuestion}
        setChange={setChange}
      />
      <CreateChapterNpsQuestion
        show={createModalChapterNpsQuestion}
        setShow={setCreateModalChapterNpsQuestion}
        id={npsQuestion}
        setChange={setChange}
      />
      <Modal
        show={deleteChapterModal}
        onHide={cancelChapterDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить раздел
          {chapterToDelete && ` «${chapterToDelete.name}»`}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelChapterDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmChapterDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={deleteQuestionModal}
        onHide={cancelQuestionDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить вопрос
          {questionToDelete && ` «${questionToDelete.name}»`}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelQuestionDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmQuestionDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="dark" onClick={handleOpenModalCreateNpsChapter} className="mt-3">
        Создать раздел
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название раздела</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {npsChapters.map((npsChapter) => (
              <tr key={npsChapter.id}>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenModalCreateNumberNpsChapter(npsChapter.id)}>
                  {npsChapter.number}
                </td>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenModalCreateNameNpsChapter(npsChapter.id)}>
                  {npsChapter.name}
                </td>
                <td>
                  <Button variant="dark" onClick={() => handleDeleteChapterClick(npsChapter.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button variant="dark" onClick={handleOpenModalCreateNpsQuestion} className="mt-3">
        Добавить вопрос
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Вопрос</th>
              <th>Раздел</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {npsQuestions.map((npsQuestion) => (
              <tr key={npsQuestion.id}>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenModalCreateNameNpsQuestion(npsQuestion.id)}>
                  {npsQuestion.name}
                </td>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenModalCreateChapterNpsQuestion(npsQuestion.id)}>
                  {npsQuestion.nps_chapter.name}
                </td>
                <td>
                  <Button variant="dark" onClick={() => handleDeleteQuestionClick(npsQuestion.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Nps;
