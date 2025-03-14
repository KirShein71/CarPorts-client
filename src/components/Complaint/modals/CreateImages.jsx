import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createComplaintImage } from '../../../http/complaintImageApi';

const CreateImages = (props) => {
  const { show, setShow, setChange, complaintId } = props;
  const [image, setImage] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddImage = () => {
    if (image) {
      const newImage = {
        image: image,
      };
      setSelectedImages((prev) => [...prev, newImage]);
    }
  };

  const handleSaveImages = () => {
    setIsLoading(true);
    const data = selectedImages.map((image) => {
      const formData = new FormData();
      formData.append('complaintId', complaintId);
      formData.append('image', image.image);
      return formData;
    });

    Promise.all(data.map(createComplaintImage))
      .then(() => {
        setSelectedImages([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setSelectedImages([]);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Добавить избражение</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="image"
                type="file"
                onChange={(e) => handleImageChange(e)}
                placeholder="Фото товара (не более 1MB)..."
              />
            </Col>
          </Row>
          <Col>
            <Button variant="dark" className="mb-3" onClick={handleAddImage}>
              Добавить
            </Button>
          </Col>
          {selectedImages.map((image, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control disabled value={image.image.name} className="mb-3" />
                </Col>
                <Col>
                  <Form.Control disabled value={image.date} className="mb-3" />
                </Col>
                <Col>
                  <Button variant="dark" onClick={() => handleRemoveImage(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedImages.length > 0 && (
            <>
              <Button
                variant="dark"
                size="sm"
                className="me-3"
                onClick={handleSaveImages}
                disabled={isLoading}>
                {isLoading ? 'Сохранение' : 'Сохранить'}
              </Button>
              <Button variant="dark" size="sm" onClick={handleRemoveAllImages}>
                Удалить все
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateImages;
