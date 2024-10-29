import React from 'react';
import { getAllManagerSale, deleteManagerSale } from '../../../http/managerSaleApi';
import { Button, Spinner, Table } from 'react-bootstrap';
import CreateManagerSale from './modals/CreateManagerSale';
import UpdatePasswordManagerSale from './modals/UpdatePasswordManagerSale';

function ManagerSale() {
  const [managerSales, setManagerSales] = React.useState([]);
  const [managerSale, setManagerSale] = React.useState(null);
  const [openCreateManagerSaleModal, setOpenCreateManagerSaleModal] = React.useState(false);
  const [openUpdatePasswordManagerSale, setOpenUpdatePasswordManagerSale] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    getAllManagerSale()
      .then((data) => setManagerSales(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleCreateManagerSale = () => {
    setOpenCreateManagerSaleModal(true);
  };

  const handeUpdateManagerSalePassword = (id) => {
    setManagerSale(id);
    setOpenUpdatePasswordManagerSale(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить сотрудника?');
    if (confirmed) {
      deleteManagerSale(id)
        .then((data) => {
          setChange(!change);
          alert(`Сотрудник «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="manager-sale">
      <CreateManagerSale
        show={openCreateManagerSaleModal}
        setShow={setOpenCreateManagerSaleModal}
        setChange={setChange}
      />
      <UpdatePasswordManagerSale
        show={openUpdatePasswordManagerSale}
        setShow={setOpenUpdatePasswordManagerSale}
        setChange={setChange}
        id={managerSale}
      />
      <div className="manager-sale__content">
        <h2 className="manager-sale__title">Менеджеры по продажам</h2>
        <Button variant="dark" onClick={handleCreateManagerSale} className="mt-3">
          Добавить менеджера по продажам
        </Button>
        <div className="table-container">
          <Table bordered hover size="sm" className="mt-3">
            <thead>
              <tr>
                <th>Имя сотрудника</th>
                <th>Телефон</th>
                <th>Пароль</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {managerSales?.map((managerSale) => (
                <tr key={managerSale.id}>
                  <td>{managerSale.name}</td>
                  <td>{managerSale.phone}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handeUpdateManagerSalePassword(managerSale.id)}>
                      {' '}
                      Изменить
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(managerSale.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ManagerSale;
