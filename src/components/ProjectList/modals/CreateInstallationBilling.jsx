import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { fetchOneProject, createInstallationBilling } from '../../../http/projectApi';

const defaultValue = { installation_billing: '' };
const defaultValid = {
  installation_billing: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'installation_billing') result.installation_billing = value.installation_billing;
  }
  return result;
};

const CreateInstallationBilling = (props) => {
  const { id, show, setShow, setChange, scrollPosition } = props;
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetchOneProject(id)
        .then((data) => {
          const prod = {
            installation_billing: data.installation_billing.toString(),
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
  }, [show, id]);

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
    if (correct.installation_billing) {
      const data = new FormData();
      data.append('installation_billing', value.installation_billing);
      setIsLoading(true);
      createInstallationBilling(id, data)
        .then((data) => {
          const prod = {
            region: data.installation_billing,
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
        <Modal.Title>Добавьте расчетный срок монтажа</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 mt-4">
            <Col>
              <Form.Control
                name="installation_billing"
                value={value.installation_billing}
                onChange={(e) => handleInputChange(e)}
                isValid={valid.installation_billing === true}
                isInvalid={valid.installation_billing === false}
                placeholder="Расчетный срок монтажа"
              />
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

export default CreateInstallationBilling;
