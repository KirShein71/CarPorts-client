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
    </>
  );
}

export default CardTabs;
