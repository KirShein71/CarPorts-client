import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createManager, getOneAccount } from '../../../../http/userApi';
import { getManager } from '../../../../http/employeeApi';
import { useParams } from 'react-router-dom';

const defaultValue = { employee: '' };
const defaultValid = {
  employee: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'employee') result.employee = value.employee.trim() !== '';
  }
  return result;
};

const CreateManager = (props) => {
  const { show, setShow, setChange } = props;
  const { id } = useParams();
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [managers, setManagers] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      getOneAccount(id)
        .then((res) => {
          setValue(defaultValue);
          setValid(isValid(defaultValue));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
    getManager().then((data) => setManagers(data));
  }, [id]);

  const handleInputChange = (e) => {
    const employeeId = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      employee: employeeId,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.employee) {
      const res = new FormData();
      res.append('employeeId', value.employee.trim());

      createManager(id, res)
        .then((res) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Назначить менеджера</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Select
                name="employee"
                value={value.employee}
                onChange={handleInputChange}
                isValid={valid.employee === true}
                isInvalid={valid.employee === false}>
                <option value="">Менеджеры</option>
                {managers &&
                  managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" className="mt-3" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateManager;
