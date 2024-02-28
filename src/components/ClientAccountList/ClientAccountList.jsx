import React from 'react';
import Header from '../Header/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Spinner, Table } from 'react-bootstrap';
import { getAllUser, deleteUser } from '../../http/userApi';

function ClientAccountList() {
  const [users, setUsers] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
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

  const handleDeleteClick = (id) => {
    deleteUser(id)
      .then((data) => {
        setChange(!change);
        alert(`Личный кабинет «${data.name}» будет удален`);
      })
      .catch((error) => alert(error.response.data.message));
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
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название</th>
            <th>Личный кабинет</th>
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
  );
}

export default ClientAccountList;