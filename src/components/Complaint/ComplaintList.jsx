import React from 'react';
import Header from '../Header/Header';
import { getAllComplaint, deleteComplaint } from '../../http/complaintApi';
import { Table, Spinner } from 'react-bootstrap';
import CreateComplaint from './modals/CreateComplaint';
import Moment from 'react-moment';
import { useLocation, useNavigate } from 'react-router-dom';

import './style.scss';

function ComplaintList() {
  const [complaints, setComplaints] = React.useState([]);
  const [openModalCreateComplaint, setOpenModalCreateComplaint] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    setFetching(true);
    getAllComplaint()
      .then((data) => {
        setComplaints(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  const handleModalCreateComplaint = () => {
    setOpenModalCreateComplaint(true);
  };

  const handleDeleteComplaint = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить рекламационную заявку?');
    if (confirmed) {
      deleteComplaint(id)
        .then((data) => {
          setChange(!change);
          alert(`Рекламационная заявка будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const addToInfo = (id) => {
    navigate(`/complaint-project/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="complaintlist">
      <Header title={'Рекламация'} />

      <CreateComplaint
        show={openModalCreateComplaint}
        setShow={setOpenModalCreateComplaint}
        setChange={setChange}
      />
      <div style={{ display: 'flex' }}>
        <button className="button__addcomplaint" onClick={handleModalCreateComplaint}>
          Создать
        </button>
      </div>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-4">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Проект</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => {
                    addToInfo(complaint.id);
                  }}>
                  {complaint.project.number}
                </td>
                <td
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                  onClick={() => {
                    addToInfo(complaint.id);
                  }}>
                  {complaint.project.name}
                </td>
                <td>
                  <Moment format="DD.MM.YYYY">{complaint.date}</Moment>
                </td>
                <td></td>
                <td
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => handleDeleteComplaint(complaint.id)}>
                  <img src="../img/delete.png" alt="delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ComplaintList;
