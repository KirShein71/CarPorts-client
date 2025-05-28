import React from 'react';
import { Table } from 'react-bootstrap';
import Checkbox from '../Checkbox/Checkbox';
import './style.scss';

function LogisticMaterial({
  materials,
  handleOpenModalCreateDimensionsMaterial,
  handleOpenModalCreateWeightMaterial,
  handlePickapMaterialForLogistic,
  selectedItems,
  handleCheckboxChange,
}) {
  // Получаем текущую дату
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Создаем массив дат в нужном порядке: сегодня+2, сегодня+1, сегодня, вчера
  const dateGroups = [
    { date: new Date(today), offset: 2, label: 'Послезавтра' },
    { date: new Date(today), offset: 1, label: 'Завтра' },
    { date: new Date(today), offset: 0, label: 'Сегодня' },
    { date: new Date(today), offset: -1, label: 'Вчера' },
  ];

  // Устанавливаем правильные даты для каждой группы
  dateGroups.forEach((group) => {
    group.date.setDate(group.date.getDate() + group.offset);
    // Форматируем дату для отображения
    group.formattedDate = group.date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    // Добавляем день недели
    group.dayOfWeek = group.date.toLocaleDateString('ru-RU', { weekday: 'short' });
  });

  // Группируем проекты по датам
  const groupedByDate = {};

  materials.forEach((material) => {
    material.dates.forEach((dateGroup) => {
      const dateStr = dateGroup.date;

      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = {
          dateInfo: dateGroups.find((g) => g.date.toISOString().split('T')[0] === dateStr),
          materials: [],
        };
      }

      groupedByDate[dateStr].materials.push({
        ...material,
        props: dateGroup.props,
      });
    });
  });

  return (
    <div className="logistic-project">
      {dateGroups.map((group) => {
        const dateStr = group.date.toISOString().split('T')[0];
        const dateData = groupedByDate[dateStr];

        if (!dateData || dateData.materials.length === 0) return null;

        return (
          <div key={dateStr} className="logistic-project__date">
            <div style={{ display: 'flex' }}>
              <div className="logistic-project__date-number">
                {group.formattedDate} - <span className="dayWeek">{group.dayOfWeek}</span>{' '}
              </div>
              <button
                className="logistic-project__button"
                onClick={async () => {
                  if (selectedItems.length === 0) {
                    alert('Выберите хотя бы один материал');
                    return;
                  }

                  const [day, month, year] = group.formattedDate.split('.');
                  const isoDate = `${year}-${month}-${day}`;
                  await handlePickapMaterialForLogistic(isoDate, selectedItems);
                }}>
                Сформировать
              </button>
            </div>

            {dateData.materials.map((material) => (
              <>
                <div key={`${dateStr}-${material.id}`} className="logistic-project__top">
                  <div className="logistic-project__project">{material.materialName}</div>
                </div>
                <Table borderless size="sm" className="logistic-project__table">
                  <thead>
                    <tr>
                      <th>Проект</th>
                      <th>Счёт</th>
                      <th>Вес</th>
                      <th>Габариты</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {material.props
                      .sort((a, b) => a.id - b.id)
                      .map((prop) => (
                        <tr key={prop.id}>
                          <td className="logistic-project__table-td">
                            {prop.name} - {prop.regionId === 2 ? 'МО' : 'Спб'}
                          </td>
                          <td className="logistic-project__table-td">{prop.check}</td>
                          <td
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpenModalCreateWeightMaterial(prop.id)}
                            className="logistic-project__table-td">
                            {prop.weight ? `${prop.weight} кг` : 'Вес'}
                          </td>
                          <td
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpenModalCreateDimensionsMaterial(prop.id)}
                            className="logistic-project__table-td">
                            {prop.dimensions ? `${prop.dimensions} м` : 'Габариты'}
                          </td>
                          <td>
                            <Checkbox
                              onChange={(e) => handleCheckboxChange(prop.id, e.target.checked)}
                              checked={selectedItems.includes(prop.id)}
                              label={`checkbox-${prop.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default LogisticMaterial;
