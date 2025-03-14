import React from 'react';
import { Button } from 'react-bootstrap';

function Imformation({ complaintProject, isExpanded, hadleUpdateNote, handleToggleText }) {
  return (
    <div className="information">
      <div className="information__content">
        <pre className="information__field">
          {isExpanded
            ? complaintProject.complaint.note
            : complaintProject.complaint.note && complaintProject.complaint.note.slice(0, 255)}
        </pre>
        {complaintProject.complaint.note && complaintProject.complaint.note.length > 255 && (
          <div className="information__show" onClick={handleToggleText}>
            {isExpanded ? 'Скрыть' : 'Показать все...'}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'right' }} onClick={hadleUpdateNote}>
        <Button variant="dark">Добавить</Button>
      </div>
    </div>
  );
}

export default Imformation;
