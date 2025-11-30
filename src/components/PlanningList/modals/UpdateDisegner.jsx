import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, updateDesigner } from '../../../http/projectApi';
import { getAllActiveDesigner } from '../../../http/designerApi';

const defaultValue = { designer: '', designerId: '' };
const defaultValid = {
  designer: null,
  designerId: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'designer') result.designer = value.designer.trim() !== '';
    if (key === 'designerId') result.designerId = value.designerId.trim() !== '';
  }
  return result;
};

const UpdateDesigner = (props) => {
  const { id, show, setShow, setChange, planningPage, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [designers, setDesigners] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем дизайнеров только когда модальное окно открыто
        if (show) {
          const [designersData, projectData] = await Promise.all([
            getAllActiveDesigner(),
            fetchOneProject(id),
          ]);

          setDesigners(designersData);

          const prod = {
            designer: projectData.designer?.toString() || '',
            designerId: projectData.designerId?.toString() || '',
          };
          setValue(prod);
          setValid(isValid(prod));
        }
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          console.log('An error occurred');
        }
      }
    };

    fetchData();
  }, [show, id]);

  const handleInputChange = (event) => {
    const selectedDesignerId = event.target.value;
    const selectedDesigner = designers.find((item) => item.id.toString() === selectedDesignerId);

    const data = {
      designer: selectedDesigner ? selectedDesigner.name : '',
      designerId: selectedDesignerId,
    };

    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    if (planningPage) {
      setShow(false);
      window.scrollTo(0, scrollPosition);
    } else {
      setShow(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    if (correct.designer && correct.designerId) {
      const data = new FormData();
      data.append('designer', value.designer.trim());
      data.append('designerId', value.designerId);

      setIsLoading(true);
      updateDesigner(id, data)
        .then((data) => {
          const prod = {
            designer: data.designer?.toString() || '',
            designerId: data.designerId?.toString() || '',
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          handleCloseModal();
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
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      className="modal__planning"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Изменить проектировщика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Select
              name="designerId"
              value={value.designerId}
              onChange={handleInputChange}
              isValid={valid.designerId === true}
              isInvalid={valid.designerId === false}>
              <option value="">Выберите проектировщика</option>
              {designers &&
                designers
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
            </Form.Select>
          </Col>
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

export default UpdateDesigner;
