import React from 'react';
import { Modal, Form, Table, Button } from 'react-bootstrap';
import {
  getAllEstimateForBrigadeComplaint,
  createComplaintEstimateBrigade,
} from '../../../../http/complaintEstimateApi';
import CheckboxInstallation from '../../checkbox/CheckboxInstallation';

function CreateInstallerComplaintEstimate(props) {
  const { showEstimate, setShowEstimate, id, setChange, complaint } = props;
  const [complaintEstimates, setComplaintEstimates] = React.useState([]);
  const [checked, setChecked] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (showEstimate) {
      getAllEstimateForBrigadeComplaint(id, complaint)
        .then((data) => {
          setComplaintEstimates(data);
          if (data) {
            const initialChecked = {};
            data.map((col) => {
              initialChecked[col.id] = col.done === 'true';
            });
            setChecked(initialChecked);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [id, complaint, showEstimate]);

  const handleCheckboxChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id], // Меняем состояние чекбокса по его id
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Создаем плоский массив обновлений
    const updates = complaintEstimates.map((col) => ({
      id: col.id,
      done: checked[col.id] ? 'true' : 'false',
    }));

    // Отправляем данные на бэк
    Promise.all(
      updates.map((update) =>
        createComplaintEstimateBrigade(update.id, update.done)
          .then((response) => {
            setChange((state) => !state);
            setShowEstimate(false);
          })
          .catch((error) => {
            alert(error.response.data.message);
          }),
      ),
    )
      .then(() => {
        // Обработка успешного завершения всех запросов, если нужно
        console.log('Все изменения сохранены');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      show={showEstimate}
      onHide={() => setShowEstimate(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="md"
      className="modal__readydate">
      <Modal.Header closeButton>
        <Modal.Title>Смета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSave}>
          <Table bordered className="mt-3">
            <thead>
              <tr>
                <th className="installation-page__head">Наименование</th>
                <th className="installation-page__head">Стоимость</th>
                <th className="installation-page__head">Выполнение</th>
              </tr>
            </thead>
            <tbody>
              {complaintEstimates.map((complaintEstimate) => (
                <tr key={complaintEstimate.id}>
                  <td className="installation-page__body">{complaintEstimate.service.name}</td>
                  <td className="installation-page__body">
                    {new Intl.NumberFormat('ru-RU').format(complaintEstimate.price)}
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <CheckboxInstallation
                      change={checked[complaintEstimate.id]}
                      handle={() => handleCheckboxChange(complaintEstimate.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="dark" type="submit" disabled={isLoading}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateInstallerComplaintEstimate;
