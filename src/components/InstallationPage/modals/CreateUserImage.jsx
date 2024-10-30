import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createUserImage } from '../../../http/userImageApi';

const defaultValue = { date: '' };
const defaultValid = {
  date: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date') result.date = value.date.trim() !== '';
  }
  return result;
};

const CreateUserImage = (props) => {
  const { show, setShow, setChange, userId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [image, setImage] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddImage = () => {
    if (value.date && image) {
      const newImage = {
        date: value.date,
        image: image,
      };
      setSelectedImages((prev) => [...prev, newImage]);
      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleSaveImages = () => {
    const data = selectedImages.map((image) => {
      const formData = new FormData();
      formData.append('date', image.date.trim());
      formData.append('userId', userId);
      formData.append('image', image.image);
      return formData;
    });

    Promise.all(data.map(createUserImage))
      .then(() => {
        setSelectedImages([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
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
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="date"
                value={value.date}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.date === true}
                isInvalid={valid.date === false}
                placeholder="Дата"
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
              <Button variant="dark" size="sm" className="me-3" onClick={handleSaveImages}>
                Сохранить
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

export default CreateUserImage;
