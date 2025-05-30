import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchMaterials } from '../../../http/materialsApi';
import {
  fetchOneProjectMaterials,
  updateMaterialIdInOrderMaterials,
} from '../../../http/projectMaterialsApi';

const defaultValue = {
  material: '',
  supplier: '',
  materialName: '',
};
const defaultValid = {
  material: null,
  supplier: null,
  materialName: null,
};

const isValid = (value) => {
  const result = {};
  const pattern = /^[1-9][0-9]*$/;
  for (let key in value) {
    if (key === 'material') result.material = pattern.test(value.material);
    if (key === 'supplier') result.supplier = pattern.test(value.supplier);
    if (key === 'materialName') result.materialName = pattern.test(value.materialName);
  }
  return result;
};

const UpdateMaterialid = (props) => {
  const { show, setShow, setChange, id, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [materials, setMaterials] = React.useState([]);

  React.useEffect(() => {
    fetchMaterials().then((data) => setMaterials(data));
  }, []);

  React.useEffect(() => {
    if (show) {
      fetchOneProjectMaterials(id)
        .then((data) => {
          const prod = {
            materialId: data.materialId.toString(),
            supplierId: data.supplierId.toString(),
            materialName: data.materialName.toString(),
          };
          setValue(prod);
          setValid(isValid(prod));
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [show]);

  const handleInputChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const materialName = selectedOption.text;
    const materialId = e.target.value;
    const supplierId = selectedOption.getAttribute('data-supplier-id');

    setValue((prevValue) => ({
      ...prevValue,
      material: materialId,
      supplier: supplierId,
      materialName: materialName,
    }));
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('materialId', value.material);
    data.append('supplierId', value.supplier ? value.supplier : 0);
    data.append('materialName', value.materialName);

    try {
      const response = await updateMaterialIdInOrderMaterials(id, data);
      const prod = {
        material: response.material.toString(),
        supplier: response.supplier.toString(),
        materialName: response.materialName.toString(),
      };
      setValue(prod);
      setValid(isValid(prod));
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error('An error occurred:', error);
      }
    }

    handleCloseModal();
    setChange((state) => !state);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__procurement">
      <Modal.Header closeButton>
        <Modal.Title>Изменить материал</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-dialog-scrollable">
        <Form noValidate onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Select
              name="material"
              value={value.material}
              onChange={(e) => handleInputChange(e)}
              isValid={valid.material === true}
              isInvalid={valid.material === false}>
              <option value="">Материалы</option>
              {materials &&
                materials.map((item) => (
                  <option key={item.id} value={item.id} data-supplier-id={item.supplierId}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
          <Row>
            <Col>
              <Button variant="dark" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateMaterialid;
