import React from 'react';
import CreateBrigade from './modals/CreateBrigade';
import UpdateBridage from './modals/UpdateBrigade';
import CreateRegionBrigade from './modals/CreateRegionBrigade';
import CreatePasswordBrigade from './modals/CreatePasswordBrigade';
import UpdateBrigadePhone from './modals/UpdateBrigadePhone';
import UpdateBrigadeName from './modals/UpdateBrigadeName';
import { Table, Button } from 'react-bootstrap';
import { fetchBrigades, deleteBrigade } from '../../http/bragadeApi';

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

  React.useEffect(() => {
    fetchBrigades().then((data) => setBrigades(data));
  }, [change]);

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить бригаду?');
    if (confirmed) {
      deleteBrigade(id)
        .then((data) => {
          setChange(!change);
          alert(`Бригада «${data.name}» будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

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
