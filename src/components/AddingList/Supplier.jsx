import React from 'react';
import CreateSupplier from './modals/CreateSupplier';
import ModalCardSupplier from './modals/ModalCardSupplier';
import { Table, Button } from 'react-bootstrap';
import { fetchSuppliers, deleteSupplier } from '../../http/supplierApi';

function Supplier() {
  const [suppliers, setSuppliers] = React.useState([]);
  const [supplier, setSupplier] = React.useState(null);
  const [supplierModal, setSupplierModal] = React.useState(false);
  const [supplierCardModal, setSupplierCardModal] = React.useState(false);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    fetchSuppliers().then((data) => setSuppliers(data));
  }, [change]);

  const handleOpenSupplierCardModal = (id) => {
    setSupplier(id);
    setSupplierCardModal(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить поставщика?');
    if (confirmed) {
      deleteSupplier(id)
        .then((data) => {
          setChange(!change);
          alert(`Поставщик «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <div className="suppliers">
      <h2 className="suppliers__title">Поставщики</h2>
      <CreateSupplier show={supplierModal} setShow={setSupplierModal} setChange={setChange} />
      <ModalCardSupplier
        show={supplierCardModal}
        setShow={setSupplierCardModal}
        id={supplier}
        change={change}
        setChange={setChange}
      />
      <Button variant="dark" onClick={() => setSupplierModal(true)} className="mt-3">
        Добавить поставщика
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Поставщик</th>
              <th>Регион</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.regionId === 2 ? 'МО' : 'Спб'}</td>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenSupplierCardModal(supplier.id)}>
                  Карточка
                </td>
                <td>
                  <Button variant="dark" onClick={() => handleDeleteClick(supplier.id)}>
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Supplier;
