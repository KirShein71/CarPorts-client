import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getOneNpsQuestion, updateNpsQuestionChapter } from '../../../http/npsQuestionApi';
import { getAllNpsChapter } from '../../../http/npsChapterApi';

const defaultValue = { npschapter: '' };
const defaultValid = {
  npschapter: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'npschapter') result.npschapter = value.npschapter;
  }
  return result;
};

const CreateChapterNpsQuestion = (props) => {
  const { id, show, setShow, setChange } = props;
  const [npsChapters, setNpsChapters] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      Promise.all([getOneNpsQuestion(id), getAllNpsChapter()])
        .then(([questionData, npsChaptersData]) => {
          const prod = {
            npschapterId: questionData.npschapterId,
          };
          setValue(prod);
          setValid(isValid(prod));
          setNpsChapters(npsChaptersData);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.npschapter) {
      const data = new FormData();

      data.append('nps_chapter_id', value.npschapter);

      setIsLoading(true);
      updateNpsQuestionChapter(id, data)
        .then((data) => {
          const prod = {
            npschapter: data.npschapter.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
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
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ maxWidth: '100%', maxHeight: '100%', width: '100vw', height: '100vh' }}
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Добавьте раздел</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="npschapter"
                value={value.npschapter}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.npschapter === true}
                isInvalid={valid.npschapter === false}>
                <option value="">Раздел</option>
                {npsChapters &&
                  npsChapters.map((npschapter) => (
                    <option key={npschapter.id} value={npschapter.id}>
                      {npschapter.name}
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

export default CreateChapterNpsQuestion;
