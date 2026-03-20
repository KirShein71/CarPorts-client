import React from 'react';
import Header from '../Header/Header';
import { getAllRegion } from '../../http/regionApi';
import { getAllDate } from '../../http/brigadesDateApi';
import { getAllActiveSet } from '../../http/setApi';
import { getAllControlTour } from '../../http/controlTourApi';
import NewProjectModal from './modals/NewProjectModal';
import CreateControlTourDate from './modals/CreateControlTourDate';
import UpdateControlTourDate from './modals/UpdateControlTourDate';
import DeleteControlTourData from './modals/DeleteControlTourData';
import EditDeleteModal from './modals/EditDeleteModal';
import { Table } from 'react-bootstrap';

import './style.scss';

function ControlTourComponent() {
  const [kits, setKits] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [controlTours, setControlTours] = React.useState([]);
  const [selectedKit, setSelectedKit] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(2);
  const [modalNewProject, setModalNewProject] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [kitId, setKitId] = React.useState(null);
  const [modalCreateControlTourDate, setModalCreateControlTourDate] = React.useState(false);
  const [controlTourDate, setControlTourDate] = React.useState(null);
  const [modalUpdateControlTourDate, setModalUpdateControlTourDate] = React.useState(false);
  const [controlTourId, setControlTourId] = React.useState(null);
  const [modalDeleteControlTourData, setModalDeleteControlTourData] = React.useState(false);
  const [modalEditDelete, setModalEditDelete] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [kitsData, datesData, regionsData, controlTourData] = await Promise.all([
          getAllActiveSet(),
          getAllDate(),
          getAllRegion(),
          getAllControlTour(),
        ]);

        setKits(kitsData);
        setDates(datesData);
        setRegions(regionsData);
        setControlTours(controlTourData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [change]);

  const handleRegionClick = (id) => {
    setSelectedRegion(id);
  };

  const handleOpenModalNewProject = () => {
    setModalNewProject(true);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleOpenModalCreateControlTourDate = (selectedKit, date) => {
    setKitId(selectedKit);
    setControlTourDate(date);
    setModalCreateControlTourDate(true);
  };

  const handleOpenModalUpdateControlTourDate = (id) => {
    setModalUpdateControlTourDate(true);
    setControlTourId(id);
  };

  const handleOpenModalDeleteControlTourData = (id) => {
    setModalDeleteControlTourData(true);
    setControlTourId(id);
  };

  const handleOpenModalEditDelete = (id) => {
    setModalEditDelete(true);
    setControlTourId(id);
  };

  const filteredDates = dates.filter((date) => {
    const dateObj = new Date(date.date);
    return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
  });

  const getDayName = (date) => {
    const dayNames = {
      воскресенье: 'вск',
      понедельник: 'пн',
      вторник: 'вт',
      среда: 'ср',
      четверг: 'чт',
      пятница: 'пт',
      суббота: 'сб',
    };

    const fullDayName = new Date(date).toLocaleDateString('ru-RU', { weekday: 'long' });
    return dayNames[fullDayName] || fullDayName;
  };

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="control-tour">
      <NewProjectModal show={modalNewProject} setShow={setModalNewProject} />
      <CreateControlTourDate
        show={modalCreateControlTourDate}
        setShow={setModalCreateControlTourDate}
        setChange={setChange}
        kitId={kitId}
        dateId={controlTourDate}
        regionId={selectedRegion}
      />
      <UpdateControlTourDate
        show={modalUpdateControlTourDate}
        setShow={setModalUpdateControlTourDate}
        setChange={setChange}
        id={controlTourId}
        regionId={selectedRegion}
      />
      <DeleteControlTourData
        id={controlTourId}
        showDeleteModal={modalDeleteControlTourData}
        setShowDeleteModal={setModalDeleteControlTourData}
        setChange={setChange}
      />
      <EditDeleteModal
        show={modalEditDelete}
        setShow={setModalEditDelete}
        id={controlTourId}
        handleOpenModalUpdateControlTourDate={handleOpenModalUpdateControlTourDate}
        handleOpenModalDeleteControlTourData={handleOpenModalDeleteControlTourData}
      />
      <Header title={'Контроль тур'} />
      <div className="control-tour__filter">
        {regions.map((region) => (
          <button
            key={region.id}
            className={`control-tour__filter-item ${selectedRegion === region.id ? 'active' : ''}`}
            onClick={() => handleRegionClick(region.id, setSelectedKit(null))}>
            {region.id === 1 ? 'Санкт-Петербург' : 'Москва'}
          </button>
        ))}
        <button
          className="control-tour__filter-newProject"
          onClick={() => handleOpenModalNewProject()}>
          Новые проекты
        </button>
      </div>

      <div className="control-tour__month">
        <div className="control-tour__month-arrow" onClick={handlePrevMonth}>
          <img src="./img/left.png" alt="left arrow" />
        </div>
        <p className="control-tour__month-name">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <div className="control-tour__month-arrow" onClick={handleNextMonth}>
          <img src="./img/right.png" alt="right arrow" />
        </div>
      </div>

      <div className="table-scrollable">
        <Table bordered size="sm" className="control-tour__table">
          <thead>
            <tr>
              <th className="control-tour__table-th mobile">Дата</th>
              <th className="control-tour__table-th"></th>
              {kits
                .filter((kitName) => kitName.regionId === selectedRegion)
                .map((kitName) => (
                  <th key={kitName.id} className="control-tour__table-th nameKit">
                    {kitName.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredDates.map((controlTourDate) => {
              const currentDate = new Date(controlTourDate.date);
              const dateString = currentDate.toISOString().split('T')[0];
              const dayOfWeek = currentDate.getDay();
              const isToday = dateString === todayString;
              const isWeekend = [0, 6].includes(dayOfWeek);

              // Стили для ячейки даты
              const dateCellStyle = {
                backgroundColor: isToday ? '#bbbbbb' : isWeekend ? '#e1dede' : '#ffffff',
              };

              return (
                <tr key={controlTourDate.id}>
                  <td className="control-tour__table-td mobile" style={dateCellStyle}>
                    {currentDate.toLocaleDateString('ru-RU')} -
                    {getDayName(controlTourDate.date).replace('вск', 'вс')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {
                      controlTours.filter((controlTourData) => {
                        const controlTourDateString = new Date(controlTourData.date.date)
                          .toISOString()
                          .split('T')[0];
                        return (
                          controlTourDateString === dateString &&
                          controlTourData.warehouse === '' &&
                          controlTourData.regionId === selectedRegion
                        );
                      }).length
                    }
                  </td>
                  {kits
                    .filter((kitName) => kitName.regionId === selectedRegion)
                    .map((kitName) => {
                      const dateControlTour = controlTours.find(
                        (el) => el.setId === kitName.id && el.dateId === controlTourDate.id,
                      );

                      let business = '';
                      if (dateControlTour) {
                        if (dateControlTour.complaint?.project?.name) {
                          business = `*${dateControlTour.complaint.project.name}*`;
                        } else {
                          business =
                            dateControlTour.project?.name || dateControlTour.warehouse || '';
                        }
                      }

                      // Стили для ячейки с бизнесом
                      const cellStyle = {
                        backgroundColor: isToday ? '#bbbbbb' : isWeekend ? '#e1dede' : '#ffffff',
                      };

                      // Дополнительный цвет для "Склад"
                      if (business === 'Склад') {
                        cellStyle.color = '#0000ff';
                      }

                      return business ? (
                        <td
                          key={kitName.id}
                          style={cellStyle}
                          onClick={() =>
                            dateControlTour?.id && handleOpenModalEditDelete(dateControlTour.id)
                          }
                          title={business}>
                          {business}
                        </td>
                      ) : (
                        <td
                          key={kitName.id}
                          onClick={() =>
                            handleOpenModalCreateControlTourDate(kitName.id, controlTourDate.id)
                          }
                          style={cellStyle}>
                          {' '}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ControlTourComponent;
