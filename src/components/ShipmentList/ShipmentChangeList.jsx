import React from 'react';
import { getAllWithNoShipment } from '../../http/projectApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateShipmentDetails from './modals/createShimpmentDetails';
import Moment from 'react-moment';

function ShipmentChangeList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    getAllWithNoShipment()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleShipmentDetails = (project) => {
    setProject(project);
    setShow(true);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="shipmentchange">
      <div className="header">
        <Link to="/shipment">
          <img className="header__icon" src="./img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Производственные детали</h1>
      </div>
      <CreateShipmentDetails
        projectId={project}
        show={show}
        setShow={setShow}
        setChange={setChange}
      />
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th>Дата договора</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((item) => item.finish === null)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                  </td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => handleShipmentDetails(item.id)}>
                      Внести детали на отгрузку
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ShipmentChangeList;
