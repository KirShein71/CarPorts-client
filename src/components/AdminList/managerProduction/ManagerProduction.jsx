import React from 'react';
import {
  getAllManagerProduction,
  deleteManagerProduction,
} from '../../../http/managerProductionApi';
import { Button, Spinner, Table } from 'react-bootstrap';
import CreateManagerProduction from './modals/CreateManagerProduction';
import UpdatePasswordManagerProduction from './modals/UpdatePasswordManagerProduction';

function ManagerProduction() {
  const [managerProductions, setManagerProductions] = React.useState([]);
  const [managerProduction, setManagerProduction] = React.useState(null);
  const [openCreateManagerProductionModal, setOpenCreateManagerProductionModal] =
    React.useState(false);
  const [openUpdatePasswordManagerProduction, setOpenUpdatePasswordManagerProduction] =
    React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    getAllManagerProduction()
      .then((data) => setManagerProductions(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleCreateManagerProduction = () => {
    setOpenCreateManagerProductionModal(true);
  };

  const handeUpdateManagerProductionPassword = (id) => {
    setManagerProduction(id);
    setOpenUpdatePasswordManagerProduction(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить сотрудника?');
    if (confirmed) {
      deleteManagerProduction(id)
        .then((data) => {
          setChange(!change);
          alert(`Сотрудник «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="manager-Production">
      <CreateManagerProduction
        show={openCreateManagerProductionModal}
        setShow={setOpenCreateManagerProductionModal}
        setChange={setChange}
      />
      <UpdatePasswordManagerProduction
        show={openUpdatePasswordManagerProduction}
        setShow={setOpenUpdatePasswordManagerProduction}
        setChange={setChange}
        id={managerProduction}
      />
      <div className="manager-sale__content">
        <h2 className="manager-sale__title">Руководитель производства</h2>
        <Button variant="dark" onClick={handleCreateManagerProduction} className="mt-3">
          Добавить руководителя производства
        </Button>
        <div className="table-container">
          <Table bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Имя сотрудника</th>
                <th>Телефон</th>
                <th>Пароль</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {managerProductions?.map((managerProduction) => (
                <tr key={managerProduction.id}>
                  <td>{managerProduction.name}</td>
                  <td>{managerProduction.phone}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handeUpdateManagerProductionPassword(managerProduction.id)}>
                      {' '}
                      Изменить
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(managerProduction.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ManagerProduction;
