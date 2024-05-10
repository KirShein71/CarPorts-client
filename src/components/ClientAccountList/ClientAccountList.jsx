import React from 'react';
import Header from '../Header/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
import { getAllUser, deleteUser } from '../../http/userApi';
import { getAllRegion } from '../../http/userImageApi';

function ClientAccountList() {
  const [users, setUsers] = React.useState([]);
  const [region, setRegion] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    getAllUser()
      .then((data) => setUsers(data))
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    getAllRegion().then((data) => setRegion(data));
  }, []);

  const addToInfo = (id) => {
    navigate(`/createinformationclient/${id}`, { state: { from: location.pathname } });
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
      <Header title={'Личный кабинет клиентов'} />
      <Link to="/createaccount">
        <Button className="mt-3">Создать личный кабинет</Button>
      </Link>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название</th>
              <th>Номер клиента</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.project.number}</td>
                <td>{user.project.name}</td>
                <td>{user.phone}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => addToInfo(user.id)}>
                    Добавить информацию
                  </Button>
                </td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleDeleteClick(user.id)}>
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
