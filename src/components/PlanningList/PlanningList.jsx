import React from 'react';
import Header from '../Header/Header';
import CreateProjectDelivery from './modals/CreateProjectDelivery';
import CreateDateInspection from './modals/CreateDateInspection';
import CreateInspectionDesigner from './modals/CreateInspectionDisegner';
import { fetchAllProjects } from '../../http/projectApi';
import { Spinner, Table, Pagination, Form, Col } from 'react-bootstrap';
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
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 20;

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
      .then((data) => {
        setProjects(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
      .finally(() => setFetching(false));
  }, [change]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProjects = projects.slice().sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);

    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projects.length);
  const projectsToShow = sortedProjects
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < projects.length) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          activeLabel=""
          onClick={() => handlePageClick(page)}>
          {page}
        </Pagination.Item>,
      );
    }
  }

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
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Col>
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
              <th className="production_column">Номер проекта </th>
              <th>Название</th>
              <th>Примечание</th>
              <th
                style={{ cursor: 'pointer', display: 'flex' }}
                onClick={() => handleSort('agreement_date')}>
                Дата договора{' '}
                <img
                  style={{ marginLeft: '5px', height: '100%' }}
                  src="./sort.png"
                  alt="icon_sort"
                />
              </th>
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
            {projectsToShow
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
                  <td className="production_column">{item.number}</td>
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
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleUpdateProjectDelivery(item.id)}>
                    {item.project_delivery ? (
                      <Moment format="DD.MM.YYYY">{item.project_delivery}</Moment>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 600, textAlign: 'center' }}>
                        Введите дату сдачи проекта
                      </span>
                    )}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCreateDateInspection(item.id)}>
                    {item.date_inspection ? (
                      <Moment format="DD.MM.YYYY">{moment(item.date_inspection)}</Moment>
                    ) : (
                      <span style={{ color: 'red', fontWeight: 600 }}>Введите дату проверки</span>
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
        <Pagination>{pages}</Pagination>
      </div>
    </div>
  );
}

export default PlanningList;
