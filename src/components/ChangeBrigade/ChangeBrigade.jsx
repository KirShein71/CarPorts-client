import React from 'react';
import { Table } from 'react-bootstrap';
import { fetchBrigades } from '../../http/bragadeApi';
import { getAllBrigadesDate, getAllDate } from '../../http/brigadesDateApi';
import { getAllRegion } from '../../http/regionApi';
import CreateBrigadeDate from './modals/CreateBrigadeDate';
import UpdateBrigadeDate from './modals/UpdateBrigadeDate';
import Header from '../Header/Header';

import './style.scss';

function ChangeBrigade() {
  const [brigades, setBrigades] = React.useState([]);
  const [dates, setDates] = React.useState([]);
  const [brigadesDates, setBrigadesDates] = React.useState([]);
  const [bridaDateId, setBrigadeDateId] = React.useState(null);
  const [selectedBrigade, setSelectedBrigade] = React.useState(null);
  const [selectedBrigadeName, setSelectedBrigadeName] = React.useState(null);
  const [openModalSelectedBrigade, setOpenModalSelectedBrigade] = React.useState(false);
  const [openCreateBrigadeDate, setOpenCreateBrigadeDate] = React.useState(false);
  const [openUpdateBrigadeDate, setOpenUpdateBrigadeDate] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [brigadeId, setBrigadeId] = React.useState(null);
  const [dateBrigade, setDateBrigade] = React.useState(null);
  const [regions, setRegions] = React.useState([]);
  const [selectedRegion, setSelectedRegion] = React.useState(1);
  const modalRef = React.useRef();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [brigadesData, brigadesDatesData, datesData, regionsData] = await Promise.all([
          fetchBrigades(),
          getAllBrigadesDate(),
          getAllDate(),
          getAllRegion(),
        ]);

        setBrigades(brigadesData);
        setBrigadesDates(brigadesDatesData);
        setDates(datesData);
        setRegions(regionsData);
        openUpdateBrigadeDate(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [change, openUpdateBrigadeDate]);

  React.useEffect(() => {
    const hadleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModalSelectedBrigade(false);
      }
    };

    document.body.addEventListener('click', hadleClickOutside);

    return () => {
      document.body.removeEventListener('click', hadleClickOutside);
    };
  });

  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', { weekday: 'long' });
  };

  const handleOpenModalCreateBrigadeDate = (selectedBrigade, date) => {
    setBrigadeId(selectedBrigade);
    setDateBrigade(date);
    setOpenCreateBrigadeDate(true);
  };

  const handleOpenModalUpdateBrigadeDate = (id) => {
    setOpenUpdateBrigadeDate(true);
    setBrigadeDateId(id);
  };

  const handleRegionClick = (id) => {
    setSelectedRegion(id);
  };

  const hadleOpenModalSelectedBrigade = () => {
    setOpenModalSelectedBrigade(!openModalSelectedBrigade);
  };

  return (
    <div className="calendar-brigade">
      <CreateBrigadeDate
        show={openCreateBrigadeDate}
        setShow={setOpenCreateBrigadeDate}
        setChange={setChange}
        brigadeId={brigadeId}
        dateId={dateBrigade}
        regionId={selectedRegion}
      />
      <UpdateBrigadeDate
        show={openUpdateBrigadeDate}
        setShow={setOpenUpdateBrigadeDate}
        setChange={setChange}
        id={bridaDateId}
        regionId={selectedRegion}
      />
      <Header title={'Календарь монтажных работ'} />
      <div className="container">
        <div className="calendar-brigade__filter">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`calendar-brigade__filter-item ${
                selectedRegion === region.id ? 'active' : ''
              }`}
              onClick={() =>
                handleRegionClick(region.id, setSelectedBrigade(null), setSelectedBrigadeName(null))
              }>
              {region.id === 1 ? 'Санкт-Петербург' : 'Москва'}
            </div>
          ))}
        </div>
        <div className="dropdown" ref={modalRef}>
          <div className="dropdown__title" onClick={hadleOpenModalSelectedBrigade}>
            Бригада: <span>{selectedBrigadeName ? selectedBrigadeName : 'Выбрать'}</span>
          </div>
          {openModalSelectedBrigade && (
            <div className="dropdown__modal">
              <div className="dropdown__modal-content">
                <ul className="dropdown__modal-items">
                  <div
                    className="dropdown__modal-item"
                    onClick={() => {
                      setSelectedBrigadeName(null);
                      setSelectedBrigade(null);
                      setOpenModalSelectedBrigade(false);
                    }}></div>
                  {brigades
                    .filter((brigadesName) => brigadesName.regionId === selectedRegion)
                    .map((brigadesName) => (
                      <div key={brigadesName.id}>
                        <li
                          className="dropdown__modal-item"
                          onClick={() => {
                            setSelectedBrigadeName(brigadesName.name);
                            setSelectedBrigade(brigadesName.id);
                            setOpenModalSelectedBrigade(false);
                          }}>
                          {brigadesName.name}
                        </li>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {selectedBrigade !== null ? (
          <Table bordered size="sm" className="calendar-brigade__table">
            <thead>
              <tr>
                <th>Дата</th>
                {brigades
                  .filter((brigadeName) => brigadeName.name === selectedBrigadeName)
                  .map((brigadeName) => (
                    <th key={brigadeName.id}>{brigadeName.name}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((date) => (
                <tr key={date.id}>
                  <td>
                    {new Date(date.date).toLocaleDateString('ru-RU')} - {getDayName(date.date)}
                  </td>
                  {brigadesDates.filter(
                    (brigadeDate) =>
                      brigadeDate.brigadeId === selectedBrigade && brigadeDate.dateId === date.id,
                  ).length > 0 ? (
                    brigadesDates
                      .filter(
                        (brigadeDate) =>
                          brigadeDate.brigadeId === selectedBrigade &&
                          brigadeDate.dateId === date.id,
                      )
                      .map((brigadeDate) => {
                        return (
                          <td
                            style={{
                              cursor: 'pointer',
                              fontSize: '17px',
                              fontWeight: '500',
                              color: brigadeDate.warranty
                                ? 'blue'
                                : brigadeDate.weekend
                                ? 'red'
                                : 'black',
                            }}
                            key={brigadeDate.id}
                            onClick={() => handleOpenModalUpdateBrigadeDate(brigadeDate.id)}>
                            {brigadeDate.project?.name ||
                              brigadeDate.warranty ||
                              brigadeDate.weekend ||
                              ''}
                          </td>
                        );
                      })
                  ) : (
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenModalCreateBrigadeDate(selectedBrigade, date.id)}>
                      Добавить
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default ChangeBrigade;
