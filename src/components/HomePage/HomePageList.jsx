import React from 'react';
import TableBrigadeCalendar from '../TableBrigadeCalendar/TableBrigadeCalendar';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { logout } from '../../http/userApi';
import CreateProject from './modals/CreateProject';
import Counter from './Counter';

import './style.scss';

function HomePageList() {
  const { user } = React.useContext(AppContext);
  const [createProjectModal, setCreateProjectModal] = React.useState(false);
  const [setChange] = React.useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    user.logout();
    navigate('/', { replace: true });
  };

  const hadleOpenModal = () => {
    setCreateProjectModal(true);
  };

  return (
    <>
      <CreateProject
        show={createProjectModal}
        setShow={setCreateProjectModal}
        setChange={setChange}
      />
      <div className="homepage">
        <Counter />
        <div className="homepage__content">
          <div className="homepage__items">
            <Link to="/project">
              <div className="homepage__title-1">Все проекты</div>
            </Link>
            <Link to="/planning">
              <div className="homepage__title-1">Проектирование</div>
            </Link>
            <div className="homepage__title">Производство</div>
            <Link to="/production">
              <div className="homepage__item">Заказы на производство</div>
            </Link>
            <Link to="/welders">
              <div className="homepage__item">Произведено</div>
            </Link>
            <Link to="/shipment">
              <div className="homepage__item">Отгрузки</div>
            </Link>
            <Link to="/manufacture">
              <div className="homepage__item">Итоговая производство</div>
            </Link>
            <div className="homepage__title">Снабжение</div>
            <Link to="/ordermaterials">
              <div className="homepage__item">Заказ материалов</div>
            </Link>
            <div className="homepage__title">Монтаж</div>
            <Link to="/installation">
              <div className="homepage__item">Монтажные работы</div>
            </Link>
            <Link to="/changebrigadedate">
              <div className="homepage__item">Календарь монтажных работ</div>
            </Link>
            <div className="homepage__title">Администирование</div>
            <Link to="/clientaccount">
              <div className="homepage__item">Личные кабинеты заказчиков</div>
            </Link>
            <Link to="/adding">
              <div className="homepage__item">Справочники</div>
            </Link>
            {user.isAdmin ? (
              <Link to="/admin">
                <div className="homepage__item">Админ</div>
              </Link>
            ) : null}
            {user.isAdmin ? (
              <Link to="/test">
                <div className="homepage__item">Тестовая страница монтажников</div>
              </Link>
            ) : null}
            <div className="homepage__item" onClick={handleLogout}>
              {' '}
              Выйти
            </div>
          </div>
          <div className="homepage__bottom">
            <TableBrigadeCalendar />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePageList;
