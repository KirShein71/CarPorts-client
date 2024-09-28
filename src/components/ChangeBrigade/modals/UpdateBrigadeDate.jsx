import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneBrigadesDate, updateBrigadesDate } from '../../../http/brigadesDateApi';
import { fetchAllProjects } from '../../../http/projectApi';

const defaultValue = { weekend: '', warranty: '', downtime: '', project: '' };
const defaultValid = {
  weekend: null,
  warranty: null,
  downtime: null,
  project: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'weekend') result.weekend = value.weekend;
    if (key === 'warranty') result.warranty = value.warranty;
    if (key === 'downtime') result.downtime = value.downtime;
    if (key === 'project') result.project = value.project;
  }
  return result;
};

const UpdateBrigadeDate = (props) => {
  const { id, show, setShow, setChange, regionId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      fetchOneBrigadesDate(id)
        .then((data) => {
          const prod = {
            weekend: data.weekend.toString(),
            warranty: data.warranty.toString(),
            downtime: data.downtime.toString(),
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
  }, [id]);

  React.useEffect(() => {
    fetchAllProjects().then((data) => setProjects(data));
  }, []);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({
        project: event.target.value, // Устанавливаем только проект
        weekend: '', // Сбрасываем выходной
        warranty: '', // Сбрасываем гарантийный день
        downtime: '',
      });
      setValid(
        isValid({
          project: event.target.value,
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
      weekend: isChecked ? 'Выходной' : null,
      warranty: '', // Сбрасываем гарантийный день
      downtime: '',
    }));
    setValid(
      isValid({
        project: 0,
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
      weekend: '', // Сбрасываем выходной
      warranty: isChecked ? 'Гарантийный день' : null,
      downtime: '',
    }));
    setValid(
      isValid({
        project: 0,
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
      weekend: '', // Сбрасываем выходной
      warranty: '',
      downtime: isChecked ? 'Простой' : null,
    }));
    setValid(
      isValid({
        project: 0,
        weekend: '',
        warranty: '',
        downtime: isChecked ? 'Простой' : null,
      }),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('weekend', value.weekend);
    data.append('projectId', value.project === '' ? 0 : value.project);
    data.append('warranty', value.warranty);
    data.append('downtime', value.downtime);

    updateBrigadesDate(id, data)
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
      });
  };

  return (
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
                    .filter(
                      (project) => project.date_finish === null && project.regionId === regionId,
                    )
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
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
              <Button variant="dark" type="submit" onClick={() => setShow(false)}>
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBrigadeDate;
