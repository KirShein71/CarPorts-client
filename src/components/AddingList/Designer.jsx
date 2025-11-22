import React from 'react';
import CreateDesigner from './modals/CreateDesigner';
import UpdateDesignerName from './modals/UpdateDesignerName';
import { Table, Button, Modal } from 'react-bootstrap';
import { fetchDesigners, deleteDesigner, updateActiveDesigner } from '../../http/designerApi';

const defaultValue = { active: '' };
const defaultValid = {
  active: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'active') result.active = value.active.trim() !== '';
  }
  return result;
};

function Designer() {
  const [designers, setDesigners] = React.useState([]);
  const [designer, setDesigner] = React.useState(null);
  const [createDesignerModal, setCreateDesignerModal] = React.useState(false);
  const [updateDesignerNameModal, setUpdateDesignerNameModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [designerToDelete, setDesignerToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchDesigners().then((data) => setDesigners(data));
  }, [change]);

  const handleUpdateDesignerName = (id) => {
    setDesigner(id);
    setUpdateDesignerNameModal(true);
  };

  const handleInactiveDesigner = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'true');

    setIsLoading(true);
    updateActiveDesigner(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleActiveDesigner = (id) => {
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('active', 'false');

    setIsLoading(true);
    updateActiveDesigner(id, data)
      .then((response) => {
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteClick = (id) => {
    const desig = designers.find((designer) => designer.id === id);
    setDesignerToDelete(desig);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (designerToDelete) {
      deleteDesigner(designerToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setDesignerToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setDesignerToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setDesignerToDelete(null);
  };

  return (
    <div className="details">
      <h2 className="details__title">Проектировщики</h2>
      <CreateDesigner
        show={createDesignerModal}
        setShow={setCreateDesignerModal}
        setChange={setChange}
      />
      <UpdateDesignerName
        show={updateDesignerNameModal}
        setShow={setUpdateDesignerNameModal}
        id={designer}
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
          Вы уверены, что хотите удалить проектировщика
          {designerToDelete && ` «${designerToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setCreateDesignerModal(true)} className="mt-3">
        Создать проектировщика
      </Button>
      <div className="ttable-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Проектировщик</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {designers
              .sort((a, b) => a.id - b.id)
              .map((designer) => (
                <tr key={designer.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateDesignerName(designer.id)}>
                    {designer.name}
                  </td>
                  <td>
                    {designer.active === 'true' ? (
                      <img
                        style={{ display: 'block', margin: '0 auto' }}
                        src="./img/active.png"
                        alt="active"
                        onClick={() => handleActiveDesigner(designer.id)}
                      />
                    ) : (
                      <img
                        style={{ display: 'block', margin: '0 auto' }}
                        src="./img/inactive.png"
                        alt="inactive"
                        onClick={() => handleInactiveDesigner(designer.id)}
                      />
                    )}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(designer.id)}>
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

export default Designer;
