import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment-business-days';
import Moment from 'react-moment';

function MobilePlanning(props) {
  const {
    filteredProjects,
    addWorkingDays,
    formatDate,
    addToProjectInfo,
    handleCreateDesignerStart,
    handleUpdateProjectDelivery,
    handleCreateDateInspection,
    handleCreateInspectionDesigner,
    handleUpdateDisegnerModal,
  } = props;

  return (
    <div className="card-project">
      {filteredProjects.map((mobilePlanning) => (
        <Table key={mobilePlanning.id} bordered className="new-planning__table" size="md">
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="cell-table">
                  <div className="project-number">{mobilePlanning.number}</div>
                  <div onClick={() => addToProjectInfo(mobilePlanning.id)} className="project-name">
                    {mobilePlanning.name}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Стоимость</div>
                  <div className="cell-subtitle">
                    {Math.round(mobilePlanning.price * 0.08).toLocaleString('ru-RU')}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Задержка начала работ</div>
                  <div className="cell-subtitle">
                    {(() => {
                      if (!mobilePlanning.design_start || !mobilePlanning.agreement_date) {
                        return <span style={{ color: '#000000' }}>0</span>;
                      }

                      const designStart = new Date(mobilePlanning.design_start);
                      const agreementDate = new Date(mobilePlanning.agreement_date);

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
                    {mobilePlanning.agreement_date ? (
                      <Moment format="DD.MM.YYYY">{mobilePlanning.agreement_date}</Moment>
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Конструктор</div>
                  <div
                    className="cell-subtitle"
                    onClick={() => handleUpdateDisegnerModal(mobilePlanning.id)}>
                    {mobilePlanning.designer ? (
                      mobilePlanning.designer
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">ГИП</div>
                  <div
                    className="cell-subtitle"
                    onClick={() => handleCreateInspectionDesigner(mobilePlanning.id)}>
                    {mobilePlanning.inspection_designer ? (
                      mobilePlanning.inspection_designer
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                {mobilePlanning.design_period !== null &&
                mobilePlanning.project_delivery !== null ? (
                  <div className="cell-table">
                    <div className="cell-title">Задержка по договору</div>
                    <div
                      className="cell-subtitle"
                      style={{
                        color: (() => {
                          const projectDelivery = new Date(mobilePlanning.project_delivery);
                          const agreementDate = new Date(mobilePlanning.agreement_date);
                          const designPeriod = mobilePlanning.design_period;
                          const deadline = addWorkingDays(agreementDate, designPeriod);

                          const delay = Math.round(
                            (projectDelivery - deadline) / (1000 * 60 * 60 * 24),
                          );
                          return delay > 0 ? '#dc3545' : '#000000';
                        })(),
                      }}>
                      {(() => {
                        const projectDelivery = new Date(mobilePlanning.project_delivery);
                        const agreementDate = new Date(mobilePlanning.agreement_date);
                        const designPeriod = mobilePlanning.design_period;
                        const deadline = addWorkingDays(agreementDate, designPeriod);

                        const delay = Math.round(
                          (projectDelivery - deadline) / (1000 * 60 * 60 * 24),
                        );
                        return delay;
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="cell-table">
                    <div className="cell-title">Осталось дней</div>
                    <div
                      className="cell-subtitle"
                      style={{
                        textAlign: 'center',
                        backgroundColor: (() => {
                          const targetDate = moment(
                            mobilePlanning.agreement_date,
                            'YYYY/MM/DD',
                          ).businessAdd(mobilePlanning.design_period, 'days');

                          // Если есть дата сдачи проекта, используем ее для расчета
                          if (mobilePlanning.project_delivery) {
                            const deliveryDate = moment(
                              mobilePlanning.project_delivery,
                              'YYYY/MM/DD',
                            );
                            const daysDifference = targetDate.diff(deliveryDate, 'days'); // положительное - сдали раньше, отрицательное - опоздали

                            if (daysDifference < 0) {
                              return '#ff0000'; // красный - сдали после дедлайна (опоздание)
                            } else if (daysDifference < 7) {
                              return '#ffe6e6'; // бледно-розовый - сдали за 0-6 дней до дедлайна
                            } else {
                              return 'transparent'; // прозрачный - сдали за 7+ дней до дедлайна
                            }
                          } else {
                            // Если даты сдачи нет, считаем оставшиеся дни до дедлайна
                            const today = moment();
                            const daysLeft = targetDate.diff(today, 'days');

                            if (daysLeft < 0) {
                              return '#ff0000'; // красный - дедлайн прошел
                            } else if (daysLeft < 7) {
                              return '#ffe6e6'; // бледно-розовый - менее 7 дней осталось
                            } else {
                              return 'transparent'; // прозрачный - все нормально
                            }
                          }
                        })(),
                      }}>
                      {(() => {
                        const targetDate = moment(
                          mobilePlanning.agreement_date,
                          'YYYY/MM/DD',
                        ).businessAdd(mobilePlanning.design_period, 'days');

                        if (mobilePlanning.project_delivery) {
                          const deliveryDate = moment(
                            mobilePlanning.project_delivery,
                            'YYYY/MM/DD',
                          );
                          const daysDifference = targetDate.diff(deliveryDate, 'days'); // положительное - сдали раньше

                          // Показываем сколько дней ДО дедлайна сдали (положительное) или после (отрицательное)
                          return daysDifference >= 0 ? daysDifference : daysDifference;
                        } else {
                          const today = moment();
                          const daysLeft = targetDate.diff(today, 'days');
                          return daysLeft;
                        }
                      })()}
                    </div>
                  </div>
                )}
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
                      const agreementDate = new Date(mobilePlanning.agreement_date);
                      const designPeriod = mobilePlanning.design_period;

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
                  <div
                    className="cell-subtitle"
                    onClick={() => handleCreateDesignerStart(mobilePlanning.id)}>
                    {mobilePlanning.design_start ? (
                      <Moment format="DD.MM.YYYY">{mobilePlanning.design_start}</Moment>
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Дата проверки</div>
                  <div
                    className="cell-subtitle"
                    onClick={() => handleCreateDateInspection(mobilePlanning.id)}>
                    {mobilePlanning.date_inspection ? (
                      <Moment format="DD.MM.YYYY">{mobilePlanning.date_inspection}</Moment>
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Задержка проверки</div>
                  <div className="cell-subtitle">
                    {(() => {
                      const dateInspection = new Date(mobilePlanning.date_inspection);
                      const projectDelivery = new Date(mobilePlanning.project_delivery);

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
                  <div className="cell-subtitle">{mobilePlanning.design_period}</div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Сдан на проверку</div>
                  <div
                    className="cell-subtitle"
                    onClick={() => handleUpdateProjectDelivery(mobilePlanning.id)}>
                    {mobilePlanning.project_delivery ? (
                      <Moment format="DD.MM.YYYY">{mobilePlanning.project_delivery}</Moment>
                    ) : (
                      <span style={{ color: 'red' }} className="cell-subtitle">
                        +
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className="cell-table">
                  <div className="cell-title">Время план/факт</div>
                  <div className="cell-subtitle">
                    {Math.round((mobilePlanning.price * 0.08) / 5000) || 0} /{' '}
                    {mobilePlanning.project_delivery && mobilePlanning.design_start
                      ? Math.round(
                          (new Date(mobilePlanning.project_delivery) -
                            new Date(mobilePlanning.design_start)) /
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
                      const plan = Math.round((mobilePlanning.price * 0.08) / 5000);
                      const fact =
                        mobilePlanning.project_delivery && mobilePlanning.design_start
                          ? Math.round(
                              (new Date(mobilePlanning.project_delivery) -
                                new Date(mobilePlanning.design_start)) /
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

export default MobilePlanning;
