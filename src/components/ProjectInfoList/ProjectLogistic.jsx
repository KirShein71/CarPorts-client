import React from 'react';
import { Button, Table } from 'react-bootstrap';
import CreateLogisticProject from './modals/CreateLogisticProject';

function ProjectLogistic({ project, projectId, setChange }) {
  const [logisticCreateModal, setLogisticCreateModal] = React.useState(false);

  const handleOpenLogisticCreateModal = () => {
    setLogisticCreateModal(true);
  };

  return (
    <div className="project-logistic">
      <CreateLogisticProject
        id={projectId}
        show={logisticCreateModal}
        setShow={setLogisticCreateModal}
        setChange={setChange}
      />
      <Table bordered hover size="sm" className="mt-3 table-planning">
        <thead>
          <tr>
            <th>Контакты</th>
            <td>{project.project.contact}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Адресс</th>
            <td>{project.project.address}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>Навигатор</th>
            <td>{project.project.navigator}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>Координаты</th>
            <td>{project.project.coordinates}</td>
          </tr>
        </tbody>
      </Table>
      <Button variant="dark" className="mt-3" size="md" onClick={handleOpenLogisticCreateModal}>
        {project.project.contact ||
        project.project.adress ||
        project.project.navigator ||
        project.project.coordinates
          ? 'Изменить'
          : 'Добавить'}
      </Button>
    </div>
  );
}

export default ProjectLogistic;
