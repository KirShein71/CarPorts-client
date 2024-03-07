import React from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
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

      {/* <Container className="d-flex justify-content-center">
        <Card className="p-2 mt-5 bg-light" id="card">
          <h3 className="m-auto">Авторизация</h3>
          <Form className="d-flex flex-column" ref={form} onSubmit={handleSubmit}>
            <Form.Control
              name="phone"
              value={clicked ? phone || 8 : ''}
              onChange={handleInputChange}
              onClick={handleInputClick}
              minLength="10"
              maxLength="11"
              className="mt-3"
              placeholder="Введите номер телефона"
            />
            <div className="d-flex justify-content-between mt-3 pl-3 pr-3">
              <Button type="submit">Войти</Button>
            </div>
          </Form>
        </Card>
      </Container> */}
    </div>
  );
});

export default Login;
