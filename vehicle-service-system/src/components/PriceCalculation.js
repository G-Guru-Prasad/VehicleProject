// src/components/PriceCalculation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PriceCalculation = () => {
    const [vehicleId, setVehicleId] = useState('');
    const [finalPrice, setFinalPrice] = useState(0);
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        if (vehicleId) {
            const fetchIssues = async () => {
                const response = await axios.get(`/api/vehicles/${vehicleId}/issues/`);
                setIssues(response.data);
            };
            fetchIssues();
        }
    }, [vehicleId]);

    const calculatePrice = () => {
        const totalPrice = issues.reduce((acc, issue) => {
            // Assuming the price logic is based on the component's repair price
            return acc + (issue.is_repair ? 100 : 50); // Example pricing logic
        }, 0);
        setFinalPrice(totalPrice);
    };

    return (
        <div>
            <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
                <option value="">Select Vehicle</option>
                {/* Populate with vehicle options */}
            </select>
            <button onClick={calculatePrice}>Calculate Price</button>
            <h3>Final Price: {finalPrice}</h3>
        </div>
    );
};

export default PriceCalculation;
