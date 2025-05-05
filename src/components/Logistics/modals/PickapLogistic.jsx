import React from 'react';
import { Modal, Col, Row } from 'react-bootstrap';

function PickapLogistic(props) {
  const { pickapData, show, setShow } = props;
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton className="new-project__title">
        Логистика
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div className="pickap-logistic">
              <div className="pickap-logistic__content">
                {pickapData.map((picData) => (
                  <div key={picData} className="pickap-logistic__item">
                    <div className="pickap-logistic__item-supplier">{picData.name}</div>
                    <div className="pickap-logistic__item-contact">{picData.contact}</div>
                    <div className="pickap-logistic__item-address">{picData.address}</div>
                    <div className="pickap-logistic__item-shipment">{picData.shipment}</div>
                    <div className="pickap-logistic__item-note">{picData.note}</div>
                    <a className="pickap-logistic__item-naviagtor">{picData.navigator}</a>
                    <div className="pickap-logistic__item-coordinates">{picData.coordinates}</div>
                    <div className="pickap-logistic__item-weight">Вес: {picData.weight} кг</div>
                    <div className="pickap-logistic__item-dimensions">
                      Длина: {picData.dimensions} м
                    </div>
                    {picData.projects.map((picProject) => (
                      <div key={picProject.id} className="pickap-logistic__item-project">
                        {picProject.name} ({picProject.region === 2 ? 'МО' : 'Спб'})
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default PickapLogistic;
