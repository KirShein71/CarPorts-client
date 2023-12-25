import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchAllProjectDetails } from '../../http/projectDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';

function ProductionList() {
  const [projectDetails, setProjectDetails] = React.useState([]);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);

  React.useEffect(() => {
    fetchAllProjectDetails()
      .then((data) => setProjectDetails(data))
      .finally(() => setFetching(false));
  }, []);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionlist">
      <Header title={'Производство'} />
      <Link to="/productionchange">
        <Button>Внести данные в проект</Button>
      </Link>
      <Table bordered size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер проекта</th>
            <th>Проект</th>
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
                .map((part) => (
                  <td>
                    {detail.props.find((prop) => prop.detailId === part.id)
                      ? detail.props.find((prop) => prop.detailId === part.id).quantity
                      : ''}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductionList;
