import React from 'react';
import { getUserForBrigade } from '../../http/userApi';
import { getAllUserImageByUserId, deleteUserImage } from '../../http/userImageApi';
import CreateUserImage from './modals/CreateUserImage';
import { Button } from 'react-bootstrap';

function ImageProject({ projectId }) {
  const [user, setUser] = React.useState([]);
  const [userImages, setUserImages] = React.useState([]);
  const [imageCreateModal, setImageCreateModal] = React.useState(false);
  const [change, setChange] = React.useState(true);
  const [showImages, setShowImages] = React.useState(false);

  React.useEffect(() => {
    if (projectId !== null) {
      const fetchData = async () => {
        try {
          // Получаем пользователя для бригады
          const userId = await getUserForBrigade(projectId);
          setUser(userId);

          // Если пользователь найден, получаем его изображения
          if (userId) {
            const userImages = await getAllUserImageByUserId(userId);
            setUserImages(userImages);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [projectId, change]);

  const handleCreateImage = () => {
    setImageCreateModal(true);
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

  const toggleImagesVisibility = () => {
    setShowImages((prev) => !prev); // Переключаем состояние
  };

  return (
    <>
      <CreateUserImage
        userId={user}
        show={imageCreateModal}
        setShow={setImageCreateModal}
        setChange={setChange}
      />
      <div className="projectinfo__files">
        <div
          className="projectinfo__files-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="link"
              onClick={() => handleCreateImage(user)}
              style={{ color: 'black', fontSize: '16px', fontWeight: '600', padding: '0px' }}>
              Загрузить
            </Button>
          </div>
          <Button
            variant="link"
            onClick={toggleImagesVisibility}
            style={{ color: 'black', fontSize: '16px', fontWeight: '600', padding: '0px' }}>
            {showImages ? 'Скрыть' : 'Показать все'}
          </Button>

          {/* Условный рендеринг изображений */}
          {showImages &&
            userImages.map((image) => (
              <div key={image.id}>
                <div style={{ display: 'flex', marginBottom: '15px' }}>
                  <img
                    style={{ width: '100px', marginRight: '10px' }}
                    src={process.env.REACT_APP_IMG_URL + image.image}
                    alt="photos of works"
                  />
                  <div>
                    <div>{image.date}</div>
                    <div
                      className="delete__image"
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDeleteImage(image.id)}>
                      Удалить
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ImageProject;
