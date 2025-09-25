import React from 'react';
import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Restaurants from './Restaurants';
import Details from './Details';
import Orders from './Orders';
import Dashboard from './Dashboard';  // import dashboard
import NotFound from './NotFound'; // import the 404 component

function Header() {
    const location = useLocation();

    // Helper function to check if path is active (starts with path)
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="container mt-4">
            {/* Tabs */}
            <ul className="nav nav-tabs">
                {/* <li className="nav-item">
                    <Link
                        to="/dashboard"
                        className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                </li> */}
                <li className="nav-item">
                    <Link
                        to="/restaurants"
                        className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`}
                    >
                        Restaurants
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/orders"
                        className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                    >
                        Orders
                    </Link>
                </li>
                
            </ul>

            {/* Tab Content */}
            <div className="tab-content mt-3">
                <Routes>
                    {/* Redirect root to /dashboard */}
                    <Route path="/" element={<Navigate to="/restaurants" replace />} />

                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    <Route path="/restaurants" element={<Restaurants />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/details/:id" element={<Details />} />
                    {/* Optionally handle /details without id */}
                    {/* <Route path="/details" element={<p>Please select a post from Posts tab to see details.</p>} /> */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

export default Header;
