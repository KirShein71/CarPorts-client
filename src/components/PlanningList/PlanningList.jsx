import React from 'react';
import Header from '../Header/Header';
import CreateProjectDelivery from './modals/CreateProjectDelivery';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment-business-days';

function PlanningList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const handleUpdateProjectDelivery = (id) => {
    setProject(id);
    setUpdateShow(true);
  };

  React.useEffect(() => {
    fetchAllProjects()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="planninglist">
      <Header title={'Проектирование'} />
      <CreateProjectDelivery
        id={project}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
      />
      <Table bordered hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>Номер проекта</th>
            <th>Название</th>
            <th>Примечание</th>
            <th>Дата договора</th>
            <th>Срок проектирования</th>
            <th>Дедлайн</th>
            <th>Дата сдачи</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.id}>
              <td>{item.number}</td>
              <td>{item.name}</td>
              <td>{item.note}</td>
              <td>
                <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
              </td>
              <td>{item.design_period}</td>
              <td>
                {moment(item.agreement_date, 'YYYY/MM/DD')
                  .businessAdd(item.design_period, 'days')
                  .format('DD.MM.YYYY')}
              </td>
              <td onClick={() => handleUpdateProjectDelivery(item.id)}>
                {item.project_delivery ? (
                  <Moment format="DD.MM.YYYY">{item.project_delivery}</Moment>
                ) : (
                  'Введите дату сдачи проекта'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PlanningList;
