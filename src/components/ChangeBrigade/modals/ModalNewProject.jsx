import React from 'react';
import { getAllProjectsWithNoInBrigadesDate } from '../../../http/projectApi';
import { Modal, Row, Col } from 'react-bootstrap';

function ModalNewProject({ show, setShow }) {
  const [projectsNew, setProjectsNew] = React.useState([]);

  React.useEffect(() => {
    if (show) {
      getAllProjectsWithNoInBrigadesDate().then((data) => setProjectsNew(data));
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
            {projectsNew.map((projectNew) => (
              <ul key={projectNew.id}>
                <li className="new-project__item">{projectNew.name}</li>
              </ul>
            ))}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ModalNewProject;
