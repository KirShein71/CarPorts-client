import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails, updateProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import UpdateProjectDetails from './modal/UpdateProjectDetails';
import './styles.scss';

function ProductionList() {
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [projectDetail, setProjectDetail] = React.useState(null);
  const [updateProjectDetailsModal, setUpdateProjectDetailsModal] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    fetchAllProjectDetails()
      .then((data) => setProjectDetails(data))
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const handleUpdateProjectDetailClick = (id) => {
    setProjectDetail(id);
    setUpdateProjectDetailsModal(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionlist">
      <Header title={'Производство'} />
      <Link to="/productionchange">
        <Button>Внести данные в проект</Button>
      </Link>
      <UpdateProjectDetails
        id={projectDetail}
        show={updateProjectDetailsModal}
        setShow={setUpdateProjectDetailsModal}
        setChange={setChange}
      />
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th className="fixed-column">Номер проекта</th>
            <th className="fixed-column">Проект</th>
            {nameDetails
              .sort((a, b) => a.id - b.id)
              .map((part) => (
                <th>{part.name}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {projectDetails.map((detail) => (
            <tr key={detail.id}>
              <td>{detail.project ? detail.project.number : ''}</td>
              <td>{detail.project ? detail.project.name : ''}</td>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => {
                  const detailProject = detail.props.find((prop) => prop.detailId === part.id);
                  const quantity = detailProject ? detailProject.quantity : '';
                  return (
                    <td onClick={() => handleUpdateProjectDetailClick(detailProject.id)}>
                      {quantity}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductionList;
