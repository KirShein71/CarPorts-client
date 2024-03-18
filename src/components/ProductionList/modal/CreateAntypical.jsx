import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAntypical } from '../../../http/antypicalApi';

const CreateAntypical = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [image, setImage] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);

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
    const data = selectedImages.map((image) => {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('image', image.image);
      return formData;
    });

    Promise.all(data.map(createAntypical))
      .then(() => {
        setSelectedImages([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert('Произошла ошибка при обработке запроса');
        }
      });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setSelectedImages([]);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Нетипичная деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="image"
                type="file"
                onChange={(e) => handleImageChange(e)}
                placeholder="Фото товара..."
              />
            </Col>
          </Row>
          <Col>
            <Button className="mb-3" onClick={handleAddImage}>
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
                  <Button variant="danger" onClick={() => handleRemoveImage(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedImages.length > 0 && (
            <>
              <Button className="me-3 mb-3" onClick={handleSaveImages}>
                Сохранить все изображения
              </Button>
              <Button className="mb-3" onClick={handleRemoveAllImages}>
                Удалить все
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAntypical;
