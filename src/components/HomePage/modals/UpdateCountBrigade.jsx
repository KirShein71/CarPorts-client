import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { updateCount, getOneBrigadeWork } from '../../../http/brigadeWorkApi';

const defaultValue = { count: '' };
const defaultValid = {
  count: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'count') result.count = value.count;
  }
  return result;
};

const UpdateCount = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (id) {
      getOneBrigadeWork(id)
        .then((data) => {
          const prod = {};
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.count) {
      const data = new FormData();
      data.append('count', value.count.trim());
      updateCount(id, data)
        .then((data) => {
          const prod = {
            count: data.count,
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          setShow(false);
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
        <Modal.Title>Изменить колиство бригад</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Control
              name="count"
              value={value.count}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.count === true}
              isInvalid={valid.count === false}
              placeholder="Количество"
              type="number"
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

export default UpdateCount;
