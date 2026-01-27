import React from 'react';
import CreateBrigade from './modals/CreateBrigade';
import UpdateBridage from './modals/UpdateBrigade';
import CreateRegionBrigade from './modals/CreateRegionBrigade';
import CreatePasswordBrigade from './modals/CreatePasswordBrigade';
import UpdateBrigadePhone from './modals/UpdateBrigadePhone';
import UpdateBrigadeName from './modals/UpdateBrigadeName';
import { Table, Button, Modal } from 'react-bootstrap';
import { fetchBrigades, deleteBrigade, updateActiveBrigade } from '../../http/bragadeApi';

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

function Brigade() {
  const [brigades, setBrigades] = React.useState([]);
  const [brigade, setBrigade] = React.useState(null);
  const [brigadeModal, setBrigadeModal] = React.useState(false);
  const [brigadeUpdateModal, setBrigadeUpdateModal] = React.useState(false);
  const [createRegionModal, setCreateRegionModal] = React.useState(false);
  const [createPasswordModal, setCreatePasswordModal] = React.useState(false);
  const [updateBrigadePhoneModal, setUpdateBrigadePhoneModal] = React.useState(false);
  const [updateBrigadeNameModal, setUpdateBrigadeNameModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [brigadeToDelete, setBrigadeToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchBrigades().then((data) => setBrigades(data));
  }, [change]);

  const handleUpdateBrigade = (id) => {
    setBrigade(id);
    setBrigadeUpdateModal(true);
  };

  const handleUpdateBrigadeName = (id) => {
    setBrigade(id);
    setUpdateBrigadeNameModal(true);
  };

  const handleUpdateBrigadePhone = (id) => {
    setBrigade(id);
    setUpdateBrigadePhoneModal(true);
  };

  const hadleCreateRegionBrigade = (id) => {
    setBrigade(id);
    setCreateRegionModal(true);
  };

  const handleCreatePasswordBrigade = (id) => {
    setBrigade(id);
    setCreatePasswordModal(true);
  };

  const handleInactiveBrigade = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'true');

    setIsLoading(true);
    updateActiveBrigade(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleActiveBrigade = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'false');

    setIsLoading(true);
    updateActiveBrigade(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteClick = (id) => {
    const brig = brigades.find((brigade) => brigade.id === id);
    setBrigadeToDelete(brig);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (brigadeToDelete) {
      deleteBrigade(brigadeToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setBrigadeToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setBrigadeToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setBrigadeToDelete(null);
  };

  return (
    <div className="details">
      <h2 className="details__title">Монтажные бригады</h2>
      <CreateBrigade show={brigadeModal} setShow={setBrigadeModal} setChange={setChange} />
      <UpdateBridage
        show={brigadeUpdateModal}
        setShow={setBrigadeUpdateModal}
        id={brigade}
        setChange={setChange}
      />
      <UpdateBrigadeName
        show={updateBrigadeNameModal}
        setShow={setUpdateBrigadeNameModal}
        id={brigade}
        setChange={setChange}
      />
      <UpdateBrigadePhone
        show={updateBrigadePhoneModal}
        setShow={setUpdateBrigadePhoneModal}
        id={brigade}
        setChange={setChange}
      />
      <CreateRegionBrigade
        show={createRegionModal}
        setShow={setCreateRegionModal}
        setChange={setChange}
        id={brigade}
      />
      <CreatePasswordBrigade
        show={createPasswordModal}
        setShow={setCreatePasswordModal}
        setChange={setChange}
        id={brigade}
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
          Вы уверены, что хотите удалить бригаду
          {brigadeToDelete && ` «${brigadeToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setBrigadeModal(true)} className="mt-3">
        Создать бригаду
      </Button>
      <div className="ttable-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Бригады</th>
              <th>Номер телефона</th>
              <th>Регион</th>
              <th>Пароль</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brigades
              .sort((a, b) => a.id - b.id)
              .map((brigade) => (
                <tr key={brigade.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateBrigadeName(brigade.id)}>
                    {brigade.name}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateBrigadePhone(brigade.id)}>
                    {brigade?.phone}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => hadleCreateRegionBrigade(brigade.id)}>
                    {brigade.region?.region}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleCreatePasswordBrigade(brigade.id)}>
                      {brigade.password ? 'Изменить' : 'Добавить'}
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleUpdateBrigade(brigade.id)}>
                      Редактирование
                    </Button>
                  </td>
                  <td>
                    {brigade.active === 'true' ? (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/active.png"
                        alt="active"
                        onClick={() => handleActiveBrigade(brigade.id)}
                      />
                    ) : (
                      <img
                        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
                        src="./img/inactive.png"
                        alt="inactive"
                        onClick={() => handleInactiveBrigade(brigade.id)}
                      />
                    )}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(brigade.id)}>
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

export default Brigade;
