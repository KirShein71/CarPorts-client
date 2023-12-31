import React from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { Button, Spinner, Table, Modal } from 'react-bootstrap';
import { fetchAllProjectInstallers } from '../../http/projectInstallersApi';
import moment from 'moment';
import Moment from 'react-moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './InstallationList.styles.scss';

function InstallationList() {
  const [projectsInstallers, setProjectsInstallers] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);

  React.useEffect(() => {
    fetchAllProjectInstallers()
      .then((data) => setProjectsInstallers(data))
      .finally(() => setFetching(false));
  }, []);

  const handleCalendarClick = (brigade) => {
    setSelectedProject(brigade);
    setShowCalendar(true);
  };

  console.log(selectedProject);

  const handleCloseCalendar = () => {
    setShowCalendar(false);
    setSelectedProject(null);
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="installationlist">
      <Header title={'Монтаж'} />
      <Link to="/appoint">
        <Button>Назначить бригаду</Button>
      </Link>
      <>
        {projectsInstallers.map((brigade) => (
          <>
            <div key={brigade.id} className="installationlist__top">
              <div className="installationlist__brigade">{brigade.installer.name}</div>
            </div>
            <Table striped bordered size="sm" className="mt-3">
              <thead>
                <tr>
                  <th>Номер проекта</th>
                  <th>Проект</th>
                  <th>Наш план начала работ</th>
                  <th>Наш план окончания работ</th>
                  <th>Количество дней</th>
                  <th>Выход на монтаж по договору</th>
                  <th>Дедлайн по договору</th>
                  <th>Количество дней</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {brigade.props.map((prop) => (
                  <>
                    <tr key={prop.id}>
                      <th>{prop.projectNumber}</th>
                      <th>{prop.projectName}</th>
                      <th>
                        <Moment format="DD.MM.YYYY">{prop.plan_start}</Moment>
                      </th>
                      <th>
                        <Moment format="DD.MM.YYYY">{prop.plan_finish}</Moment>
                      </th>
                      <th>
                        {moment(prop.plan_finish, 'YYYY/MM/DD').businessDiff(
                          moment(prop.plan_start, 'YYYY/MM/DD'),
                          'days',
                        )}
                      </th>
                      <th>
                        {moment(prop.agreementDate, 'YYYY/MM/DD')
                          .businessAdd(prop.designPeriod, 'days')
                          .businessAdd(prop.expirationDate, 'days')
                          .format('DD.MM.YYYY')}
                      </th>
                      <th>
                        {moment(prop.agreementDate, 'YYYY/MM/DD')
                          .businessAdd(prop.designPeriod, 'days')
                          .businessAdd(prop.expirationDate, 'days')
                          .businessAdd(prop.installationPeriod, 'days')
                          .format('DD.MM.YYYY')}
                      </th>
                      <th>
                        {moment(prop.plan_finish, 'YYYY/MM/DD').businessDiff(
                          moment(prop.plan_start, 'YYYY/MM/DD'),
                          'days',
                        )}
                      </th>
                      <th>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleCalendarClick(brigade)}>
                          Календарь
                        </Button>
                      </th>
                    </tr>
                    {selectedProject && (
                      <>
                        {selectedProject.props.map((prop) => (
                          <Modal key={prop.id} show={showCalendar} onHide={handleCloseCalendar}>
                            <Modal.Header closeButton>
                              <Modal.Title>
                                Календарь для проекта <div>{prop.projectName}</div>
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <FullCalendar
                                plugins={[dayGridPlugin]}
                                events={[
                                  {
                                    title: 'Монтаж по договору',
                                    start: moment(prop.agreementDate, 'YYYY-MM-DD')
                                      .businessAdd(prop.designPeriod, 'days')
                                      .businessAdd(prop.expirationDate, 'days')
                                      .format('YYYY-MM-DD'),
                                    end: moment(prop.agreementDate, 'YYYY-MM-DD')
                                      .businessAdd(prop.designPeriod, 'days')
                                      .businessAdd(prop.expirationDate, 'days')
                                      .businessAdd(prop.installationPeriod, 'days')
                                      .add(1, 'day')
                                      .format('YYYY-MM-DD'),
                                    backgroundColor: 'green',
                                  },
                                  {
                                    title: 'Монтаж по нашему плану',
                                    start: moment(prop.plan_start, 'YYYY-MM-DD').format(
                                      'YYYY-MM-DD',
                                    ),
                                    end: moment(prop.plan_finish, 'YYYY-MM-DD')
                                      .add(1, 'day')
                                      .format('YYYY-MM-DD'),
                                    backgroundColor: 'grey',
                                  },
                                ]}
                                locale="ru"
                                firstDay={1}
                              />
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseCalendar}>
                                Закрыть
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        ))}
                      </>
                    )}
                  </>
                ))}
              </tbody>
            </Table>
          </>
        ))}
      </>
    </div>
  );
}

export default InstallationList;
