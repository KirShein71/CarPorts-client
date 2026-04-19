import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneControlTour, updateControlTour } from '../../../http/controlTourApi';
import { getAllActiveProjectForCreatedAndUpdated } from '../../../http/projectApi';
import { getAllComplaint } from '../../../http/complaintApi';

const defaultValue = {
  warehouse: '',
  project: '',
  complaint: '',
};
const defaultValid = {
  warehouse: null,
  project: null,
  complaint: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'warehouse') result.warehouse = value.warehouse !== '';
    if (key === 'project') result.project = value.project;
    if (key === 'complaint') result.project = value.complaint;
  }
  return result;
};

const UpdateControlTourDate = (props) => {
  const { id, show, setShow, setChange, regionId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [projects, setProjects] = React.useState([]);
  const [complaints, setComplaints] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneControlTour(id)
        .then((data) => {
          const prod = {
            warehouse: data.warehouse.toString(),
            project: data.project.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [id, show]);

  React.useEffect(() => {
    if (show) {
      getAllActiveProjectForCreatedAndUpdated().then((data) => setProjects(data));
      getAllComplaint().then((data) => setComplaints(data));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({
        project: event.target.value, // Устанавливаем только проект
        complaint: 0,
        warehouse: '',
      });
      setValid(
        isValid({
          project: event.target.value,
          complaint: 0,
          warehouse: '',
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
        warehouse: '',
      });
      setValid(
        isValid({
          project: 0,
          complaint: event.target.value,
          warehouse: '',
        }),
      );
    }
  };

  const handleWarehouseChange = (e) => {
    const isChecked = e.target.checked;
    setValue((prevValue) => ({
      project: 0, // Сбрасываем проект
      complaint: 0,
      warehouse: isChecked ? 'Склад' : null,
    }));
    setValid(
      isValid({
        project: 0,
        complaint: 0,
        warehouse: isChecked ? 'Склад' : null,
      }),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('warehouse', value.warehouse);
    data.append('projectId', value.project === '' ? 0 : value.project);
    data.append('complaintId', value.complaint === '' ? 0 : value.complaint);
    setIsLoading(true);
    updateControlTour(id, data)
      .then((data) => {
        setValue(defaultValue);
        setValid(defaultValid);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          console.log('An error occurred');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="modal__name">
        <Modal.Header closeButton>
          <Modal.Title>Обновить данные</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
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
                      .filter((project) => project.regionId === regionId)
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
                  name="warehouse"
                  type="switch"
                  id="warehouse-switch"
                  label="Склад"
                  checked={value.warehouse === 'Склад'}
                  onChange={(e) => handleWarehouseChange(e)}
                  isValid={valid.warehouse === true}
                  isInvalid={valid.warehouse === false}
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
    </>
  );
};

export default UpdateControlTourDate;
