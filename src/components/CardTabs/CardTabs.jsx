import React from 'react';
import { Link } from 'react-router-dom';
import './CardTabs.styles.scss';

function CardTabs() {
  return (
    <>
      <Link to="/project">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Проекты</h2>
          </div>
        </div>
      </Link>
      <Link to="/suppliers">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Поставщики</h2>
          </div>
        </div>
      </Link>
      <Link to="/payment">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Оплата</h2>
          </div>
        </div>
      </Link>
      <Link to="/stock">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Склад</h2>
          </div>
        </div>
      </Link>
      <Link to="/deadline">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Сроки</h2>
          </div>
        </div>
      </Link>
      <Link to="/logistics">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Логистика</h2>
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
      <Link to="team">
        <div className="cardtabs">
          <div className="cardtabs__content">
            <h2 className="cardtabs__title">Бригады</h2>
          </div>
        </div>
      </Link>
    </>
  );
}

export default CardTabs;
