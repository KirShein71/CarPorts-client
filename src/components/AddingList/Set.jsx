import React from 'react';
import CreateSet from './modals/CreateSet';
import UpdateSet from './modals/UpdateSet';
import { Table, Button, Spinner, Modal } from 'react-bootstrap';
import { getAllSets, updateActiveSet, deleteSet } from '../../http/setApi';

const defaultValue = { active: '' };
const defaultValid = {
  active: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'active') result.active = value.active.trim() !== '';
  }
  return result;
};

function Set() {
  const [sets, setSets] = React.useState([]);
  const [set, setSet] = React.useState(null);
  const [createSetModal, setCreateSetModal] = React.useState(false);
  const [updateSetModal, setUpdateSetModal] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [setToDelete, setSetToDelete] = React.useState(null);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    getAllSets()
      .then((data) => setSets(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    const set = sets.find((item) => item.id === id);
    setSetToDelete(set);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (setToDelete) {
      deleteSet(setToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setSetToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setSetToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setSetToDelete(null);
  };

  const handleCreateSet = () => {
    setCreateSetModal(true);
  };

  const handleUpdateSet = (id) => {
    setSet(id);
    setUpdateSetModal(true);
  };

  const handleInactiveSet = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'false');

    updateActiveSet(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleActiveSet = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'true');

    updateActiveSet(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="templates-task">
      <h2 className="templates-task__title">Комплекты</h2>
      <CreateSet show={createSetModal} setShow={setCreateSetModal} setChange={setChange} />
      <UpdateSet show={updateSetModal} setShow={setUpdateSetModal} setChange={setChange} id={set} />
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>Вы уверены, что хотите удалить комплект?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="dark" onClick={handleCreateSet} className="mt-3">
        Создать комплект
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Наименование</th>
              <th>Регион</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sets
              .sort((a, b) => a.number - b.number)
              .map((set) => (
                <tr key={set.id}>
                  <td>{set.number}</td>
                  <td>{set.name}</td>
                  <td>{set.regionId === 1 ? 'ЛО' : 'МО'}</td>
                  <td>
                    <Button variant="dark" onClick={() => handleUpdateSet(set.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    {set.active === 'true' ? (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/active.png"
                        alt="active"
                        onClick={() => handleInactiveSet(set.id)}
                      />
                    ) : (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/inactive.png"
                        alt="inactive"
                        onClick={() => handleActiveSet(set.id)}
                      />
                    )}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(set.id)}>
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

export default Set;
