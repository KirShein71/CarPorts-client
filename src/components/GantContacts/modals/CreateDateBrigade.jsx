import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { createBrigadesDate } from '../../../http/brigadesDateApi';
import { fetchBrigades } from '../../../http/bragadeApi';

const defaultValue = {
  brigade: '',
};
const defaultValid = {
  brigade: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'brigade') result.brigade = value.brigade;
  }
  return result;
};

const CreateDateBrigade = (props) => {
  const { show, setShow, setChange, projectId, dateId, regionId } = props;
  const [brigades, setBrigades] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchBrigades().then((data) => setBrigades(data));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('projectId', projectId);
    data.append('brigadeId', value.brigade.trim());
    data.append('dateId', dateId);
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
                name="brigade"
                value={value.brigade}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.brigade === true}
                isInvalid={valid.brigade === false}>
                <option value="">Бригады</option>
                {brigades &&
                  brigades
                    .filter((brigade) => brigade.regionId === regionId)
                    .map((brigade) => (
                      <option key={brigade.id} value={brigade.id}>
                        {brigade.name}
                      </option>
                    ))}
              </Form.Select>
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

export default CreateDateBrigade;
