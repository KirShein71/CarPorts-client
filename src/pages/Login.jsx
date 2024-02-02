import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { login } from '../http/userApi';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const phone = event.target.phone.value.trim();
    try {
      const data = await login(phone);
      if (data) {
        localStorage.setItem('id', data.id);
        navigate('/personalaccount');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '50%' }} className="p-2 mt-5 bg-light">
        <h3 className="m-auto">Авторизация</h3>
        <Form className="d-flex flex-column" onSubmit={handleSubmit}>
          <Form.Control
            name="phone"
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
    </Container>
  );
}

export default Login;
