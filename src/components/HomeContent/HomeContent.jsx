import React from 'react';
import CardTabs from '../CardTabs/CardTabs';
import './HomeContent.styles.scss';

function HomeContent() {
  return (
    <div className="homecontent">
      <div className="homecontent__content">
        <CardTabs />
      </div>
    </div>
  );
}

export default HomeContent;
