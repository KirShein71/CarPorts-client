import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { Table } from 'react-bootstrap';
import './OrderMaterialsList.styles.scss';

function ProjectMaterial({
  name,
  number,
  id,
  agreement_date,
  expiration_date,
  design_period,
  props,
  handleUpdateClick,
  handlePaymentDate,
  hadleReadyDate,
  hadleShippingDate,
  handleDeleteProjectMaterials,
  handleCreateMaterial,
  handleCreateColor,
  user,
  buttonNoColorProject,
  buttonNoDatePaymentProject,
  buttonNoReadyDateProject,
  buttonNoShippingDateProject,
  handleOpenModalUpdateMaterialId,
  addWorkingDays,
  formatDate,
}) {
  return (
    <div className="projectmaterial">
      <>
        <div>
          <div className="table-scrollable">
            <div className="projectmaterial__top">
              <div className="projectmaterial__number">{number}</div>
              <div className="projectmaterial__project">{name}</div>
              <button
                className="button__projectmaterial-add"
                onClick={user.isManagerProduction ? undefined : () => handleCreateMaterial(id)}>
                Добавить
              </button>
              <div className="projectmaterial__deadline">
                Сроки:{' '}
                {(() => {
                  // Вычисляем дедлайн
                  const agreementDate = new Date(agreement_date);
                  const designPeriod = design_period;
                  const expirationDate = expiration_date;
                  const sumDays = designPeriod + expirationDate;
                  const endDate = addWorkingDays(agreementDate, sumDays);
                  const formattedEndDate = formatDate(endDate);
                  return formattedEndDate;
                })()}
              </div>
              <div className="projectmaterial__remainder">
                {(() => {
                  // Вычисляем дедлайн
                  const agreementDate = new Date(agreement_date);
                  const designPeriod = design_period;
                  const expirationDate = expiration_date;
                  const sumDays = designPeriod + expirationDate;
                  const endDate = addWorkingDays(agreementDate, sumDays);

                  // Вычисляем разницу с сегодняшним днем
                  const today = new Date();
                  const timeDiff = endDate.getTime() - today.getTime();
                  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                  // Определяем цвет для цифры
                  let numberColor = 'inherit';
                  if (daysLeft < 0) {
                    numberColor = '#ff0000'; // красный для минусовых значений
                  } else if (daysLeft < 7) {
                    numberColor = '#ff6b6b'; // красный/розовый для менее 7 дней
                  }

                  return (
                    <>
                      Осталось дней:{' '}
                      <span style={{ color: numberColor, fontWeight: 'bold' }}>{daysLeft}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="table-container">
            <Table striped bordered size="sm" className="projectmaterial-table mt-3">
              <thead>
                <tr>
                  <th style={{ width: '30%' }} className="production_column">
                    Тип материала
                  </th>
                  <th style={{ textAlign: 'center', width: '25%' }}>Счёт</th>
                  <th style={{ textAlign: 'center', width: '25%' }}>Оплата</th>
                  <th style={{ textAlign: 'center', width: '25%' }}>Готовность</th>
                  <th style={{ textAlign: 'center', width: '25%' }}>Отгрузка</th>
                  <th style={{ textAlign: 'center', width: '25%' }}>Цвет</th>
                  <th style={{ width: '25%' }}></th>
                </tr>
              </thead>
              <tbody>
                {props
                  .filter((prop) => {
                    const matchesNoPayment = buttonNoDatePaymentProject
                      ? prop.date_payment === null
                      : true;
                    const matchesNoColor = buttonNoColorProject ? prop.color === null : true;
                    const matchesNoReady = buttonNoReadyDateProject
                      ? prop.ready_date === null
                      : true;
                    const matchesNoShipping = buttonNoShippingDateProject.isNoShipping
                      ? prop.shipping_date === null
                      : true;
                    return (
                      matchesNoPayment && matchesNoColor && matchesNoReady && matchesNoShipping
                    );
                  })
                  .sort((a, b) => a.id - b.id)
                  .map((prop) => {
                    return (
                      <tr key={prop.id}>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenModalUpdateMaterialId(prop.id)}
                          className="production_column">
                          {prop.materialName}
                        </td>
                        <td
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={
                            user.isManagerProduction ? undefined : () => handleUpdateClick(prop.id)
                          }>
                          {prop.check ? (
                            <>{prop.check}</>
                          ) : (
                            <span
                              style={{
                                color: 'red',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={
                            user.isManagerProduction ? undefined : () => handlePaymentDate(prop.id)
                          }>
                          {prop.date_payment ? (
                            <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                          ) : (
                            <span
                              style={{
                                color: 'red',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => hadleReadyDate(prop.id)}>
                          {prop.ready_date ? (
                            <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                          ) : (
                            <span
                              style={{
                                color: 'red',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={
                            user.isManagerProduction ? undefined : () => hadleShippingDate(prop.id)
                          }>
                          {prop.shipping_date ? (
                            <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
                          ) : (
                            <span
                              style={{
                                color: 'red',
                                textAlign: 'center',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={
                            user.isManagerProduction ? undefined : () => handleCreateColor(prop.id)
                          }>
                          {prop.color ? (
                            <>{prop.color}</>
                          ) : (
                            <span
                              style={{
                                color: 'red',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="button__projectmaterial-delete"
                            onClick={
                              user.isManagerProduction
                                ? undefined
                                : () => handleDeleteProjectMaterials(prop.id)
                            }>
                            Удалить
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    </div>
  );
}

export default ProjectMaterial;
