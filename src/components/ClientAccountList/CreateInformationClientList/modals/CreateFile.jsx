import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createUserFile } from '../../../../http/userFileApi';

const defaultValue = { name: '' };
const defaultValid = {
  name: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
  }
  return result;
};

const CreateFile = (props) => {
  const { show, setShow, setChange, userId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [file, setFile] = React.useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAddFile = () => {
    if (value.name && file) {
      const newFile = {
        name: value.name,
        file: file,
      };
      setSelectedFiles((prev) => [...prev, newFile]);
      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleSaveFiles = () => {
    const data = selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append('name', file.name.trim());
      formData.append('userId', userId);
      formData.append('file', file.file);
      return formData;
    });

    Promise.all(data.map(createUserFile))
      .then(() => {
        setSelectedFiles([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Добавить файл</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="file"
                type="file"
                onChange={(e) => handleFileChange(e)}
                placeholder="Файл (не более 1MB)..."
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.name === true}
                isInvalid={valid.name === false}
                placeholder="Название файла"
              />
            </Col>
          </Row>
          <Col>
            <Button variant="dark" className="mb-3" onClick={handleAddFile}>
              Добавить
            </Button>
          </Col>
          {selectedFiles.map((file, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control disabled value={file.file.name} className="mb-3" />
                </Col>
                <Col>
                  <Form.Control disabled value={file.name} className="mb-3" />
                </Col>
                <Col>
                  <Button variant="dark" onClick={() => handleRemoveFile(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedFiles.length > 0 && (
            <>
              <Button variant="dark" className="me-3 mb-3" onClick={handleSaveFiles}>
                Сохранить все файлы
              </Button>
              <Button variant="dark" onClick={handleRemoveAllFiles}>
                Удалить все
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateFile;
