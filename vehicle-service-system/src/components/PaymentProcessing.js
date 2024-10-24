// src/components/PaymentProcessing.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentProcessing = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [issues, setIssues] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/vehicles/');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setErrorMessage('Failed to load vehicles.');
            }
        };

        fetchVehicles();
    }, []);

    const handleVehicleChange = async (e) => {
        const vehicleId = e.target.value;
        setSelectedVehicle(vehicleId);  // Update selectedVehicle to enable the button
        setSelectedVehicleId(vehicleId);  // Also store the vehicle ID
        
        if (vehicleId) {
            try {
                // Fetch the issues for the selected vehicle
                const issuesResponse = await axios.get(`http://localhost:8000/api/vehicles/${vehicleId}/issues/`);
                setIssues(issuesResponse.data);
    
                // Fetch the total price calculation
                const priceResponse = await axios.get(`http://localhost:8000/api/vehicles/${vehicleId}/calculate_payment/`);
                setTotalPrice(priceResponse.data.total_price);
            } catch (error) {
                console.error('Error fetching issues or calculating total price:', error);
                setErrorMessage('Failed to fetch data or calculate total price.');
                setTotalPrice(0);
                setIssues([]);  // Reset issues if there's an error
            }
        } else {
            setTotalPrice(0);
            setIssues([]);  // Reset issues if no vehicle is selected
        }
    };
    
    const handlePayment = async () => {
        if (!selectedVehicleId) {
            setErrorMessage('Please select a vehicle.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/process_payment/', {
                vehicle_id: selectedVehicleId,  // Pass the vehicle ID
            });
    
            setSuccessMessage(response.data.message);
            setTotalPrice(0);
            setSelectedVehicle('');
            setIssues([]);
        } catch (error) {
            console.error('Payment processing error:', error);
            setErrorMessage('Payment processing failed. Please try again.');
        }
    };
    

    return (
        <div>
            <h1>Payment Processing</h1>
            <select value={selectedVehicle} onChange={handleVehicleChange}>
                <option value="">Select a Vehicle</option>
                {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                    </option>
                ))}
            </select>
            <h2>Issues:</h2>
            {issues.length > 0 ? (
                <ul>
                    {issues.map((issue) => (
                        <li key={issue.id}>
                            {issue.description} (Repair: {issue.is_repair ? 'Yes' : 'No'})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No issues found for this vehicle.</p>
            )}
            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            <button onClick={handlePayment} disabled={!selectedVehicle || totalPrice === 0}>
                Process Payment
            </button>
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default PaymentProcessing;
