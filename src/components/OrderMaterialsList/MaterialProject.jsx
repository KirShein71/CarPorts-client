import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { Table, Button } from 'react-bootstrap';
import './OrderMaterialsList.styles.scss';

function MaterialProject({
  materialName,
  props,
  handleUpdateClick,
  handlePaymentDate,
  hadleReadyDate,
  hadleShippingDate,
  handleDeleteProjectMaterials,
  handleCreateColor,
}) {
  return (
    <div className="materialproject">
      <>
        <div>
          <div className="table-scrollable">
            <div className="materialproject__top">
              <div className="materialproject__name">{materialName}</div>
            </div>
          </div>
          <div className="table-container">
            <Table striped bordered size="sm" className="mt-3">
              <thead>
                <tr>
                  <th>Номер проекта</th>
                  <th className="production_column">Название проекта</th>
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
                {props.map((prop) => (
                  <tr>
                    <td>{prop.number}</td>
                    <td className="production_column">{prop.name}</td>
                    <td>
                      {moment(prop.agreement_date, 'YYYY/MM/DD')
                        .businessAdd(prop.expiration_date, 'days')
                        .businessAdd(prop.design_period, 'days')
                        .format('DD.MM.YYYY')}
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => handleUpdateClick(prop.id)}>
                      {prop.check ? (
                        <>{prop.check}</>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
                      )}
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => handlePaymentDate(prop.id)}>
                      {prop.date_payment ? (
                        <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
                      )}
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => hadleReadyDate(prop.id)}>
                      {prop.ready_date ? (
                        <Moment format="DD.MM.YYYY">{prop.ready_date}</Moment>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
                      )}
                    </td>
                    <td style={{ cursor: 'pointer' }} onClick={() => hadleShippingDate(prop.id)}>
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
                    <td style={{ cursor: 'pointer' }} onClick={() => handleCreateColor(prop.id)}>
                      {prop.color ? (
                        <>{prop.color}</>
                      ) : (
                        <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>+</span>
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
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </>
    </div>
  );
}

export default MaterialProject;
