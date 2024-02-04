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
  const [fetching, setFetching] = React.useState(false);

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

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="manufacturelist">
      <Header title={'Итоговая таблица по производству'} />
      <div className="table-scrollable">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th className="manufacture_column">Проекты</th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th>{part.name}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td className="manufacture_column">Себестоимость</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {sumStockDetail.map((sum) => (
              <tr key={sum.id}>
                <td></td>
                <td className="manufacture_column">Произведено (Иван)</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {sum.props.concat().find((el) => el.detailId === part.id)
                        ? sum.props.concat().find((el) => el.detailId === part.id).totalSum
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {sumShipmentDetail.map((sumShipment) => (
              <tr key={sumShipment.id}>
                <td></td>
                <td className="manufacture_column">Отгружено (Иван)</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {sumShipment.props.find((el) => el.detailId === part.id)
                        ? sumShipment.props.find((el) => el.detailId === part.id).shipmentSum
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {waitShipmentAllOneDetail.map((allWait) => (
              <tr key={allWait.id}>
                <td></td>
                <td className="manufacture_column">Ждут отгрузки</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {allWait.props.find((el) => el.detailId === part.id)
                        ? allWait.props.find((el) => el.detailId === part.id).waitShipmentDifference
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {remainderDetail.map((remainder) => (
              <tr key={remainder.id}>
                <td></td>
                <td className="manufacture_column">На остатке</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {remainder.props.find((el) => el.detailId === part.id)
                        ? remainder.props.find((el) => el.detailId === part.id).remainderDifference
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {produceDetail.map((produce) => (
              <tr key={produce.id}>
                <td></td>
                <td className="manufacture_column">К производству</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {produce.props.find((el) => el.detailId === part.id)
                        ? produce.props.find((el) => el.detailId === part.id).produceDifference
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {overproductionDetail.map((over) => (
              <tr key={over.id}>
                <td></td>
                <td className="manufacture_column">Перепроизводство</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {over.props.find((el) => el.detailId === part.id)
                        ? over.props.find((el) => el.detailId === part.id).overproductionDifference
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
            {waitShipmentDetail.map((waitShipment) => (
              <tr key={waitShipment.id}>
                <td>{waitShipment.project.number}</td>
                <td className="manufacture_column">{waitShipment.project.name}</td>
                {nameDetails
                  .sort((a, b) => a.id - b.id)
                  .map((part) => (
                    <td>
                      {waitShipment.props.find((el) => el.detailId === part.id)
                        ? waitShipment.props.find((el) => el.detailId === part.id).dif_quantity
                        : ''}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ManufactureList;
