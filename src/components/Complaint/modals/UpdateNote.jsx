import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getOneComplaint, updateNote } from '../../../http/complaintApi';

const defaultValue = { note: '' };
const defaultValid = {
  note: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'note') result.note = value.note.trim() !== '';
  }
  return result;
};

const UpdateNote = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      getOneComplaint(id)
        .then((data) => {
          const prod = {
            note: data.complaint.note.toString(),
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

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    setLoading(true);
    const data = new FormData();
    data.append('note', value.note ? value.note.trim() : '');

    updateNote(id, data)
      .then((data) => {
        const prod = {
          note: data.complaint.note.toString(),
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
      })
      .finally(() => {
        setLoading(false);
        handleCloseModal();
        setChange((state) => !state);
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
        <Modal.Title>Добавить комментарий</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <textarea
                name="note"
                value={value.note}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.note === true}
                isInvalid={valid.note === false}
                placeholder="Комментарии"
                style={{ minHeight: '200px', width: '100%' }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" type="submit" disabled={loading}>
                {loading ? 'Загрузка...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateNote;
