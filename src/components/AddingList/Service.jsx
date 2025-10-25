import React from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { getAllService, deleteService } from '../../http/serviceApi';
import CreateService from './modals/CreateService';
import UpdateService from './modals/UpdateService';
import CreateNumberService from './modals/CreateNumberService';

function Service() {
  const [services, setServices] = React.useState([]);
  const [service, setService] = React.useState(null);
  const [createServiceModal, setCreateServiceModal] = React.useState(false);
  const [updateServiceModal, setUpdateServiceModal] = React.useState(false);
  const [createNumberServiceModal, setCreateNumberServiceModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);

  React.useEffect(() => {
    getAllService().then((data) => setServices(data));
  }, [change]);

  const handleUpdateService = (id) => {
    setService(id);
    setUpdateServiceModal(true);
  };

  const handleOpenCreateServiceNumberModal = (id) => {
    setService(id);
    setCreateNumberServiceModal(true);
  };

  const handleDeleteClick = (id) => {
    const service = services.find((item) => item.id === id);
    setServiceToDelete(service);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id)
        .then((data) => {
          setChange(!change);
          setDeleteModal(false);
          setServiceToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setServiceToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setServiceToDelete(null);
  };

  return (
    <div className="service">
      <h2 className="service__title">Услуги монтажный работ</h2>
      <CreateService
        show={createServiceModal}
        setShow={setCreateServiceModal}
        setChange={setChange}
      />
      <UpdateService
        show={updateServiceModal}
        setShow={setUpdateServiceModal}
        setChange={setChange}
        id={service}
      />
      <CreateNumberService
        show={createNumberServiceModal}
        setShow={setCreateNumberServiceModal}
        setChange={setChange}
        id={service}
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
          Вы уверены, что хотите удалить услугу
          {serviceToDelete && ` «${serviceToDelete.name}»`}?
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
      <Button variant="dark" onClick={() => setCreateServiceModal(true)} className="mt-3">
        Создать услугу монтажных работ
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название услуги</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services
              .slice()
              .sort((a, b) => {
                // Разбиваем номера на части (например, "1.10" → ["1", "10"])
                const partsA = String(a.number || '0').split('.');
                const partsB = String(b.number || '0').split('.');

                // Сравниваем целые части
                const intA = parseInt(partsA[0], 10);
                const intB = parseInt(partsB[0], 10);
                if (intA !== intB) return intA - intB;

                // Если целые части равны, сравниваем десятичные
                const decimalA = partsA[1] ? parseInt(partsA[1], 10) : 0;
                const decimalB = partsB[1] ? parseInt(partsB[1], 10) : 0;

                return decimalA - decimalB;
              })
              .map((service) => (
                <tr key={service.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenCreateServiceNumberModal(service.id)}>
                    {service.number}
                  </td>
                  <td>{service.name}</td>
                  <td>
                    <Button variant="dark" onClick={() => handleUpdateService(service.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(service.id)}>
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

export default Service;
