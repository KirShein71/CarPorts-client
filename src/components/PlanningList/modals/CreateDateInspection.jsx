import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateProject } from '../../../http/projectApi';
import { useNavigate } from 'react-router-dom';

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
  const { id, show, setShow, setChange, scrollPosition, currentPageUrl } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
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
  }, [id]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
    navigate(currentPageUrl); // Восстанавливаем текущую страницу после закрытия модального окна
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.date_inspection) {
      const data = new FormData();
      data.append('date_inspection', value.date_inspection.trim());
      updateProject(id, data)
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
              <Button variant="dark" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateDateInspection;
