import React from 'react';
import Header from '../Header/Header';
import { Table, Spinner } from 'react-bootstrap';
import { getSumOneDetail } from '../../http/stockDetailsApi';
import { fetchAllDetails } from '../../http/detailsApi';
import { getSumOneShipmentDetail } from '../../http/shipmentDetailsApi';
import { getAllRemainderOneDetail } from '../../http/remainderDetailsApi';
import { getOverproductionOneDetail } from '../../http/remainderDetailsApi';
import { getProduceOneDetail } from '../../http/remainderDetailsApi';
import { getWaitShipmentProjectOneDetail } from '../../http/remainderDetailsApi';
import { getWaitShipment } from '../../http/remainderDetailsApi';
import ModalImage from './modal/ModalImage';
import './styles.scss';

function ManufactureList() {
  const [nameDetails, setNameDatails] = React.useState([]);
  const [sumStockDetail, setSumStockDetail] = React.useState([]);
  const [sumShipmentDetail, setSumShipmentDetail] = React.useState([]);
  const [overproductionDetail, SetOverproductionDetail] = React.useState([]);
  const [produceDetail, setProduceDetail] = React.useState([]);
  const [remainderDetail, setRemainderDetail] = React.useState([]);
  const [waitShipmentDetail, setWaitShipmentDetail] = React.useState([]);
  const [waitShipmentAllOneDetail, setWaitShipmentAllOneDetail] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const [imageModal, setImageModal] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [fullTableButton, setFullTableButton] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      fetchAllDetails(),
      getAllRemainderOneDetail(),
      getOverproductionOneDetail(),
      getSumOneShipmentDetail(),
      getSumOneDetail(),
      getProduceOneDetail(),
      getWaitShipmentProjectOneDetail(),
      getWaitShipment(),
    ])
      .then(
        ([
          nameDetails,
          remainderDetail,
          overproductionDetail,
          sumShipmentDetail,
          sumStockDetail,
          produceDetail,
          waitShipmentDetail,
          waitShipmentAllOneDetail,
        ]) => {
          setNameDatails(nameDetails);
          setRemainderDetail(remainderDetail);
          SetOverproductionDetail(overproductionDetail);
          setSumShipmentDetail(sumShipmentDetail);
          setSumStockDetail(sumStockDetail);
          setNameDatails(nameDetails);
          setProduceDetail(produceDetail);
          setWaitShipmentDetail(waitShipmentDetail);
          setWaitShipmentAllOneDetail(waitShipmentAllOneDetail);
        },
      )
      .finally(() => setFetching(false));
  }, []);

  const handleOpenImage = (images, id) => {
    setImages(images, id);
    setImageModal(true);
  };

  const holidays = [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-08',
    '2024-02-23',
    '2024-03-08',
    '2024-04-29',
    '2024-04-30',
    '2024-05-01',
    '2024-05-09',
    '2024-05-10',
    '2024-06-12',
    '2024-11-04',
    '2025-01-01',
    '2025-01-02',
    '2025-01-03',
    '2025-01-06',
    '2025-01-07',
    '2025-01-08',
    '2025-05-01',
    '2025-05-02',
    '2025-05-08',
    '2025-05-09',
    '2025-06-12',
    '2025-06-13',
    '2025-11-03',
    '2025-11-04',
    '2025-12-31',
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05',
    '2026-01-08',
    '2026-01-09',
    '2026-02-23',
    '2026-03-09',
    '2026-05-01',
    '2026-05-11',
    '2026-06-12',
    '2026-11-04',
    '2026-12-31',
  ].map((date) => new Date(date));

  // Функция для проверки, является ли дата выходным или праздничным днем
  function isWorkingDay(date) {
    const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
    const isHoliday = holidays.some((holiday) => {
      const holidayString = holiday.toDateString();
      const dateString = date.toDateString();
      return holidayString === dateString;
    });

    return dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday; // Не выходной и не праздник
  }
  // Функция для добавления рабочих дней к дате
  function addWorkingDays(startDate, daysToAdd) {
    let currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
      if (isWorkingDay(currentDate)) {
        addedDays++;
      }
    }

    return currentDate;
  }

  // Функция для форматирования даты в формате ДД.ММ.ГГГГ
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Исправлено: добавлены кавычки для шаблонной строки
  }

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="manufacturelist">
      <Header title={'Итоговая таблица по производству'} />
      <button
        className={`button-manufacture__fulltable ${
          fullTableButton === true ? 'active' : 'inactive'
        }`}
        onClick={() => setFullTableButton(!fullTableButton)}>
        Общая
      </button>
      <div className="table-scrollable">
        <ModalImage show={imageModal} images={images} setShow={setImageModal} />
        <div className="manufacture-table-container">
          <div className="manufacture-table-wrapper">
            {fullTableButton ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="manufacture-fulltable__thead detail">Деталь</th>
                    <th className="manufacture-fulltable__thead">Произведено</th>
                    <th className="manufacture-fulltable__thead">В покраску</th>
                    <th className="manufacture-fulltable__thead">Жду покраску</th>
                    <th className="manufacture-fulltable__thead">Остаток</th>
                    <th className="manufacture-fulltable__thead">К производству</th>
                    <th className="manufacture-fulltable__thead">Перепроизводство</th>
                  </tr>
                </thead>
                <tbody>
                  {nameDetails
                    .sort((a, b) => a.number - b.number)
                    .map((part) => (
                      <tr key={part.id}>
                        {/* Название детали */}
                        <td className="manufacture-fulltable__td detail">{part.name}</td>

                        {/* Произведено */}
                        <td className="manufacture-fulltable__td">
                          {sumStockDetail
                            .flatMap((sum) => sum.props)
                            .find((p) => p.detailId === part.id)?.totalSum || ''}
                        </td>

                        {/* В покраску */}
                        <td className="manufacture-fulltable__td">
                          {sumShipmentDetail
                            .flatMap((sumShipment) => sumShipment.props)
                            .find((p) => p.detailId === part.id)?.shipmentSum || ''}
                        </td>

                        {/* Жду покраску */}
                        <td className="manufacture-fulltable__td">
                          {waitShipmentAllOneDetail
                            .flatMap((allWait) => allWait.props)
                            .find((p) => p.detailId === part.id)?.waitShipmentDifference || ''}
                        </td>

                        {/* Остаток */}
                        <td className="manufacture-fulltable__td">
                          {remainderDetail
                            .flatMap((remainder) => remainder.props)
                            .find((p) => p.detailId === part.id)?.remainderDifference || ''}
                        </td>

                        {/* К производству */}
                        <td className="manufacture-fulltable__td">
                          {(() => {
                            const prop = produceDetail
                              .flatMap((produce) => produce.props)
                              .find((p) => p.detailId === part.id);
                            return prop?.produceDifference !== undefined
                              ? prop.produceDifference < 0
                                ? 0
                                : prop.produceDifference
                              : prop?.projectSum || '';
                          })()}
                        </td>

                        {/* Перепроизводство */}
                        <td className="manufacture-fulltable__td">
                          {(() => {
                            const prop = overproductionDetail
                              .flatMap((over) => over.props)
                              .find((p) => p.detailId === part.id);
                            return prop?.overproductionDifference < 0
                              ? 0
                              : prop?.overproductionDifference || '';
                          })()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <Table bordered>
                <thead className="manufacture-top__thead">
                  <tr>
                    <th className="manufacture_thead"></th>
                    <th className="manufacture_thead"></th>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((partAntypical) => (
                        <th className="manufacture_thead" key={partAntypical.id}></th>
                      ))}
                    <th className="manufacture_thead"></th>
                  </tr>
                </thead>
                <tbody className="manufacture-top__tbody">
                  {waitShipmentAllOneDetail.map((allWait) => (
                    <tr key={allWait.id}>
                      <td className="manufacture-top__td" colspan="2">
                        Заказ
                      </td>

                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => (
                          <td key={part.id} className="manufacture-top__quantity">
                            {allWait.props.find((el) => el.detailId === part.id)
                              ? allWait.props.find((el) => el.detailId === part.id)
                                  .waitShipmentDifference
                              : ''}
                          </td>
                        ))}
                      <td></td>
                    </tr>
                  ))}
                  {remainderDetail.map((remainder) => (
                    <tr key={remainder.id}>
                      <td className="manufacture-top__td" colspan="2">
                        Остаток
                      </td>

                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => (
                          <td key={part.id} className="manufacture-top__quantity">
                            {remainder.props.find((el) => el.detailId === part.id)
                              ? remainder.props.find((el) => el.detailId === part.id)
                                  .remainderDifference
                              : ''}
                          </td>
                        ))}
                      <td></td>
                    </tr>
                  ))}
                  {produceDetail.map((produce) => (
                    <tr key={produce.id}>
                      <td className="manufacture-top__td" colspan="2">
                        К производству
                      </td>

                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => (
                          <td key={part.id} className="manufacture-top__quantity">
                            {produce.props.find((el) => el.detailId === part.id)
                              ? produce.props.find((el) => el.detailId === part.id)
                                  .produceDifference !== undefined
                                ? produce.props.find((el) => el.detailId === part.id)
                                    .produceDifference < 0
                                  ? 0
                                  : produce.props.find((el) => el.detailId === part.id)
                                      .produceDifference
                                : produce.props.find((el) => el.detailId === part.id).projectSum
                              : ''}
                          </td>
                        ))}
                      <td></td>
                    </tr>
                  ))}
                </tbody>
                <tbody style={{ borderColor: 'transparent' }}>
                  <td></td>
                  <td></td>
                </tbody>
                <tbody style={{ borderColor: 'transparent' }}>
                  <td></td>
                  <td></td>
                </tbody>
                <tbody style={{ borderColor: 'transparent' }}>
                  <td></td>
                  <td></td>
                </tbody>
                <tbody style={{ borderColor: 'transparent' }}>
                  <td></td>
                  <td></td>
                </tbody>
                <thead>
                  <tr>
                    <th className="manufacture-table__thead">Номер</th>
                    <th className="manufacture-table__thead">Проект</th>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((partAntypical) => (
                        <th className="manufacture-table__thead-detail" key={partAntypical.id}>
                          {partAntypical.name}
                        </th>
                      ))}
                    {/* <th className="manufacture-table__thead">Нетиповые</th> */}
                  </tr>
                </thead>
                <tbody>
                  {waitShipmentDetail
                    .filter((waitShipment) => {
                      // Проверяем, что проект не завершен
                      if (waitShipment.project.finish !== null) return false;

                      // Проверяем, есть ли хотя бы одна ячейка с числовым значением
                      const hasNumericValues = nameDetails.some((part) => {
                        const prop = waitShipment.props.find((el) => el.detailId === part.id);
                        if (!prop) return false;

                        const value =
                          prop.dif_quantity !== null
                            ? prop.dif_quantity !== 0
                              ? prop.dif_quantity
                              : null
                            : prop.quantity;

                        return value !== null && value !== 0 && value !== ' ';
                      });

                      return hasNumericValues;
                    })
                    .map((waitShipment) => (
                      <tr key={waitShipment.id}>
                        <td>{waitShipment.project.number}</td>
                        <td className="manufacture_td">{waitShipment.project.name}</td>
                        {nameDetails
                          .sort((a, b) => a.number - b.number)
                          .map((part) => (
                            <td
                              key={part.id}
                              style={{
                                textAlign: 'center',
                                backgroundColor: (() => {
                                  // Получаем значение для отображения
                                  const prop = waitShipment.props.find(
                                    (el) => el.detailId === part.id,
                                  );
                                  const displayValue = prop
                                    ? prop.dif_quantity !== null
                                      ? prop.dif_quantity !== 0
                                        ? prop.dif_quantity
                                        : ''
                                      : prop.quantity
                                    : '';

                                  // Если значение пустое - возвращаем прозрачный фон
                                  if (displayValue === '') {
                                    return 'transparent';
                                  }

                                  // Вычисляем дедлайн таким же способом как в первой ячейке
                                  const agreementDate = new Date(
                                    waitShipment.project && waitShipment.project.agreement_date,
                                  );
                                  const designPeriod =
                                    waitShipment.project && waitShipment.project.design_period;
                                  const expirationDate =
                                    waitShipment.project && waitShipment.project.expiration_date;
                                  const sumDays = designPeriod + expirationDate;
                                  const endDate = addWorkingDays(agreementDate, sumDays);

                                  // Вычисляем разницу с сегодняшним днем
                                  const today = new Date();
                                  const timeDiff = endDate.getTime() - today.getTime();
                                  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

                                  if (daysLeft < 0) {
                                    return '#ff0000'; // красный для минусовых значений
                                  } else if (daysLeft < 7) {
                                    return '#ffe6e6'; // бледно-розовый для менее 7 дней
                                  } else {
                                    return 'transparent'; // прозрачный для остальных
                                  }
                                })(),
                              }}>
                              {waitShipment.props.find((el) => el.detailId === part.id)
                                ? waitShipment.props.find((el) => el.detailId === part.id)
                                    .dif_quantity !== null
                                  ? waitShipment.props.find((el) => el.detailId === part.id)
                                      .dif_quantity !== 0
                                    ? waitShipment.props.find((el) => el.detailId === part.id)
                                        .dif_quantity
                                    : ''
                                  : waitShipment.props.find((el) => el.detailId === part.id)
                                      .quantity
                                : ''}
                            </td>
                          ))}
                        {/* <td>
                          {waitShipment.antypical?.length > 0 ? (
                            <span
                              style={{ color: 'red', cursor: 'pointer' }}
                              onClick={() => handleOpenImage(waitShipment.antypical)}>
                              Файлы
                            </span>
                          ) : (
                            ''
                          )}
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
        {/* <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="manufacture_thead">Номер проекта</th>
                  <th className="manufacture_column">Проекты</th>
                  {nameDetails
                    .sort((a, b) => a.number - b.number)
                    .map((partAntypical) => (
                      <th className="manufacture_thead" key={partAntypical.id}>
                        {partAntypical.name}
                      </th>
                    ))}
                  <th className="manufacture_thead">Нетиповые</th>
                </tr>
              </thead>
              <tbody>
                {sumStockDetail.map((sum) => (
                  <tr key={sum.id}>
                    <td></td>
                    <td className="manufacture_td">Произведено</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td key={part.id}>
                          {sum.props.concat().find((el) => el.detailId === part.id)
                            ? sum.props.concat().find((el) => el.detailId === part.id).totalSum
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {sumShipmentDetail.map((sumShipment) => (
                  <tr key={sumShipment.id}>
                    <td></td>
                    <td className="manufacture_td">В покраску</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td>
                          {sumShipment.props.find((el) => el.detailId === part.id)
                            ? sumShipment.props.find((el) => el.detailId === part.id).shipmentSum
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {waitShipmentAllOneDetail.map((allWait) => (
                  <tr key={allWait.id}>
                    <td></td>
                    <td className="manufacture_td">Ждут в покраску</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td key={part.id}>
                          {allWait.props.find((el) => el.detailId === part.id)
                            ? allWait.props.find((el) => el.detailId === part.id)
                                .waitShipmentDifference
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {remainderDetail.map((remainder) => (
                  <tr key={remainder.id}>
                    <td></td>
                    <td className="manufacture_td">На остатке</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td key={part.id}>
                          {remainder.props.find((el) => el.detailId === part.id)
                            ? remainder.props.find((el) => el.detailId === part.id)
                                .remainderDifference
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {produceDetail.map((produce) => (
                  <tr key={produce.id} className="highlighted-row">
                    <td></td>
                    <td className="manufacture_td highlighted-row">К производству</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td style={{ color: 'white' }} key={part.id}>
                          {produce.props.find((el) => el.detailId === part.id)
                            ? produce.props.find((el) => el.detailId === part.id)
                                .produceDifference !== undefined
                              ? produce.props.find((el) => el.detailId === part.id)
                                  .produceDifference < 0
                                ? 0
                                : produce.props.find((el) => el.detailId === part.id)
                                    .produceDifference
                              : produce.props.find((el) => el.detailId === part.id).projectSum
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {overproductionDetail.map((over) => (
                  <tr key={over.id}>
                    <td></td>
                    <td className="manufacture_td">Перепроизводство</td>
                    {nameDetails
                      .sort((a, b) => a.number - b.number)
                      .map((part) => (
                        <td key={part.id}>
                          {over.props.find((el) => el.detailId === part.id)
                            ? over.props.find((el) => el.detailId === part.id)
                                .overproductionDifference < 0
                              ? 0
                              : over.props.find((el) => el.detailId === part.id)
                                  .overproductionDifference
                            : ''}
                        </td>
                      ))}
                    <td></td>
                  </tr>
                ))}
                {waitShipmentDetail
                  .filter((waitShipment) => waitShipment.project.finish === null)
                  .map((waitShipment) => (
                    <tr key={waitShipment.id}>
                      <td>{waitShipment.project.number}</td>
                      <td className="manufacture_td">{waitShipment.project.name}</td>
                      {nameDetails
                        .sort((a, b) => a.number - b.number)
                        .map((part) => (
                          <td key={part.id}>
                            {waitShipment.props.find((el) => el.detailId === part.id)
                              ? waitShipment.props.find((el) => el.detailId === part.id)
                                  .dif_quantity !== null
                                ? waitShipment.props.find((el) => el.detailId === part.id)
                                    .dif_quantity !== 0
                                  ? waitShipment.props.find((el) => el.detailId === part.id)
                                      .dif_quantity
                                  : ''
                                : waitShipment.props.find((el) => el.detailId === part.id).quantity
                              : ''}
                          </td>
                        ))}
                      <td>
                        {waitShipment.antypical?.length > 0 ? (
                          <span
                            style={{ color: 'red', cursor: 'pointer' }}
                            onClick={() => handleOpenImage(waitShipment.antypical)}>
                            Файлы
                          </span>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table> */}
        {/* </div>
        </div> */}
      </div>
    </div>
  );
}

export default ManufactureList;
