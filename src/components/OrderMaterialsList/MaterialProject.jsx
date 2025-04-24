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
  projectNoDatePaymentCheckbox,
  projectNoColorCheckbox,
  user,
}) {
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [sortField, setSortField] = React.useState('prop.number');

  const sortedProps = [...props].sort((a, b) => {
    const aValue =
      sortField === 'prop.number'
        ? a.number
        : moment(a.agreement_date, 'YYYY/MM/DD')
            .businessAdd(a.expiration_date, 'days')
            .businessAdd(a.design_period, 'days');

    const bValue =
      sortField === 'prop.number'
        ? b.number
        : moment(b.agreement_date, 'YYYY/MM/DD')
            .businessAdd(b.expiration_date, 'days')
            .businessAdd(b.design_period, 'days');

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    } else if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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
            <Table striped bordered size="sm" className="projectmaterial-table mt-3">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>
                    <div style={{ cursor: 'pointer', display: 'flex' }}>
                      <div>Номер</div>{' '}
                      <img
                        onClick={() => handleSort('prop.number')}
                        style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                        src="./img/sort.png"
                        alt="icon_sort"
                      />
                    </div>
                  </th>
                  <th className="production_column" style={{ width: '30%' }}>
                    Название проекта
                  </th>
                  <th style={{ textAlign: 'center', width: '25%' }}>
                    <div style={{ cursor: 'pointer', display: 'flex' }}>
                      <div>Дедлайн</div>{' '}
                      <img
                        onClick={() => handleSort('deadline')}
                        style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                        src="./img/sort.png"
                        alt="icon_sort"
                      />
                    </div>
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
                {sortedProps
                  .filter((prop) => !projectNoDatePaymentCheckbox || prop.date_payment === null)
                  .filter((prop) => !projectNoColorCheckbox || prop.color === null)

                  .map((prop) => (
                    <tr>
                      <td>{prop.number}</td>
                      <td className="production_column">{prop.name}</td>
                      <td style={{ textAlign: 'center' }}>
                        {moment(prop.agreement_date, 'YYYY/MM/DD')
                          .businessAdd(prop.expiration_date, 'days')
                          .businessAdd(prop.design_period, 'days')
                          .format('DD.MM.YYYY')}
                      </td>
                      <td
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                        onClick={() => handleUpdateClick(prop.id)}>
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
                        onClick={
                          user.isManagerProduction ? undefined : () => hadleReadyDate(prop.id)
                        }>
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
