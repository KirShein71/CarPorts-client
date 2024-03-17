import React from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { login } from '../../http/userApi';
import { observer } from 'mobx-react';

import './style.scss';

const Login = observer(() => {
  const { user } = React.useContext(AppContext);
  const navigate = useNavigate();
  const form = React.useRef();
  const [clicked, setClicked] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (user.isAdmin) navigate('/workingpage', { replace: true });
    if (user.isUser) navigate('/personalaccount', { replace: true });
    if (user.isEmployee) navigate('/workingpage', { replace: true });
  }, [navigate, user.isAdmin, user.isUser, user.isEmployee]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const phone = event.target.phone.value.trim();
    const password = event.target.password.value.trim();
    try {
      const data = await login(phone, password);

      if (data) {
        user.login(data);

        if (user.isAdmin) navigate('/admin');
        if (user.isUser) navigate('/personalaccount');
        if (user.isEmployee) navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputClick = () => {
    if (clicked) {
      setClicked(true);
      setPhone('8');
    }
  };

  const handleInputPhone = (event) => {
    if (event.target.value.length <= 11) {
      setPhone(event.target.value);
    }
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <img src="./login_fon.jpg" alt="login_fon" />
      <div className="login__card">
        <h3 className="login__title">Авторизация</h3>
        <div className="login__content">
          <form onSubmit={handleSubmit} ref={form}>
            <div>
              <input
                className="phone__input"
                name="phone"
                value={clicked ? phone : ''}
                onChange={handleInputPhone}
                onClick={handleInputClick}
                placeholder="Введите номер телефона"
              />
            </div>
            <div>
              <input
                className="password__input"
                name="password"
                value={password}
                onChange={handleInputPassword}
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите ваш пароль"
              />
            </div>
            <label className="login__label">
              Показать пароль
              <input
                style={{ marginLeft: '7px' }}
                type="checkbox"
                checked={showPassword}
                onChange={toggleShowPassword}
              />
            </label>
            <button type="submit" className="login__button">
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;
