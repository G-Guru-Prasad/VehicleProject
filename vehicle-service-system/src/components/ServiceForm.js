import React, { useState, useEffect } from 'react';

function ServiceForm() {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState('');
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/vehicles/');
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        const fetchComponents = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/components/');
                const data = await response.json();
                setComponents(data);
            } catch (error) {
                console.error('Error fetching components:', error);
            }
        };

        fetchVehicles();
        fetchComponents();
    }, []);

    const addIssue = () => {
        if (selectedVehicle && selectedComponent) {
            setIssues([...issues, { vehicle: selectedVehicle, component: selectedComponent }]);
            setSelectedVehicle(''); // Reset selection
            setSelectedComponent(''); // Reset selection
        } else {
            alert('Please select both a vehicle and a component before adding an issue.');
        }
    };

    const submitRepair = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/repairs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ issues }),
            });

            if (response.ok) {
                alert('Repair added successfully!');
                setIssues([]); // Clear issues after submission
            } else {
                const errorData = await response.json();
                alert('Error submitting repair: ' + errorData.detail);
            }
        } catch (error) {
            console.error('Error submitting repair:', error);
        }
    };

    return (
        <div>
            <h2>Add Repair</h2>
            <label htmlFor="vehicle-select">Select Vehicle:</label>
            <select
                id="vehicle-select"
                onChange={(e) => setSelectedVehicle(e.target.value)}
                value={selectedVehicle}
            >
                <option value="">-- Select a Vehicle --</option>
                {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model}
                    </option>
                ))}
            </select>

            <label htmlFor="component-select">Select Component:</label>
            <select
                id="component-select"
                onChange={(e) => setSelectedComponent(e.target.value)}
                value={selectedComponent}
            >
                <option value="">-- Select a Component --</option>
                {components.map((component) => (
                    <option key={component.id} value={component.id}>
                        {component.name}
                    </option>
                ))}
            </select>

            <button onClick={addIssue}>Add Issue</button>
            <button onClick={submitRepair}>Submit Repair</button>

            <h3>Issues Added:</h3>
            <ul>
                {issues.map((issue, index) => (
                    <li key={index}>
                        Vehicle ID: {issue.vehicle}, Component ID: {issue.component}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ServiceForm;
