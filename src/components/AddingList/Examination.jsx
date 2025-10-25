import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { getAllExamination, deleteExamination } from '../../http/examinationApi';
import CreateExamination from './modals/CreateExamination';
import UpdateExamination from './modals/UpdateExamination';
import UpdateExaminationName from './modals/UpdateExaminationName';
import UpdateExaminationNumber from './modals/UpdateExaminationNumber';

function Examination() {
  const [examinations, setExaminations] = React.useState([]);
  const [examination, setExamination] = React.useState(null);
  const [createExaminationModal, setCreateExaminationModal] = React.useState(false);
  const [updateExaminationModal, setUpdateExaminationModal] = React.useState(false);
  const [updateNameExaminationModal, setUpdateNameExaminationModal] = React.useState(false);
  const [updateNumberExaminationModal, setUpdateNumberExaminationModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [examinationToDelete, setExaminationToDelete] = React.useState(null);

  React.useEffect(() => {
    getAllExamination().then((data) => setExaminations(data));
  }, [change]);

  const handleUpdateExamination = (id) => {
    setExamination(id);
    setUpdateExaminationModal(true);
  };

  const handleOpenUpdateExaminationNumberModal = (id) => {
    setExamination(id);
    setUpdateNumberExaminationModal(true);
  };

  const handleOpenUpdateExaminationNameModal = (id) => {
    setExamination(id);
    setUpdateNameExaminationModal(true);
  };

  const handleDeleteClick = (id) => {
    const exam = examinations.find((item) => item.id === id);
    setExaminationToDelete(exam);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (examinationToDelete) {
      deleteExamination(examinationToDelete.id)
        .then((data) => {
          setChange(!change);
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
    <div className="Examination">
      <h2 className="Examination__title">Список проверок</h2>
      <CreateExamination
        show={createExaminationModal}
        setShow={setCreateExaminationModal}
        setChange={setChange}
      />
      <UpdateExamination
        show={updateExaminationModal}
        setShow={setUpdateExaminationModal}
        setChange={setChange}
        id={examination}
      />
      <UpdateExaminationNumber
        show={updateNumberExaminationModal}
        setShow={setUpdateNumberExaminationModal}
        setChange={setChange}
        id={examination}
      />
      <UpdateExaminationName
        show={updateNameExaminationModal}
        setShow={setUpdateNameExaminationModal}
        setChange={setChange}
        id={examination}
      />
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
          Вы уверены, что хотите удалить проверку
          {examinationToDelete && ` «${examinationToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setCreateExaminationModal(true)} className="mt-3">
        Создать проверку
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название проверки</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {examinations
              .slice()
              .sort((a, b) => {
                // Разбиваем номера на части (например, "1.10" → ["1", "10"])
                const partsA = String(a.number || '0').split('.');
                const partsB = String(b.number || '0').split('.');

                // Сравниваем целые части
                const intA = parseInt(partsA[0], 10);
                const intB = parseInt(partsB[0], 10);
                if (intA !== intB) return intA - intB;

                // Если целые части равны, сравниваем десятичные
                const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
                const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

                return decimalA - decimalB;
              })
              .map((examination) => (
                <tr key={examination.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenUpdateExaminationNumberModal(examination.id)}>
                    {examination.number}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenUpdateExaminationNameModal(examination.id)}>
                    {examination.name}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleUpdateExamination(examination.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(examination.id)}>
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

export default Examination;
