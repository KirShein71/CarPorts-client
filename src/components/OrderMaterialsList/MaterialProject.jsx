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
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('prop.name');

  const sortedProps = [...props].sort((a, b) => {
    if (sortField === 'prop.name') {
      if (a.name < b.name) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (a.name > b.name) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
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
            <Table striped bordered size="sm" className="mt-3">
              <thead>
                <tr>
                  <th>Номер проекта</th>
                  <th className="production_column">
                    <div style={{ cursor: 'pointer', display: 'flex' }}>
                      <div>Название проекта</div>{' '}
                      <img
                        onClick={() => handleSort('prop.name')}
                        style={{ marginLeft: '10px', width: '24px', height: '24px' }}
                        src="./img/sort.png"
                        alt="icon_sort"
                      />
                    </div>
                  </th>
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
                {sortedProps
                  .filter((prop) => !projectNoDatePaymentCheckbox || prop.date_payment === null)
                  .filter((prop) => !projectNoColorCheckbox || prop.color === null)
                  .sort((a, b) => a.id - b.id)
                  .map((prop) => (
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
                          <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                            +
                          </span>
                        )}
                      </td>
                      <td
                        style={{ cursor: 'pointer' }}
                        onClick={
                          user.isManagerProduction ? undefined : () => handlePaymentDate(prop.id)
                        }>
                        {prop.date_payment ? (
                          <Moment format="DD.MM.YYYY">{prop.date_payment}</Moment>
                        ) : (
                          <span style={{ color: 'red', fontWeight: 600, cursor: 'pointer' }}>
                            +
                          </span>
                        )}
                      </td>
                      <td
                        style={{ cursor: 'pointer' }}
                        onClick={
                          user.isManagerProduction ? undefined : () => hadleReadyDate(prop.id)
                        }>
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
                        onClick={
                          user.isManagerProduction ? undefined : () => hadleShippingDate(prop.id)
                        }>
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
                        onClick={
                          user.isManagerProduction ? undefined : () => handleCreateColor(prop.id)
                        }>
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
