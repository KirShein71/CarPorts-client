import React from 'react';
import CreateBrigade from './modals/CreateBrigade';
import UpdateBridage from './modals/UpdateBrigade';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchBrigades, deleteBrigade } from '../../http/bragadeApi';

function Brigade() {
  const [brigades, setBrigades] = React.useState([]);
  const [brigade, setBrigade] = React.useState(null);
  const [brigadeModal, setBrigadeModal] = React.useState(false);
  const [brigadeUpdateModal, setBrigadeUpdateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchBrigades()
      .then((data) => setBrigades(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    deleteBrigade(id)
      .then((data) => {
        setChange(!change);
        alert(`Бригада «${data.name}» будет удалена`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleUpdateBrigade = (id) => {
    setBrigade(id);
    setBrigadeUpdateModal(true);
  };

  if (fetching) {
    return <Spinner />;
  }

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
      <Button onClick={() => setBrigadeModal(true)} className="mt-3">
        Создать бригаду
      </Button>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Бригады</th>
              <th>Номер телефона</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {brigades.map((brigade) => (
              <tr key={brigade.id}>
                <td>{brigade.name}</td>
                <td>{brigade?.phone}</td>
                <td>
                  <Button onClick={() => handleUpdateBrigade(brigade.id)}>Редактирование</Button>
                </td>
                <td>
                  <Button onClick={() => handleDeleteClick(brigade.id)}>Удалить</Button>
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
