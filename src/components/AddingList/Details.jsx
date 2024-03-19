import React from 'react';
import CreateDetail from './modals/CreateDetail';
import UpdateDetail from './modals/UpdateDetail';
import CreatePriceDetail from './modals/CreatePriceDetail';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchAllDetails, deleteDetail } from '../../http/detailsApi';

function Details() {
  const [details, setDetails] = React.useState([]);
  const [detail, setDetail] = React.useState(null);
  const [detailModal, setDetailModal] = React.useState(false);
  const [updateDeatialModal, setUpdateDetailModal] = React.useState(null);
  const [createPriceModal, setCreatePriceModal] = React.useState(false);
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
      <Button onClick={() => setDetailModal(true)} className="mt-3">
        Создать деталь
      </Button>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Название детали</th>
              <th>Себестоимость</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {details
              .sort((a, b) => a.id - b.id)
              .map((detail) => (
                <tr key={detail.id}>
                  <td>{detail.name}</td>
                  <td onClick={() => handleCreatePrice(detail.id)}>
                    {detail.price ? (
                      <>{detail.price}</>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
                    )}
                  </td>
                  <td>
                    <Button onClick={() => handleUpdateDetail(detail.id)}>Редактировать</Button>
                  </td>
                  <td>
                    <Button onClick={() => handleDeleteClick(detail.id)}>Удалить</Button>
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
