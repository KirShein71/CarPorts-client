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

  React.useEffect(() => {
    if (user.isAdmin) navigate('/workingpage', { replace: true });
    if (user.isUser) navigate('/personalaccount', { replace: true });
    if (user.isEmployee) navigate('/workingpage', { replace: true });
  }, [navigate, user.isAdmin, user.isUser, user.isEmployee]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const phone = event.target.phone.value.trim();
    try {
      const data = await login(phone);

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
    if (!clicked) {
      setClicked(true);
    }
  };

  const handleInputChange = (event) => {
    setPhone(event.target.value);
  };

  return (
    <div className="login">
      <img src="./login_fon.jpg" alt="login_fon" />
      <div className="login__card">
        <h3 className="login__title">Авторизация</h3>
        <div className="login__content">
          <form onSubmit={handleSubmit} ref={form}>
            <input
              className="login__input"
              name="phone"
              value={clicked ? phone || 8 : ''}
              onChange={handleInputChange}
              onClick={handleInputClick}
              minLength="10"
              maxLength="11"
              placeholder="Введите номер телефона"
            />
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
