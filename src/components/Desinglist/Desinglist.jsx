import React from 'react';
import { getAllWithNoDesing } from '../../http/projectApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateDesing from './modals/CreateDesing';
import moment from 'moment-business-days';

function Desinglist() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [project, setProject] = React.useState(null);

  const handleUpdateClick = (id) => {
    setProject(id);
    setUpdateShow(true);
  };

  React.useEffect(() => {
    getAllWithNoDesing()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="desinglist">
      <div className="header">
        <Link to="/project">
          <img className="header__icon" src="./back.png" alt="back" />
        </Link>
        <h1 className="header__title">Проектирование</h1>
      </div>
      <CreateDesing id={project} show={updateShow} setShow={setUpdateShow} setChange={setChange} />
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="production_column">Номер проекта</th>
              <th>Название</th>
              <th>Дедлайн проектирования</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr key={item.id}>
                <td className="production_column">{item.number}</td>
                <td>{item.name}</td>
                <td>
                  {moment(item.agreement_date, 'YYYY/MM/DD')
                    .businessAdd(item.design_period, 'days')
                    .format('DD.MM.YYYY')}
                </td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleUpdateClick(item.id)}>
                    Внести данные
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

export default Desinglist;
