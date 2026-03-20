import React from 'react';
import { getAllProjectsWithNoInControlTour } from '../../../http/projectApi';
import { Modal, Row, Col } from 'react-bootstrap';

function NewProjectModal({ show, setShow }) {
  const [newProjects, setNewProjects] = React.useState([]);

  React.useEffect(() => {
    if (show) {
      getAllProjectsWithNoInControlTour().then((data) => setNewProjects(data));
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton className="new-project__title">
        Новые проекты
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            {newProjects.map((newProject) => (
              <ul key={newProject.id}>
                <li className="new-project__item">{newProject.name}</li>
              </ul>
            ))}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default NewProjectModal;
