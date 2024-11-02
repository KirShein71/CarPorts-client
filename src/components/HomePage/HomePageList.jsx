import React from 'react';
import TableBrigadeCalendar from '../TableBrigadeCalendar/TableBrigadeCalendar';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { logout } from '../../http/userApi';
import CreateProject from './modals/CreateProject';
import Counter from './Counter';

import './style.scss';

const MenuItems = ({ items }) => {
  return items.map((item, index) => (
    <div key={index}>
      {item.title && <div className="homepage__title">{item.title}</div>}
      <Link to={item.link}>
        <div className="homepage__item">{item.label}</div>
      </Link>
    </div>
  ));
};

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

  const managerSaleItems = [
    { label: 'Добавить проект', onClick: hadleOpenModal },
    { label: 'Все проекты', link: '/project' },
  ];

  const managerProjectItems = [
    { label: 'Все проекты', link: '/project' },
    { label: 'Проектирование', link: '/planning' },
    { title: 'Производство' },
    { label: 'Заказы на производство', link: '/production' },
    { label: 'Произведено', link: '/welders' },
    { label: 'Отгрузки', link: '/shipment' },
    { label: 'Итоговая производство', link: '/manufacture' },
    { title: 'Снабжение' },
    { label: 'Заказ материалов', link: '/ordermaterials' },
    { title: 'Монтаж' },
    { label: 'Календарь монтажных работ', link: '/changebrigadedate' },
    { title: 'Администирование' },
    { label: 'Справочники', link: '/adding' },
  ];

  const adminItems = [
    { label: 'Все проекты', link: '/project' },
    { label: 'Проектирование', link: '/planning' },
    { title: 'Производство' },
    { label: 'Заказы на производство', link: '/production' },
    { label: 'Произведено', link: '/welders' },
    { label: 'Отгрузки', link: '/shipment' },
    { label: 'Итоговая производство', link: '/manufacture' },
    { title: 'Снабжение' },
    { label: 'Заказ материалов', link: '/ordermaterials' },
    { title: 'Монтаж' },
    { label: 'Монтажные работы', link: '/installation' },
    { label: 'Календарь монтажных работ', link: '/changebrigadedate' },
    { title: 'Администирование' },
    { label: 'Личные кабинеты заказчиков', link: '/clientaccount' },
    { label: 'Справочники', link: '/adding' },
    { label: 'Админ', link: '/admin' },
  ];

  const managerProductionItems = [
    { title: 'Производство' },
    { label: 'Заказы на производство', link: '/production' },
    { label: 'Произведено', link: '/welders' },
    { label: 'Отгрузки', link: '/shipment' },
    { label: 'Итоговая производство', link: '/manufacture' },
  ];

  const employeeItems = [
    { label: 'Все проекты', link: '/project' },
    { label: 'Проектирование', link: '/planning' },
    { title: 'Производство' },
    { label: 'Заказы на производство', link: '/production' },
    { label: 'Произведено', link: '/welders' },
    { label: 'Отгрузки', link: '/shipment' },
    { label: 'Итоговая производство', link: '/manufacture' },
    { title: 'Снабжение' },
    { label: 'Заказ материалов', link: '/ordermaterials' },
    { title: 'Монтаж' },
    { label: 'Монтажные работы', link: '/installation' },
    { label: 'Календарь монтажных работ', link: '/changebrigadedate' },
    { title: 'Администирование' },
    { label: 'Личные кабинеты заказчиков', link: '/clientaccount' },
    { label: 'Справочники', link: '/adding' },
  ];

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
            {user.isManagerSale && (
              <>
                <MenuItems items={managerSaleItems} />
              </>
            )}
            {user.isManagerProject && <MenuItems items={managerProjectItems} />}
            {user.isAdmin && <MenuItems items={adminItems} />}
            {user.isManagerProduction && <MenuItems items={managerProductionItems} />}
            {user.isEmployee && <MenuItems items={employeeItems} />}
            <div className="homepage__item" onClick={handleLogout}>
              Выйти
            </div>{' '}
          </div>
          {user.isManagerProduction ? (
            ''
          ) : (
            <div className="homepage__bottom">
              <TableBrigadeCalendar />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePageList;
