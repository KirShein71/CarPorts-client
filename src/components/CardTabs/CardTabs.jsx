import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { logout } from '../../http/userApi';
import './CardTabs.styles.scss';

function CardTabs() {
  const { user } = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <Link to="/project">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Проекты</h2>
          </div>
        </div>
      </Link>
      <Link to="/production">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Производство</h2>
          </div>
        </div>
      </Link>
      <Link to="/planning">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Проектирование</h2>
          </div>
        </div>
      </Link>
      <Link to="/ordermaterials">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Заказы материалов</h2>
          </div>
        </div>
      </Link>
      <Link to="/installation">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Монтаж</h2>
          </div>
        </div>
      </Link>
      <Link to="/welders">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Сварщики</h2>
          </div>
        </div>
      </Link>
      <Link to="/shipment">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Отгрузка</h2>
          </div>
        </div>
      </Link>
      <Link to="/manufacture">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Итоговая производство</h2>
          </div>
        </div>
      </Link>
      <Link to="/clientaccount">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Личный кабинет клиента</h2>
          </div>
        </div>
      </Link>
      {user.isAdmin ? (
        <Link to="/admin">
          <div className="cardtabs">
            <div className="cardtabs__content">
              <h2 className="cardtabs__title">Админ</h2>
            </div>
          </div>
        </Link>
      ) : null}
      <Link to="/adding">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Справочники</h2>
          </div>
        </div>
      </Link>
      <div className="cardtabs" onClick={handleLogout}>
        <div className="cardtabs__content">
          <h2 className="cardtabs__title">Выйти</h2>
        </div>
      </div>
    </>
  );
}

export default CardTabs;
