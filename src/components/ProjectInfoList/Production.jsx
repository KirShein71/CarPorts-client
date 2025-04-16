import React from 'react';
import { Table } from 'react-bootstrap';

function Production(props) {
  const {
    nameDetails,
    project,
    handleOpenModalUpdateProjectDetail,
    handleOpenModalCreateOneProjectDetail,
    handleOpenModalCreateOneShipmentDetail,
    handleOpenModalUpdateShipmentDetail,
    handleOpenModalCreateAntypical,
    handleOpenModalAntypicalImage,
    handleOpenModalCreateOneDeliveryDetail,
    handleOpenModalUpdateDeliveryDetail,
  } = props;

  const [showAllDetails, setShowAllDetails] = React.useState(false);

  // Фильтруем детали в зависимости от состояния showAllDetails
  const filteredDetails = showAllDetails
    ? nameDetails
    : nameDetails.filter((part) =>
        project.extractedDetails?.some((detail) => detail.detailId === part.id),
      );

  return (
    <div className="table-production">
      <Table bordered size="md" className="mt-3">
        <thead>
          <tr>
            <th className="table-production__th">Изделия</th>
            <th className="table-production__th">Заказ</th>
            <th className="table-production__th">Покраска</th>
            <th className="table-production__th">Отгрузка</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetails
            .sort((a, b) => a.id - b.id)
            .map((part) => {
              const detailProject = project.extractedDetails?.find(
                (prop) => prop.detailId === part.id,
              );
              const quantity = detailProject ? detailProject.quantity : '';

              const detailPainting = project.shipmentDetails?.find(
                (prop) => prop.detailId === part.id,
              );

              const quantityPainting = detailPainting ? detailPainting.quantity : '';

              const detailDelivery = project.deliveryDetails?.find(
                (prop) => prop.detailId === part.id,
              );

              const quantityDelivery = detailDelivery ? detailDelivery.quantity : '';

              return (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  <td
                    onClick={() => {
                      quantity
                        ? handleOpenModalUpdateProjectDetail(detailProject.id)
                        : handleOpenModalCreateOneProjectDetail(part.id, project.project.id);
                    }}
                    style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {quantity}
                  </td>
                  <td
                    onClick={() => {
                      quantityPainting
                        ? handleOpenModalUpdateShipmentDetail(detailPainting.id)
                        : handleOpenModalCreateOneShipmentDetail(
                            part.id,
                            project.project.id,
                            project.shipmentDetails.length > 0
                              ? project.shipmentDetails[0].date
                              : new Date().toISOString(),
                          );
                    }}
                    style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {quantityPainting}
                  </td>
                  <td
                    onClick={() => {
                      quantityDelivery
                        ? handleOpenModalUpdateDeliveryDetail(detailDelivery.id)
                        : handleOpenModalCreateOneDeliveryDetail(part.id, project.project.id);
                    }}
                    style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {quantityDelivery ? (
                      <div>{quantityDelivery}</div>
                    ) : (
                      <div
                        style={{
                          cursor: 'pointer',
                          color: 'red',
                          fontWeight: 600,
                          fontSize: '20px',
                        }}>
                        +
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
        <tbody>
          <tr>
            <td>Нетиповые</td>
            <td>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  onClick={() => handleOpenModalCreateAntypical(project.project.id)}
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    fontWeight: 600,
                    paddingRight: '15px',
                  }}>
                  +
                </div>
                <div
                  onClick={() => handleOpenModalAntypicalImage(project.antypicalDetails)}
                  className="production__eye">
                  {project.antypicalDetails?.length > 0 ? (
                    <img src="../img/eye.png" alt="eye" />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>
              <button className="btn btn-link" onClick={() => setShowAllDetails(!showAllDetails)}>
                {showAllDetails ? 'Скрыть' : 'Показать все'}
              </button>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

export default Production;

{
  /* <thead>
<tr>
  <th className="table-production__th">Производство</th>
  {nameDetails
    .sort((a, b) => a.id - b.id)
    .map((part) => (
      <th key={part.id}>{part.name}</th>
    ))}
  <th>Нетиповые</th>
</tr>
</thead> */
}

{
  /* <tbody>
          <tr>
            <th className="table-production__th">Заказ</th>
            {nameDetails
              .sort((a, b) => a.id - b.id)
              .map((part) => {
                const detailProject = project.extractedDetails?.find(
                  (prop) => prop.detailId === part.id,
                );
                const quantity = detailProject ? detailProject.quantity : '';
                return (
                  <td
                    key={part.id}
                    onClick={() => {
                      quantity
                        ? handleOpenModalUpdateProjectDetail(detailProject.id)
                        : handleOpenModalCreateOneProjectDetail(part.id, project.project.id);
                    }}
                    style={{ cursor: 'pointer' }}>
                    {quantity}
                  </td>
                );
              })}
            <td>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  onClick={() => handleOpenModalCreateAntypical(project.project.id)}
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    fontWeight: 600,
                    paddingRight: '15px',
                  }}>
                  +
                </div>
                <div
                  onClick={() => handleOpenModalAntypicalImage(project.antypicalDetails)}
                  className="production__eye">
                  {project.antypicalDetails?.length > 0 ? (
                    <img src="../img/eye.png" alt="eye" />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th className="table-production__th">
              <div>Отгрузка</div>
            </th>
            {nameDetails
              .sort((a, b) => a.id - b.id)
              .map((part) => {
                const detailProject = project.shipmentDetails?.find(
                  (prop) => prop.detailId === part.id,
                );
                const quantity = detailProject ? detailProject.quantity : '';
                return <td key={part.id}>{quantity}</td>;
              })}
            <td></td>
          </tr>
        </tbody> */
}
