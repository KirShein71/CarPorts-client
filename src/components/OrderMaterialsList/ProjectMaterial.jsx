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
                variant="primary"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => handleCreateMaterial(id)}>
                Добавить материал
              </Button>
            </div>
          </div>
          <div className="table-container">
            <Table striped bordered size="sm" className="mt-3">
              <thead>
                <tr>
                  <th className="production_column">Тип материала</th>
                  <th>Дедлайн производства</th>
                  <th>Счёт</th>
                  <th>Дата оплаты</th>
                  <th>Дата готовности</th>
                  <th>Даты отгрузки</th>
                  <th>Цвет</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {props
                  .filter((prop) => !projectNoColorCheckbox || prop.color === null)
                  .filter((prop) => !projectNoDatePaymentCheckbox || prop.date_payment === null)
                  .map((prop) => {
                    return (
                      <tr key={prop.id}>
                        <td className="production_column">{prop.materialName}</td>
                        <td>
                          {moment(agreement_date, 'YYYY/MM/DD')
                            .businessAdd(expiration_date, 'days')
                            .businessAdd(design_period, 'days')
                            .format('DD.MM.YYYY')}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUpdateClick(prop.id)}>
                          {prop.check ? (
                            <>{prop.check}</>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePaymentDate(prop.id)}>
                          {prop.date_payment ? (
                            <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td style={{ cursor: 'pointer' }} onClick={() => hadleReadyDate(prop.id)}>
                          {prop.ready_date ? (
                            <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => hadleShippingDate(prop.id)}>
                          {prop.shipping_date ? (
                            <Moment format="DD.MM.YYYY">{prop.shipping_date}</Moment>
                          ) : (
                            <span
                              style={{
                                color: 'red',

                                fontWeight: 600,
                                cursor: 'pointer',
                              }}>
                              +
                            </span>
                          )}
                        </td>
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleCreateColor(prop.id)}>
                          {prop.color ? (
                            <>{prop.color}</>
                          ) : (
                            <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                              +
                            </span>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProjectMaterials(prop.id)}>
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
