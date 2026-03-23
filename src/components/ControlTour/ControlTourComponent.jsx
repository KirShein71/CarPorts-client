import React from 'react';
import Header from '../Header/Header';
import { getAllActiveSet } from '../../http/setApi';
import { getAllControlTour } from '../../http/controlTourApi';
import CreateControlTourDate from './modals/CreateControlTourDate';
import UpdateControlTourDate from './modals/UpdateControlTourDate';
import { Table } from 'react-bootstrap';

import './style.scss';

function ControlTourComponent() {
  const [kits, setKits] = React.useState([]);
  const [controlTours, setControlTours] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [kitId, setKitId] = React.useState(null);
  const [modalCreateControlTourDate, setModalCreateControlTourDate] = React.useState(false);
  const [modalUpdateControlTourDate, setModalUpdateControlTourDate] = React.useState(false);
  const [controlTourId, setControlTourId] = React.useState(null);
  const [regionId, setRegionId] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [kitsData, controlTourData] = await Promise.all([
          getAllActiveSet(),
          getAllControlTour(),
        ]);

        setKits(kitsData);
        setControlTours(controlTourData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [change]);

  const handleOpenModalCreateControlTour = (selectedKit, regionId) => {
    setKitId(selectedKit);
    setRegionId(regionId);
    setModalCreateControlTourDate(true);
  };

  const handleOpenModalUpdateControlTour = (id, regionId) => {
    setModalUpdateControlTourDate(true);
    setRegionId(regionId);
    setControlTourId(id);
  };

  return (
    <div className="control-tour">
      <CreateControlTourDate
        show={modalCreateControlTourDate}
        setShow={setModalCreateControlTourDate}
        setChange={setChange}
        kitId={kitId}
        regionId={regionId}
      />
      <UpdateControlTourDate
        show={modalUpdateControlTourDate}
        setShow={setModalUpdateControlTourDate}
        setChange={setChange}
        id={controlTourId}
        regionId={regionId}
      />

      <Header title={'Контроль тур'} />

      <div className="control-tour__content">
        <div className="control-tour__msk">
          <h2 className="control-tour__region">Мск</h2>
          <Table bordered className="control-tour__table">
            <tbody>
              {kits
                .filter((kitName) => kitName.regionId === 2)
                .map((kitName) => {
                  const controlTourData = controlTours.find(
                    (item) => item.setId === kitName.id && item.regionId === 2,
                  );

                  const hasData =
                    controlTourData &&
                    (controlTourData.project?.name ||
                      controlTourData.complaint ||
                      controlTourData.warehouse);

                  return (
                    <tr key={kitName.id}>
                      <td className="control-tour__kit-name">{kitName.name}</td>
                      <td
                        className="control-tour__td"
                        key={controlTourData?.id || kitName.id}
                        onClick={
                          hasData
                            ? () => handleOpenModalUpdateControlTour(controlTourData.id, 2)
                            : () => handleOpenModalCreateControlTour(kitName.id, 2)
                        }>
                        {hasData &&
                          (controlTourData.project?.name ||
                            (controlTourData.complaint?.project?.name &&
                              `*${controlTourData.complaint.project.name}*`) ||
                            controlTourData.warehouse)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <div className="control-tour__spb">
          <h2 className="control-tour__region">ЛО</h2>
          <Table bordered className="control-tour__table">
            <tbody>
              {kits
                .filter((kitName) => kitName.regionId === 1)
                .map((kitName) => {
                  const controlTourData = controlTours.find(
                    (item) => item.setId === kitName.id && item.regionId === 1,
                  );

                  const hasData =
                    controlTourData &&
                    (controlTourData.project?.name ||
                      controlTourData.complaint ||
                      controlTourData.warehouse);

                  return (
                    <tr key={kitName.id}>
                      <td className="control-tour__kit-name">{kitName.name}</td>
                      <td
                        className="control-tour__td"
                        key={controlTourData?.id || kitName.id}
                        onClick={
                          hasData
                            ? () => handleOpenModalUpdateControlTour(controlTourData.id, 1)
                            : () => handleOpenModalCreateControlTour(kitName.id, 1)
                        }>
                        {hasData &&
                          (controlTourData.project?.name ||
                            (controlTourData.complaint?.project?.name &&
                              `*${controlTourData.complaint.project.name}*`) ||
                            controlTourData.warehouse)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ControlTourComponent;
