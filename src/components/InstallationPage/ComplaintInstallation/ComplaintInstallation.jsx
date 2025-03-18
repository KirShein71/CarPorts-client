import React from 'react';
import Header from '../../Header/Header';
import { Table, Spinner, Button } from 'react-bootstrap';
import { getAllComplaintEstimateForBrigadeForAllProject } from '../../../http/complaintEstimateApi';
import { getAllComplaintPaymentForBrigade } from '../../../http/complaintPaymentApi';
import CreateInstallerComplaintEstimate from './modals/CreateInstallerComplaintEstimate';
import ComplaintPayment from './modals/ComplaintPayment';
import ComplaintNote from './modals/ComplaintNote';
import ComplaintImage from './modals/ComplaintImage';
import CreateComplaintImage from './modals/CreateComplaintImage';

import './style.scss';

function ComplaintInstallation() {
  const [complaintEstimates, setComplaintEstimates] = React.useState([]);
  const [complaintPayments, setComplaintPayments] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [modalCreateInstallerComplaintEstimate, setModalCreateInstallerComplaintEstimate] =
    React.useState(false);
  const [complaint, setComplaint] = React.useState(null);
  const [modalComplaintPayment, setModalComplaintPayment] = React.useState(false);
  const [modalComplaintNote, setModalComplaintNote] = React.useState(false);
  const [complaintNote, setComplaintNote] = React.useState(null);
  const [modalComplaintImage, setModalComplaintImage] = React.useState(false);
  const [modalCreateComplaintImage, setModalCreateComplaintImage] = React.useState(false);
  const [filteredComplaintEstimates, setFilteredComplaintEstimates] = React.useState([]);
  const [buttonActiveComplaint, setButtonActiveComplaint] = React.useState(true);
  const [buttonClosedComplaint, setButtonClosedComplaint] = React.useState(false);

  React.useEffect(() => {
    const brigadeId = localStorage.getItem('id');

    // Проверяем, есть ли brigadeId
    if (!brigadeId) {
      console.error('Brigade ID not found in localStorage');
      setFetching(false); // Останавливаем загрузку, если ID не найден
      return;
    }

    // Функция для получения данных
    const fetchData = async () => {
      try {
        const complaintEstimates = await getAllComplaintEstimateForBrigadeForAllProject(brigadeId);
        setComplaintEstimates(complaintEstimates);
        const complaintPayments = await getAllComplaintPaymentForBrigade(brigadeId);
        setComplaintPayments(complaintPayments);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setFetching(false); // Останавливаем загрузку после завершения запроса
      }
    };

    fetchData(); // Вызываем функцию получения данных
  }, [change]);

  React.useEffect(() => {
    const filters = {
      isActive: buttonActiveComplaint,
      isClosed: buttonClosedComplaint,
    };

    const filteredComplaintEstimates = complaintEstimates.filter((comEst) => {
      const isActiveComplaint = filters.isActive && comEst.complaintFinish === null;
      const isClosedComplaint = filters.isClosed && comEst.complaintFinish !== null;

      // Если ни одна кнопка не активна, показываем все проекты
      return isClosedComplaint || isActiveComplaint;
    });

    setFilteredComplaintEstimates(filteredComplaintEstimates);
  }, [complaintEstimates, buttonActiveComplaint, buttonClosedComplaint]);

  const handleOpenModalCreateComplaintEstimate = (complaintId) => {
    setModalCreateInstallerComplaintEstimate(true);
    setComplaint(complaintId);
  };

  const handleOpenModalComplaintPayment = (complaintId) => {
    setModalComplaintPayment(true);
    setComplaint(complaintId);
  };

  const handleOpenModalComplaintNote = (complaintNote) => {
    setComplaintNote(complaintNote);
    setModalComplaintNote(true);
  };

  const handleOpenModalComplaintImage = (complaintId) => {
    setModalComplaintImage(true);
    setComplaint(complaintId);
  };

  const handleOpenModalCreateComplaintImage = (complaintId) => {
    setModalCreateComplaintImage(true);
    setComplaint(complaintId);
  };

  const handleButtonActiveComplaint = () => {
    const newButtonActiveComplaint = !buttonActiveComplaint;
    setButtonActiveComplaint(newButtonActiveComplaint);

    if (!newButtonActiveComplaint) {
      setButtonClosedComplaint(true);
    } else {
      setButtonClosedComplaint(false);
    }
  };

  const handleButtonClosedComplaint = () => {
    const newButtonClosedComplaint = !buttonClosedComplaint;
    setButtonClosedComplaint(newButtonClosedComplaint);

    if (!newButtonClosedComplaint) {
      setButtonActiveComplaint(true);
    } else {
      setButtonActiveComplaint(false);
    }
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="complaintlist">
      <Header title={'Рекламация'} />
      <CreateInstallerComplaintEstimate
        showEstimate={modalCreateInstallerComplaintEstimate}
        setShowEstimate={setModalCreateInstallerComplaintEstimate}
        setChange={setChange}
        complaint={complaint}
        id={localStorage.getItem('id')}
      />
      <ComplaintPayment
        showPayment={modalComplaintPayment}
        setShowPayment={setModalComplaintPayment}
        complaintPayments={complaintPayments}
        complaint={complaint}
        brigadeId={localStorage.getItem('id')}
      />
      <ComplaintNote
        showNote={modalComplaintNote}
        setShowNote={setModalComplaintNote}
        note={complaintNote}
      />
      <ComplaintImage
        showImage={modalComplaintImage}
        setShowImage={setModalComplaintImage}
        complaintId={complaint}
      />
      <CreateComplaintImage
        show={modalCreateComplaintImage}
        setShow={setModalCreateComplaintImage}
        complaintId={complaint}
      />
      <div style={{ display: 'flex' }}>
        <button
          className={`button__work-complaint ${
            buttonActiveComplaint === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonActiveComplaint}>
          Активные
        </button>
        <button
          className={`button__closed-complaint ${
            buttonClosedComplaint === true ? 'active' : 'inactive'
          }`}
          onClick={handleButtonClosedComplaint}>
          Закрытые
        </button>
      </div>
      <div className="table-scrollable">
        <Table bordered hover size="sm" className="mt-4">
          <thead>
            <tr>
              <th className="complaint-installation__thead">Наименование</th>
              <th className="complaint-installation__thead">Сумма сметы</th>
              <th className="complaint-installation__thead">Выплачено</th>
              <th className="complaint-installation__thead">Остаток</th>
              <th className="complaint-installation__thead"></th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaintEstimates.map((complaintEstimate) => (
              <tr key={complaintEstimate.id}>
                <td style={{ textAlign: 'center' }}>{complaintEstimate.projectName}</td>
                <td>
                  {' '}
                  {(() => {
                    const totalEstimate = filteredComplaintEstimates.reduce((total, sumEst) => {
                      const complaintTotal = sumEst.estimates
                        .filter(
                          (estimateForComplaint) =>
                            estimateForComplaint.done === 'true' &&
                            estimateForComplaint.complaintId === complaintEstimate.complaintId,
                        )
                        .reduce((accumulator, current) => accumulator + Number(current.price), 0);
                      return total + complaintTotal;
                    }, 0);

                    return (
                      <div style={{ textAlign: 'center' }}>
                        {new Intl.NumberFormat('ru-RU').format(totalEstimate)}₽
                      </div>
                    );
                  })()}{' '}
                </td>
                <td>
                  {(() => {
                    const totalPayment = complaintPayments
                      .filter(
                        (complaintPayment) =>
                          complaintPayment.complaintId === complaintEstimate.complaintId,
                      )
                      .reduce((total, sumEst) => {
                        return total + Number(sumEst.sum);
                      }, 0);

                    return (
                      <div style={{ textAlign: 'center' }}>
                        {new Intl.NumberFormat('ru-RU').format(totalPayment)}₽
                      </div>
                    ); // Отображаем итоговую сумму
                  })()}
                </td>
                <td>
                  {' '}
                  {(() => {
                    const totalEstimate = filteredComplaintEstimates.reduce((total, sumEst) => {
                      const complaintTotal = sumEst.estimates
                        .filter(
                          (estimateForComplaint) =>
                            estimateForComplaint.done === 'true' &&
                            estimateForComplaint.complaintId === complaintEstimate.complaintId,
                        )
                        .reduce((accumulator, current) => accumulator + Number(current.price), 0);
                      return total + complaintTotal;
                    }, 0);

                    const totalPayment = complaintPayments
                      .filter(
                        (complaintPayment) =>
                          complaintPayment.complaintId === complaintEstimate.complaintId,
                      )
                      .reduce((total, sumEst) => {
                        return total + Number(sumEst.sum);
                      }, 0);

                    return (
                      <div style={{ textAlign: 'center' }}>
                        {new Intl.NumberFormat('ru-RU').format(totalEstimate - totalPayment)} ₽
                      </div>
                    );
                  })()}{' '}
                </td>
                <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button
                    variant="link"
                    className="complaint-installation__button"
                    onClick={() => handleOpenModalComplaintNote(complaintEstimate.complaintNote)}>
                    Информация
                  </Button>
                  <Button
                    variant="link"
                    className="complaint-installation__button"
                    onClick={() =>
                      handleOpenModalCreateComplaintEstimate(complaintEstimate.complaintId)
                    }>
                    Смета
                  </Button>
                  <Button
                    variant="link"
                    className="complaint-installation__button"
                    onClick={() => handleOpenModalComplaintPayment(complaintEstimate.complaintId)}>
                    Выплаты
                  </Button>
                  <Button
                    variant="link"
                    className="complaint-installation__button"
                    onClick={() => handleOpenModalComplaintImage(complaintEstimate.complaintId)}>
                    Фото
                  </Button>
                  <Button
                    variant="link"
                    className="complaint-installation__button"
                    onClick={() =>
                      handleOpenModalCreateComplaintImage(complaintEstimate.complaintId)
                    }>
                    Загрузить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ComplaintInstallation;
