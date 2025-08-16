import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateDateInspection } from '../../../http/projectApi';

const defaultValue = { date_inspection: '' };
const defaultValid = {
  date_inspection: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date_inspection') result.date_inspection = value.date_inspection;
  }
  return result;
};

const CreateDateInspection = (props) => {
  const { id, show, setShow, setChange, scrollPosition, planningPage } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            date_inspection: data.date_inspection.toString(),
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
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    if (planningPage) {
      setShow(false);
      window.scrollTo(0, scrollPosition);
    } else {
      setShow(false);
    }
    console.log(setShow);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.date_inspection) {
      const data = new FormData();
      data.append('date_inspection', value.date_inspection.trim());
      setIsLoading(true);
      updateDateInspection(id, data)
        .then((data) => {
          const prod = {
            date_inspection: data.date_inspection.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          handleCloseModal();
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
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавь дату проверки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="date_inspection"
              value={value.date_inspection}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.date_inspection === true}
              isInvalid={valid.date_inspection === false}
              placeholder="Дата проверки"
              type="date"
            />
          </Col>
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

export default CreateDateInspection;
