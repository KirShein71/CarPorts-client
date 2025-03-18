import React from 'react';
import { Modal } from 'react-bootstrap';
import { getAllByComplaintId } from '../../../../http/complaintImageApi';
import { deleteComplaintImage } from '../../../../http/complaintImageApi';

function ComplaintImage(props) {
  const { showImage, setShowImage, complaintId } = props;
  const [complaintImages, setComplaintImages] = React.useState([]);
  const [change, setChange] = React.useState(true);

  React.useEffect(() => {
    if (showImage === true) {
      getAllByComplaintId(complaintId)
        .then((data) => {
          setComplaintImages(data);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            alert(error.response.data.message);
          } else {
            console.log('An error occurred');
          }
        });
    }
  }, [complaintId, showImage, change]);

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

  const handelFullScreenImage = (imageElement) => {
    if (!document.fullscreenElement) {
      imageElement.requestFullscreen().catch((error) => console.log(error));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <Modal
        show={showImage}
        onHide={() => setShowImage(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="md">
        <Modal.Header closeButton>
          <Modal.Title>Фотографии</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="complaint-image">
            <div className="complaint-image__content">
              {complaintImages.map((comImg) => (
                <div className="complaint-image__image" key={comImg.id}>
                  <img
                    src={process.env.REACT_APP_IMG_URL + comImg.image}
                    alt="main"
                    onClick={(e) => handelFullScreenImage(e.target)}
                  />
                  <div
                    className="complaint-image__delete"
                    onClick={() => handleDeleteImage(comImg.id)}>
                    Удалить
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ComplaintImage;
