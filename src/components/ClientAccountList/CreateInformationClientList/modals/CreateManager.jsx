import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createManager, getOneAccount } from '../../../../http/userApi';
import { getAllManagerProject } from '../../../../http/managerProjectApi';
import { useParams } from 'react-router-dom';

const defaultValue = { managerproject: '' };
const defaultValid = {
  managerproject: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'managerproject') result.managerproject = value.managerproject.trim() !== '';
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
    getAllManagerProject().then((data) => setManagers(data));
  }, [id]);

  const handleInputChange = (e) => {
    const managerprojectId = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      managerproject: managerprojectId,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.managerproject) {
      const res = new FormData();
      res.append('managerProjectId', value.managerproject.trim());

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
                name="managerproject"
                value={value.managerproject}
                onChange={handleInputChange}
                isValid={valid.managerproject === true}
                isInvalid={valid.managerproject === false}>
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
