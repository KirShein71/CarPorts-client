import React from 'react';
import Header from '../Header/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
import { getAllUser, deleteUser } from '../../http/userApi';
import UpdatePhoneClient from './modal/UpdatePhoneClient';
import UpdatePasswordClient from './modal/UpdatePasswordClient';

function ClientAccountList() {
  const [users, setUsers] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [userId, setUserId] = React.useState(null);
  const [modalUpdatePhoneClient, setModalUpdatePhoneClient] = React.useState(false);
  const [modalUpdatePasswordClient, setModalUpdatePasswordClient] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    getAllUser()
      .then((data) => setUsers(data))
      .finally(() => setFetching(false));
  }, [change]);

  const addToInfo = (id) => {
    navigate(`/createinformationclient/${id}`, { state: { from: location.pathname } });
  };

  const handleOpenModalUpdatePhoneClient = (id) => {
    setModalUpdatePhoneClient(true);
    setUserId(id);
  };

  const handleOpenModalUpdatePasswordClient = (id) => {
    setModalUpdatePasswordClient(true);
    setUserId(id);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить личный кабинет?');
    if (confirmed) {
      deleteUser(id)
        .then((data) => {
          setChange(!change);
          alert('Личный кабинет пользователя был удален');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="clientaccount">
      <UpdatePhoneClient
        show={modalUpdatePhoneClient}
        setShow={setModalUpdatePhoneClient}
        setChange={setChange}
        id={userId}
      />
      <UpdatePasswordClient
        show={modalUpdatePasswordClient}
        setShow={setModalUpdatePasswordClient}
        setChange={setChange}
        id={userId}
      />
      <Header title={'Личный кабинет клиентов'} />
      <Link to="/createaccount">
        <Button variant="dark" className="mt-3">
          Создать личный кабинет
        </Button>
      </Link>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название</th>
              <th>Номер клиента</th>
              <th>Пароль</th>
              <th>Телеграм</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => b.id - a.id)
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.project.number}</td>
                  <td>{user.project.name}</td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenModalUpdatePhoneClient(user.id)}>
                    {user.phone}
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => handleOpenModalUpdatePasswordClient(user.id)}>
                      Изменить
                    </Button>
                  </td>
                  <td>{user.telegram_chat_id ? 'Да' : 'Нет'}</td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => addToInfo(user.id)}>
                      Добавить информацию
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => handleDeleteClick(user.id)}>
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

export default ClientAccountList;
