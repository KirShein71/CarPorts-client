import React from 'react';
import CreateDetail from './modals/CreateDetail';
import UpdateDetail from './modals/UpdateDetail';
import CreatePriceDetail from './modals/CreatePriceDetail';
import CreateNumberDetail from './modals/CreateNumberDetail';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchAllDetails, deleteDetail } from '../../http/detailsApi';

function Details() {
  const [details, setDetails] = React.useState([]);
  const [detail, setDetail] = React.useState(null);
  const [detailModal, setDetailModal] = React.useState(false);
  const [updateDeatialModal, setUpdateDetailModal] = React.useState(null);
  const [createPriceModal, setCreatePriceModal] = React.useState(false);
  const [createNumberModal, setCreateNumberModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchAllDetails()
      .then((data) => setDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить деталь?');
    if (confirmed) {
      deleteDetail(id)
        .then((data) => {
          setChange(!change);
          alert(`Деталь «${data.name}» будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleCreatePrice = (id) => {
    setDetail(id);
    setCreatePriceModal(true);
  };

  const handleUpdateDetail = (id) => {
    setDetail(id);
    setUpdateDetailModal(true);
  };

  const handleOpenCreateNumberModal = (id) => {
    setDetail(id);
    setCreateNumberModal(true);
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="details">
      <h2 className="details__title">Детали</h2>
      <CreateDetail show={detailModal} setShow={setDetailModal} setChange={setChange} />
      <UpdateDetail
        show={updateDeatialModal}
        setShow={setUpdateDetailModal}
        setChange={setChange}
        id={detail}
      />
      <CreatePriceDetail
        show={createPriceModal}
        setShow={setCreatePriceModal}
        setChange={setChange}
        id={detail}
      />
      <CreateNumberDetail
        show={createNumberModal}
        setShow={setCreateNumberModal}
        setChange={setChange}
        id={detail}
      />
      <Button variant="dark" onClick={() => setDetailModal(true)} className="mt-3">
        Создать деталь
      </Button>
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Название детали</th>
              <th>Себестоимость</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {details
              .sort((a, b) => a.number - b.number)
              .map((detail) => (
                <tr key={detail.id}>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenCreateNumberModal(detail.id)}>
                    {detail.number}
                  </td>
                  <td>{detail.name}</td>
                  <td onClick={() => handleCreatePrice(detail.id)}>
                    {detail.price ? (
                      <>{detail.price}</>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
                    )}
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleUpdateDetail(detail.id)}>
                      Редактировать
                    </Button>
                  </td>
                  <td>
                    <Button variant="dark" onClick={() => handleDeleteClick(detail.id)}>
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

export default Details;
