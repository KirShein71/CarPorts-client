import React from 'react';
import CreateMaterial from './modals/CreateMaterial';
import UpdateMaterial from './modals/UpdateMaterial';
import CreateSupplierMaterial from './modals/CreateSupplierMaterial';
import { Table, Button } from 'react-bootstrap';
import { fetchMaterials, deleteMaterial } from '../../http/materialsApi';

function Materials() {
  const [materials, setMaterials] = React.useState([]);
  const [material, setMaterial] = React.useState(null);
  const [materialModal, setMaterialModal] = React.useState(false);
  const [materialUpdateModal, setMaterialUpdateModal] = React.useState(false);
  const [supplierMaterialCreateModal, setSupplierMaterialCreateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);

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
    const confirmed = window.confirm('Вы уверены, что хотите удалить материал?');
    if (confirmed) {
      deleteMaterial(id)
        .then((data) => {
          setChange(!change);
          alert(`Материал «${data.name}» будет удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
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
