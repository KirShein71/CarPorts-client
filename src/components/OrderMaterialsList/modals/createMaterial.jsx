import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchMaterials } from '../../../http/materialsApi';
import { createProjectMaterials } from '../../../http/projectMaterialsApi';
import { useNavigate } from 'react-router-dom';

const defaultValue = {
  material: '',
  materialName: '',
  expirationMaterial_date: '',
  date_payment: '',
};
const defaultValid = {
  material: null,
  materialName: null,
};

const isValid = (value) => {
  const result = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === 'material') result.material = pattern.test(value.material);
    if (key === 'materialName') result.materialName = pattern.test(value.materialName);
  }
  return result;
};

const CreateMaterial = (props) => {
  const { show, setShow, setChange, projectId, scrollPosition, currentPageUrl } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [materials, setMaterials] = React.useState(null);
  const [selectedMaterials, setSelectedMaterials] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchMaterials().then((data) => setMaterials(data));
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleAddMaterial = () => {
    if (value.material) {
      const newDetail = {
        materialId: value.material,
        materialName: value.materialName,
        date_payment: value.date_payment,
        expirationMaterial_date: value.expirationMaterial_date,
      };
      setSelectedMaterials((prev) => [...prev, newDetail]);
      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
    navigate(currentPageUrl); // Восстанавливаем текущую страницу после закрытия модального окна
  };

  const handleSaveMaterials = () => {
    const newData = selectedMaterials.filter((material) => !material.id);
    const data = newData.map((material) => {
      const formData = new FormData();
      formData.append('materialName', material.materialName);
      formData.append('materialId', material.materialId);
      formData.append('projectId', projectId);

      if (material.expirationMaterial_date) {
        // Проверка на пустое значение
        formData.append('expirationMaterial_date', material.expirationMaterial_date);
      }

      if (material.date_payment) {
        // Проверка на пустое значение
        formData.append('date_payment', material.date_payment);
      }

      return formData;
    });

    Promise.all(data.map(createProjectMaterials))
      .then(() => {
        setSelectedMaterials([]);
        handleCloseModal();
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };
  const handleMaterialChange = (e) => {
    const materialId = e.target.value;
    const materialName = e.target.options[e.target.selectedIndex].text;
    setValue((prevValue) => ({
      ...prevValue,
      material: materialId,
      materialName: materialName,
    }));
  };

  const handleRemoveMaterial = (index) => {
    setSelectedMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllMaterials = () => {
    setSelectedMaterials([]);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="xl "
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__procurement">
      <Modal.Header closeButton>
        <Modal.Title>Добавить материал</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-dialog-scrollable">
        <Form>
          <Col className="mb-3">
            <Form.Select
              name="material"
              value={value.material}
              onChange={handleMaterialChange}
              isValid={valid.material === true}
              isInvalid={valid.material === false}>
              <option value="">Материалы</option>
              {materials &&
                materials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
          <Row className="mb-3">
            <Col>
              {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                <>
                  <label for="date_payment">Дата платежа</label>
                  <Form.Control
                    id="date_payment"
                    name="date_payment"
                    value={value.date_payment}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.date_payment === true}
                    isInvalid={valid.date_payment === false}
                    type="date"
                  />
                </>
              ) : (
                <Form.Control
                  name="date_payment"
                  value={value.date_payment}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.date_payment === true}
                  isInvalid={valid.date_payment === false}
                  placeholder="Дата платежа"
                  type="text"
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                name="expirationMaterial_date"
                value={value.expirationMaterial_date}
                onChange={(e) => handleInputChange(e)}
                placeholder="Срок производства"
                className="mb-3"
              />
            </Col>
          </Row>
          <Col>
            <Button className="mb-3" onClick={handleAddMaterial}>
              Добавить
            </Button>
          </Col>
          {selectedMaterials.map((material, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control disabled value={material.materialName} className="mb-3" />
                </Col>

                <Col>
                  <Button variant="danger" onClick={() => handleRemoveMaterial(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedMaterials.length > 0 && (
            <>
              <Button className="me-3" onClick={handleSaveMaterials}>
                Сохранить все материалы
              </Button>
              <Button onClick={handleRemoveAllMaterials}>Удалить все</Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMaterial;
