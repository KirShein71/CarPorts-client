import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createAntypical } from '../../../http/antypicalApi';

const defaultValue = {
  name: '',
  color: '',
  antypicals_quantity: '',
};
const defaultValid = {
  name: null,
  color: null,
  antypicals_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'color') result.color = value.color.trim() !== '';
    if (key === 'antypicals_quantity')
      result.antypicals_quantity = value.antypicals_quantity.trim() !== '';
  }
  return result;
};

const CreateAntypical = (props) => {
  const { show, setShow, setChange, projectId, scrollPosition } = props;
  const [image, setImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [errors, setErrors] = React.useState({});

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
            const pastedImage = clipboardData.files[i];
            setImage(pastedImage);
            setSelectedImage({
              image: pastedImage,
              preview: URL.createObjectURL(pastedImage),
            });
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
            setSelectedImage({
              image: pastedImage,
              preview: URL.createObjectURL(pastedImage),
            });
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

  // Очистка preview URL при размонтировании
  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const handleInputChange = (event) => {
    const { name, value: inputValue } = event.target;
    const data = { ...value, [name]: inputValue };
    setValue(data);

    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Валидация количества в реальном времени
    if (name === 'antypicals_quantity') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue === '') {
        setValid((prev) => ({ ...prev, antypicals_quantity: false }));
      } else if (!isNaN(trimmedValue) && parseInt(trimmedValue) > 0) {
        setValid((prev) => ({ ...prev, antypicals_quantity: true }));
      }
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setSelectedImage({
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleAddImage = () => {
    if (image) {
      setSelectedImage({
        image: image,
        preview: URL.createObjectURL(image),
      });
      setImage(null);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleSave = () => {
    let hasError = false;
    const newErrors = {};

    // Проверка наличия изображения
    if (!selectedImage) {
      newErrors.image = 'Пожалуйста, добавьте изображение';
      hasError = true;
    }

    // Проверка количества (единственное обязательное поле)
    const quantity = value.antypicals_quantity.trim();
    if (!quantity) {
      newErrors.antypicals_quantity = 'Количество - обязательное поле';
      hasError = true;
    } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
      newErrors.antypicals_quantity = 'Укажите положительное число';
      hasError = true;
    }

    // Название и цвет НЕ обязательные
    const name = value.name.trim();
    const color = value.color.trim();

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('image', selectedImage.image);
    formData.append('name', name);
    formData.append('color', color);
    formData.append('antypicals_quantity', parseInt(quantity));

    createAntypical(formData)
      .then(() => {
        // Очищаем все данные
        setSelectedImage(null);
        setImage(null);
        setValue(defaultValue);
        setValid(defaultValid);
        setErrors({});
        handleCloseModal();
        setChange((state) => !state);
      })
      .catch((error) => {
        let errorMessage = 'Произошла ошибка при обработке запроса';

        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }

        setErrors((prev) => ({ ...prev, form: errorMessage }));
      });
  };

  const handleRemoveImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    setImage(null);
  };

  const handleClose = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    setImage(null);
    setValue(defaultValue);
    setValid(defaultValid);
    setErrors({});
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onShow={() => {
        setImage(null);
        setSelectedImage(null);
        setValue(defaultValue);
        setValid(defaultValid);
        setErrors({});
      }}>
      <Modal.Header closeButton>
        <Modal.Title>Нетипичная деталь</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Ошибка формы */}
          {errors.form && <div className="alert alert-danger mb-3">{errors.form}</div>}

          {/* Ошибка изображения */}
          {errors.image && <div className="alert alert-warning mb-3">{errors.image}</div>}

          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="name"
                value={value.name}
                onChange={handleInputChange}
                placeholder="Название"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Control
                name="color"
                value={value.color}
                onChange={handleInputChange}
                placeholder="Цвет"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Control
                name="antypicals_quantity"
                value={value.antypicals_quantity}
                onChange={handleInputChange}
                isInvalid={!!errors.antypicals_quantity}
                placeholder="Количество"
              />
              {errors.antypicals_quantity && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.antypicals_quantity}
                </Form.Control.Feedback>
              )}
              <Form.Text className="text-muted">Обязательное поле</Form.Text>
            </Col>
          </Row>

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

          <p className="text-muted small mt-2">Или вставьте изображение через Ctrl+V</p>

          {selectedImage && (
            <div className="mb-3">
              <Row className="mb-3 align-items-center">
                <Col>
                  <Form.Control disabled value={selectedImage.image.name} className="mb-2" />
                </Col>
                <Col xs="auto">
                  <Button variant="dark" onClick={handleRemoveImage}>
                    Удалить
                  </Button>
                </Col>
              </Row>
              {/* Предпросмотр изображения */}
              <div className="text-center mb-3">
                <img
                  src={selectedImage.preview}
                  alt="Предпросмотр"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          )}

          {!selectedImage && image && (
            <div className="mb-3">
              <Button variant="dark" onClick={handleAddImage}>
                Добавить изображение
              </Button>
            </div>
          )}

          {selectedImage && (
            <div className="d-grid gap-2">
              <Button variant="dark" onClick={handleSave}>
                Сохранить деталь
              </Button>
            </div>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAntypical;
