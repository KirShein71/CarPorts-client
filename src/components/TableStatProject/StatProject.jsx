import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllStatProject } from '../../http/projectApi';
import './style.scss';

function StatProject() {
  const [statProjects, setStatProjects] = React.useState([]);

  React.useEffect(() => {
    getAllStatProject().then((data) => setStatProjects(data));
  }, []);

  // Функция для группировки проектов по месяцам
  const groupProjectsByMonth = (projects, dateField) => {
    const grouped = {};

    projects.forEach((project) => {
      if (!project[dateField]) return;

      const date = new Date(project[dateField]);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('ru-RU', { month: 'long' });
      // Делаем первую букву заглавной
      const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          name: capitalizedMonthName,
          projects: [],
        };
      }

      grouped[monthKey].projects.push(project);
    });

    return grouped;
  };

  // Получаем текущую дату и даты за последние 3 месяца
  const currentDate = new Date();

  const lastMonths = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthName = date.toLocaleString('ru-RU', { month: 'long' });
    // Делаем первую букву заглавной
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    lastMonths.push({ key: monthKey, name: capitalizedMonthName });
  }

  // Разделяем проекты и группируем по месяцам
  const signedProjects = statProjects.filter((project) => project.date_finish === null);
  const finishedProjects = statProjects.filter((project) => project.date_finish !== null);

  const groupedSigned = groupProjectsByMonth(signedProjects, 'agreement_date');
  const groupedFinished = groupProjectsByMonth(finishedProjects, 'date_finish');

  return (
    <div className="stat-project">
      <Table borderless>
        <thead>
          <tr>
            <th className="stat-project__th">Подписаны</th>
            <th className="stat-project__th">Сданы</th>
          </tr>
        </thead>
        <tbody>
          {/* Отображаем месяцы в правильном порядке */}
          {lastMonths.map((month) => (
            <tr key={month.key}>
              {/* Колонка подписанных проектов */}
              <td style={{ verticalAlign: 'top', padding: '10px' }}>
                <div className="stat-project__month">{month.name}</div>
                {groupedSigned[month.key]?.projects.map((project) => (
                  <div key={project.id} className="stat-project__project">
                    {project.name}
                  </div>
                )) || <div style={{ color: '#999', fontStyle: 'italic' }}>Нет проектов</div>}
              </td>

              {/* Колонка сданных проектов - убираем дублирование названия месяца */}
              <td style={{ verticalAlign: 'top', padding: '10px' }}>
                {/* Пустой div вместо заголовка месяца */}
                <div style={{ height: '42px' }}></div>
                {groupedFinished[month.key]?.projects.map((project) => (
                  <div className="stat-project__project" key={project.id}>
                    {project.name}
                  </div>
                )) || <div style={{ color: '#999', fontStyle: 'italic' }}>Нет проектов</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StatProject;
