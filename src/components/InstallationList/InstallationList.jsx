import React from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import { Button, Spinner, Table, Modal, Form, Col } from 'react-bootstrap';
import { fetchAllProjectBrigades } from '../../http/projectBrigadesApi';
import { fetchBrigades } from '../../http/bragadeApi';
import moment from 'moment';
import Moment from 'react-moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import CreatePlanStartDate from './modals/CreatePlanStartDate';
import CreatePlanFinishDate from './modals/CreateFinishDate';
import './InstallationList.styles.scss';

function InstallationList() {
  const [projectsBrigades, setProjectsBrigades] = React.useState([]);
  const [projectBrigades, setProjectBrigades] = React.useState(null);
  const [brigades, setBrigades] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [createStartDateModal, setCreateStartDateModal] = React.useState(false);
  const [createFinishDateModal, setCreateFinishDateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);

  const modalRef = React.useRef();

  React.useEffect(() => {
    fetchAllProjectBrigades().then((data) => {
      setProjectsBrigades(data);
    });
    fetchBrigades()
      .then((data) => {
        setBrigades(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    const hadleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModal(false);
      }
    };

    document.body.addEventListener('click', hadleClickOutside);

    return () => {
      document.body.removeEventListener('click', hadleClickOutside);
    };
  });

  const handleCalendarClick = (brigade) => {
    setSelectedProject(brigade);
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
    setSelectedProject(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const hadleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const hadleCreateStartDate = (id) => {
    setProjectBrigades(id);
    setCreateStartDateModal(true);
  };

  const hadleCreateFinishDate = (id) => {
    setProjectBrigades(id);
    setCreateFinishDateModal(true);
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
      <CreatePlanStartDate
        id={projectBrigades}
        show={createStartDateModal}
        setShow={setCreateStartDateModal}
        setChange={setChange}
      />
      <CreatePlanFinishDate
        id={projectBrigades}
        show={createFinishDateModal}
        setShow={setCreateFinishDateModal}
        setChange={setChange}
      />
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Col>
      <div className="dropdown" ref={modalRef}>
        <div className="dropdown__title" onClick={hadleOpenModal}>
          Бригада: <span>{selectedBrigade ? selectedBrigade : 'Все бригады'}</span>
        </div>
        {openModal && (
          <div className="dropdown__modal">
            <div className="dropdown__modal-content">
              <ul className="dropdown__modal-items">
                <div
                  className="dropdown__modal-item"
                  onClick={() => {
                    setSelectedBrigade(null);
                    setOpenModal(false);
                  }}>
                  Все бригады
                </div>
                {brigades.map((brigadeName) => (
                  <div key={brigadeName.id}>
                    <li
                      className="dropdown__modal-item"
                      onClick={() => {
                        setSelectedBrigade(brigadeName.name);
                        setOpenModal(false);
                      }}>
                      {brigadeName.name}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <>
        {projectsBrigades
          .filter((brigade) => selectedBrigade === null || brigade.brigade.name === selectedBrigade)
          .map((brigade) => (
            <>
              <div key={brigade.id} className="installationlist__top">
                <div className="installationlist__brigade">{brigade.brigade.name}</div>
              </div>
              <div className="table-scrollable">
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
                    {brigade.props
                      .filter(
                        (prop) =>
                          prop.projectName &&
                          prop.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((prop) => (
                        <>
                          <tr key={prop.id}>
                            <th>{prop.projectNumber}</th>
                            <th>{prop.projectName}</th>
                            <th
                              style={{ cursor: 'pointer' }}
                              onClick={() => hadleCreateStartDate(prop.id)}>
                              <Moment format="DD.MM.YYYY">{prop.plan_start}</Moment>
                            </th>
                            <th
                              style={{ cursor: 'pointer' }}
                              onClick={() => hadleCreateFinishDate(prop.id)}>
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
                                <Modal
                                  key={prop.id}
                                  show={showCalendar}
                                  onHide={handleCloseCalendar}>
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
              </div>
            </>
          ))}
      </>
    </div>
  );
}

export default InstallationList;
