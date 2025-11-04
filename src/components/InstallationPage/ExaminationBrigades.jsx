import React from 'react';
import DetailsProjectExamination from '../TechSupervision/modals/DetailsProjectExamination';
import { Button, Table } from 'react-bootstrap';

function ExaminationBrigades({ projects, brigadeId }) {
  const [modalDetailExamination, setModalDetailExamination] = React.useState(false);
  const [projectId, setProjectId] = React.useState(null);

  const handleOpenModalDetailExamination = (projectId) => {
    setProjectId(projectId);
    setModalDetailExamination(true);
  };

  return (
    <>
      <div className="examination-brigade">
        <DetailsProjectExamination
          show={modalDetailExamination}
          setShow={setModalDetailExamination}
          projectId={projectId}
          brigadeId={brigadeId}
        />
        <div className="examination-brigade__content">
          <div className="examination-brigade-table-container">
            <div className="examination-brigade-table-wrapper">
              <Table bordered size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Номер</th>
                    <th className="examination-brigade-th mobile" style={{ textAlign: 'center' }}>
                      Проект
                    </th>
                    <th style={{ textAlign: 'center' }}>Результат</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((projectInfo) => (
                    <tr key={projectInfo.projectId}>
                      <td style={{ textAlign: 'center' }}>{projectInfo.number}</td>
                      <td>{projectInfo.project}</td>
                      <td style={{ textAlign: 'center' }}>{projectInfo.result}%</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button
                          size="sm"
                          variant="dark"
                          onClick={() => handleOpenModalDetailExamination(projectInfo.projectId)}>
                          Подробнее
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExaminationBrigades;
