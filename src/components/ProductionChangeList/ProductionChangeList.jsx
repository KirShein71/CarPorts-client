import React from 'react';
import { getAllWithNoDetails } from '../../http/projectApi';
import { addToProduction } from '../../http/projectDetailsApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateDetails from './modals/createDetails';
import Moment from 'react-moment';
import moment from 'moment-business-days';

function ProductionChangeList() {
  const [projects, setProjects] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [change, setChange] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('agreement_date');

  React.useEffect(() => {
    getAllWithNoDetails()
      .then((data) => setProjects(data))
      .finally(() => setFetching(false));
  }, [change]);

  const handleUpdateClick = (project) => {
    setProject(project);
    setShow(true);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const AddToProduction = (project) => {
    const data = new FormData();
    data.append('projectId', project);

    addToProduction(data)
      .then((data) => {
        // приводим форму в изначальное состояние
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleClickAddToProduction = (project) => {
    AddToProduction(project);
  };

  const holidays = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-08',
    '2024-02-23',
    '2024-03-08',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-09',
    '2024-05-10',
    '2024-06-12',
    '2024-11-04',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',
    '2025-01-06',
    '2025-01-07',
    '2025-01-08',
    '2025-05-01',
    '2025-05-02',
    '2025-05-08',
    '2025-05-09',
    '2025-06-12',
    '2025-06-13',
    '2025-11-03',
    '2025-11-04',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05',
    '2026-01-08',
    '2026-01-09',
    '2026-02-23',
    '2026-03-09',
    '2026-05-01',
    '2026-05-11',
    '2026-06-12',
    '2026-11-04',
    '2026-12-31',
  ].map((date) => new Date(date));

  // Функция для проверки, является ли дата выходным или праздничным днем
  function isWorkingDay(date) {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const isHoliday = holidays.some((holiday) => {
      const holidayString = holiday.toDateString();
      const dateString = date.toDateString();
      return holidayString === dateString;
    });

    return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
  }
  // Функция для добавления рабочих дней к дате
  function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
      if (isWorkingDay(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  // Функция для форматирования даты в формате ДД.ММ.ГГГГ
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Исправлено: добавлены кавычки для шаблонной строки
  }

  if (fetching) {
    return <Spinner animation="border" />;
  }
  return (
    <div className="productionchange">
      <div className="header">
        <Link to="/production">
          <img className="header__icon" src="./img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Производственные детали</h1>
      </div>
      <CreateDetails projectId={project} show={show} setShow={setShow} setChange={setChange} />
      <div className="table-container">
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('agreement_date')}>
                Дата договора{' '}
                <img styles={{ marginLeft: '5px' }} src="./img/sort.png" alt="icon_sort" />
              </th>
              <th>Дедлайн</th>
              <th>Осталось</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects
              .filter((item) => item.finish === null)
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
                  <td style={{ fontWeight: item.project_delivery ? 'bold' : 'normal' }}>
                    {item.name}
                  </td>
                  <td>
                    <Moment format="DD.MM.YYYY">{item.agreement_date}</Moment>
                  </td>
                  <td>
                    {(() => {
                      const agreementDate = new Date(item && item.agreement_date);
                      const designPeriod = item && item.design_period;
                      const expirationDate = item && item.expiration_date;

                      const sumDays = designPeriod + expirationDate;
                      const endDate = addWorkingDays(agreementDate, sumDays);
                      const formattedEndDate = formatDate(endDate);
                      return formattedEndDate;
                    })()}
                  </td>
                  <td
                    style={{
                      backgroundColor: (() => {
                        // Вычисляем дедлайн таким же способом как в первой ячейке
                        const agreementDate = new Date(item && item.agreement_date);
                        const designPeriod = item && item.design_period;
                        const expirationDate = item && item.expiration_date;
                        const sumDays = designPeriod + expirationDate;
                        const endDate = addWorkingDays(agreementDate, sumDays);

                        // Вычисляем разницу с сегодняшним днем
                        const today = new Date();
                        const timeDiff = endDate.getTime() - today.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        if (daysLeft < 0) {
                          return '#ff0000'; // красный для минусовых значений
                        } else if (daysLeft < 7) {
                          return '#ffe6e6'; // бледно-розовый для менее 7 дней
                        } else {
                          return 'transparent'; // прозрачный для остальных
                        }
                      })(),
                    }}>
                    {(() => {
                      // Вычисляем дедлайн таким же способом как в первой ячейке
                      const agreementDate = new Date(item && item.agreement_date);
                      const designPeriod = item && item.design_period;
                      const expirationDate = item && item.expiration_date;
                      const sumDays = designPeriod + expirationDate;
                      const endDate = addWorkingDays(agreementDate, sumDays);

                      // Вычисляем разницу с сегодняшним днем
                      const today = new Date();
                      const timeDiff = endDate.getTime() - today.getTime();
                      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                      return daysLeft; // Возвращаем разницу в днях
                    })()}
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleClickAddToProduction(item.id)}>
                      Добавить
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="dark"
                      size="sm"
                      style={{ display: 'block', margin: '0 auto' }}
                      onClick={() => handleUpdateClick(item.id)}>
                      Внести детали
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

export default ProductionChangeList;
