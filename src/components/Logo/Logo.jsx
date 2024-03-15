import React from 'react';
import { AppContext } from '../../context/AppContext';
import { logout } from '../../http/userApi';
import { useNavigate } from 'react-router-dom';
import './Logo.styles.scss';

function Logo() {
  const { user } = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };
  return (
    <div className="top__content">
      <div className="logo">
        <img src="./logo.png" alt="logo" />
      </div>
      <div className="logout" onClick={handleLogout}>
        Выйти
      </div>
    </div>
  );
}

export default Logo;
