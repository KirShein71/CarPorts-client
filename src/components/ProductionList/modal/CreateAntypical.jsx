import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAntypical } from '../../../http/antypicalApi';

const CreateAntypical = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [image, setImage] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);

  // Обработчик вставки из буфера обмена
  useEffect(() => {
    const handlePaste = (event) => {
      if (!show) return;

      const clipboardData = event.clipboardData || window.clipboardData;
      const items = clipboardData.items;

      // Проверяем, есть ли в буфере файлы (при копировании из файловой системы)
      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          if (clipboardData.files[i].type.indexOf('image') !== -1) {
            setImage(clipboardData.files[i]);
            handleAddImage(clipboardData.files[i]);
            break;
          }
        }
      }
      // Обычная вставка изображения (например, скриншот)
      else {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            // Генерируем имя файла с временной меткой
            const fileName = `screenshot-${new Date().toISOString().slice(0, 10)}.png`;
            const pastedImage = new File([blob], fileName, { type: 'image/png' });
            setImage(pastedImage);
            handleAddImage(pastedImage);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [show]);

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleAddImage = (img = null) => {
    const imageToAdd = img || image;
    if (imageToAdd) {
      const newImage = {
        image: imageToAdd,
      };
      setSelectedImages((prev) => [...prev, newImage]);
      setImage(null); // Сбрасываем текущее изображение после добавления
    }
  };

  // Остальной код без изменений
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
      centered
      onShow={() => setImage(null)} // Сбрасываем изображение при открытии
    >
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
                onChange={handleImageChange}
                placeholder="Фото товара (не более 1MB)..."
                accept="image/*"
              />
            </Col>
          </Row>
          <Col>
            <Button variant="dark" className="mb-3" onClick={() => handleAddImage()}>
              Добавить
            </Button>
          </Col>
          <p className="text-muted small mt-2">Или вставьте изображение через Ctrl+V</p>

          {selectedImages.map((image, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control disabled value={image.image.name} className="mb-3" />
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
              <Button variant="dark" className="me-3 mb-3" onClick={handleSaveImages}>
                Сохранить все изображения
              </Button>
              <Button className="mb-3" variant="dark" onClick={handleRemoveAllImages}>
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
