import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Details() {
  const { id } = useParams();

  const [restaurantName, setRestaurantName] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [orderAvgAmount, setOrderAvgAmount] = useState(0);
  const [peakOrderHour, setPeakOrderHour] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage] = useState(10);

  // Example date filters (add more if needed)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Format peak hour to 12-hour AM/PM
  const formatPeakHour = (hour) => {
    if (hour === null || hour === undefined) return 'N/A';
    const h = parseInt(hour, 10);
    if (isNaN(h)) return 'N/A';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour} ${ampm}`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/restaurants/${id}`, {
          params: {
            page: currentPage,
            perPage,
            from: fromDate,
            to: toDate,
          },
        });

        // assuming API returns paginated orders in res.data.orders.data
        setRestaurantName(res.data.restaurant_name);
        setOrders(res.data.orders.data);
        setLastPage(res.data.orders.last_page);

        setOrderCount(res.data.order_count);
        setOrderAmount(res.data.order_amount);
        setOrderAvgAmount(res.data.order_avg_amount);
        setPeakOrderHour(res.data.peak_order_hour);
      } catch (error) {
        console.error('Failed to fetch details', error);
      }
    };

    fetchDetails();
  }, [id, currentPage, perPage, fromDate, toDate]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">{restaurantName}</h4>

      {/* Date Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-3">
          <label>To Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5>Total Orders</h5>
              <p className="display-6">{orderCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <p className="display-6">₹{orderAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h5>Average Order Value</h5>
              <p className="display-6">₹{orderAvgAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h5>Peak Order Hour</h5>
              <p className="display-6">{formatPeakHour(peakOrderHour)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Order Amount</th>
            <th>Order Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{(currentPage - 1) * perPage + index + 1}</td>
                <td>₹{order.order_amount}</td>
                <td>{new Date(order.order_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Details;
