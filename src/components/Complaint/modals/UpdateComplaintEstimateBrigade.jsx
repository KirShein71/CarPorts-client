import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchBrigades } from '../../../http/bragadeApi';
import {
  getAllEstimateForBrigadeComplaint,
  updateBrigadeForComplaint,
} from '../../../http/complaintEstimateApi';

const defaultValue = { brigade: '' };
const defaultValid = {
  brigade: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'brigade') result.brigade = value.brigade;
  }
  return result;
};

const UpdateComplaintEstimateBrigade = (props) => {
  const { id, complaint, show, setShow, setChange, regionId } = props;
  const [brigades, setBrigades] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      Promise.all([getAllEstimateForBrigadeComplaint(id, complaint), fetchBrigades()])
        .then(([estimateData, brigadesData]) => {
          const prod = {
            brigadeId: estimateData.brigadeId,
          };
          setValue(prod);
          setValid(isValid(prod));
          setBrigades(brigadesData);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [id, complaint]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.brigade) {
      const data = new FormData();
      data.append('brigadeId', value.brigade);
      setIsLoading(true);
      updateBrigadeForComplaint(id, complaint, data)
        .then((data) => {
          const prod = {
            brigade: data.brigade,
          };
          setValue(prod);
          setValid(isValid(prod));
          setChange((state) => !state);
          setShow(false);
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
        <Modal.Title>Назанчить новую бригаду</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="brigade"
                value={value.brigade}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.brigade === true}
                isInvalid={valid.brigade === false}>
                <option value="">Бригада</option>
                {brigades &&
                  brigades
                    .filter((brigade) => brigade.regionId === regionId)
                    .map((brigade) => (
                      <option key={brigade.id} value={brigade.id}>
                        {brigade.name}
                      </option>
                    ))}
              </Form.Select>
            </Col>
          </Row>
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

export default UpdateComplaintEstimateBrigade;
