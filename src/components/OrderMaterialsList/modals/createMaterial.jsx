import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchMaterials } from '../../../http/materialsApi';
import { createProjectMaterials } from '../../../http/projectMaterialsApi';

const defaultValue = {
  material: '',
  materialName: '',
  supplier: '',
  expirationMaterial_date: '',
  date_payment: '',
  plan_date: '',
};
const defaultValid = {
  material: null,
  materialName: null,
  supplier: null,
};

const isValid = (value) => {
  const result = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === 'material') result.material = pattern.test(value.material);
    if (key === 'materialName') result.materialName = pattern.test(value.materialName);
    if (key === 'supplier') result.supplier = pattern.test(value.supplier);
  }
  return result;
};

const CreateMaterial = (props) => {
  const { show, setShow, setChange, projectId, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [materials, setMaterials] = React.useState(null);
  const [selectedMaterials, setSelectedMaterials] = React.useState([]);

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
        supplierId: value.supplier,
        date_payment: value.date_payment,
        plan_date: value.plan_date,
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
  };

  const handleSaveMaterials = () => {
    const newData = selectedMaterials.filter((material) => !material.id);
    const data = newData.map((material) => {
      const formData = new FormData();
      formData.append('materialName', material.materialName);
      formData.append('materialId', material.materialId);
      formData.append('projectId', projectId);
      formData.append('supplierId', material.supplierId ? material.supplierId : 0);

      if (material.expirationMaterial_date) {
        // Проверка на пустое значение
        formData.append('expirationMaterial_date', material.expirationMaterial_date);
      }

      if (material.date_payment) {
        // Проверка на пустое значение
        formData.append('date_payment', material.date_payment);
      }

      if (material.plan_date) {
        // Проверка на пустое значение
        formData.append('plan_date', material.plan_date);
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
    const selectedOption = e.target.options[e.target.selectedIndex];
    const materialId = e.target.value;
    const materialName = selectedOption.text;
    const supplierId = selectedOption.getAttribute('data-supplier-id');

    setValue((prevValue) => ({
      ...prevValue,
      material: materialId,
      materialName: materialName,
      supplier: supplierId,
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
                materials
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <option key={item.id} value={item.id} data-supplier-id={item.supplierId}>
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
          <Row className="mb-3">
            <Col>
              {/iPad|iPhone|iPod/.test(navigator.userAgent) ? (
                <>
                  <label for="plan_date">Плановая дата</label>
                  <Form.Control
                    id="plan_date"
                    name="plan_date"
                    value={value.plan_date}
                    onChange={(e) => handleInputChange(e)}
                    isValid={valid.plan_date === true}
                    isInvalid={valid.plan_date === false}
                    type="date"
                  />
                </>
              ) : (
                <Form.Control
                  name="plan_date"
                  value={value.plan_date}
                  onChange={(e) => handleInputChange(e)}
                  isValid={valid.plan_date === true}
                  isInvalid={valid.plan_date === false}
                  placeholder="Плановая дата"
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
            <Button variant="dark" className="mb-3" onClick={handleAddMaterial}>
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
                  <Button variant="dark" onClick={() => handleRemoveMaterial(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedMaterials.length > 0 && (
            <>
              <Button variant="dark" className="me-3" onClick={handleSaveMaterials}>
                Сохранить все материалы
              </Button>
              <Button variant="dark" onClick={handleRemoveAllMaterials}>
                Удалить все
              </Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMaterial;
