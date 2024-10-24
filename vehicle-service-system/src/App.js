// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import VehicleAddition from './components/VehicleAddition';
import ComponentManagement from './components/ComponentManagement'; // Import your other components
import IssueManagement from './components/IssueManagement'; // Import your other components
import RevenuePage from './components/RevenuePage'; // Import your other components
import PaymentProcessing from './components/PaymentProcessing';
import './styles.css';

const App = () => {
    return (
        <div>
            <h1>Vehicle Service System</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/components">Manage Components</Link>
                    </li>
                    <li>
                        <Link to="/add-vehicle">Add Vehicle</Link>
                    </li>
                    <li>
                        <Link to="/issues">Manage Issues</Link>
                    </li>
                    <li>
                        <Link to="/payment">Payment</Link>
                    </li>
                    <li>
                        <Link to="/revenue-report">Revenue Report</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<h2>Welcome to the Vehicle Service System</h2>} />
                <Route path="/add-vehicle" element={<VehicleAddition />} />
                <Route path="/components" element={<ComponentManagement />} />
                <Route path="/issues" element={<IssueManagement />} />
                <Route path="/revenue-report" element={<RevenuePage />} />
                <Route path="/payment" element={<PaymentProcessing />} />
            </Routes>
        </div>
    );
};

export default App;
