import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, createRegion } from '../../../http/projectApi';
import { getAllRegion } from '../../../http/regionApi';

const defaultValue = { region: '' };
const defaultValid = {
  region: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'region') result.region = value.region;
  }
  return result;
};

const CreateRegion = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [regions, setRegions] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);

  React.useEffect(() => {
    if (show) {
      Promise.all([fetchOneProject(id), getAllRegion()])
        .then(([projectData, regionsData]) => {
          const prod = {
            regionId: projectData.regionId,
          };
          setValue(prod);
          setValid(isValid(prod));
          setRegions(regionsData);
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

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleCloseModal = () => {
    setShow(false);
    window.scrollTo(0, scrollPosition);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const correct = isValid(value);
    setValid(correct);
    if (correct.region) {
      const data = new FormData();
      data.append('regionId', value.region);
      createRegion(id, data)
        .then((data) => {
          const prod = {
            region: data.region,
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
        <Modal.Title>Добавьте регион</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Select
                name="region"
                value={value.region}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.region === true}
                isInvalid={valid.region === false}>
                <option value="">Регион</option>
                {regions &&
                  regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.region}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
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

export default CreateRegion;
