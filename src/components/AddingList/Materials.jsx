import React from 'react';
import CreateMaterial from './modals/CreateMaterial';
import UpdateMaterial from './modals/UpdateMaterial';
import CreateSupplierMaterial from './modals/CreateSupplierMaterial';
import { Table, Button, Modal } from 'react-bootstrap';
import { fetchMaterials, deleteMaterial } from '../../http/materialsApi';

function Materials() {
  const [materials, setMaterials] = React.useState([]);
  const [material, setMaterial] = React.useState(null);
  const [materialModal, setMaterialModal] = React.useState(false);
  const [materialUpdateModal, setMaterialUpdateModal] = React.useState(false);
  const [supplierMaterialCreateModal, setSupplierMaterialCreateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [materialToDelete, setMaterialToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchMaterials().then((data) => setMaterials(data));
  }, [change]);

  const handleUpdateMaterial = (id) => {
    setMaterial(id);
    setMaterialUpdateModal(true);
  };

  const handleOpenSupplierMaterialCreateModal = (id) => {
    setMaterial(id);
    setSupplierMaterialCreateModal(true);
  };

  const handleDeleteClick = (id) => {
    const material = materials.find((item) => item.id === id);
    setMaterialToDelete(material);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (materialToDelete) {
      deleteMaterial(materialToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setMaterialToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setMaterialToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setMaterialToDelete(null);
  };

  return (
    <div className="materials">
      <h2 className="materials__title">Материалы</h2>
      <CreateMaterial show={materialModal} setShow={setMaterialModal} setChange={setChange} />
      <UpdateMaterial
        show={materialUpdateModal}
        setShow={setMaterialUpdateModal}
        setChange={setChange}
        id={material}
      />
      <CreateSupplierMaterial
        show={supplierMaterialCreateModal}
        setShow={setSupplierMaterialCreateModal}
        setChange={setChange}
        id={material}
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
          Вы уверены, что хотите удалить материал
          {materialToDelete && ` «${materialToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setMaterialModal(true)} className="mt-3">
        Создать материал
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Материала</th>
              <th>Поставщик</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td>{material.name}</td>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenSupplierMaterialCreateModal(material.id)}>
                  {material.supplier?.name}
                </td>
                <td>
                  <Button variant="dark" onClick={() => handleUpdateMaterial(material.id)}>
                    Редактировать
                  </Button>
                </td>
                <td>
                  <Button variant="dark" onClick={() => handleDeleteClick(material.id)}>
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

export default Materials;
