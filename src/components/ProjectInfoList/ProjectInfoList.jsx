import React from 'react';
import { fetchProjectMaterials } from '../../http/projectMaterialsApi';
import { fetchOneProject } from '../../http/projectApi';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

function ProjectInfoList() {
  const { id } = useParams();
  const [project, setProject] = React.useState();
  const [projectMaterials, setProjectMaterials] = React.useState([]);

  React.useEffect(() => {
    fetchOneProject(id).then((data) => setProject(data));
    fetchProjectMaterials(id).then((data) => setProjectMaterials(data));
  }, [id]);

  if (!project) {
    return <Spinner />;
  }

  return (
    <div className="projectlistinfo">
      <div className="projectlistcontent">
        <div className="header">
          <Link to="/project">
            <img className="header__icon" src="../back.png" alt="back" />
          </Link>
          <h1 className="header__title">Подробная информация о проекте</h1>
        </div>
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Номер проекта</th>
              <th>Название</th>
              <th>Дата договора</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{project.number}</td>
              <td>{project.name}</td>
              <td>
                <Moment format="DD.MM.YYYY">{project.agreement_date}</Moment>
              </td>
            </tr>
          </tbody>
        </Table>
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Сроки</th>
              <th>Сроки по договору</th>
              <th>Даты сдачи по договору</th>
              <th>Дата начала</th>
              <th>Дата сдачи</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Проектирование</td>
              <td>{project.design_period}</td>
              <td>
                {moment(project.agreement_date, 'YYYY/MM/DD')
                  .businessAdd(project.design_period, 'days')
                  .format('DD.MM.YYYY')}
              </td>
              <td>
                <Moment format="DD.MM.YYYY">{project.design_start}</Moment>
              </td>
              <td>
                <Moment format="DD.MM.YYYY">{project.project_delivery}</Moment>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>Производство</td>
              <td>{project.expiration_date}</td>
              <td>
                {moment(project.agreement_date, 'YYYY/MM/DD')
                  .businessAdd(project.expiration_date, 'days')
                  .format('DD.MM.YYYY')}
              </td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>Монтажные работы</td>
              <td>{project.installation_period}</td>
              <td>
                {moment(project.agreement_date, 'YYYY/MM/DD')
                  .businessAdd(project.installation_period, 'days')
                  .format('DD.MM.YYYY')}
              </td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </Table>
        <div className="projectinfolist__subtitle">Закупки</div>
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Тип материала</th>
              <th>Оплаты</th>
              <th>Прогноз готовности</th>
              <th>Готовность</th>
              <th>Отгрузки</th>
            </tr>
          </thead>
          <tbody>
            {projectMaterials.map((property) => (
              <tr key={property.id}>
                <td>{property.materialName}</td>
                <td>
                  <Moment format="DD.MM.YYYY">{property.date_payment}</Moment>
                </td>
                <td>{property.expirationMaterial_date}</td>
                <td>
                  {property.ready_date ? (
                    <Moment format="DD.MM.YYYY">{property.ready_date}</Moment>
                  ) : (
                    ''
                  )}
                </td>
                <td>
                  {property.shipping_date ? (
                    <Moment format="DD.MM.YYYY">{property.shipping_date}</Moment>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ProjectInfoList;
