// src/components/VehicleAddition.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleAddition = () => {
    const [name, setName] = useState('');
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [vehicles, setVehicles] = useState([]); // State for existing vehicles
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editingVehicleId, setEditingVehicleId] = useState(null); // State to track vehicle being edited

    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/components/');
                setComponents(response.data);
            } catch (error) {
                console.error('Error fetching components:', error);
                setErrorMessage('Failed to load components.');
            }
        };

        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/vehicles/');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setErrorMessage('Failed to load vehicles.');
            }
        };

        fetchComponents();
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const vehicle = { name, components: selectedComponents };

        try {
            if (editingVehicleId) {
                // Update existing vehicle
                await axios.put(`http://localhost:8000/api/vehicles/${editingVehicleId}/`, vehicle);
                setSuccessMessage('Vehicle updated successfully!');
            } else {
                // Add new vehicle
                await axios.post('http://localhost:8000/api/vehicles/', vehicle);
                setSuccessMessage('Vehicle added successfully!');
            }

            setName('');
            setSelectedComponents([]);
            setEditingVehicleId(null); // Reset editing state
        } catch (error) {
            console.error('Error adding or updating vehicle:', error);
            setErrorMessage('Failed to add or update vehicle. Please try again.');
        }
    };

    const handleComponentChange = (id) => {
        setSelectedComponents((prev) => 
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleEditVehicle = (vehicle) => {
        setName(vehicle.name);
        setSelectedComponents(vehicle.components); // Set selected components from the vehicle
        setEditingVehicleId(vehicle.id); // Set the editing vehicle ID
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Enter Vehicle Name <br></br>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vehicle Name"
                    required
                />
                <div>
                    Select Components
                    {components.map((component) => (
                        <div key={component.id}>
                            <input
                                type="checkbox"
                                value={component.id}
                                checked={selectedComponents.includes(component.id)}
                                onChange={() => handleComponentChange(component.id)}
                            />
                            {component.name}
                        </div>
                    ))}
                </div>
                <button type="submit">{editingVehicleId ? 'Update Vehicle' : 'Add Vehicle'}</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <h2>Existing Vehicles</h2>
            <ul>
                {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                        {vehicle.name} 
                        <button onClick={() => handleEditVehicle(vehicle)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehicleAddition;
