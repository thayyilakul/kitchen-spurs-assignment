import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        fetchRestaurants();
    }, [searchTerm, sortField, sortDirection, fromDate, toDate]);

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get('/api/restaurants', {
                params: {
                    search: searchTerm,
                    sortField,
                    sortDirection,
                    from: fromDate || undefined,
                    to: toDate || undefined,
                }
            });
            setRestaurants(res.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (field) => {
        if (field !== sortField) return null;
        return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    };

    // Map display names to actual sort field keys
    const columns = [
        { label: 'ID', field: 'id' },
        { label: 'NAME', field: 'name' },
        { label: 'LOCATION', field: 'location' },
        { label: 'CUISINE', field: 'cuisine' },
        { label: 'TOTAL AMOUNT EARNED', field: 'orders_sum_order_amount' },
        { label: 'TOTAL ORDERS', field: 'orders_count' },
        { label: 'CREATED AT', field: 'created_at' },
    ];

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Restaurants</h2>

            {/* Search input */}
            <div className="mb-3 w-50">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search name, location or cuisine..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Date filters */}
            <div className="mb-3 w-50 d-flex gap-3">
                <div>
                    <label htmlFor="fromDate" className="form-label">From Date</label>
                    <input
                        type="date"
                        id="fromDate"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div>
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

            {/* Restaurants Table */}
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>SR NO</th> {/* New Sr No header */}
                        {columns.map(({ label, field }) => (
                            <th
                                key={field}
                                onClick={() => handleSort(field)}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                {label}
                                {renderSortIcon(field)}
                            </th>
                        ))}
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.length > 0 ? (
                        restaurants.map((restaurant, index) => (
                            <tr key={restaurant.id}>
                                <td>{index + 1}</td> {/* Serial number */}
                                <td>{restaurant.id}</td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{restaurant.cuisine}</td>
                                <td>{restaurant.orders_sum_order_amount ?? 0}</td>
                                <td>{restaurant.orders_count ?? 0}</td>
                                <td>{new Date(restaurant.created_at).toLocaleString()}</td>
                                <td>
                                    <Link to={`/details/${restaurant.id}`} className="btn btn-primary btn-sm">
                                        View More
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            {/* +1 because of new Sr No column */}
                            <td colSpan={columns.length + 2} className="text-center">
                                No restaurants found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}

export default Restaurants;
