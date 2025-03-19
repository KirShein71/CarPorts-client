import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createComplaint } from '../../../http/complaintApi';
import { createComplaintImage } from '../../../http/complaintImageApi';
import { fetchAllProjects } from '../../../http/projectApi';
import Select from 'react-select';

const defaultValue = {
  date: '',
  note: '',
  project: '',
};
const defaultValid = {
  date: null,
  note: null,
  project: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'date') result.date = value.date.trim() !== '';
    if (key === 'project') result.project = value.project;
    if (key === 'note') result.note = value.note.trim() !== '';
  }
  return result;
};

const CreateComplaint = (props) => {
  const { show, setShow, setChange } = props;
  const [projects, setProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [complaintId, setComplaintId] = React.useState(null);
  const [buttonText, setButtonText] = React.useState('Сохранить');

  React.useEffect(() => {
    if (show) {
      fetchAllProjects().then((data) => setProjects(data));
    }
  }, [show]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleInputProject = (selectedOption) => {
    const data = { ...value, project: selectedOption.value };
    setValue(data);
    setValid(isValid(data));
    setSelectedProject(selectedOption);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddImage = () => {
    if (image) {
      const newImage = {
        image: image,
      };
      setSelectedImages((prev) => [...prev, newImage]);
      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const correct = isValid(value);
    setValid(correct);
    setIsLoading(true);
    const data = new FormData();
    data.append('date', new Date().toISOString());
    data.append('note', value.note.trim());
    data.append('projectId', value.project);

    createComplaint(data)
      .then((data) => {
        // приводим форму в изначальное состояние
        setValue(defaultValue);
        setValid(defaultValid);
        setComplaintId(data.id);
      })
      .catch((error) => alert(error.response.data.message))
      .finally(() => {
        setIsLoading(false);
        setButtonText('Сохранено');
      });
  };

  const handleCreateImages = () => {
    const photos = selectedImages.map((image) => {
      const formData = new FormData();
      formData.append('complaintId', complaintId);
      formData.append('image', image.image);
      return formData;
    });

    Promise.all(photos.map(createComplaintImage))
      .then(() => {
        setSelectedImages([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response ? error.response.data.message : error.message);
      });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setSelectedImages([]);
  };

  const handleClosedModal = () => {
    setShow(false);
    setChange((state) => !state);
  };

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <Modal
      show={show}
      onHide={handleClosedModal}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Создать рекламацию</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Select
                name="project"
                options={projectOptions}
                value={value.selectedProject}
                onChange={handleInputProject}
                isSearchable
                isValid={valid.project === true}
                isInvalid={valid.project === false}
                placeholder="Проект"
                noOptionsMessage={() => 'Проекты не найдены'}
              />
            </Col>
          </Row>
          <Col md={12} className="my-3">
            <textarea
              name="note"
              value={value.note}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.note === true}
              isInvalid={valid.note === false}
              placeholder="Описание"
              style={{ height: '200px', width: '100%' }}
            />
          </Col>
          <Row>
            <Col>
              <Button
                variant="dark"
                type="submit"
                disabled={buttonText === 'Сохранено' || isLoading}>
                {isLoading ? 'Сохранение...' : buttonText}
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal.Title className="mt-3">Добавить фотографии</Modal.Title>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                name="image"
                type="file"
                onChange={(e) => handleImageChange(e)}
                placeholder="Фото товара (не более 5MB)..."
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
                onClick={handleCreateImages}
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

export default CreateComplaint;
