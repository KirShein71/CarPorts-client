import React from 'react';
import Header from '../Header/Header';
import CreateProjectDelivery from './modals/CreateProjectDelivery';
import CreateDateInspection from './modals/CreateDateInspection';
import CreateInspectionDesigner from './modals/CreateInspectionDisegner';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment-business-days';

function PlanningList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [createDateInspectionModal, setCreateDateInspectionModal] = React.useState(false);
  const [createInspectionDesignerModal, setCreateInspectionDesignerModal] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);

  const handleUpdateProjectDelivery = (id) => {
    setProject(id);
    setUpdateShow(true);
  };

  const handleCreateDateInspection = (id) => {
    setProject(id);
    setCreateDateInspectionModal(true);
  };

  const handleCreateInspectionDesigner = (id) => {
    setProject(id);
    setCreateInspectionDesignerModal(true);
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
      <CreateDateInspection
        id={project}
        show={createDateInspectionModal}
        setShow={setCreateDateInspectionModal}
        setChange={setChange}
      />
      <CreateInspectionDesigner
        id={project}
        show={createInspectionDesignerModal}
        setShow={setCreateInspectionDesignerModal}
        setChange={setChange}
      />
      <div className="table-scrollable">
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
              <th>Дата проверки</th>
              <th>Осталось дней</th>
              <th>Проектировщик</th>
              <th>Проверяет проект</th>
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
                    <span style={{ color: 'red', fontWeight: 600 }}>
                      Введите дату сдачи проекта
                    </span>
                  )}
                </td>
                <td onClick={() => handleCreateDateInspection(item.id)}>
                  {item.date_inspection ? (
                    <Moment format="DD.MM.YYYY">{item.date_inspection}</Moment>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 600 }}>Введите дату проверки</span>
                  )}
                </td>
                <td>
                  <td>
                    {(() => {
                      const targetDate = moment(item.agreement_date, 'YYYY/MM/DD').businessAdd(
                        item.design_period,
                        'days',
                      );

                      function subtractDaysUntilZero(targetDate) {
                        const today = moment();
                        let daysLeft = 0;

                        while (targetDate.diff(today, 'days') > 0) {
                          daysLeft++;
                          targetDate.subtract(1, 'day');
                        }

                        return daysLeft;
                      }

                      return subtractDaysUntilZero(targetDate);
                    })()}
                  </td>
                </td>
                <td>{item.designer}</td>
                <td onClick={() => handleCreateInspectionDesigner(item.id)}>
                  {item.inspection_designer ? (
                    <div>{item.inspection_designer}</div>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 600 }}>Введите проверяющего</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default PlanningList;
