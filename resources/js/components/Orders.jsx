import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('order_time'); // default sorting field
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage] = useState(10);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [fromHour, setFromHour] = useState('');
    const [toHour, setToHour] = useState('');

    // Aggregate data
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [averageOrderValue, setAverageOrderValue] = useState(0);
    const [peakOrderHour, setPeakOrderHour] = useState(null);

    // Columns config with display label and backend sort key
    const columns = [
        { label: 'RESTAURANT NAME', sortKey: 'restaurant.name' },
        { label: 'ORDER AMOUNT', sortKey: 'order_amount' },
        { label: 'ORDER TIME', sortKey: 'order_time' }
    ];

    // Fetch restaurants
    useEffect(() => {
        axios.get('/api/restaurants')
            .then(res => setRestaurants(res.data))
            .catch(err => console.error('Failed to fetch restaurants:', err));
    }, []);

    // Fetch orders with filters & sorting
    useEffect(() => {
        fetchOrders();
    }, [searchTerm, sortField, sortDirection, currentPage, fromDate, toDate, minAmount, maxAmount, fromHour, toHour, selectedRestaurant]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders', {
                params: {
                    search: searchTerm,
                    sortField,
                    sortDirection,
                    page: currentPage,
                    perPage,
                    from: fromDate,
                    to: toDate,
                    minAmount,
                    maxAmount,
                    fromHour,
                    toHour,
                    restaurant_id: selectedRestaurant
                }
            });

            setOrders(res.data.data);
            setLastPage(res.data.last_page);

            setTotalOrders(res.data.total_orders || 0);
            setTotalRevenue(res.data.total_revenue || 0);
            setAverageOrderValue(res.data.average_order_value || 0);
            setPeakOrderHour(res.data.peak_order_hour);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const renderSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const formatPeakHour = (hour) => {
        if (hour === null || hour === undefined) return 'N/A';
        const h = parseInt(hour, 10);
        if (isNaN(h)) return 'N/A';
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 === 0 ? 12 : h % 12;
        return `${displayHour} ${ampm}`;
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Orders</h2>

            {/* Filters */}
            <div className="row mb-3">
                {/* Restaurant Dropdown */}
                <div className="col-md-4">
                    <label htmlFor="restaurantSelect" className="form-label">Restaurant Name</label>
                    <select
                        className="form-select"
                        id="restaurantSelect"
                        value={selectedRestaurant}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setSelectedRestaurant(e.target.value);
                        }}
                    >
                        <option value="">All Restaurants</option>
                        {restaurants.map((rest) => (
                            <option key={rest.id} value={rest.id}>{rest.name}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div className="col-md-4">
                    <label htmlFor="fromDate" className="form-label">From Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setFromDate(e.target.value);
                        }}
                    />
                </div>

                <div className="col-md-4">
                    <label htmlFor="toDate" className="form-label">To Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setToDate(e.target.value);
                        }}
                    />
                </div>

                {/* Amount Range */}
                <div className="col-md-4 mt-3">
                    <label htmlFor="minAmount" className="form-label">Min Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="minAmount"
                        value={minAmount}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setMinAmount(e.target.value);
                        }}
                    />
                </div>

                <div className="col-md-4 mt-3">
                    <label htmlFor="maxAmount" className="form-label">Max Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="maxAmount"
                        value={maxAmount}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setMaxAmount(e.target.value);
                        }}
                    />
                </div>

                {/* Hour Range */}
                <div className="col-md-2 mt-3">
                    <label htmlFor="fromHour" className="form-label">From Hour (0-23)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="fromHour"
                        min="0"
                        max="23"
                        value={fromHour}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setFromHour(e.target.value);
                        }}
                    />
                </div>

                <div className="col-md-2 mt-3">
                    <label htmlFor="toHour" className="form-label">To Hour (0-23)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="toHour"
                        min="0"
                        max="23"
                        value={toHour}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setToHour(e.target.value);
                        }}
                    />
                </div>
            </div>

            {/* Cards */}
            <div className="row mb-4">
                <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Orders</h5>
                            <p className="card-text display-6">{totalOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text display-6">₹{totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-warning text-dark h-100">
                        <div className="card-body">
                            <h5 className="card-title">Average Order Value</h5>
                            <p className="card-text display-6">₹{averageOrderValue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                    <div className="card bg-danger text-white h-100">
                        <div className="card-body">
                            <h5 className="card-title">Peak Order Hour</h5>
                            <p className="card-text display-6">{formatPeakHour(peakOrderHour)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        {columns.map(({ label, sortKey }) => (
                            <th
                                key={sortKey}
                                onClick={() => handleSort(sortKey)}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                {label}
                                {renderSortIcon(sortKey)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                <td>{order.restaurant.name}</td>
                                <td>{order.order_amount}</td>
                                <td>{new Date(order.order_time).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Orders;
