import React from 'react';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import { useNavigate, useLocation } from 'react-router-dom';

function Complaint({ project }) {
  const navigate = useNavigate();
  const location = useLocation();

  const addToInfoComplaint = (id) => {
    navigate(`/complaint-project/${id}`, { state: { from: location.pathname } });
  };

  return (
    <div className="table-complaint">
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th className="table-complaint__note"></th>
            <th className="table-complaint__date">Дата</th>
          </tr>
        </thead>
        <tbody>
          {project &&
            project.complaints.map((complaintProject) => (
              <tr key={complaintProject.id}>
                <td
                  onClick={() => {
                    addToInfoComplaint(complaintProject.id);
                  }}
                  style={{ cursor: 'pointer' }}>
                  {complaintProject.note.length > 100
                    ? `${complaintProject.note.substring(0, 100)}...`
                    : complaintProject.note}
                </td>
                <td>
                  <Moment format="DD.MM.YYYY">{complaintProject.date}</Moment>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Complaint;
