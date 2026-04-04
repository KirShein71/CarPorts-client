import React from 'react';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { fetchAllDetails } from '../../../http/detailsApi';
import { createProjectDetails } from '../../../http/projectDetailsApi';

const defaultValue = {
  detail: '',
  detailName: '',
  quantity: '',
  color: '',
};
const defaultValid = {
  detail: null,
  detailName: null,
  quantity: null,
  color: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'detail') result.detail = value.detail.trim() !== '';
    if (key === 'detailName') result.detailName = value.detailName.trim() !== '';
    if (key === 'quantity') result.quantity = value.quantity.trim() !== '';
    if (key === 'color') result.color = value.color.trim() !== '';
  }
  return result;
};

const CreateProjectDetails = (props) => {
  const { show, setShow, setChange, projectId, existingDetailIds = [] } = props; // Добавляем пропс
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [details, setDetails] = React.useState(null);
  const [selectedDetails, setSelectedDetails] = React.useState([]);
  const [filteredDetails, setFilteredDetails] = React.useState([]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => {
      setDetails(data);

      // Фильтруем детали: оставляем только те, которых еще нет в проекте
      const filtered = data.filter((detail) => !existingDetailIds.includes(detail.id));
      setFilteredDetails(filtered);
    });
  }, [existingDetailIds]); // Зависимость от existingDetailIds

  const handleInputChange = (event) => {
    const regex = /^[0-9]*$/;
    if (regex.test(event.target.value)) {
      setValue({ ...value, [event.target.name]: event.target.value });
      setValid(isValid({ ...value, [event.target.name]: event.target.value }));
    }
  };

  const handleInputChangeColor = (event) => {
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
        color: value.color,
      };
      setSelectedDetails((prev) => [...prev, newDetail]);

      // Удаляем выбранную деталь из доступных
      setFilteredDetails((prev) => prev.filter((d) => d.id !== parseInt(value.detail)));

      setValue(defaultValue);
      setValid(defaultValid);
    }
  };

  const handleSaveDetails = () => {
    const newData = selectedDetails.filter((detail) => !detail.id);
    const data = newData.map((detail) => {
      const formData = new FormData();
      formData.append('quantity', detail.quantity.trim());
      formData.append('color', detail.color.trim());
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
    const removedDetail = selectedDetails[index];
    setSelectedDetails((prev) => prev.filter((_, i) => i !== index));

    // Возвращаем удаленную деталь в список доступных
    if (removedDetail && removedDetail.detailId && details) {
      const detailToRestore = details.find((d) => d.id === parseInt(removedDetail.detailId));
      if (detailToRestore) {
        setFilteredDetails((prev) => [...prev, detailToRestore].sort((a, b) => a.id - b.id));
      }
    }
  };

  const handleRemoveAllDetails = () => {
    // Возвращаем все выбранные детали в список доступных
    if (selectedDetails.length > 0 && details) {
      const restoredDetails = selectedDetails
        .map((detail) => details.find((d) => d.id === parseInt(detail.detailId)))
        .filter(Boolean);

      setFilteredDetails((prev) => [...prev, ...restoredDetails].sort((a, b) => a.id - b.id));
    }

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
              isInvalid={valid.detail === false}
              disabled={filteredDetails.length === 0} // Деактивируем если нет доступных деталей
            >
              <option value="">
                {filteredDetails.length === 0 ? 'Все детали уже добавлены' : 'Детали'}
              </option>
              {filteredDetails
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </Form.Select>
            {filteredDetails.length === 0 && (
              <p className="text-muted mt-2">Все доступные детали уже добавлены в этот проект.</p>
            )}
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
                disabled={!value.detail} // Деактивируем если не выбрана деталь
              />
            </Col>
          </Row>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="color"
                value={value.color}
                onChange={(e) => handleInputChangeColor(e)}
                isValid={valid.color === true}
                isInvalid={valid.color === false}
                placeholder="Цвет деталей"
                className="mb-3"
                disabled={!value.detail} // Деактивируем если не выбрана деталь
              />
            </Col>
          </Row>
          <Col>
            <Button
              variant="dark"
              className="mb-3"
              onClick={handleAddDetail}
              disabled={!value.detail || !value.quantity}>
              Добавить
            </Button>
          </Col>

          {selectedDetails.length > 0 && (
            <>
              <h6 className="mt-3">Выбранные детали:</h6>
              {selectedDetails.map((detail, index) => (
                <div key={index}>
                  <Row className="mb-3 align-items-center">
                    <Col xs={5}>
                      <Form.Control disabled value={detail.detailName} />
                    </Col>
                    <Col xs={3}>
                      <Form.Control disabled value={detail.quantity} />
                    </Col>
                    <Col xs={4}>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveDetail(index)}
                        size="sm">
                        Удалить
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

              <div className="d-flex gap-2 mt-3">
                <Button variant="dark" onClick={handleSaveDetails}>
                  Сохранить все детали
                </Button>
                <Button variant="outline-danger" onClick={handleRemoveAllDetails}>
                  Удалить все
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProjectDetails;
