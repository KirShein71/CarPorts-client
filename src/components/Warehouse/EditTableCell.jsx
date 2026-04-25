import React from 'react';
import {
  deleteOneWarehouseDetail,
  updateProjectWarehouse,
  createProjectWarehouse,
} from '../../http/projectWarehouseApi';

function EditTableCell(props) {
  const {
    value,
    onSave,
    hasData,
    warehouseAssortmentId,
    projectId,
    warehouseProjectId,
    setChange,
  } = props;
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || '');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(value || '');
  };

  const handleSave = async () => {
    const trimmedValue = inputValue.trim();

    // Если значение не изменилось, просто закрываем редактирование
    if (trimmedValue === (value?.toString() || '')) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      // Если поле пустое
      if (!trimmedValue) {
        // Если запись существует в БД - удаляем её
        if (hasData && warehouseProjectId) {
          await deleteOneWarehouseDetail(warehouseProjectId);
        }
        // Если записи не было, ничего не делаем
      } else {
        // Поле не пустое - сохраняем или обновляем
        if (hasData && warehouseProjectId) {
          // Обновление существующей записи
          const data = new FormData();
          data.append('quantity', trimmedValue);
          data.append('quantity_stat', trimmedValue);
          await updateProjectWarehouse(warehouseProjectId, data);
        } else {
          // Создание новой записи
          const data = new FormData();
          data.append('quantity', trimmedValue);
          data.append('quantity_stat', trimmedValue);
          data.append('warehouse_assortement_id', warehouseAssortmentId);
          data.append('projectId', projectId);
          await createProjectWarehouse(data);
        }
      }

      // Обновляем данные в родительском компоненте
      setChange((prev) => !prev);

      // Вызываем колбэк onSave если он передан
      if (onSave) {
        onSave();
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert(error.response?.data?.message || 'Ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = () => {
    if (!isLoading) {
      handleSave();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value || '');
    }
  };

  const handleChange = (e) => {
    const regex = /^[0-9]*$/;
    if (regex.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  if (isEditing) {
    return (
      <td className="warehouse-table__td quantity" style={{ padding: '0', position: 'relative' }}>
        <input
          className="warehouse-table__td input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
        />
        {isLoading && <span className="warehouse-table__td loading">⏳</span>}
      </td>
    );
  }

  return (
    <td
      className="warehouse-table__td quantity"
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative' }}
      title="Кликните для редактирования">
      {value || ''}
    </td>
  );
}

export default EditTableCell;
