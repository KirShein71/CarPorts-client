import { Table } from 'react-bootstrap';

function ShipmentAntypicals({
  antypicalsDetails,
  handleOpenModalCreateAntypicalsShipmentQuantity,
  handleDownloadFile,
}) {
  return (
    <div className="welders-antypicals">
      <Table className="mt-4" bordered>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Номер</th>
            <th style={{ textAlign: 'center' }}>Проект</th>
            <th style={{ textAlign: 'center' }}>Деталь</th>
            <th style={{ textAlign: 'center' }}>Заказ</th>
            <th style={{ textAlign: 'center' }}>Покраска</th>
          </tr>
        </thead>
        <tbody>
          {antypicalsDetails.map((antypDetail) => (
            <tr key={antypDetail.id}>
              <td>{antypDetail.project.number}</td>
              <td>{antypDetail.project.name}</td>
              <td
                onClick={() =>
                  handleDownloadFile(process.env.REACT_APP_IMG_URL + antypDetail.image)
                }
                style={{ textAlign: 'center', cursor: 'pointer' }}>
                {antypDetail.name ? antypDetail.name : 'Файл'}
              </td>
              <td style={{ textAlign: 'center' }}>
                {antypDetail.antypicals_quantity}({antypDetail.color})
              </td>
              <td
                onClick={() => handleOpenModalCreateAntypicalsShipmentQuantity(antypDetail.id)}
                style={{ textAlign: 'center', cursor: 'pointer' }}>
                {antypDetail.antypicals_shipment_quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ShipmentAntypicals;
