import React from 'react';
import CreateDetail from './modals/CreateDetail';
import UpdateDetail from './modals/UpdateDetail';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchAllDetails, deleteDetail } from '../../http/detailsApi';

function Details() {
  const [details, setDetails] = React.useState([]);
  const [detail, setDetail] = React.useState(null);
  const [detailModal, setDetailModal] = React.useState(false);
  const [updateDeatialModal, setUpdateDetailModal] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchAllDetails()
      .then((data) => setDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleDeleteClick = (id) => {
    deleteDetail(id)
      .then((data) => {
        setChange(!change);
        alert(`Деталь «${data.name}» будет удалена`);
      })
      .catch((error) => alert(error.response.data.message));
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
      <Button onClick={() => setDetailModal(true)} className="mt-3">
        Создать деталь
      </Button>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Название детали</th>
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
  );
}

export default Details;
