import React from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getOneAccount } from '../../../http/userApi';
import { getAllUserImageByUserId, deleteUserImage } from '../../../http/userImageApi';
import { getAllUserFileByUserId, deleteUserFile } from '../../../http/userFileApi';
import { Spinner, Table, Button } from 'react-bootstrap';
import CreateManager from './modals/CreateManager';
import CreateBrigade from './modals/CreateBrigade';
import CreateImage from './modals/CreateImages';
import CreateFile from './modals/CreateFile';
import CreateMainImage from './modals/CreateMainImage';

function CreateInformatoinClientList() {
  const { id } = useParams();
  const [user, setUser] = React.useState();
  const [change, setChange] = React.useState(true);
  const [managerCreateModal, setManagerCreateModal] = React.useState(false);
  const [brigadeCreateModal, setBrigadeCreateModal] = React.useState(false);
  const [userImages, setUserImages] = React.useState([]);
  const [imageCreateModal, setImageCreateModal] = React.useState(false);
  const [userFiles, setUserFiles] = React.useState([]);
  const [fileCreateModal, setFileCreateModal] = React.useState(false);
  const [createMainImageModal, setCreateMainImageModal] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    getOneAccount(id).then((data) => setUser(data));
    getAllUserImageByUserId(id).then((data) => setUserImages(data));
    getAllUserFileByUserId(id).then((data) => setUserFiles(data));
  }, [id, change]);

  const handleCreateManager = (data) => {
    setUser(data);
    setManagerCreateModal(true);
  };

  const handleCreateBrigade = (data) => {
    setUser(data);
    setBrigadeCreateModal(true);
  };

  const handleCreateImage = (data) => {
    setUser(data);
    setImageCreateModal(true);
  };

  const handleCreateFile = (data) => {
    setUser(data);
    setFileCreateModal(true);
  };

  const handleCreateMainImage = (id) => {
    setUser(id);
    setCreateMainImageModal(true);
  };

  const handleDeleteImage = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить изображение?');
    if (confirmed) {
      deleteUserImage(id)
        .then((data) => {
          setChange(!change);
          // Удалить удаленное изображение из списка images
          const updatedImages = userImages.filter((image) => image.id !== id);
          setUserImages(updatedImages);
          alert('Изображение удалено');
        })
        .catch((error) => alert(error.response.data.message));
    }
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

  const handleDeleteFile = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить файл?');
    if (confirmed) {
      deleteUserFile(id)
        .then((data) => {
          setChange(!change);
          const updatedFiles = userFiles.filter((file) => file.id !== id);
          setUserImages(updatedFiles);
          alert('Файд удален');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const addToPersonalAccount = (id) => {
    navigate(`/viewingpersonalaccount/${id}`, { state: { from: location.pathname } });
  };

  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="information" style={{ marginBottom: '25px' }}>
      <div className="header">
        <Link to="/clientaccount">
          <img className="header__icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Добавление информация для личного кабинета клиента</h1>
      </div>
      <CreateManager
        data={user}
        show={managerCreateModal}
        setShow={setManagerCreateModal}
        setChange={setChange}
      />
      <CreateBrigade
        data={user}
        show={brigadeCreateModal}
        setShow={setBrigadeCreateModal}
        setChange={setChange}
      />
      <CreateImage
        userId={user}
        show={imageCreateModal}
        setShow={setImageCreateModal}
        setChange={setChange}
      />
      <CreateFile
        userId={user}
        show={fileCreateModal}
        setShow={setFileCreateModal}
        setChange={setChange}
      />
      <CreateMainImage
        id={id}
        show={createMainImageModal}
        setShow={setCreateMainImageModal}
        setChange={setChange}
      />
      <div className="information__main-image">
        <div
          className="information__main-image-title"
          style={{ marginTop: '25px', color: 'rgb(7, 7, 7)', fontSize: '22px', fontWeight: '600' }}>
          Изображение на главную
        </div>
        <Button variant="dark" className="mt-3" size="md" onClick={() => handleCreateMainImage(id)}>
          Добавить изображение
        </Button>
        <div className="information__main-image-image">
          <img
            style={{ width: '40%', marginTop: '10px' }}
            src={process.env.REACT_APP_IMG_URL + user.image}
            alt="main"
          />
        </div>
      </div>
      <div className="information__manager">
        <div
          className="information__manager-title"
          style={{ marginTop: '25px', color: 'rgb(7, 7, 7)', fontSize: '22px', fontWeight: '600' }}>
          Менеджер проекта
        </div>
        <Button variant="dark" className="mt-3" size="md" onClick={() => handleCreateManager(id)}>
          Добавить менеджера
        </Button>
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Менеджер</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {userData.employeeId === 4 && userData.managerProjectId === null
                  ? 'Алла Ким'
                  : userData.manager_project.name}
              </td>
              <td>
                {userData.employeeId === 4 && userData.managerProjectId === null
                  ? '89164874942'
                  : userData.manager_project.phone}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="information__brigade">
        <div
          className="information__brigade-title"
          style={{ marginTop: '25px', color: 'rgb(7, 7, 7)', fontSize: '22px', fontWeight: '600' }}>
          Бригада
        </div>
        <Button variant="dark" className="mt-3" size="md" onClick={() => handleCreateBrigade(id)}>
          Добавить бригаду
        </Button>
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Бригада</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user.brigade?.name}</td>
              <td>{user.brigade?.phone}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="information__image">
        <div
          className="information__image-title"
          style={{ marginTop: '25px', color: 'rgb(7, 7, 7)', fontSize: '22px', fontWeight: '600' }}>
          Изображения хода работ
        </div>
        <Button variant="dark" className="mt-3" size="md" onClick={() => handleCreateImage(id)}>
          Добавить изображение
        </Button>
        <div
          className="infоrmation__image-content"
          style={{
            marginTop: '25px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: '5px',
            gridRowGap: '5px',
          }}>
          {userImages.map((image) => (
            <div key={image.id}>
              <div className="information__image-card">
                <img
                  style={{ width: '70%', marginBottom: '10px' }}
                  src={process.env.REACT_APP_IMG_URL + image.image}
                  alt="photos of works"
                />
                <div>{image.date}</div>
                <div
                  className="delete__image"
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={() => handleDeleteImage(image.id)}>
                  Удалить
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="information__file">
        <div
          className="information__file-title"
          style={{ marginTop: '25px', color: 'rgb(7, 7, 7)', fontSize: '22px', fontWeight: '600' }}>
          Добавить файлы
        </div>
        <Button variant="dark" className="mt-3" size="md" onClick={() => handleCreateFile(id)}>
          Добавить файл
        </Button>
        <div className="information__file-content" style={{ marginTop: '25px' }}>
          {userFiles.map((file) => (
            <div className="information__file-card" style={{ display: 'flex' }} key={file.id}>
              <div
                onClick={() => handleDownloadFile(process.env.REACT_APP_IMG_URL + file.file)}
                style={{ color: 'rgb(7, 7, 7)', fontWeight: '600' }}>
                {file.name}
              </div>
              <div
                className="delete__file"
                style={{ color: 'red', cursor: 'pointer', marginLeft: '7px' }}
                onClick={() => handleDeleteFile(file.id)}>
                Удалить
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="dark"
          className="information__viewing"
          onClick={() => addToPersonalAccount(id)}>
          Посмотреть личный кабинет
        </Button>
      </div>
    </div>
  );
}

export default CreateInformatoinClientList;
