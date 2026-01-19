import React from 'react';
import Header from '../Header/Header';
import Details from './Details';
import Materials from './Materials';
import Brigade from './Brigade';
import Service from './Service';
import Supplier from './Supplier';
import Examination from './Examination';
import Designer from './Designer';
import Nps from './Nps';
import WarehouseAssortment from './WarehouseAssortment';

import './style.scss';

function AddingList() {
  const [selectedChapter, setSelectedChapter] = React.useState('Детали');
  const [selectedChapterName, setSelectedChapterName] = React.useState('Детали'); // Установлено по умолчанию
  const [openModalSelectedChapter, setOpenModalSelectedChapter] = React.useState(false);
  const chapters = [
    'Детали',
    'Материалы',
    'Поставщики',
    'Монтажные бригады',
    'Проектировщики',
    'Услуги монтажный работ',
    'Список проверок',
    'Обратная связь',
    'Ассортимент склада',
  ];
  const modalRef = React.useRef();

  const handleOpenModalSelectedChapter = () => {
    setOpenModalSelectedChapter(!openModalSelectedChapter);
  };

  // Рендеринг выбранного компонента на основе выбранного раздела
  const renderSelectedComponent = () => {
    switch (selectedChapter) {
      case 'Детали':
        return <Details />;
      case 'Материалы':
        return <Materials />;
      case 'Поставщики':
        return <Supplier />;
      case 'Монтажные бригады':
        return <Brigade />;
      case 'Проектировщики':
        return <Designer />;
      case 'Услуги монтажный работ':
        return <Service />;
      case 'Список проверок':
        return <Examination />;
      case 'Обратная связь':
        return <Nps />;
      case 'Ассортимент склада':
        return <WarehouseAssortment />;
      default:
        return <Details />;
    }
  };

  // Обработчик клика по разделу
  const handleChapterSelect = (chapterName) => {
    setSelectedChapterName(chapterName);
    setSelectedChapter(chapterName);
    setOpenModalSelectedChapter(false);
  };

  return (
    <>
      <Header title={'Справочники'} />
      <div className="adding__dropdown" ref={modalRef}>
        <button className="adding__dropdown-chapter" onClick={handleOpenModalSelectedChapter}>
          <div>
            Раздел: {selectedChapterName}
            <img src="./img/arrow-down.png" alt="arrow down" />
          </div>
        </button>
        {openModalSelectedChapter && (
          <div className="adding__dropdown-modal">
            <div className="adding__dropdown-content">
              <div className="adding__dropdown-items">
                {chapters.map((chapterName) => (
                  <div key={chapterName}>
                    <div
                      className="adding__dropdown-item"
                      onClick={() => handleChapterSelect(chapterName)}>
                      {chapterName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {renderSelectedComponent()}
    </>
  );
}

export default AddingList;
