import React from 'react';
import { deleteUserFile } from '../../http/userFileApi';
import CreateFile from '../ClientAccountList/CreateInformationClientList/modals/CreateFile';
import { Button } from 'react-bootstrap';

function UserFile({ project, change, setChange, userId }) {
  const [fileCreateModal, setFileCreateModal] = React.useState(false);

  console.log(userId);

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
          const updatedFiles = project.userFile?.filter((file) => file.id !== id);

          alert('Файд удален');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const handleCreateFile = () => {
    setFileCreateModal(true);
  };

  return (
    <div className="user-file">
      <CreateFile
        userId={userId}
        show={fileCreateModal}
        setShow={setFileCreateModal}
        setChange={setChange}
      />
      <div className="user-file__content">
        {project &&
          project.userFile?.map((usFile) => (
            <div key={usFile.id} className="user-file__item">
              <div
                className="user-file__name"
                onClick={() => handleDownloadFile(process.env.REACT_APP_IMG_URL + usFile.file)}>
                {usFile.name}
              </div>
              <div className="user-file__delete" onClick={() => handleDeleteFile(usFile.id)}>
                Удалить
              </div>
            </div>
          ))}
        <Button
          style={{ display: 'block', margin: '0 auto' }}
          variant="dark"
          className="mt-3"
          size="md"
          onClick={() => handleCreateFile()}>
          Добавить файл
        </Button>
      </div>
    </div>
  );
}

export default UserFile;
