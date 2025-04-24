import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { Table, Button } from 'react-bootstrap';
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
  projectNoDatePaymentCheckbox,
  projectNoColorCheckbox,
  user,
}) {
  return (
    <div className="projectmaterial">
      <>
        <div>
          <div className="table-scrollable">
            <div className="projectmaterial__top">
              <div className="projectmaterial__number">{number}</div>
              <div className="projectmaterial__project">{name}</div>
              <Button
                size="sm"
                className="ms-3"
                variant="dark"
                style={{ whiteSpace: 'nowrap' }}
                onClick={user.isManagerProduction ? undefined : () => handleCreateMaterial(id)}>
                Добавить материал
              </Button>
              <div className="projectmaterial__deadline">
                Сроки :
                {moment(agreement_date, 'YYYY/MM/DD')
                  .businessAdd(expiration_date, 'days')
                  .businessAdd(design_period, 'days')
                  .format('DD.MM.YYYY')}
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
                  .filter((prop) => !projectNoColorCheckbox || prop.color === null)
                  .filter((prop) => !projectNoDatePaymentCheckbox || prop.date_payment === null)
                  .sort((a, b) => a.id - b.id)
                  .map((prop) => {
                    return (
                      <tr key={prop.id}>
                        <td className="production_column">{prop.materialName}</td>
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
                          <Button
                            size="sm"
                            variant="dark"
                            onClick={
                              user.isManagerProduction
                                ? undefined
                                : () => handleDeleteProjectMaterials(prop.id)
                            }>
                            Удалить
                          </Button>
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
