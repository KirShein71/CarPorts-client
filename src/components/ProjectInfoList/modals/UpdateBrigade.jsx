import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProjectBrigades, updateBrigade } from '../../../http/projectBrigadesApi';
import { fetchBrigades } from '../../../http/bragadeApi';

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

const UpdateBrigade = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [brigades, setBrigades] = React.useState(null);

  React.useEffect(() => {
    if (id) {
      fetchOneProjectBrigades(id)
        .then((data) => {
          const prod = {
            brigade: data.brigade.toString(),
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
    fetchBrigades().then((data) => setBrigades(data));
  }, []);

  const handleInstallerChange = (e) => {
    const brigadeId = e.target.value;
    setValue((prevValue) => ({
      ...prevValue,
      brigade: brigadeId,
    }));
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.brigade) {
      const data = new FormData();
      data.append('brigadeId', value.brigade);

      updateBrigade(id, data)
        .then((data) => {
          const prod = {
            brigade: data.brigade.toString(),
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Изменить бригаду</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
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

export default UpdateBrigade;
