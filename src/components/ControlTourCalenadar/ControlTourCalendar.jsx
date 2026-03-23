import React from 'react';
import { Table } from 'react-bootstrap';
import { getAllControlTour } from '../../http/controlTourApi';
import './style.scss';

function ControlTourCalendar() {
  const [controlTourDates, setControlTourDates] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchControlTourDates = async () => {
      try {
        const data = await getAllControlTour();
        if (isMounted) {
          setControlTourDates(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке дат контрольного тура:', error);
      }
    };

    fetchControlTourDates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="control-table">
      <div className="control-table__title">Контроль тур</div>
      <div className="control-table__msk">
        <h2 className="control-table__region">Мск</h2>
        <Table bordered className="control-table__table">
          <tbody>
            {controlTourDates
              .filter((dataMsk) => dataMsk.regionId === 2)
              .sort((a, b) => a.set.number - b.set.number)
              .map((dataMsk) => (
                <tr key={dataMsk.id}>
                  <td>{dataMsk.set?.name}</td>
                  <td>
                    {dataMsk.project?.name ||
                      (dataMsk.complaint?.project?.name && `*${dataMsk.complaint.project.name}*`) ||
                      dataMsk.warehouse}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <div className="control-table__spb">
        <h2 className="control-table__region">ЛО</h2>
        <Table bordered className="control-table__table">
          <tbody>
            {controlTourDates
              .filter((dataSpb) => dataSpb.regionId === 1)
              .sort((a, b) => a.set.number - b.set.number)
              .map((dataSpb) => (
                <tr key={dataSpb.id}>
                  <td>{dataSpb.set?.name}</td>
                  <td>
                    {dataSpb.project?.name ||
                      (dataSpb.complaint?.project?.name && `*${dataSpb.complaint.project.name}*`) ||
                      dataSpb.warehouse}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ControlTourCalendar;
