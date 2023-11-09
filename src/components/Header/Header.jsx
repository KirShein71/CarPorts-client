import React from 'react';
import { Link } from 'react-router-dom';
import './Header.styles.scss';

function Header({ title }) {
  return (
    <div className="header">
      <Link to="/">
        <img className="header__icon" src="./back.png" alt="back" />
      </Link>
      <h1 className="header__title">{title}</h1>
    </div>
  );
}

export default Header;
