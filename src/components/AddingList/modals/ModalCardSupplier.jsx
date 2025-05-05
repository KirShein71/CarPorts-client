import React from 'react';
import { fetchSupplier, updateSupplier } from '../../../http/supplierApi';
import { getAllRegion } from '../../../http/regionApi';
import { Modal, Row, Col, Table, Form } from 'react-bootstrap';

const defaultValue = {
  name: '',
  contact: '',
  address: '',
  shipment: '',
  navigator: '',
  note: '',
  coordinates: '',
  regionId: '',
};
const defaultValid = {
  name: null,
  contact: null,
  address: null,
  shipment: null,
  navigator: null,
  note: null,
  coordinates: null,
  regionId: null,
};

const isValid = (value) => {
  const result = {};
  for (let key in value) {
    if (key === 'name') result.name = value.name.trim() !== '';
    if (key === 'contact') result.contact = value.contact.trim() !== '';
    if (key === 'address') result.address = value.address.trim() !== '';
    if (key === 'shipment') result.shipment = value.shipment.trim() !== '';
    if (key === 'navigator') result.navigator = value.navigator.trim() !== '';
    if (key === 'note') result.note = value.note.trim() !== '';
    if (key === 'coordinates') result.coordinates = value.coordinates.trim() !== '';
    if (key === 'regionId') result.regionId = value.regionId;
  }
  return result;
};

function ModalCardSupplier({ show, setShow, id, change, setChange }) {
  const [supplier, setSupplier] = React.useState([]);
  const [value, setValue] = React.useState(defaultValue);
  const [valid, setValid] = React.useState(defaultValid);
  const [isLoading, setIsLoading] = React.useState(false);
  const [updateClick, setUpdateClick] = React.useState(false);
  const [editingField, setEditingField] = React.useState(null);
  const [regions, setRegions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!show) return;

      try {
        // Загружаем данные поставщика и регионы параллельно
        const [supplierData, regionsData] = await Promise.all([fetchSupplier(id), getAllRegion()]);

        // Проверка данных поставщика
        if (!supplierData) {
          throw new Error('Данные поставщика не получены');
        }

        const requiredFields = ['name', 'contact', 'address'];
        const isValidSupplier = requiredFields.every(
          (field) => supplierData[field] !== undefined && supplierData[field] !== null,
        );

        if (!isValidSupplier) {
          throw new Error('Некорректные данные поставщика');
        }

        // Обновляем состояние
        setSupplier(supplierData);

        const prod = {
          name: supplierData.name,
          contact: supplierData.contact,
          address: supplierData.address,
          shipment: supplierData.shipment || '',
          navigator: supplierData.navigator || '',
          note: supplierData.note || '',
          coordinates: supplierData.coordinates || '',
          regionId: supplierData.regionId || '',
        };

        setValue(prod);
        setValid(isValid(prod));

        // Проверка данных регионов
        if (!regionsData || !Array.isArray(regionsData)) {
          console.warn('Некорректные данные регионов');
        } else {
          setRegions(regionsData);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);

        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('Произошла ошибка при загрузке данных');
        }
      }
    };

    fetchData();
  }, [show, change]);

  const handleInputChange = (event) => {
    const data = { ...value, [event.target.name]: event.target.value };
    setValue(data);
    setValid(isValid(data));
  };

  const handleSubmit = async (event) => {
    // Если event не передан (при вызове из handleSaveUpdate), создаем пустой объект
    event?.preventDefault();
    const correct = isValid(value);
    setValid(correct);

    const data = new FormData();
    data.append('name', value.name.trim());
    data.append('contact', value.contact.trim());
    data.append('address', value.address.trim());
    data.append('shipment', value.shipment.trim());
    data.append('navigator', value.navigator.trim());
    data.append('note', value.note.trim());
    data.append('coordinates', value.coordinates.trim());
    data.append('regionId', value.regionId);

    setIsLoading(true);
    updateSupplier(id, data)
      .then((data) => {
        const prod = {
          name: data.name.toString(),
          contact: data.contact.toString(),
          address: data.address.toString(),
          shipment: data.shipment.toString(),
          navigator: data.navigator.toString(),
          note: data.note.toString(),
          coordinates: data.coordinates.toString(),
          regionId: data.regionId.toString(),
        };
        setValue(prod);
        setValid(isValid(prod));
        setChange((state) => !state);
        setUpdateClick(false); // Добавляем закрытие режима редактирования
      })
      .catch((error) => alert(error.response?.data?.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClickUpdate = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleSaveUpdate = (e, fieldName) => {
    e?.preventDefault();
    handleSubmit(e);
    setEditingField(null); // Закрываем редактирование после сохранения
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton className="new-project__title">
        Карточка поставщика
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Table bordered>
              <tbody>
                {[supplier].map((sup) => [
                  <tr key={`${sup.id}-name`}>
                    <td>
                      <strong>Название</strong>
                    </td>
                    <td>
                      {editingField === 'name' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="name"
                          value={value.name}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.name === true}
                          isInvalid={valid.name === false}
                        />
                      ) : (
                        sup.name
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'name'
                            ? handleSaveUpdate(e, 'name')
                            : handleClickUpdate('name')
                        }
                        src={editingField === 'name' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'name' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-contact`}>
                    <td>
                      <strong>Контакты</strong>
                    </td>
                    <td>
                      {editingField === 'contact' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="contact"
                          value={value.contact}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.contact === true}
                          isInvalid={valid.contact === false}
                        />
                      ) : (
                        sup.contact
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'contact'
                            ? handleSaveUpdate(e, 'contact')
                            : handleClickUpdate('contact')
                        }
                        src={editingField === 'contact' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'contact' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-address`}>
                    <td>
                      <strong>Адрес</strong>
                    </td>
                    <td>
                      {editingField === 'address' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="address"
                          value={value.address}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.address === true}
                          isInvalid={valid.address === false}
                        />
                      ) : (
                        sup.address
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'address'
                            ? handleSaveUpdate(e, 'address')
                            : handleClickUpdate('address')
                        }
                        src={editingField === 'address' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'address' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-shipment`}>
                    <td>
                      <strong>Вид погрузки</strong>
                    </td>
                    <td>
                      {editingField === 'shipment' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="shipment"
                          value={value.shipment}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.shipment === true}
                          isInvalid={valid.shipment === false}
                        />
                      ) : (
                        sup.shipment
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'shipment'
                            ? handleSaveUpdate(e, 'shipment')
                            : handleClickUpdate('shipment')
                        }
                        src={editingField === 'shipment' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'shipment' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-note`}>
                    <td>
                      <strong>Примечание</strong>
                    </td>
                    <td>
                      {editingField === 'note' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="note"
                          value={value.note}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.note === true}
                          isInvalid={valid.note === false}
                        />
                      ) : (
                        sup.note
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'note'
                            ? handleSaveUpdate(e, 'note')
                            : handleClickUpdate('note')
                        }
                        src={editingField === 'note' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'note' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-navigator`}>
                    <td>
                      <strong>Навигатор</strong>
                    </td>
                    <td>
                      {editingField === 'navigator' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="navigator"
                          value={value.navigator}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.navigator === true}
                          isInvalid={valid.navigator === false}
                        />
                      ) : (
                        sup.navigator
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'navigator'
                            ? handleSaveUpdate(e, 'navigator')
                            : handleClickUpdate('navigator')
                        }
                        src={editingField === 'navigator' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'navigator' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-coordinates`}>
                    <td>
                      <strong>Координаты</strong>
                    </td>
                    <td>
                      {editingField === 'coordinates' ? (
                        <Form.Control
                          onSubmit={handleSubmit}
                          name="coordinates"
                          value={value.coordinates}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.coordinates === true}
                          isInvalid={valid.coordinates === false}
                        />
                      ) : (
                        sup.coordinates
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'coordinates'
                            ? handleSaveUpdate(e, 'coordinates')
                            : handleClickUpdate('coordinates')
                        }
                        src={editingField === 'coordinates' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'coordinates' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                  <tr key={`${sup.id}-region`}>
                    <td>
                      <strong>Регион</strong>
                    </td>
                    <td>
                      {editingField === 'region' ? (
                        <Form.Select
                          name="regionId"
                          value={value.regionId}
                          onChange={(e) => handleInputChange(e)}
                          isValid={valid.regionId === true}
                          isInvalid={valid.regionId === false}>
                          <option value="">Регион</option>
                          {regions &&
                            regions.map((region) => (
                              <option key={region.id} value={region.id}>
                                {region.region}
                              </option>
                            ))}
                        </Form.Select>
                      ) : sup.regionId === 2 ? (
                        'МО'
                      ) : (
                        'Спб'
                      )}
                      <img
                        onClick={(e) =>
                          editingField === 'region'
                            ? handleSaveUpdate(e, 'region')
                            : handleClickUpdate('region')
                        }
                        src={editingField === 'region' ? './img/save.png' : './img/update.png'}
                        alt={editingField === 'region' ? 'save' : 'update'}
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer', marginLeft: '5px' }}
                      />
                    </td>
                  </tr>,
                ])}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCardSupplier;
