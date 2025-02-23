import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createBrigade, getOneAccount } from '../../../../http/userApi';
import { fetchBrigades } from '../../../../http/bragadeApi';
import { useParams } from 'react-router-dom';

const defaultValue = { brigade: '' };
const defaultValid = {
  brigade: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'brigade') result.brigade = value.brigade.trim() !== '';
  }
  return result;
};

const CreateBrigade = (props) => {
  const { show, setShow, setChange } = props;
  const { id } = useParams();
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [brigades, setBridades] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

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
    fetchBrigades().then((data) => setBridades(data));
  }, [id]);

  const handleInstallerChange = (e) => {
    const brigadeId = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      brigade: brigadeId,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.brigade) {
      const res = new FormData();
      res.append('brigadeId', value.brigade.trim());
      setIsLoading(true);
      createBrigade(id, res)
        .then((res) => {
          setValue(defaultValue);
          setValid(defaultValid);
          setShow(false);
          setChange((state) => !state);
        })
        .catch((error) => alert(error.response.res.message));
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Назначить бригаду</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Select
                name="brigade"
                value={value.brigade}
                onChange={handleInstallerChange}
                isValid={valid.brigade === true}
                isInvalid={valid.brigade === false}>
                <option value="">Бригады</option>
                {brigades &&
                  brigades.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
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

export default CreateBrigade;
