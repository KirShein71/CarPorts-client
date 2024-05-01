import React from 'react';
import { getProjectStatistics } from '../../http/counterApi';

function Counter() {
  const [projectStatistics, setProjectStatistics] = React.useState([]);

  React.useEffect(() => {
    getProjectStatistics().then((data) => setProjectStatistics(data));
  }, []);

  return (
    <div className="counter">
      {projectStatistics.map((number) => (
        <div key={number.id} className="counter__content">
          <div className="counter__item">Всего проектов: {number.countProject} </div>
          <div className="counter__item">Очередь на проектирование: {number.countNoDesigner}</div>
          <div className="counter__item">Очередь на снабжение: {number.countNoMaterials}</div>
          <div className="counter__item">Очередь на монтаж: {number.countNoInstallers}</div>
          <div className="counter__item">На монтаже: {number.countInstallers}</div>
          <div className="counter__item">Завершено всего: {number.countFinish}</div>
          <div className="counter__item">Завершено в этом году: {number.countFinishThisYear}</div>
        </div>
      ))}
    </div>
  );
}

export default Counter;
