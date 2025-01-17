import React from 'react';
import { getAllEmployee, deleteAccountEmployee } from '../../http/employeeApi';
import { Table, Spinner, Button } from 'react-bootstrap';
import CreateEmployee from './modals/CreateEmployee';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import ManagerSale from './managerSale/ManagerSale';
import ManagerProject from './managerproject/ManagerProject';
import Constructor from './constructor/Constructor';
import ManagerProduction from './managerProduction/ManagerProduction';

function Admin() {
  const [employees, setEmployees] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить сотрудника?');
    if (confirmed) {
      deleteAccountEmployee(id)
        .then((data) => {
          setChange(!change);
          alert(`Сотрудник «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
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
      <Header title={'Создание доступа для сотрудников'} />
      <CreateEmployee show={show} setShow={setShow} setChange={setChange} />
      <Button variant="dark" onClick={() => setShow(true)} className="mt-3">
        Добавить сотрудника
      </Button>
      <div className="table-container">
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
                  <Button variant="dark" onClick={() => handleDeleteClick(employee.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ManagerSale />
      <ManagerProject />
      <Constructor />
      <ManagerProduction />
    </div>
  );
}

export default Admin;
