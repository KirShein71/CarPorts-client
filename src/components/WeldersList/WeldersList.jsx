import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Col, Form } from 'react-bootstrap';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllStockDetails, deleteStockDetails } from '../../http/stockDetailsApi';
import CreateStockDetails from './modals/сreateStockDetails';
import Moment from 'react-moment';
import UpdateStockDetails from './modals/updateStockDetails';
import CreateOneStockDetail from './modals/createOneStockDetail';
import './modals/style.scss';
import CreateStockAntypical from './modals/createStockAntypical';
import { AppContext } from '../../context/AppContext';
import WeldersAntypicals from './WeldersAntypicals';
import { fetchAllAntypical } from '../../http/antypicalApi';
import CreateAntypicalsWeldersQuantity from './modals/CreateAntypicalsWeldersQuanity';

function WeldersList() {
  const { user } = React.useContext(AppContext);
  const [nameDetails, setNameDetails] = React.useState([]);
  const [stockDetails, setStockDetails] = React.useState([]);
  const [stockDetail, setStockDetail] = React.useState(null);
  const [createDetailsModal, setCreateDetailsModal] = React.useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = React.useState(false);
  const [createOneStockDetailModal, setCreateOneStockDetailModal] = React.useState(false);
  const [createStockAntypical, setCreateStockAntypical] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [stockDate, setStockDate] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('stock_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeWeldersAntypicals, setActiveWeldersAntypicals] = React.useState(false);
  const [antypicalsDetails, setAntypicalsDetails] = React.useState([]);
  const [openModalCreateAntypicalsWeldersQuantity, setOpenModalCreateAntypicalsWeldersQuantity] =
    React.useState(false);
  const [antypicalsId, setAntypicalsId] = React.useState(null);

  React.useEffect(() => {
    const fetchAllData = async () => {
      try {
        setFetching(true);

        const [stockData, nameData, antypicalsData] = await Promise.all([
          fetchAllStockDetails(),
          fetchAllDetails(),
          fetchAllAntypical(),
        ]);

        setStockDetails(stockData);
        setNameDetails(nameData);
        setAntypicalsDetails(antypicalsData);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchAllData();
  }, [change]);

  const handleUpdateDetailClick = (id) => {
    setStockDetail(id);
    setUpdateDetailsModal(true);
  };

  const handleCreateStockAntypical = (stockDate) => {
    setStockDate(stockDate);
    setCreateStockAntypical(true);
  };

  const handleCreateOneStockDetail = (detailId, stockDate) => {
    setDetailId(detailId);
    setStockDate(stockDate);
    setCreateOneStockDetailModal(true);
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickActiveWeldersAntypicals = () => {
    setActiveWeldersAntypicals(true);
  };

  const handleClickActiveMainWelders = () => {
    setActiveWeldersAntypicals(false);
  };

  const handleOpenModalCreateAntypicalsWeldersQuantity = (id) => {
    setAntypicalsId(id);
    setOpenModalCreateAntypicalsWeldersQuantity(true);
  };

  const handleDeleteStockDetails = (stock_date) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить?');
    if (confirmed) {
      deleteStockDetails(stock_date)
        .then((data) => {
          setChange(!change);
          alert(`Строка будет удалена`);
        })
        .catch((error) => alert(error.response.data.message));
    }
  };

  const detailSums = nameDetails
    .sort((a, b) => a.id - b.id)
    .map((part) => {
      let sum = 0;
      stockDetails.forEach((stock) => {
        const detail = stock.props.find((el) => el.detailId === part.id);
        if (detail) {
          sum += detail.stock_quantity;
        }
      });
      return sum;
    });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStockDetails = stockDetails.slice().sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);

    if (sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const handleDownloadFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileUrl.substring(fileUrl.lastIndexOf('/') + 1));
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error('Ошибка при скачивании файла:', error));
  };

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="welderslist">
      <Header title={'Произведено'} />
      <div style={{ display: 'flex' }}>
        {activeWeldersAntypicals ? (
          <button className="button__main" onClick={handleClickActiveMainWelders}>
            Главная
          </button>
        ) : (
          <>
            <button className="button__welders" onClick={() => setCreateDetailsModal(true)}>
              Внести детали
            </button>
            <button className="button__antypicals" onClick={handleClickActiveWeldersAntypicals}>
              Нетиповые
            </button>
            <input
              class="welders__search"
              placeholder="Поиск по дате"
              value={searchQuery}
              onChange={handleSearch}
            />
          </>
        )}
      </div>
      <CreateStockDetails
        show={createDetailsModal}
        setShow={setCreateDetailsModal}
        setChange={setChange}
      />
      <UpdateStockDetails
        id={stockDetail}
        show={updateDetailsModal}
        setShow={setUpdateDetailsModal}
        setChange={setChange}
      />
      <CreateStockAntypical
        stockDate={stockDate}
        show={createStockAntypical}
        setShow={setCreateStockAntypical}
        setChange={setChange}
      />
      <CreateOneStockDetail
        detailId={detailId}
        stockDate={stockDate}
        show={createOneStockDetailModal}
        setShow={setCreateOneStockDetailModal}
        setChange={setChange}
      />
      <CreateAntypicalsWeldersQuantity
        show={openModalCreateAntypicalsWeldersQuantity}
        setShow={setOpenModalCreateAntypicalsWeldersQuantity}
        id={antypicalsId}
        setChange={setChange}
      />
      {activeWeldersAntypicals ? (
        <WeldersAntypicals
          antypicalsDetails={antypicalsDetails}
          handleOpenModalCreateAntypicalsWeldersQuantity={
            handleOpenModalCreateAntypicalsWeldersQuantity
          }
          handleDownloadFile={handleDownloadFile}
        />
      ) : (
        <div className="welders-table-container">
          <div className="welders-table-wrapper">
            <Table
              bordered
              size="sm"
              className="mt-3"
              style={{ border: '1px solid #dee2e6', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="welders_column">Сумма</th>
                  {detailSums.map((sum, index) => (
                    <th className="welders_thead" key={index}>
                      {sum}
                    </th>
                  ))}
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th className="welders-th mobile" onClick={() => handleSort('stock_date')}>
                    Отметка времени{' '}
                    <img styles={{ marginLeft: '5px' }} src="./img/sort.png" alt="icon_sort" />
                  </th>
                  {nameDetails
                    .sort((a, b) => a.id - b.id)
                    .map((part) => (
                      <th className="welders-th" key={part.id}>
                        {part.name}
                      </th>
                    ))}

                  <th className="welders-th"></th>
                </tr>
              </thead>
              <tbody>
                {sortedStockDetails
                  .filter((stock) => {
                    const searchValue = searchQuery.toLowerCase();
                    const parts = stock.stock_date.split('-'); // Разбиваем дату на части по дефису
                    const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`; // Преобразуем дату в формат "dd.mm.yyyy"
                    return formattedDate.includes(searchValue); // Проверяем, содержит ли преобразованная дата искомое значение
                  })
                  .map((stock) => (
                    <tr>
                      <td className="welders-td mobile">
                        <Moment format="DD.MM.YYYY">{stock.stock_date}</Moment>
                      </td>
                      {nameDetails
                        .sort((a, b) => a.id - b.id)
                        .map((part) => {
                          const detail = stock.props.find((el) => el.detailId === part.id);
                          const quantity = detail ? detail.stock_quantity : '';
                          return (
                            <td
                              style={{ cursor: 'pointer' }}
                              onClick={
                                user.isManagerProduction
                                  ? undefined
                                  : () =>
                                      quantity
                                        ? handleUpdateDetailClick(detail.id)
                                        : handleCreateOneStockDetail(part.id, stock.stock_date)
                              }>
                              {quantity}
                            </td>
                          );
                        })}
                      <td>
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={() => handleDeleteStockDetails(stock.stock_date)}>
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeldersList;
