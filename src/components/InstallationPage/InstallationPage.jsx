import React from 'react';
import { getAllEstimateForBrigade } from '../../http/estimateApi';

function InstallationPage() {
  const [serviceEstimate, setServiceEstimate] = React.useState([]);

  React.useEffect(() => {
    getAllEstimateForBrigade().then((data) => setServiceEstimate(data));
  }, []);

  return (
    <div className="installation-page">
      <div className="istallation-page__content">
        {serviceEstimate.map((col) => (
          <div className="installation-page__item" style={{ display: 'flex' }}>
            <div className="installation-page__service" style={{ marginRight: '10px' }}>
              {col.service.name}
            </div>
            <div className="installation-page__price">{col.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstallationPage;
