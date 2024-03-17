import React from 'react';
import Header from '../Header/Header';
import { Button, Table, Spinner, Pagination, Col, Form } from 'react-bootstrap';
import { fetchAllDetails } from '../../http/detailsApi';
import { fetchAllStockDetails, deleteStockDetails } from '../../http/stockDetailsApi';
import CreateStockDetails from './modals/createStockDetails';
import Moment from 'react-moment';
import UpdateStockDetails from './modals/updateStockDetails';
import CreateOneStockDetail from './modals/createOneStockDetail';
import './modals/styles.scss';

function WeldersList() {
  const [nameDetails, setNameDetails] = React.useState([]);
  const [stockDetails, setStockDetails] = React.useState([]);
  const [stockDetail, setStockDetail] = React.useState(null);
  const [createDetailsModal, setCreateDetailsModal] = React.useState(false);
  const [updateDetailsModal, setUpdateDetailsModal] = React.useState(false);
  const [createOneStockDetailModal, setCreateOneStockDetailModal] = React.useState(false);
  const [detailId, setDetailId] = React.useState(null);
  const [stockDate, setStockDate] = React.useState(null);
  const [change, setChange] = React.useState(true);
  const [fetching, setFetching] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortField, setSortField] = React.useState('stock_date');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const itemsPerPage = 20;

  React.useEffect(() => {
    fetchAllStockDetails()
      .then((data) => {
        setStockDetails(data);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
        setCurrentPage(1);
      })
      .finally(() => setFetching(false));
  }, [change]);

  React.useEffect(() => {
    fetchAllDetails().then((data) => setNameDetails(data));
  }, []);

  const handleUpdateDetailClick = (id) => {
    setStockDetail(id);
    setUpdateDetailsModal(true);
  };

  const handleCreateOneStockDetail = (detailId, stockDate) => {
    setDetailId(detailId);
    setStockDate(stockDate);
    setCreateOneStockDetailModal(true);
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
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

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, stockDetails.length);
  const stockDetailsToShow = sortedStockDetails.slice(startIndex, endIndex);

  const pages = [];
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;

    if (startIndex < stockDetails.length) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          activeLabel=""
          onClick={() => handlePageClick(page)}>
          {page}
        </Pagination.Item>,
      );
    }
  }

  if (fetching) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="welderslist">
      <Header title={'Произведено'} />
      <Button onClick={() => setCreateDetailsModal(true)}>Внести детали</Button>
      <Col className="mt-3" sm={2}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск по дате"
            value={searchQuery}
            onChange={handleSearch}
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Col>
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
      <CreateOneStockDetail
        detailId={detailId}
        stockDate={stockDate}
        show={createOneStockDetailModal}
        setShow={setCreateOneStockDetailModal}
        setChange={setChange}
      />
      <div className="table-scrollable">
        <Table bordered size="sm" className="mt-3">
          <thead>
            <tr>
              <th className="welders_column" onClick={() => handleSort('stock_date')}>
                Отметка времени{' '}
                <img styles={{ marginLeft: '5px' }} src="./sort.png" alt="icon_sort" />
              </th>
              {nameDetails
                .sort((a, b) => a.id - b.id)
                .map((part) => (
                  <th key={part.id}>{part.name}</th>
                ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stockDetailsToShow
              .filter((stock) => {
                const searchValue = searchQuery.toLowerCase();
                const parts = stock.stock_date.split('-'); // Разбиваем дату на части по дефису
                const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`; // Преобразуем дату в формат "dd.mm.yyyy"
                return formattedDate.includes(searchValue); // Проверяем, содержит ли преобразованная дата искомое значение
              })
              .map((stock) => (
                <tr>
                  <td className="welders_column">
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
                          onClick={() =>
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
                      variant="success"
                      size="sm"
                      onClick={() => handleDeleteStockDetails(stock.stock_date)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {stockDetails.length > 15 ? <Pagination>{pages}</Pagination> : ''}
      </div>
    </div>
  );
}

export default WeldersList;
