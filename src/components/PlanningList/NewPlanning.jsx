import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-business-days';
import Moment from 'react-moment';

function NewPlanning(props) {
  const {
    projects,
    selectedDesignerName,
    selectedDesignerId,
    currentMonth,
    currentYear,
    addWorkingDays,
    formatDate,
  } = props;

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
          <Table key={projectDesigner.id} bordered className="new-planning__table" size="md">
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
                    <div className="cell-subtitle">
                      {Math.round(projectDesigner.price * 0.08).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка начала работ</div>
                    <div className="cell-subtitle">
                      {(() => {
                        if (!projectDesigner.design_start || !projectDesigner.agreement_date) {
                          return <span style={{ color: '#000000' }}>0</span>;
                        }

                        const designStart = new Date(projectDesigner.design_start);
                        const agreementDate = new Date(projectDesigner.agreement_date);

                        const delay = Math.round(
                          (designStart - agreementDate) / (1000 * 60 * 60 * 24),
                        );

                        return (
                          <span style={{ color: delay > 0 ? '#dc3545' : '#000000' }}>{delay}</span>
                        );
                      })()}
                    </div>
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
                      {projectDesigner.agreement_date ? (
                        <Moment format="DD.MM.YYYY">{projectDesigner.agreement_date}</Moment>
                      ) : (
                        <span className="cell-subtitle">дата не добавлена</span>
                      )}
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
                    <div className="cell-subtitle">
                      {projectDesigner.inspection_designer
                        ? projectDesigner.inspection_designer
                        : 'ГИП не назначен'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка по договору</div>
                    <div
                      className="cell-subtitle"
                      style={{
                        color: (() => {
                          const projectDelivery = new Date(projectDesigner.project_delivery);
                          const agreementDate = new Date(projectDesigner.agreement_date);
                          const designPeriod = projectDesigner.design_period;
                          const deadline = addWorkingDays(agreementDate, designPeriod);

                          const delay = Math.round(
                            (projectDelivery - deadline) / (1000 * 60 * 60 * 24),
                          );
                          return delay > 0 ? '#dc3545' : '#000000';
                        })(),
                      }}>
                      {(() => {
                        const projectDelivery = new Date(projectDesigner.project_delivery);
                        const agreementDate = new Date(projectDesigner.agreement_date);
                        const designPeriod = projectDesigner.design_period;
                        const deadline = addWorkingDays(agreementDate, designPeriod);

                        const delay = Math.round(
                          (projectDelivery - deadline) / (1000 * 60 * 60 * 24),
                        );
                        return delay;
                      })()}
                    </div>
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
                      {projectDesigner.design_start ? (
                        <Moment format="DD.MM.YYYY">{projectDesigner.design_start}</Moment>
                      ) : (
                        <span className="cell-subtitle">дата не добавлена</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Дата проверки</div>
                    <div className="cell-subtitle">
                      {projectDesigner.date_inspection ? (
                        <Moment format="DD.MM.YYYY">{projectDesigner.date_inspection}</Moment>
                      ) : (
                        <span className="cell-subtitle">дата не добавлена</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Задержка проверки</div>
                    <div className="cell-subtitle">
                      {(() => {
                        const dateInspection = new Date(projectDesigner.date_inspection);
                        const projectDelivery = new Date(projectDesigner.project_delivery);

                        const delay = Math.round(
                          (dateInspection - projectDelivery) / (1000 * 60 * 60 * 24),
                        );

                        return (
                          <span style={{ color: delay > 0 ? '#dc3545' : '#000000' }}>{delay}</span>
                        );
                      })()}
                    </div>
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
                      {projectDesigner.project_delivery ? (
                        <Moment format="DD.MM.YYYY">{projectDesigner.project_delivery}</Moment>
                      ) : (
                        <span className="cell-subtitle">дата не добавлена</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Время план/факт</div>
                    <div className="cell-subtitle">
                      {Math.round((projectDesigner.price * 0.08) / 5000) || 0} /{' '}
                      {projectDesigner.project_delivery && projectDesigner.design_start
                        ? Math.round(
                            (new Date(projectDesigner.project_delivery) -
                              new Date(projectDesigner.design_start)) /
                              (1000 * 60 * 60 * 24) +
                              1,
                          )
                        : 0}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="cell-table">
                    <div className="cell-title">Скорость проект.</div>
                    <div className="cell-subtitle">
                      {(() => {
                        const plan = Math.round((projectDesigner.price * 0.08) / 5000);
                        const fact =
                          projectDesigner.project_delivery && projectDesigner.design_start
                            ? Math.round(
                                (new Date(projectDesigner.project_delivery) -
                                  new Date(projectDesigner.design_start)) /
                                  (1000 * 60 * 60 * 24) +
                                  1,
                              )
                            : 0;

                        const percentage = fact > 0 ? Math.round((plan / fact) * 100) : 0;

                        return `${percentage}%`;
                      })()}
                    </div>
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
