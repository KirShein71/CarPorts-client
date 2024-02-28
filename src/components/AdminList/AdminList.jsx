import React from 'react';
import { getAllEmployee, deleteAccountEmployee } from '../../http/employeeApi';
import { Table, Spinner, Button } from 'react-bootstrap';
import CreateEmployee from './modals/CreateEmployee';

function Admin() {
  const [employees, setEmployees] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  const handleDeleteClick = (id) => {
    deleteAccountEmployee(id)
      .then((data) => {
        setChange(!change);
        alert(`Сотрудник «${data.name}» будет удален`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  React.useEffect(() => {
    getAllEmployee()
      .then((data) => setEmployees(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="adminlist">
      <div className="header">
        <h1 className="header__title">Создание доступа для сотрудников</h1>
      </div>
      <CreateEmployee show={show} setShow={setShow} setChange={setChange} />
      <Button onClick={() => setShow(true)} className="mt-3">
        Добавить сотрудника
      </Button>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Имя сотрудника</th>
            <th>Телефон</th>
            <th>Специальность</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.speciality}</td>
              <td>
                <Button onClick={() => handleDeleteClick(employee.id)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Admin;