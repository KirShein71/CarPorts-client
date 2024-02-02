import React from 'react';
import { getOneAccount, logout } from '../../http/userApi';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function PersonalAccountList() {
  const [account, setAccount] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = localStorage.getItem('id');
    getOneAccount(userId)
      .then((data) => setAccount(data))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  return (
    <>
      <div>Добро Пожаловать</div>
      <div>Это ваш личный кабинет</div>
      <>
        {[account].map((userData) => (
          <div key={userData.id}>
            <div>{userData.project.name}</div>
            <div>{userData.project.number}</div>
          </div>
        ))}
      </>
      <Button onClick={handleLogout}>Выйти</Button>
    </>
  );
}

export default PersonalAccountList;
