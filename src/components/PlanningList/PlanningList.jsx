import React from 'react';
import Header from '../Header/Header';
import CreateProjectDelivery from './modals/CreateProjectDelivery';
import CreateDateInspection from './modals/CreateDateInspection';
import CreateInspectionDesigner from './modals/CreateInspectionDisegner';
import CreateDesignerStart from './modals/CreateDesignerStart';
import UpdateDesigner from './modals/UpdateDisegner';
import UpdateNote from './modals/UpdateNote';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table, Form, Col } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment-business-days';
import Checkbox from '../Checkbox/Checkbox';

function PlanningList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [updateShow, setUpdateShow] = React.useState(false);
  const [createDesignerStart, setCreateDesignerStart] = React.useState(false);
  const [createDateInspectionModal, setCreateDateInspectionModal] = React.useState(false);
  const [createInspectionDesignerModal, setCreateInspectionDesignerModal] = React.useState(false);
  const [updateDisegnerModal, setUpdateDisegnerModal] = React.useState(false);
  const [updateNote, setUpdateNote] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [projectNoDesignerCheckbox, setProjectNoDesignerCheckbox] = React.useState(false);
  const [projectInProgressCheckbox, setProjectInProgressCheckbox] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState(null);

  const handleUpdateProjectDelivery = (id) => {
    setProject(id);
    setUpdateShow(true);
  };

  const handleCreateDesignerStart = (id) => {
    setProject(id);
    setCreateDesignerStart(true);
  };

  const handleCreateDateInspection = (id) => {
    setProject(id);
    setCreateDateInspectionModal(true);
  };

  const handleCreateInspectionDesigner = (id) => {
    setProject(id);
    setCreateInspectionDesignerModal(true);
  };

  const handleUpdateDisegnerModal = (id) => {
    setProject(id);
    setUpdateDisegnerModal(true);
  };

  const handleUpdateNote = (id) => {
    setProject(id);
    setUpdateNote(true);
  };

  React.useEffect(() => {
    fetchAllProjects()
      .then((data) => {
        setProjects(data);
      })
      .finally(() => setFetching(false));
  }, [change]);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const handleNoDesignerCheckboxChange = () => {
    const updatedValue = !projectNoDesignerCheckbox;
    setProjectNoDesignerCheckbox(updatedValue);
    const filtered = updatedValue
      ? projects.filter((project) => project.designer === null)
      : projects;
    setFilteredProjects(filtered);
  };

  const handleInProgressCheckboxChange = () => {
    const updatedValue = !projectInProgressCheckbox;
    setProjectInProgressCheckbox(updatedValue);
    const filtered = updatedValue
      ? projects.filter((project) => project.date_inspection === null && project.designer !== null)
      : projects;
    setFilteredProjects(filtered);
  };

  const handleToggleText = (id) => {
    if (selectedNote === id) {
      setSelectedNote(null);
      window.scrollTo(0, scrollPosition); // Возвращаемся к предыдущей позиции скролла
    } else {
      // Сохраняем информацию о скрытой ячейке

      setScrollPosition(window.scrollY); // Сохраняем текущую позицию скролла
      setSelectedNote(id);
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="planninglist">
      <Header title={'Проектирование'} />
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            className="mb-2"
            aria-label="Search"
          />
        </Form>
      </Col>
      <CreateProjectDelivery
        id={project}
        show={updateShow}
        setShow={setUpdateShow}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateDesignerStart
        id={project}
        show={createDesignerStart}
        setShow={setCreateDesignerStart}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateDateInspection
        id={project}
        show={createDateInspectionModal}
        setShow={setCreateDateInspectionModal}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <CreateInspectionDesigner
        id={project}
        show={createInspectionDesignerModal}
        setShow={setCreateInspectionDesignerModal}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <UpdateDesigner
        id={project}
        show={updateDisegnerModal}
        setShow={setUpdateDisegnerModal}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <UpdateNote
        id={project}
        show={updateNote}
        setShow={setUpdateNote}
        setChange={setChange}
        scrollPosition={scrollPosition}
      />
      <Checkbox
        change={projectNoDesignerCheckbox}
        handle={handleNoDesignerCheckboxChange}
        name={'Новые проекты'}
        label={'chbxNoDesigner'}
      />
      <Checkbox
        change={projectInProgressCheckbox}
        handle={handleInProgressCheckboxChange}
        name={'В работе'}
        label={'chbxNoDateInspection'}
      />
      <div className="table-scrollable">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="thead_column">Номер проекта </th>
              <th className="production_column">Название</th>
              <th className="thead_column">Примечание</th>
              <th className="thead_column" onClick={() => handleSort('agreement_date')}>
                <div style={{ display: 'flex', cursor: 'pointer' }}>
                  Дата договора{' '}
                  <img
                    style={{ marginLeft: '5px', height: '100%' }}
                    src="./sort.png"
                    alt="icon_sort"
                  />
                </div>
              </th>
              <th className="thead_column">Срок проектирования</th>
              <th className="thead_column">Дедлайн</th>
              <th className="thead_column">Дата начала</th>
              <th className="thead_column">Дата сдачи</th>
              <th className="thead_column">Дата проверки</th>
              <th className="thead_column">Осталось дней</th>
              <th className="thead_column">Проектировщик</th>
              <th className="thead_column">Проверяет проект</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a[sortField]);
                const dateB = new Date(b[sortField]);

                if (sortOrder === 'desc') {
                  return dateB - dateA;
                } else {
                  return dateA - dateB;
                }
              })
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.number}</td>
                  <td className="td_column">{item.name}</td>
                  <td style={{ cursor: 'pointer' }}>
                    {item.note && (
                      <div onClick={() => handleUpdateNote(item.id)}>
                        {selectedNote === item.id ? item.note : item.note.slice(0, 180)}
                      </div>
                    )}
                    {item.note.length > 180 && (
                      <div className="show" onClick={() => handleToggleText(item.id)}>
                        {selectedNote === item.id ? 'Скрыть' : '...'}
                      </div>
                    )}
                  </td>
                  <td>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                  </td>
                  <td>{item.design_period}</td>
                  <td>
                    {moment(item.agreement_date, 'YYYY/MM/DD')
                      .businessAdd(item.design_period, 'days')
                      .format('DD.MM.YYYY')}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCreateDesignerStart(item.id)}>
                    {item.design_start ? (
                      <Moment format="DD.MM.YYYY">{item.design_start}</Moment>
                    ) : (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                        +
                      </span>
                    )}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateProjectDelivery(item.id)}>
                    {item.project_delivery ? (
                      <Moment format="DD.MM.YYYY">{item.project_delivery}</Moment>
                    ) : (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                        +
                      </span>
                    )}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCreateDateInspection(item.id)}>
                    {item.date_inspection ? (
                      <Moment format="DD.MM.YYYY" parse="YYYY-MM-DD">
                        {item.date_inspection}
                      </Moment>
                    ) : (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                        +
                      </span>
                    )}
                  </td>
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
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateDisegnerModal(item.id)}>
                    {item.designer ? (
                      <div>{item.designer}</div>
                    ) : (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                        +
                      </span>
                    )}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCreateInspectionDesigner(item.id)}>
                    {item.inspection_designer ? (
                      <div>{item.inspection_designer}</div>
                    ) : (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                        +
                      </span>
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
