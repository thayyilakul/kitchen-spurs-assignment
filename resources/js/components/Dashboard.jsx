// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [restaurantCount, setRestaurantCount] = useState(null);
    const [orderCount, setOrderCount] = useState(null);
    const [orderAmount, setOrderAmount] = useState(null);


    // Fetch restaurant count from Laravel API
    const fetchRestaurantCount = async () => {
        try {
            const params = {};
            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            const response = await axios.get('http://localhost:8000/api/dashboard/total-restaurants', {
                params,
            });

            setRestaurantCount(response.data.restaurant_count);
            setOrderCount(response.data.order_count);
            setOrderAmount(response.data.order_amount);
        } catch (error) {
            console.error('Failed to fetch restaurant count:', error);
            setRestaurantCount('N/A');
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchRestaurantCount();
    }, []);

    // Fetch again when dates change
    useEffect(() => {
        fetchRestaurantCount();
    }, [fromDate, toDate]);

    return (
        <div>
            <h2 className="mb-4">Dashboard</h2>

            {/* Date Filters */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <label htmlFor="fromDate" className="form-label">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label htmlFor="toDate" className="form-label">To Date</label>
                    <input
                        type="date"
                        id="toDate"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards */}
            <div className="row">
                {/* Card 1 - Total Restaurants */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card text-white bg-primary h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Restaurants</h5>
                            <p className="card-text display-6">
                                {restaurantCount !== null ? restaurantCount : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card text-white bg-success h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Orders</h5>
                            <p className="card-text display-6">
                                {orderCount !== null ? orderCount : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card text-white bg-warning h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Amount Earned</h5>
                            <p className="card-text display-6">
                                {orderAmount !== null ? `₹${orderAmount}` : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 4 (optional) */}
                {/* <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card text-white bg-danger h-100">
                        <div className="card-body">
                            <h5 className="card-title">Settings</h5>
                            <p className="card-text">Configure app settings and preferences.</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Dashboard;
