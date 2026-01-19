import React from 'react';
import CreateWarehouseAssortment from './modals/CreateWarehouseAssortment';
import UpdateWarehouseAssortment from './modals/UpdateWarehouseAssortment';
import { Table, Button, Spinner, Modal } from 'react-bootstrap';
import {
  fetchAllWarehouseAssortments,
  deleteWarehouseAssortment,
} from '../../http/warehouseAssortmentApi';

function WarehouseAssortment() {
  const [warehouseAssortments, setWarehouseAssortments] = React.useState([]);
  const [warehouseAssortment, setWarehouseAssortment] = React.useState(null);
  const [createWarehouseAssortmentModal, setCreateWarehouseAssortmentModal] = React.useState(false);
  const [updateWarehouseAssortmentModal, setUpdateWarehouseAssortmentModal] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [warehouseAssortmentToDelete, setWarehouseAssortmentToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchAllWarehouseAssortments()
      .then((data) => setWarehouseAssortments(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    const warehouseAssortment = warehouseAssortments.find((item) => item.id === id);
    setWarehouseAssortmentToDelete(warehouseAssortment);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (warehouseAssortmentToDelete) {
      deleteWarehouseAssortment(warehouseAssortmentToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setWarehouseAssortmentToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setWarehouseAssortmentToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setWarehouseAssortmentToDelete(null);
  };

  const handleCreateWarehouseAssortment = () => {
    setCreateWarehouseAssortmentModal(true);
  };

  const handleUpdateWarehouseAssortment = (id) => {
    setWarehouseAssortment(id);
    setUpdateWarehouseAssortmentModal(true);
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="details">
      <h2 className="details__title">Ассортимент склада</h2>
      <CreateWarehouseAssortment
        show={createWarehouseAssortmentModal}
        setShow={setCreateWarehouseAssortmentModal}
        setChange={setChange}
      />
      <UpdateWarehouseAssortment
        show={updateWarehouseAssortmentModal}
        setShow={setUpdateWarehouseAssortmentModal}
        setChange={setChange}
        id={warehouseAssortment}
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
        <Modal.Body style={{ color: '#000' }}>Вы уверены, что хотите удалить ?</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="dark" onClick={handleCreateWarehouseAssortment} className="mt-3">
        Создать деталь
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Себестоимость</th>
              <th>Цена отгр.</th>
              <th>Вес, гр.</th>
              <th>Порядковый номер</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {warehouseAssortments
              .sort((a, b) => a.number - b.number)
              .map((warehouseAssortment) => (
                <tr key={warehouseAssortment.id}>
                  <td>{warehouseAssortment.name}</td>
                  <td>{warehouseAssortment.cost_price}</td>
                  <td>{warehouseAssortment.shipment_price}</td>
                  <td>{warehouseAssortment.weight}</td>
                  <td>{warehouseAssortment.number}</td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handleUpdateWarehouseAssortment(warehouseAssortment.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      onClick={() => handleDeleteClick(warehouseAssortment.id)}>
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

export default WarehouseAssortment;
