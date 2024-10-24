// src/components/IssueManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssueManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [components, setComponents] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [isRepair, setIsRepair] = useState(true); // true for repair, false for new component
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/vehicles/');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        const fetchComponents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/components/');
                setComponents(response.data);
            } catch (error) {
                console.error('Error fetching components:', error);
            }
        };

        fetchVehicles();
        fetchComponents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newIssue = {
            vehicle: selectedVehicle,
            description: issueDescription,
            is_repair: isRepair,
        };

        try {
            await axios.post('http://localhost:8000/api/issues/', newIssue);
            setSuccessMessage('Issue added successfully!');
            setIssueDescription('');
            setSelectedVehicle('');
            setIsRepair(true); // Reset to default state
        } catch (error) {
            console.error('Error adding issue:', error);
            setErrorMessage('Failed to add issue. Please check the details and try again.');
        }
    };

    return (
        <div>
            <h1>Issue Management</h1>
            {successMessage && <div className="success">{successMessage}</div>}
            {errorMessage && <div className="error">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="vehicle">Select Vehicle:</label>
                    <select
                        id="vehicle"
                        value={selectedVehicle}
                        onChange={(e) => setSelectedVehicle(e.target.value)}
                        required
                    >
                        <option value="">--Select a Vehicle--</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="description">Issue Description:</label>
                    <textarea
                        id="description"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder="Describe the issue"
                        required
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value={true}
                            checked={isRepair}
                            onChange={() => setIsRepair(true)}
                        />
                        Repair
                    </label>
                    <label>
                        <input
                            type="radio"
                            value={false}
                            checked={!isRepair}
                            onChange={() => setIsRepair(false)}
                        />
                        New Component
                    </label>
                </div>
                <button type="submit">Add Issue</button>
            </form>
        </div>
    );
};

export default IssueManagement;
