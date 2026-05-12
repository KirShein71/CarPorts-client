import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, createPortfolioNote } from '../../../http/projectApi';

const defaultValue = { note_portfolio: '' };
const defaultValid = {
  note_portfolio: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'note_portfolio') result.note_portfolio = value.note_portfolio.trim() !== '';
  }
  return result;
};

const CreatePortfolioNote = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            note_portfolio: data.note_portfolio.toString(),
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.note_portfolio) {
      const data = new FormData();
      data.append('note_portfolio', value.note_portfolio.trim());

      createPortfolioNote(id, data)
        .then((data) => {
          const prod = {
            note_portfolio: data.note_portfolio.toString(),
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
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Добавить описание</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <textarea
                name="note_portfolio"
                value={value.note_portfolio}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.note_portfolio === true}
                isInvalid={valid.note_portfolio === false}
                placeholder="Описание"
                style={{ minHeight: '200px', width: '100%' }}
              />
            </Col>
          </Row>
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

export default CreatePortfolioNote;
