import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-business-days';
import Moment from 'react-moment';

function NewPlanning(props) {
  const { projects, selectedDesignerName, currentMonth, currentYear, addWorkingDays, formatDate } =
    props;

  return (
    <div className="card-project">
      {projects
        .filter((projectDesigner) => {
          // Проверяем совпадение проектировщика
          if (projectDesigner.designer !== selectedDesignerName) return false;

          // Проверяем что дата сдачи не null
          if (!projectDesigner.project_delivery) return false;

          // Проверяем совпадение месяца и года даты сдачи с выбранными
          const deliveryDate = moment(projectDesigner.project_delivery, 'YYYY/MM/DD');
          const deliveryMonth = deliveryDate.month(); // 0-11
          const deliveryYear = deliveryDate.year();

          return deliveryMonth === currentMonth && deliveryYear === currentYear;
        })
        .map((projectDesigner) => (
          <Table key={projectDesigner.id} bordered className="mt-4" size="md">
            <tbody>
              <tr>
                <td colSpan={2}>
                  <div className="cell-table">
                    <div className="project-number">{projectDesigner.number}</div>
                    <div className="project-name">{projectDesigner.name}</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Стоимость</div>
                    <div className="cell-subtitle">{projectDesigner.price * 0.08}</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка начала работ</div>
                    <div className="cell-subtitle">30</div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Дата договора</div>
                    <div className="cell-subtitle">
                      <Moment format="DD.MM.YYYY">{projectDesigner.agreement_date}</Moment>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Конструктор</div>
                    <div className="cell-subtitle">{projectDesigner.designer}</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">ГИП</div>
                    <div className="cell-subtitle">{projectDesigner.inspection_designer}</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка по дог.</div>
                    <div className="cell-subtitle">4</div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Дедлайн</div>
                    <div className="cell-subtitle">
                      {(() => {
                        const agreementDate = new Date(projectDesigner.agreement_date);
                        const designPeriod = projectDesigner.design_period;

                        const endDate = addWorkingDays(agreementDate, designPeriod);
                        const formattedEndDate = formatDate(endDate);
                        return formattedEndDate;
                      })()}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Взят в работу</div>
                    <div className="cell-subtitle">
                      <Moment format="DD.MM.YYYY">{projectDesigner.design_start}</Moment>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Дата проверки</div>
                    <div className="cell-subtitle">
                      <Moment format="DD.MM.YYYY">{projectDesigner.date_inspection}</Moment>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка проверки</div>
                    <div className="cell-subtitle">0</div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Срок по договору</div>
                    <div className="cell-subtitle">{projectDesigner.design_period}</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Сдан на проверку</div>
                    <div className="cell-subtitle">
                      <Moment format="DD.MM.YYYY">{projectDesigner.project_delivery}</Moment>{' '}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Время план/факт</div>
                    <div className="cell-subtitle">10 / 13</div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Скорость проект.</div>
                    <div className="cell-subtitle">76%</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        ))}
    </div>
  );
}

export default NewPlanning;
