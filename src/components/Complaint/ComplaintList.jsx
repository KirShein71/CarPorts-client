import React from 'react';
import Header from '../Header/Header';
import { getAllComplaint } from '../../http/complaintApi';
import { Table, Spinner, Button } from 'react-bootstrap';
import CreateComplaint from './modals/CreateComplaint';
import Moment from 'react-moment';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteComplaint from './modals/DeleteComplaint';
import ClosedComplaint from './modals/ClosedComplaint';
import RestoreComplaint from './modals/RestoreComplaint';

import './style.scss';

function ComplaintList() {
  const [complaints, setComplaints] = React.useState([]);
  const [openModalCreateComplaint, setOpenModalCreateComplaint] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [filteredComplaints, setFilteredComplaints] = React.useState([]);
  const [buttonNewComplaint, setButtonNewComplaint] = React.useState(true);
  const [buttonClosedComplaint, setButtonClosedComplaint] = React.useState(false);
  const [buttonWorkComplaint, setButtonWorkComplaint] = React.useState(false);
  const [modalDeleteComplaint, setModalDeleteComplaint] = React.useState(false);
  const [complaintId, setComplaintId] = React.useState(null);
  const [modalClosedComplaint, setModalClosedComplaint] = React.useState(false);
  const [modalRestoreComplaint, setModalRestoreComplaint] = React.useState(false);
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

  React.useEffect(() => {
    const filters = {
      isNew: buttonNewComplaint,
      isClosed: buttonClosedComplaint,
      isWork: buttonWorkComplaint,
    };

    const filteredComplaints = complaints.filter((complaint) => {
      const isNewComplaint =
        filters.isNew &&
        complaint.date_finish === null &&
        complaint.complaint_estimates.length === 0;
      const isClosedComplaint = filters.isClosed && complaint.date_finish !== null;
      const isWorkComplaint =
        filters.isWork &&
        complaint.date_finish === null &&
        complaint.complaint_estimates.length > 0;

      // Если ни одна кнопка не активна, показываем все проекты
      return isNewComplaint || isClosedComplaint || isWorkComplaint;
    });

    setFilteredComplaints(filteredComplaints);
  }, [complaints, buttonNewComplaint, buttonClosedComplaint, buttonWorkComplaint]);

  const handleModalCreateComplaint = () => {
    setOpenModalCreateComplaint(true);
  };

  const handleOpenModalDeleteComplaint = (id) => {
    setComplaintId(id);
    setModalDeleteComplaint(true);
  };

  const handleOpenModalClosedComplaint = (id) => {
    setComplaintId(id);
    setModalClosedComplaint(true);
  };

  const handleOpenModalRestoreComplaint = (id) => {
    setComplaintId(id);
    setModalRestoreComplaint(true);
  };

  const handleButtonNewComplaint = () => {
    const newButtonNewComplaint = !buttonNewComplaint;
    setButtonNewComplaint(newButtonNewComplaint);

    if (newButtonNewComplaint) {
      setButtonClosedComplaint(false);
      setButtonWorkComplaint(false);
    } else {
      setButtonClosedComplaint(false);
      setButtonWorkComplaint(true);
    }
  };

  const handleButtonWorkComplaint = () => {
    const newButtonWorkComplaint = !buttonWorkComplaint;
    setButtonWorkComplaint(newButtonWorkComplaint);

    if (newButtonWorkComplaint) {
      setButtonClosedComplaint(false);
      setButtonNewComplaint(false);
    } else {
      setButtonClosedComplaint(true);
      setButtonNewComplaint(false);
    }
  };

  const handleButtonClosedComplaint = () => {
    const newButtonClosedComplaint = !buttonClosedComplaint;
    setButtonClosedComplaint(newButtonClosedComplaint);

    if (newButtonClosedComplaint) {
      setButtonWorkComplaint(false);
      setButtonNewComplaint(false);
    } else {
      setButtonNewComplaint(true);
      setButtonWorkComplaint(false);
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
      <DeleteComplaint
        showModal={modalDeleteComplaint}
        setShowModal={setModalDeleteComplaint}
        setChange={setChange}
        complaintId={complaintId}
      />
      <ClosedComplaint
        showModal={modalClosedComplaint}
        setShowModal={setModalClosedComplaint}
        setChange={setChange}
        complaintId={complaintId}
      />
      <RestoreComplaint
        showModal={modalRestoreComplaint}
        setShowModal={setModalRestoreComplaint}
        setChange={setChange}
        complaintId={complaintId}
      />
      <div style={{ display: 'flex' }}>
        <button className="button__addcomplaint" onClick={handleModalCreateComplaint}>
          Создать
        </button>
        <button
          className={`button__new-complaint ${buttonNewComplaint === true ? 'active' : 'inactive'}`}
          onClick={handleButtonNewComplaint}>
          Новые
        </button>
        <button
          className={`button__work-complaint ${
            buttonWorkComplaint === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonWorkComplaint}>
          В работе
        </button>
        <button
          className={`button__closed-complaint ${
            buttonClosedComplaint === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonClosedComplaint}>
          Закрытые
        </button>
      </div>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="complaint-table mt-4">
          <thead>
            <tr>
              <th className="complaint-thead__number">Номер</th>
              <th className="complaint-thead__name">Проект</th>
              <th className="complaint-thead__date">Дата</th>
              <th className="complaint-thead__closed"></th>
              <th className="complaint-thead__delete"></th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
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
                <td>
                  {complaint.date_finish !== null ? (
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleOpenModalRestoreComplaint(complaint.id)}>
                      Восстановить
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleOpenModalClosedComplaint(complaint.id)}>
                      Закрыть
                    </Button>
                  )}
                </td>
                <td
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => handleOpenModalDeleteComplaint(complaint.id)}>
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
