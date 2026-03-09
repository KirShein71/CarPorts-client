import React from 'react';
import { getAllForShipmentOrderProject } from '../../http/shipmentOrderApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import ModalImage from './modals/ModalImage';

import './style.scss';

function ShipmentOrderComponent() {
  const [shipmentOrderDetails, setShipmentOrderDetails] = React.useState([]);
  const [details, setDetails] = React.useState([]);
  const [modalImage, setModalImage] = React.useState(false);
  const [image, setImage] = React.useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const projectId = queryParams.get('projectId');
  const date = queryParams.get('date');

  React.useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        const data = await fetchAllDetails();
        if (isMounted) {
          setDetails(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке деталей:', error);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const fetchShipmentOrders = async () => {
      if (!projectId || !date) return;

      try {
        const data = await getAllForShipmentOrderProject(projectId, date);
        if (isMounted) {
          setShipmentOrderDetails(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных отгрузки:', error);
      }
    };

    fetchShipmentOrders();

    return () => {
      isMounted = false;
    };
  }, [projectId, date]);

  // Получаем все detailId из shipmentOrderDetails (только те, у которых detailId не null)
  const detailIdsFromShipment = React.useMemo(() => {
    if (!shipmentOrderDetails.length) return [];

    const ids = shipmentOrderDetails.flatMap((order) =>
      order.props.filter((prop) => prop.detailId !== null).map((prop) => prop.detailId),
    );

    return [...new Set(ids)];
  }, [shipmentOrderDetails]);

  // Получаем все нетиповые детали из shipmentOrderDetails
  const antypicalDetails = React.useMemo(() => {
    if (!shipmentOrderDetails.length) return [];

    // Собираем все пропсы с detailId === null и antypical_name !== null
    const antypicalProps = shipmentOrderDetails.flatMap((order) =>
      order.props.filter((prop) => prop.detailId === null && prop.antypical_name !== null),
    );

    // Убираем дубликаты по antypical_name (если нужно)
    const uniqueAntypical = [];
    const seenNames = new Set();

    antypicalProps.forEach((prop) => {
      if (!seenNames.has(prop.antypical_name)) {
        seenNames.add(prop.antypical_name);
        uniqueAntypical.push(prop);
      }
    });

    return uniqueAntypical;
  }, [shipmentOrderDetails]);

  // Фильтруем детали, оставляя только те, которые есть в shipmentOrderDetails
  const filteredDetails = React.useMemo(() => {
    if (!details.length || !detailIdsFromShipment.length) return [];

    return details
      .filter((part) => detailIdsFromShipment.includes(part.id))
      .sort((a, b) => a.number - b.number);
  }, [details, detailIdsFromShipment]);

  const handleOpenModalImage = (image) => {
    setImage(image);
    setModalImage(true);
  };

  return (
    <div className="shipment-order">
      <ModalImage show={modalImage} setShow={setModalImage} image={image} />
      <div className="shipment-order__header">
        {shipmentOrderDetails.map((shipOrder) => (
          <div key={shipOrder.shipment_date} className="shipment-order__header-title">
            Заказ для проекта: {shipOrder.projectName} {shipOrder.projectNumber} от{' '}
            <Moment format="DD.MM.YYYY">{shipOrder.shipment_date}</Moment>
          </div>
        ))}
        <div className="shipment-order__content">
          <Table className="shipment-order__table" bordered>
            <thead>
              <tr>
                <th className="shipment-order__table-th">Деталь</th>
                <th className="shipment-order__table-th">Цвет</th>
                <th className="shipment-order__table-th">Количество</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((part) => {
                const shipmentProp = shipmentOrderDetails[0]?.props.find(
                  (prop) => prop.detailId === part.id,
                );

                return (
                  <tr key={part.id}>
                    <td className="shipment-order__table-td">{part.name}</td>
                    <td className="shipment-order__table-td">{shipmentProp?.color || ''}</td>
                    <td className="shipment-order__table-td">
                      {shipmentProp?.shipment_quantity || ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Блок с нетиповыми деталями */}
          {antypicalDetails.length > 0 && (
            <div className="shipment-order__antypical">
              <div className="shipment-order__antypical-title">Нетиповые детали</div>
              <Table className="shipment-order__antypical-table" bordered>
                <thead>
                  <tr>
                    <th className="shipment-order__antypical-th">Название</th>
                    <th className="shipment-order__antypical-th">Цвет</th>
                    <th className="shipment-order__antypical-th">Количество</th>
                    <th className="shipment-order__antypical-th">Чертеж</th>
                  </tr>
                </thead>
                <tbody>
                  {antypicalDetails.map((prop, index) => (
                    <tr key={prop.id || index}>
                      <td className="shipment-order__antypical-td">{prop.antypical_name}</td>
                      <td className="shipment-order__antypical-td">{prop.color || ''}</td>
                      <td className="shipment-order__antypical-td">
                        {prop.shipment_quantity || ''}
                      </td>
                      <td
                        className="shipment-order__antypical-image"
                        onClick={() => handleOpenModalImage(prop.image)}>
                        <img src="./img/eye.png" alt="Посмотреть чертеж" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShipmentOrderComponent;
