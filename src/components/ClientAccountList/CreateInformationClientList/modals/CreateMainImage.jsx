import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { createMainImage, getOne } from '../../../../http/userApi';

const CreateMainImage = (props) => {
  const { id, show, setShow, setChange } = props;
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (id) {
      getOne(id).catch((error) => alert(error.response.data.message));
    }
  }, [id]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('image', image, image.name);

    data.append('otherDataKey', 'otherDataValue');

    createMainImage(id, data)
      .then((data) => {
        event.target.image.value = '';
        setShow(false);
        setChange((state) => !state);
      })
      .catch((error) => alert(error.response.data.message));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Добавить изображение</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate onSubmit={handleSubmit}>
          <Col>
            <Form.Control
              name="image"
              type="file"
              onChange={(e) => handleImageChange(e)}
              placeholder="Изображение..."
            />
          </Col>
          <Row className="mt-3">
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

export default CreateMainImage;
