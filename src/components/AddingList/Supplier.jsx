import React from 'react';
import CreateSupplier from './modals/CreateSupplier';
import ModalCardSupplier from './modals/ModalCardSupplier';
import { Table, Button, Modal } from 'react-bootstrap';
import { fetchSuppliers, deleteSupplier } from '../../http/supplierApi';

function Supplier() {
  const [suppliers, setSuppliers] = React.useState([]);
  const [supplier, setSupplier] = React.useState(null);
  const [supplierModal, setSupplierModal] = React.useState(false);
  const [supplierCardModal, setSupplierCardModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [supplierToDelete, setSupplierToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchSuppliers().then((data) => setSuppliers(data));
  }, [change]);

  const handleOpenSupplierCardModal = (id) => {
    setSupplier(id);
    setSupplierCardModal(true);
  };

  const handleDeleteClick = (id) => {
    const supplier = suppliers.find((item) => item.id === id);
    setSupplierToDelete(supplier);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setSupplierToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setSupplierToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setSupplierToDelete(null);
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
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить поставщика
          {supplierToDelete && ` «${supplierToDelete.name}»`}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
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
