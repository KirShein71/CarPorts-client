import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchAllDetails } from '../../../http/detailsApi';
import { createProjectDetails } from '../../../http/projectDetailsApi';
import './styles.scss';

const defaultValue = {
  detail: '',
  detailName: '',
  quantity: '',
};
const defaultValid = {
  detail: null,
  detailName: null,
  quantity: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'detail') result.detail = value.detail.trim() !== '';
    if (key === 'detailName') result.detailName = value.detailName.trim() !== '';
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
  }
  return result;
};

const CreateDetails = (props) => {
  const { show, setShow, setChange, projectId } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [details, setDetails] = React.useState(null);
  const [selectedDetails, setSelectedDetails] = React.useState([]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setDetails(data));
  }, []);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleAddDetail = () => {
    if (value.detail && value.quantity) {
      const newDetail = {
        detailId: value.detail,
        detailName: value.detailName,
        quantity: value.quantity,
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
      formData.append('quantity', detail.quantity.trim());
      formData.append('detailName', detail.detailName);
      formData.append('detailId', detail.detailId);
      formData.append('projectId', projectId);
      return formData;
    });

    Promise.all(data.map(createProjectDetails))
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
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton>
        <Modal.Title>Добавить деталь</Modal.Title>
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
                name="quantity"
                value={value.quantity}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.quantity === true}
                isInvalid={valid.quantity === false}
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
                  <Form.Control disabled value={detail.quantity} className="mb-3" />
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

export default CreateDetails;
