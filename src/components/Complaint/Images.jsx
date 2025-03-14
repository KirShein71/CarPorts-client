import React from 'react';
import { Button } from 'react-bootstrap';

function Images({ complaintProject, hadleCreateImages, handleDeleteImage }) {
  const imageCount = complaintProject.complaintImages.length;
  const gridTemplateColumns =
    imageCount === 1 ? 'repeat(1, 1fr)' : imageCount === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <div className="images">
      <div className="images__content" style={{ gridTemplateColumns }}>
        {complaintProject.complaintImages.map((complaintImage) => (
          <div className="images__image" key={complaintImage.id}>
            <img src={process.env.REACT_APP_IMG_URL + complaintImage.image} alt="main" />
            <div className="images__delete" onClick={() => handleDeleteImage(complaintImage.id)}>
              Удалить
            </div>
          </div>
        ))}
      </div>
      <div onClick={hadleCreateImages}>
        <Button variant="dark">Добавить</Button>
      </div>
    </div>
  );
}

export default Images;
