import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createBrigadesDate } from '../../../http/brigadesDateApi';
import { fetchAllProjects } from '../../../http/projectApi';
import { getAllComplaint } from '../../../http/complaintApi';

const defaultValue = {
  weekend: '',
  warranty: '',
  downtime: '',
  project: '',
  complaint: '',
};
const defaultValid = {
  weekend: null,
  warranty: null,
  downtime: null,
  project: null,
  complaint: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'weekend') result.weekend = value.weekend !== '';
    if (key === 'warranty') result.warranty = value.warranty !== '';
    if (key === 'downtime') result.downtime = value.downtime !== '';
    if (key === 'project') result.project = value.project;
    if (key === 'complaint') result.project = value.complaint;
  }
  return result;
};

const CreateBrigadeDate = (props) => {
  const { show, setShow, setChange, brigadeId, dateId, regionId } = props;
  const [projects, setProjects] = React.useState([]);
  const [complaints, setComplaints] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchAllProjects().then((data) => setProjects(data));
      getAllComplaint().then((data) => setComplaints(data));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({
        project: event.target.value, // Устанавливаем только проект
        complaint: 0,
        weekend: '', // Сбрасываем выходной
        warranty: '', // Сбрасываем гарантийный день
        downtime: '', // Сбрасываем день простоя
      });
      setValid(
        isValid({
          project: event.target.value,
          complaint: 0,
          weekend: '',
          warranty: '',
          downtime: '',
        }),
      );
    }
  };

  const handleInputChangeComplaint = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({
        project: 0,
        complaint: event.target.value, //Устанавливаем только рекламацию
        weekend: '', // Сбрасываем выходной
        warranty: '', // Сбрасываем гарантийный день
        downtime: '', // Сбрасываем день простоя
      });
      setValid(
        isValid({
          project: 0,
          complaint: event.target.value,
          weekend: '',
          warranty: '',
          downtime: '',
        }),
      );
    }
  };

  const handleWeekendChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prevValue) => ({
      project: 0, // Сбрасываем проект
      complaint: 0,
      weekend: isChecked ? 'Выходной' : null,
      warranty: '', // Сбрасываем гарантийный день
      downtime: '',
    }));
    setValid(
      isValid({
        project: 0,
        complaint: 0,
        weekend: isChecked ? 'Выходной' : null,
        warranty: '',
        downtime: '',
      }),
    );
  };

  const handleWarrantyChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prevValue) => ({
      project: 0, // Сбрасываем проект
      complaint: 0,
      weekend: '', // Сбрасываем выходной
      warranty: isChecked ? 'Гарантийный день' : null,
      downtime: '',
    }));
    setValid(
      isValid({
        project: 0,
        complaint: 0,
        weekend: '',
        warranty: isChecked ? 'Гарантийный день' : null,
        downtime: '',
      }),
    );
  };

  const handleDowntimeChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prevValue) => ({
      project: 0, // Сбрасываем проект
      complaint: 0,
      weekend: '', // Сбрасываем выходной
      warranty: '',
      downtime: isChecked ? 'Простой' : null,
    }));
    setValid(
      isValid({
        project: 0,
        complaint: 0,
        weekend: '',
        warranty: '',
        downtime: isChecked ? 'Простой' : null,
      }),
    );
  };

  const handleSave = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('weekend', value.weekend);
    data.append('projectId', value.project === '' ? 0 : value.project);
    data.append('complaintId', value.complaint === '' ? 0 : value.complaint);
    data.append('brigadeId', brigadeId);
    data.append('dateId', dateId);
    data.append('regionId', regionId);
    data.append('warranty', value.warranty);
    data.append('downtime', value.downtime);
    setIsLoading(true);
    createBrigadesDate(data)
      .then((data) => {
        setValue(defaultValue);
        setValid(defaultValid);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Проставить данные</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSave}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="project"
                value={value.project}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.project === true}
                isInvalid={valid.project === false}>
                <option value="">Проект</option>
                {projects &&
                  projects
                    .filter((project) => project.finish === null && project.regionId === regionId)
                    .sort((a, b) => new Date(b.agreement_date) - new Date(a.agreement_date))
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="complaint"
                value={value.complaint}
                onChange={(e) => handleInputChangeComplaint(e)}
                isValid={valid.complaint === true}
                isInvalid={valid.complaint === false}>
                <option value="">Рекламация</option>
                {complaints &&
                  complaints
                    .filter((complaint) => complaint.date_finish === null)
                    .map((complaint) => (
                      <option key={complaint.id} value={complaint.id}>
                        {complaint.project.name}
                      </option>
                    ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Check
                name="weekend"
                type="switch"
                id="weekend-switch"
                label="Выходной"
                checked={value.weekend === 'Выходной'}
                onChange={(e) => handleWeekendChange(e)}
                isValid={valid.weekend === true}
                isInvalid={valid.weekend === false}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Check
                name="warranty"
                type="switch"
                id="warranty-switch"
                label="Гарантийный день"
                checked={value.warranty === 'Гарантийный день'}
                onChange={(e) => handleWarrantyChange(e)}
                isValid={valid.warranty === true}
                isInvalid={valid.warranty === false}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Check
                name="downtime"
                type="switch"
                id="downtime-switch"
                label="Простой"
                checked={value.downtime === 'Простой'}
                onChange={(e) => handleDowntimeChange(e)}
                isValid={valid.downtime === true}
                isInvalid={valid.downtime === false}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBrigadeDate;
