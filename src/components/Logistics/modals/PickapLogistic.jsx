import React from 'react';
import { Modal, Col, Row } from 'react-bootstrap';

function PickapLogistic(props) {
  const { pickapData, show, setShow, handleOpenCreateLogisticProjectModal } = props;

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal__detail">
      <Modal.Header closeButton className="new-project__title">
        Логистика
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <div className="pickap-logistic">
              <div className="pickap-logistic__content">
                {pickapData.map((picData) => (
                  <>
                    <div key={picData.id} className="pickap-logistic__item">
                      <div className="pickap-logistic__item-supplier">{picData.name}</div>
                      <div className="pickap-logistic__item-contact">{picData.contact}</div>
                      <div className="pickap-logistic__item-address">{picData.address}</div>
                      <div className="pickap-logistic__item-shipment">{picData.shipment}</div>
                      <div className="pickap-logistic__item-note">{picData.note}</div>
                      <a className="pickap-logistic__item-naviagtor">{picData.navigator}</a>
                      <div className="pickap-logistic__item-coordinates">{picData.coordinates}</div>
                      <div className="pickap-logistic__item-weight">Вес: {picData.weight} кг</div>
                      <div className="pickap-logistic__item-dimensions">
                        Длина: {picData.dimensions} м
                      </div>
                      {picData.projects.map((picProject) => (
                        <div key={picProject.id} className="pickap-logistic__item-project">
                          {picProject.name} ({picProject.region === 2 ? 'МО' : 'Спб'})
                          {picData.projects.length > 1 ? ` - ${picProject.materialName}` : ''}
                        </div>
                      ))}
                    </div>
                  </>
                ))}
                <div className="pickap-logistic__unloading">
                  <div className="pickap-logistic__unloading-msk">
                    {(() => {
                      // Собираем все проекты из всех элементов pickapData
                      const mskProjects = pickapData.flatMap((picD) =>
                        picD.projects.filter((unloadProject) => unloadProject.region === 2),
                      );

                      // Если есть хотя бы один проект - отображаем заголовок и все проекты
                      return (
                        mskProjects.length > 0 && (
                          <>
                            <div className="pickap-logistic__unloading-title">Выгрузка в Мск</div>

                            {mskProjects.map((unloadProject) => (
                              <div
                                key={unloadProject.id}
                                className="pickap-logistic__unloading-items">
                                <div
                                  className="pickap-logistic__unloading-project"
                                  onClick={() =>
                                    handleOpenCreateLogisticProjectModal(unloadProject.id)
                                  }>
                                  {unloadProject.name}{' '}
                                  <img
                                    src="./img/update.png"
                                    alt="update"
                                    width={15}
                                    height={15}
                                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                                  />
                                </div>
                                <div className="pickap-logistic__unloading-contact">
                                  {unloadProject.contact ? unloadProject.contact : 'Контакты'}
                                </div>
                                <div className="pickap-logistic__unloading-address">
                                  {unloadProject.address ? unloadProject.address : 'Адрес'}
                                </div>
                                <div className="pickap-logistic__unloading-navigator">
                                  {unloadProject.navigator ? unloadProject.navigator : 'Навигатор'}
                                </div>
                                <div className="pickap-logistic__unloading-coordinates">
                                  {unloadProject.coordinates
                                    ? unloadProject.coordinates
                                    : 'Координаты'}
                                </div>
                              </div>
                            ))}
                          </>
                        )
                      );
                    })()}
                  </div>
                  <div className="pickap-logistic__unloading-spb">
                    {(() => {
                      // Собираем все проекты из всех элементов pickapData
                      const spbProjects = pickapData.flatMap((picD) =>
                        picD.projects.filter((unloadProject) => unloadProject.region === 1),
                      );

                      // Если есть хотя бы один проект - отображаем заголовок и все проекты
                      return (
                        spbProjects.length > 0 && (
                          <>
                            <div className="pickap-logistic__unloading-title">Выгрузка в Спб</div>

                            {spbProjects.map((unloadProject) => (
                              <div
                                key={unloadProject.id}
                                className="pickap-logistic__unloading-items">
                                <div
                                  className="pickap-logistic__unloading-project"
                                  onClick={() =>
                                    handleOpenCreateLogisticProjectModal(unloadProject.id)
                                  }>
                                  {unloadProject.name}{' '}
                                  <img
                                    src="./img/update.png"
                                    alt="update"
                                    width={15}
                                    height={15}
                                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                                  />
                                </div>
                                <div className="pickap-logistic__unloading-contact">
                                  {unloadProject.contact ? unloadProject.contact : 'Контакты'}
                                </div>
                                <div className="pickap-logistic__unloading-address">
                                  {unloadProject.address ? unloadProject.address : 'Адрес'}
                                </div>
                                <div className="pickap-logistic__unloading-navigator">
                                  {unloadProject.navigator ? unloadProject.navigator : 'Навигатор'}
                                </div>
                                <div className="pickap-logistic__unloading-coordinates">
                                  {unloadProject.coordinates
                                    ? unloadProject.coordinates
                                    : 'Координаты'}
                                </div>
                              </div>
                            ))}
                          </>
                        )
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default PickapLogistic;

//  <div className="pickap-logistic__unloading">
//                   <div className="pickap-logistic__unloading-msk">
//                     {unloadingProjects.filter((unloadProject) => unloadProject.regionId === 2)
//                       .length > 0 && (
//                       <>
//                         <div className="pickap-logistic__unloading-title">Выгрузка в Мск</div>
//                         {unloadingProjects
//                           .filter((unloadProject) => unloadProject.regionId === 2)
//                           .map((unloadProject) => (
//                             <div
//                               key={unloadProject.id}
//                               className="pickap-logistic__unloading-items">
//                               <div
//                                 className="pickap-logistic__unloading-project"
//                                 onClick={() =>
//                                   handleOpenCreateLogisticProjectModal(unloadProject.id)
//                                 }>
//                                 {unloadProject.name}{' '}
//                                 <img
//                                   src="./img/update.png"
//                                   alt="update"
//                                   width={15}
//                                   height={15}
//                                   style={{ cursor: 'pointer', marginLeft: '5px' }}
//                                 />
//                               </div>
//                               <div className="pickap-logistic__unloading-contact">
//                                 {unloadProject.contact ? unloadProject.contact : 'Контакты'}
//                               </div>
//                               <div className="pickap-logistic__unloading-address">
//                                 {unloadProject.address ? unloadProject.address : 'Адрес'}
//                               </div>
//                               <div className="pickap-logistic__unloading-navigator">
//                                 {unloadProject.navigator ? unloadProject.navigator : 'Навигатор'}
//                               </div>
//                               <div className="pickap-logistic__unloading-coordinates">
//                                 {unloadProject.coordinates
//                                   ? unloadProject.coordinates
//                                   : 'Координаты'}
//                               </div>
//                             </div>
//                           ))}
//                       </>
//                     )}
//                   </div>
//                   <div className="pickap-logistic__unloading-spb">
//                     {unloadingProjects.filter((unloadProject) => unloadProject.regionId === 1)
//                       .length > 0 && (
//                       <>
//                         <div className="pickap-logistic__unloading-title">Выгрузка в Спб</div>
//                         {unloadingProjects
//                           .filter((unloadProject) => unloadProject.regionId === 1)
//                           .map((unloadProject) => (
//                             <div
//                               key={unloadProject.id}
//                               className="pickap-logistic__unloading-items">
//                               <div
//                                 className="pickap-logistic__unloading-project"
//                                 onClick={() =>
//                                   handleOpenCreateLogisticProjectModal(unloadProject.id)
//                                 }>
//                                 {unloadProject.name}
//                                 <img
//                                   src="./img/update.png"
//                                   alt="update"
//                                   width={15}
//                                   height={15}
//                                   style={{ cursor: 'pointer', marginLeft: '5px' }}
//                                 />
//                               </div>
//                               <div className="pickap-logistic__unloading-contact">
//                                 {unloadProject.contact ? unloadProject.contact : 'Контакты'}
//                               </div>
//                               <div className="pickap-logistic__unloading-address">
//                                 {unloadProject.address ? unloadProject.address : 'Адрес'}
//                               </div>
//                               <div className="pickap-logistic__unloading-navigator">
//                                 {unloadProject.navigator ? unloadProject.navigator : 'Навигатор'}
//                               </div>
//                               <div className="pickap-logistic__unloading-coordinates">
//                                 {unloadProject.coordinates
//                                   ? unloadProject.coordinates
//                                   : 'Координаты'}
//                               </div>
//                             </div>
//                           ))}
//                       </>
//                     )}
//                   </div>
//                 </div>
