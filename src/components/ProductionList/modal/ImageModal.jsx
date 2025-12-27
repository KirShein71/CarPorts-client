import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import { deleteAntypical, getAllAntypiclasForProject } from '../../../http/antypicalApi';
import CreateName from '../../ProductionOrders/modals/CreateName';
import CreateColor from '../../ProductionOrders/modals/CreateColor';
import CreateAntypicalsQuantity from '../../ProductionOrders/modals/CreateAntypicalsQuantity';

function ImageModal(props) {
  const { show, setShow, id } = props;
  const [antypicalsDetailProject, setAntypicalsDetailProject] = React.useState([]);
  const [change, setChange] = React.useState(true);
  const [openModalCreateAntypicalColor, setOpenModalCreateAntypicalColor] = React.useState(false);
  const [openModalCreateAntypicalName, setOpenModalCreateAntypicalName] = React.useState(false);
  const [openModalCreateAntypicalsQuantity, setOpenModalCreateAntypicalsQuantity] =
    React.useState(false);
  const [antypicalId, setAntypicalId] = React.useState(null);

  React.useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const data = await getAllAntypiclasForProject(id);
          setAntypicalsDetailProject(data);
        } catch (error) {
          console.error('Ошибка при загрузке нетипичных деталей:', error);
          // Можно добавить уведомление пользователю
          if (error.response?.data?.message) {
            alert(`Ошибка: ${error.response.data.message}`);
          }
        }
      };

      fetchData();
    }
  }, [show, id, change]);

  const handleCreateAntypicalName = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalName(true);
  };

  const handleCreateAntypicalColor = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalColor(true);
  };

  const handleCreateAntypicalsQuantity = (id) => {
    setAntypicalId(id);
    setOpenModalCreateAntypicalsQuantity(true);
  };

  const handleDownloadFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error('Ошибка при скачивании файла:', error));
  };

  const handleDeleteAntypical = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить изображение?');
    if (confirmed) {
      deleteAntypical(id)
        .then((data) => {
          setChange(!change);
          const updatedImages = images.filter((image) => image.id !== id);
          setImages(updatedImages);
          alert('Изображение удалено');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  return (
    <>
      <CreateName
        show={openModalCreateAntypicalName}
        setShow={setOpenModalCreateAntypicalName}
        setChange={setChange}
        id={antypicalId}
      />
      <CreateColor
        show={openModalCreateAntypicalColor}
        setShow={setOpenModalCreateAntypicalColor}
        setChange={setChange}
        id={antypicalId}
      />
      <CreateAntypicalsQuantity
        show={openModalCreateAntypicalsQuantity}
        setShow={setOpenModalCreateAntypicalsQuantity}
        setChange={setChange}
        id={antypicalId}
      />
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изображения</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="mt-2" bordered>
            <thead>
              <tr>
                <th>Деталь</th>
                <th>Количество</th>
                <th>Цвет</th>
                <th>Файл</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {antypicalsDetailProject.map((antyProDetial) => (
                <React.Fragment key={antyProDetial.id}>
                  <tr>
                    <td onClick={() => handleCreateAntypicalName(antyProDetial.id)}>
                      {antyProDetial.name || ''}
                    </td>
                    <td onClick={() => handleCreateAntypicalsQuantity(antyProDetial.id)}>
                      {antyProDetial.antypicals_quantity || ''}
                    </td>
                    <td onClick={() => handleCreateAntypicalColor(antyProDetial.id)}>
                      {antyProDetial.color}
                    </td>
                    <td
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        handleDownloadFile(process.env.REACT_APP_IMG_URL + antyProDetial.image)
                      }>
                      Файл
                    </td>
                    <td>
                      <img
                        style={{ display: 'block', margin: '0 auto' }}
                        onClick={() => handleDeleteAntypical(antyProDetial.id)}
                        src="./img/delete.png"
                        alt="удалить"
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageModal;
