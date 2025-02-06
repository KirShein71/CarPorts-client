import React from 'react';
import Header from '../Header/Header';
import CreateProject from './modals/CreateProject';
import UpdateNameProject from './modals/UpdateNameProject';
import UpdateNumberProject from './modals/UpdateNumberProject';
import UpdateDateProject from './modals/UpdateDateProject';
import CreateRegion from './modals/CreateRegion';
import CreateInstallationBilling from './modals/CreateInstallationBilling';
import { fetchAllProjects, deleteProject } from '../../http/projectApi';
import { getDaysInstallerForProjects } from '../../http/brigadesDateApi';
import { Spinner, Table, Button, Col, Row, Form } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Checkbox from '../Checkbox/Checkbox';
import Moment from 'react-moment';

function ProjectList() {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [projectDays, setProjectDays] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [createShow, setCreateShow] = React.useState(false);
  const [updateNameModal, setUpdateNameModal] = React.useState(false);
  const [updateNumberProjectModal, setUpdateNumberProjectModal] = React.useState(false);
  const [updateDateProject, setUpdateDateProject] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProjects, setFilteredProjects] = React.useState([]);
  const [createRegionModal, setCreateRegionModal] = React.useState(false);
  const [createInstallationBillingModal, setCreateInstallationBillingModal] = React.useState(false);
  const [projectMoscowCheckbox, setProjectMoscowCheckbox] = React.useState(false);
  const [projectSpbCheckbox, setProjectSpbCheckbox] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    getDaysInstallerForProjects().then((data) => setProjectDays(data));
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  React.useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const handleMoscowCheckboxChange = () => {
    setProjectMoscowCheckbox((prev) => !prev);
  };

  React.useEffect(() => {
    if (projectMoscowCheckbox) {
      // Фильтруем проекты только если чекбокс активен
      const filtered = projects.filter((project) => project.regionId === 2);
      setFilteredProjects(filtered);
    } else {
      // Если чекбокс не активен, показываем все проекты
      setFilteredProjects(projects);
    }
  }, [projects, projectMoscowCheckbox]);

  const handleSpbCheckboxChange = () => {
    setProjectSpbCheckbox((prev) => !prev);
  };

  React.useEffect(() => {
    if (projectSpbCheckbox) {
      // Фильтруем проекты только если чекбокс активен
      const filtered = projects.filter((project) => project.regionId === 1);
      setFilteredProjects(filtered);
    } else {
      // Если чекбокс не активен, показываем все проекты
      setFilteredProjects(projects);
    }
  }, [projects, projectSpbCheckbox]);

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить проект?');
    if (confirmed) {
      deleteProject(id)
        .then((data) => {
          setChange(!change);
          alert(`Проект «${data.name}» был удален`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const hadleUpdateNameProject = (id) => {
    setProject(id);
    setUpdateNameModal(true);
  };

  const hadleUpdateNumberProject = (id) => {
    setProject(id);
    setUpdateNumberProjectModal(true);
  };

  const hadleUpdateDateProject = (id) => {
    setProject(id);
    setUpdateDateProject(true);
  };

  const hadleCreateRegionProject = (id) => {
    setProject(id);
    setCreateRegionModal(true);
  };

  const hadleCreateInstallationBilling = (id) => {
    setProject(id);
    setCreateInstallationBillingModal(true);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const addToInfo = (id) => {
    navigate(`/projectinfo/${id}`, { state: { from: location.pathname } });
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="projectlist">
      <Header title={'Проекты '} />

      <CreateProject show={createShow} setShow={setCreateShow} setChange={setChange} />
      <UpdateNameProject
        show={updateNameModal}
        setShow={setUpdateNameModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <UpdateNumberProject
        show={updateNumberProjectModal}
        setShow={setUpdateNumberProjectModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <UpdateDateProject
        show={updateDateProject}
        setShow={setUpdateDateProject}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <CreateRegion
        show={createRegionModal}
        setShow={setCreateRegionModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <CreateInstallationBilling
        show={createInstallationBillingModal}
        setShow={setCreateInstallationBillingModal}
        setChange={setChange}
        id={project}
        scrollPosition={scrollPosition}
      />
      <Row className="d-flex flex-column">
        <Col className="mt-3 align-items-start">
          <Button variant="dark" className="me-3 my-2" onClick={() => setCreateShow(true)}>
            Добавить проект
          </Button>
        </Col>
      </Row>
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search"
          />
        </Form>
      </Col>
      <Link to="/finishproject">
        <div style={{ fontSize: '18px', paddingTop: '10px', cursor: 'pointer', color: 'black' }}>
          &bull; Показать завершенные проекты
        </div>
      </Link>
      <Checkbox
        change={projectMoscowCheckbox}
        handle={handleMoscowCheckboxChange}
        name={'Регион Москва'}
        label={'chbxMoscow'}
      />
      <Checkbox
        change={projectSpbCheckbox}
        handle={handleSpbCheckboxChange}
        name={'Регион Санкт-Петербург'}
        label={'chbxSpb'}
      />
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-4">
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }} className="production_column">
                Номер проекта
              </th>
              <th style={{ textAlign: 'center' }} className="thead_column">
                Название
              </th>
              <th className="thead_column"></th>
              <th className="thead_column" onClick={() => handleSort('agreement_date')}>
                <div style={{ cursor: 'pointer', display: 'flex' }}>
                  {' '}
                  Дата договора
                  <img
                    style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                    src="./img/sort.png"
                    alt="icon_sort"
                  />
                </div>
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Регион
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Расчетный срок монтажа
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Факт монтажа
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                План монтажа
              </th>
              <th className="thead_column" style={{ textAlign: 'center' }}>
                Остаток
              </th>
              <th className="thead_column"></th>
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
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleUpdateNumberProject(item.id)}
                    className="td_column">
                    {item.number}
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => hadleUpdateNameProject(item.id)}>
                    {item.name}
                  </td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => addToInfo(item.id)}>
                      Подробнее
                    </Button>
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleUpdateDateProject(item.id)}>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleCreateRegionProject(item.id)}>
                    {item.region?.region}
                  </td>
                  <td
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => hadleCreateInstallationBilling(item.id)}>
                    {item.installation_billing}
                  </td>
                  {projectDays.some((projectDay) => projectDay.projectId === item.id) ? (
                    projectDays
                      .filter((projectDay) => projectDay.projectId === item.id)
                      .map((projectDay) => (
                        <>
                          <td style={{ textAlign: 'center' }}>{projectDay.factDay}</td>
                          <td style={{ textAlign: 'center' }}>{projectDay.planDay}</td>
                          <td style={{ textAlign: 'center' }}>
                            {item.installation_billing - projectDay.factDay - projectDay.planDay}
                          </td>
                        </>
                      ))
                  ) : (
                    <>
                      <td></td>
                      <td></td>
                      <td></td>
                    </>
                  )}
                  <td>
                    <Button variant="dark" size="sm" onClick={() => handleDeleteClick(item.id)}>
                      Удалить
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

export default ProjectList;
