import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createEstimateFile } from '../../../http/projectApi';

const defaultValue = { estimate_file: '' };
const defaultValid = {
  estimate_file: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'estimate_file') result.estimate_file = value.estimate_file.trim() !== '';
  }
  return result;
};

const CreateEstimateFile = (props) => {
  const { id, show, setShow, setChange } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [file, setFile] = React.useState(null); // Переименовал image в file для ясности

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('estimate_file', file);

      await createEstimateFile(id, data);

      setValue(defaultValue);
      setValid(defaultValid);
      setFile(null);
      setChange((state) => !state);
      setShow(false);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      console.log(error.response?.data?.message || 'Произошла ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setFile(null);
    setValue(defaultValue);
    setValid(defaultValid);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__name">
      <Modal.Header closeButton>
        <Modal.Title>Добавление файла со сметой</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.xls,.xlsx,.doc,.docx"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="dark" type="submit" disabled={isLoading || !file}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEstimateFile;
