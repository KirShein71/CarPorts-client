import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchAllDetails } from '../../../http/detailsApi';
import { createShipmentDetails } from '../../../http/shipmentDetailsApi';

const defaultValue = {
  detail: '',
  detailName: '',
  shipment_quantity: '',
};
const defaultValid = {
  detail: null,
  detailName: null,
  shipment_quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'detail') result.detail = value.detail.trim() !== '';
    if (key === 'detailName') result.detailName = value.detailName.trim() !== '';
    if (key === 'shipment_quantity')
      result.shipment_quantity = value.shipment_quantity.trim() !== '';
  }
  return result;
};

const CreateShipmentDetails = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [details, setDetails] = React.useState(null);
  const [selectedDetails, setSelectedDetails] = React.useState([]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setDetails(data));
  }, []);

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleAddDetail = () => {
    if (value.detail && value.shipment_quantity) {
      const newDetail = {
        detailId: value.detail,
        detailName: value.detailName,
        shipment_quantity: value.shipment_quantity,
      };
      setSelectedDetails((prev) => [...prev, newDetail]);
      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleSaveDetails = () => {
    const newData = selectedDetails.filter((detail) => !detail.id);
    const data = newData.map((detail) => {
      const formData = new FormData();
      formData.append('shipment_quantity', detail.shipment_quantity);
      formData.append('detailName', detail.detailName);
      formData.append('detailId', detail.detailId);
      formData.append('projectId', projectId);
      formData.append('shipment_date', new Date().toISOString());
      return formData;
    });

    Promise.all(data.map(createShipmentDetails))
      .then(() => {
        setSelectedDetails([]);
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  const handleDetailChange = (e) => {
    const detailId = e.target.value;
    const detailName = e.target.options[e.target.selectedIndex].text;
    setValue((prevValue) => ({
      ...prevValue,
      detail: detailId,
      detailName: detailName,
    }));
  };

  const handleRemoveDetail = (index) => {
    setSelectedDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAllDetails = () => {
    setSelectedDetails([]);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь на отгрузку</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Col>
            <Form.Select
              name="detail"
              value={value.detail}
              onChange={handleDetailChange}
              isValid={valid.detail === true}
              isInvalid={valid.detail === false}>
              <option value="">Детали</option>
              {details &&
                details
                  .sort((a, b) => a.id - b.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
            </Form.Select>
          </Col>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="shipment_quantity"
                value={value.shipment_quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.shipment_quantity === true}
                isInvalid={valid.shipment_quantity === false}
                placeholder="Количество деталей"
                className="mb-3"
              />
            </Col>
          </Row>
          <Col>
            <Button className="mb-3" onClick={handleAddDetail}>
              Добавить
            </Button>
          </Col>
          {selectedDetails.map((detail, index) => (
            <div key={index}>
              <Row className="mb-3">
                <Col>
                  <Form.Control disabled value={detail.detailName} className="mb-3" />
                </Col>
                <Col>
                  <Form.Control disabled value={detail.shipment_quantity} className="mb-3" />
                </Col>
                <Col>
                  <Button variant="danger" onClick={() => handleRemoveDetail(index)}>
                    Удалить
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          {selectedDetails.length > 0 && (
            <>
              <Button className="me-3" onClick={handleSaveDetails}>
                Сохранить все детали
              </Button>
              <Button onClick={handleRemoveAllDetails}>Удалить все</Button>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateShipmentDetails;
