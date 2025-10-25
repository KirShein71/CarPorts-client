import React from 'react';
import { Table } from 'react-bootstrap';
import Header from '../Header/Header';
import { getAllStatSignedProject, getAllYearStatProject } from '../../http/projectApi';

import './style.scss';

function ReportProjects() {
  const [reportProjects, setReportProjects] = React.useState([]);
  const [reportYearProjects, setReportYearProjects] = React.useState([]);

  React.useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [monthlyData, yearlyData] = await Promise.all([
          getAllStatSignedProject(),
          getAllYearStatProject(),
        ]);

        setReportProjects(monthlyData);
        setReportYearProjects(yearlyData);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, []);

  // Группируем данные по годам
  const dataByYear = React.useMemo(() => {
    const years = {};

    reportProjects.forEach((item) => {
      const [month, year] = item.month.split('.');
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push({ ...item, month: parseInt(month) });
    });

    // Сортируем месяцы внутри каждого года
    Object.keys(years).forEach((year) => {
      years[year].sort((a, b) => a.month - b.month);
    });

    return years;
  }, [reportProjects]);

  // Получаем список лет в порядке убывания
  const years = Object.keys(dataByYear).sort((a, b) => b - a);

  // Создаем массив месяцев для заголовков
  const months = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];

  return (
    <div className="report-projects">
      <Header title={'Подписано/Сдано'} />

      {years.map((year) => {
        // Находим данные за текущий год
        const currentYearData = reportYearProjects.find((repYear) => repYear.year === Number(year));

        return (
          <div key={year} style={{ marginTop: '30px' }}>
            <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>{year}</h3>
            <div className="report-projects-table-container">
              <div className="report-projects-table-wrapper">
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th className="report-projects-th mobile" style={{ width: '120px' }}></th>

                      <th></th>
                      {/* Заголовки для месяцев */}
                      {months.map((month, index) => (
                        <th key={index} style={{ textAlign: 'center', minWidth: '60px' }}>
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Строка "Подписано договоров" */}
                    <tr>
                      <td className="report-projects-td mobile" style={{ fontWeight: 'bold' }}>
                        Подписано договоров
                      </td>
                      {/* Данные по текущему году - подписано */}
                      <td
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          backgroundColor: '#f8f9fa',
                        }}>
                        {currentYearData ? currentYearData.signed : 0}
                      </td>
                      {/* Данные по месяцам - подписано */}
                      {months.map((_, monthIndex) => {
                        const monthData = dataByYear[year]?.find(
                          (item) => item.month === monthIndex + 1,
                        );
                        return (
                          <td key={monthIndex} style={{ textAlign: 'center' }}>
                            {monthData ? monthData.signed : 0}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Строка "Сдано проектов" */}
                    <tr>
                      <td className="report-projects-td mobile" style={{ fontWeight: 'bold' }}>
                        Сдано проектов
                      </td>
                      {/* Данные по текущему году - сдано */}
                      <td
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          backgroundColor: '#f8f9fa',
                        }}>
                        {currentYearData ? currentYearData.finished : 0}
                      </td>
                      {/* Данные по месяцам - сдано */}
                      {months.map((_, monthIndex) => {
                        const monthData = dataByYear[year]?.find(
                          (item) => item.month === monthIndex + 1,
                        );
                        return (
                          <td key={monthIndex} style={{ textAlign: 'center' }}>
                            {monthData ? monthData.finished : 0}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        );
      })}

      {years.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}

export default ReportProjects;
