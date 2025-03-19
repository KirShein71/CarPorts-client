import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getOneComplaint } from '../../http/complaintApi';
import { deleteComplaintImage } from '../../http/complaintImageApi';
import { Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import Information from './Information';
import Images from './Images';
import UpdateNote from './modals/UpdateNote';
import CreateImages from './modals/CreateImages';
import ComplaintEstimate from './ComplaintEstimate';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

function ComplaintInfo() {
  const { id } = useParams();
  const [complaintProject, setComplaintProject] = React.useState();
  const [change, setChange] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('information');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [openModalUpdateNote, setOpenModalUpdateNote] = React.useState(false);
  const [openModalCreateImages, setOpenModalCreateImages] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    getOneComplaint(id).then((data) => setComplaintProject(data));
  }, [change, id]);

  const hadleUpdateNote = () => {
    setOpenModalUpdateNote(true);
  };

  const hadleCreateImages = () => {
    setOpenModalCreateImages(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeleteImage = (id) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить изображение?');
    if (confirmed) {
      deleteComplaintImage(id)
        .then((data) => {
          setChange(!change);
          alert('Изображение удалено');
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  if (!complaintProject) {
    return <Spinner />;
  }

  return (
    <div className="complaint-info">
      <UpdateNote
        id={id}
        show={openModalUpdateNote}
        setShow={setOpenModalUpdateNote}
        setChange={setChange}
      />
      <CreateImages
        complaintId={id}
        show={openModalCreateImages}
        setShow={setOpenModalCreateImages}
        setChange={setChange}
      />
      <div className="header">
        <Link to={location.state.from}>
          <img className="header__icon" src="../img/back.png" alt="back" />
        </Link>
        <h1 className="header__title">Подробная информация</h1>
      </div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Главная</Breadcrumb.Item>
        <Breadcrumb.Item href="/complaint">Рекламация</Breadcrumb.Item>
        <Breadcrumb.Item active>Подробная информация</Breadcrumb.Item>
      </Breadcrumb>
      <div className="complaint-info__content">
        <div className="complaint-info__image">
          {complaintProject &&
          complaintProject.complaintUser &&
          (complaintProject.complaintUser.length === 0 ||
            complaintProject.complaintUser.every((user) => !user.image)) ? (
            <img src="../img/fon.jpg" alt="image__company" />
          ) : (
            complaintProject.complaintUser &&
            complaintProject.complaintUser.map(
              (user) =>
                user.image && (
                  <img key={user.id} src={process.env.REACT_APP_IMG_URL + user.image} alt="main" />
                ),
            )
          )}
        </div>
        {complaintProject.complaintProject &&
          complaintProject.complaintProject.map((project) => (
            <div key={project.id} className="complaint-info__information">
              <div className="complaint-info__number">{project.number}</div>
              <div className="complaint-info__name">{project.name}</div>
              <div className="complaint-info__date">
                <Moment format="DD.MM.YYYY">{complaintProject && complaintProject.date}</Moment>
              </div>
            </div>
          ))}
        <div className="complaint-info__filter">
          <div className="complaint-info__filter-card">
            <div className="complaint-info__filter-card__content">
              <div
                className={`complaint-info__filter-card__item ${
                  activeTab === 'information' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('information')}>
                Информация
              </div>
              <div
                className={`complaint-info__filter-card__item ${
                  activeTab === 'images' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('images')}>
                Фотографии
              </div>
              <div
                className={`complaint-info__filter-card__item ${
                  activeTab === 'estimate' ? 'active' : ''
                }`}
                onClick={() => handleTabClick('estimate')}>
                Смета
              </div>
            </div>
          </div>
        </div>
        {activeTab === 'information' && (
          <Information
            complaintProject={complaintProject}
            isExpanded={isExpanded}
            handleToggleText={handleToggleText}
            hadleUpdateNote={hadleUpdateNote}
          />
        )}
        {activeTab === 'images' && (
          <Images
            complaintProject={complaintProject}
            hadleCreateImages={hadleCreateImages}
            handleDeleteImage={handleDeleteImage}
          />
        )}
        {activeTab === 'estimate' && (
          <ComplaintEstimate
            complaintId={id}
            regionId={
              complaintProject.complaintProject && complaintProject.complaintProject[0].regionId
            }
          />
        )}
      </div>
    </div>
  );
}

export default ComplaintInfo;
