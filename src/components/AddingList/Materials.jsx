import React from 'react';
import CreateMaterial from './modals/CreateMaterial';
import UpdateMaterial from './modals/UpdateMaterial';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchMaterials, deleteMaterial } from '../../http/materialsApi';

function Materials() {
  const [materials, setMaterials] = React.useState([]);
  const [material, setMaterial] = React.useState(null);
  const [materialModal, setMaterialModal] = React.useState(false);
  const [materialUpdateModal, setMaterialUpdateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchMaterials()
      .then((data) => setMaterials(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateMaterial = (id) => {
    setMaterial(id);
    setMaterialUpdateModal(true);
  };

  const handleDeleteClick = (id) => {
    deleteMaterial(id)
      .then((data) => {
        setChange(!change);
        alert(`Материал «${data.name}» будет удален`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="materials">
      <h2 className="materials__title">Матариалы</h2>
      <CreateMaterial show={materialModal} setShow={setMaterialModal} setChange={setChange} />
      <UpdateMaterial
        show={materialUpdateModal}
        setShow={setMaterialUpdateModal}
        setChange={setChange}
        id={material}
      />
      <Button onClick={() => setMaterialModal(true)} className="mt-3">
        Создать материал
      </Button>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Название материала</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.id}>
              <td>{material.name}</td>
              <td>
                <Button onClick={() => handleUpdateMaterial(material.id)}>Редактировать</Button>
              </td>
              <td>
                <Button onClick={() => handleDeleteClick(material.id)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Materials;