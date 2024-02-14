import React from 'react';
import CreateDetail from './modals/CreateDetail';
import { Table, Button, Spinner } from 'react-bootstrap';
import { fetchAllDetails, deleteDetail } from '../../http/detailsApi';

function Details() {
  const [details, setDetails] = React.useState([]);
  const [detailModal, setDetailModal] = React.useState(false);
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
        alert(`Бригада «${data.name}» будет удалена`);
      })
      .catch((error) => alert(error.response.data.message));
  };

  if (fetching) {
    return <Spinner />;
  }

  return (
    <div className="details">
      <h2 className="details__title">Детали</h2>
      <CreateDetail show={detailModal} setShow={setDetailModal} setChange={setChange} />
      <Button onClick={() => setDetailModal(true)} className="mt-3">
        Создать деталь
      </Button>
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Название детали</th>
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
