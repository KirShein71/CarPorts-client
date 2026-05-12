import React from 'react';
import { createPortfolioProject } from '../../http/projectApi';
import { Button, Modal } from 'react-bootstrap';
import { getAllByProjectId, deletePortfolioImage } from '../../http/portfolioImageApi';
import CreatePortfolioImage from './modals/CreatePortfolioImage';
import CreatePortfolioNote from './modals/CreatePortfolioNote';

import './style.scss';

function ProjectPortfolio(props) {
  const { portfolio, portfolioNote, projectId, change, setChange } = props;
  const [isActive, setIsActive] = React.useState(portfolio === 'true');
  const [loading, setLoading] = React.useState(false);
  const [modalCreatePortfolioImage, setModalCreatePortfolioImage] = React.useState(false);
  const [portFolioImages, setPortfolioImages] = React.useState([]);
  const [portfolioImageChange, setPortfolioImageChange] = React.useState(true);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [modalCreatePortfolioNote, setModalCreatePortfolioNote] = React.useState(false);

  React.useEffect(() => {
    if (projectId && isActive) {
      getAllByProjectId(projectId)
        .then((data) => {
          setPortfolioImages(data);
        })
        .catch((error) => {
          console.error('Ошибка при загрузке изображений:', error);
        });
    }
  }, [portfolioImageChange, projectId, isActive]);

  React.useEffect(() => {
    setIsActive(portfolio === 'true');
  }, [portfolio]);

  const handleToggle = async () => {
    const newStatus = !isActive;
    const portfolioValue = newStatus ? 'true' : 'false';

    setLoading(true);

    try {
      // Отправляем запрос с portfolio: 'true' или 'false'
      await createPortfolioProject(projectId, {
        portfolio: portfolioValue,
      });

      // Обновляем локальное состояние
      setIsActive(newStatus);
      // Обновляем глобальное состояние
      setChange(!change);
    } catch (error) {
      console.error('Ошибка при обновлении портфолио:', error);
      alert(error.response?.data?.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalCreatePortfoioImage = () => {
    setModalCreatePortfolioImage(true);
  };

  const handleOpenModalCreatePortfoioNote = () => {
    setModalCreatePortfolioNote(true);
  };

  const handleDeleteClick = (id) => {
    const portofolioImage = portFolioImages.find((item) => item.id === id);
    setImageToDelete(portofolioImage);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deletePortfolioImage(imageToDelete.id)
        .then((data) => {
          setPortfolioImageChange(!portfolioImageChange);
          setDeleteModal(false);
          setImageToDelete(null);
        })
        .catch((error) => {
          setDeleteModal(false);
          setImageToDelete(null);
          alert(error.response.data.message);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setImageToDelete(null);
  };

  const handleToggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="project-portfolio">
      <CreatePortfolioImage
        show={modalCreatePortfolioImage}
        setShow={setModalCreatePortfolioImage}
        projectId={projectId}
        change={portfolioImageChange}
        setChange={setPortfolioImageChange}
      />
      <CreatePortfolioNote
        show={modalCreatePortfolioNote}
        setShow={setModalCreatePortfolioNote}
        id={projectId}
        change={change}
        setChange={setChange}
      />
      <Modal
        show={deleteModal}
        onHide={cancelDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#000' }}>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: '#000' }}>
          Вы уверены, что хотите удалить фотографию ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={cancelDelete}>
            Отмена
          </Button>
          <Button variant="dark" onClick={confirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="project-portfolio__content">
        <div className="project-portfolio__header">
          <span className="project-portfolio__title">Портфолио</span>

          <label className="portfolio-checkbox">
            <input type="checkbox" checked={isActive} onChange={handleToggle} disabled={loading} />
            <span className="portfolio-checkbox__slider"></span>
          </label>
        </div>
        <div className="project-portfolio__images">
          <div className="project-portfolio__images-title">Фотографии</div>
          <div className="project-portfolio__images-content">
            {portFolioImages.map((portFolioImage) => (
              <div className="project-portfolio__images-card">
                <div key={portFolioImage.id} className="project-portfolio__images-image">
                  <img
                    src={`${process.env.REACT_APP_IMG_URL}${portFolioImage.image}`}
                    alt={'фотогграфия'}
                  />
                </div>
                <Button
                  variant="dark"
                  className="project-portfolio__images-delete"
                  size="sm"
                  onClick={() => handleDeleteClick(portFolioImage.id)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="dark"
            className="project-portfolio__images-added"
            size="md"
            onClick={handleOpenModalCreatePortfoioImage}>
            Добавить файл
          </Button>
        </div>
        <div className="project-portfolio__note">
          <div className="project-portfolio__note-title">Описание проекта</div>
          <div className="project-portfolio__note-content">
            <pre className="project-portfolio__note-field">
              {isExpanded
                ? portfolioNote || 'Описание отсутствует'
                : portfolioNote
                  ? portfolioNote.slice(0, 255)
                  : 'Описание отсутствует'}
            </pre>
            {portfolioNote && portfolioNote.length > 255 && (
              <div className="project-portfolio__note-show" onClick={handleToggleText}>
                {isExpanded ? 'Скрыть' : 'Показать все...'}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button variant="dark" onClick={handleOpenModalCreatePortfoioNote}>
              Добавить описание
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPortfolio;
