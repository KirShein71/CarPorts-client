import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createPortfolioImage } from '../../../http/portfolioImageApi';

const CreatePortfolioImage = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [file, setFile] = React.useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef(null); // Создаем ref для input

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAddFile = () => {
    if (file) {
      setSelectedFiles((prev) => [...prev, file]);
      setFile(null);
      // Очищаем input file через ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveFiles = async () => {
    setIsLoading(true);

    try {
      // Отправляем файлы по одному
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('image', file);
        await createPortfolioImage(formData);
      }

      setSelectedFiles([]);
      setShow(false);
      setChange((state) => !state);
    } catch (error) {
      console.error(error.response?.data?.message || 'Ошибка при сохранении');
      alert(error.response?.data?.message || 'Ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавить изображение</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off">
          <Row className="mb-3">
            <Col>
              <Form.Control
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button variant="dark" onClick={handleAddFile} disabled={!file}>
                Добавить
              </Button>
            </Col>
          </Row>

          {selectedFiles.map((file, index) => (
            <Row key={index} className="mb-3">
              <Col>
                <Form.Control disabled value={file.name} />
              </Col>
              <Col>
                <Button variant="danger" onClick={() => handleRemoveFile(index)}>
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}

          {selectedFiles.length > 0 && (
            <Row>
              <Col>
                <Button
                  variant="dark"
                  className="me-3"
                  onClick={handleSaveFiles}
                  disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить все'}
                </Button>
                <Button variant="secondary" onClick={handleRemoveAllFiles} disabled={isLoading}>
                  Удалить все
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePortfolioImage;
