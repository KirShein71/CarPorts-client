import React from 'react';
import CreateCoefficient from './modals/CreateCoefficicent';
import UpdateNameCoefficient from './modals/UpdateNameCoefficient';
import UpdateNumberCoefficient from './modals/UpdateNumberCoefficient';
import { Table, Button, Modal } from 'react-bootstrap';
import { fetchCoefficients, deleteCoefficient } from '../../../http/coefficientApi';

function Coefficient() {
  const [coefficients, setCoefficients] = React.useState([]);
  const [coefficient, setCoefficient] = React.useState(null);
  const [createCoefficientModal, setCreateCoefficientModal] = React.useState(false);
  const [updateCoefficientNameModal, setUpdateCoefficientNameModal] = React.useState(false);
  const [updateCoefficientNumberModal, setUpdateCoefficientNumberModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [coefficientToDelete, setCoefficientToDelete] = React.useState(null);

  React.useEffect(() => {
    fetchCoefficients().then((data) => setCoefficients(data));
  }, [change]);

  const handleUpdateCoefficientName = (id) => {
    setCoefficient(id);
    setUpdateCoefficientNameModal(true);
  };

  const handleUpdateCoefficientNumber = (id) => {
    setCoefficient(id);
    setUpdateCoefficientNumberModal(true);
  };

  const handleDeleteClick = (id) => {
    const coeff = coefficients.find((coefficient) => coefficient.id === id);
    setCoefficientToDelete(coeff);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (coefficientToDelete) {
      deleteCoefficient(coefficientToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setCoefficientToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setCoefficientToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setCoefficientToDelete(null);
  };

  return (
    <div className="details">
      <h2 className="details__title">Коэффициенты</h2>
      <CreateCoefficient
        show={createCoefficientModal}
        setShow={setCreateCoefficientModal}
        setChange={setChange}
      />
      <UpdateNameCoefficient
        show={updateCoefficientNameModal}
        setShow={setUpdateCoefficientNameModal}
        id={coefficient}
        setChange={setChange}
      />
      <UpdateNumberCoefficient
        show={updateCoefficientNumberModal}
        setShow={setUpdateCoefficientNumberModal}
        id={coefficient}
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
          Вы уверены, что хотите удалить коэффициент?
          {coefficientToDelete && ` «${coefficientToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setCreateCoefficientModal(true)} className="mt-3">
        Создать коэффициент
      </Button>
      <div className="ttable-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Название</th>
              <th>Коэффициент</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coefficients
              .sort((a, b) => a.id - b.id)
              .map((coefficient) => (
                <tr key={coefficient.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateCoefficientName(coefficient.id)}>
                    {coefficient.name}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateCoefficientNumber(coefficient.id)}>
                    {coefficient.number}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(coefficient.id)}>
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

export default Coefficient;
