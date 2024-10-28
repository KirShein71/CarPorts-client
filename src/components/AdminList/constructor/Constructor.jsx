import React from 'react';
import { getAllConstructor, deleteConstructor } from '../../../http/constructorApi';
import { Button, Spinner, Table } from 'react-bootstrap';
import CreateConstructor from './modals/CreateCostructor';
import UpdatePasswordConstructor from './modals/UpdatePasswordConstructor';

function Constructor() {
  const [constructors, setConstructors] = React.useState([]);
  const [constructor, setConstructor] = React.useState(null);
  const [openCreateConstructorModal, setOpenCreateConstructorModal] = React.useState(false);
  const [openUpdatePasswordConstructor, setOpenUpdatePasswordConstructor] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    getAllConstructor()
      .then((data) => setConstructors(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleCreateConstructor = () => {
    setOpenCreateConstructorModal(true);
  };

  const handeUpdateConstructorPassword = (id) => {
    setConstructor(id);
    setOpenUpdatePasswordConstructor(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить сотрудника?');
    if (confirmed) {
      deleteConstructor(id)
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
    <div className="manager-sale">
      <CreateConstructor
        show={openCreateConstructorModal}
        setShow={setOpenCreateConstructorModal}
        setChange={setChange}
      />
      <UpdatePasswordConstructor
        show={openUpdatePasswordConstructor}
        setShow={setOpenUpdatePasswordConstructor}
        setChange={setChange}
        id={constructor}
      />
      <div className="manager-sale__content">
        <h2 className="manager-sale__title">Конструктор</h2>
        <Button variant="dark" onClick={handleCreateConstructor} className="mt-3">
          Добавить конструктора
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
              {constructors?.map((constructor) => (
                <tr key={constructor.id}>
                  <td>{constructor.name}</td>
                  <td>{constructor.phone}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handeUpdateConstructorPassword(constructor.id)}>
                      {' '}
                      Изменить
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(constructor.id)}>
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

export default Constructor;
