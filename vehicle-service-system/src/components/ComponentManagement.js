// src/components/ComponentRegistration.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComponentRegistration = () => {
    const [name, setName] = useState('');
    const [repairPrice, setRepairPrice] = useState('');
    const [components, setComponents] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch existing components on mount
    const fetchComponents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/components/');
            setComponents(response.data);
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const component = { name, repair_price: repairPrice };

        try {
            if (editingId) {
                // Edit existing component
                await axios.put(`http://localhost:8000/api/components/${editingId}/`, component);
                setSuccessMessage('Component updated successfully!');
            } else {
                // Add new component
                await axios.post('http://localhost:8000/api/components/', component);
                setSuccessMessage('Component registered successfully!');
            }

            // Clear fields after submission
            setName('');
            setRepairPrice('');
            setEditingId(null);
            fetchComponents(); // Refresh the component list
        } catch (error) {
            console.error('Error submitting component:', error);
            setSuccessMessage('Error occurred while processing your request.');
        }
    };

    // Handle edit button click
    const handleEdit = (component) => {
        setName(component.name);
        setRepairPrice(component.repair_price);
        setEditingId(component.id);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Component Name"
                    required
                />
                <input
                    type="number"
                    value={repairPrice}
                    onChange={(e) => setRepairPrice(e.target.value)}
                    placeholder="Repair Price"
                    required
                />
                <button type="submit">{editingId ? 'Update Component' : 'Register Component'}</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
            <h2>Existing Components</h2>
            <ul>
                {components.map((component) => (
                    <li key={component.id}>
                        {component.name} - ${component.repair_price}
                        <button onClick={() => handleEdit(component)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComponentRegistration;
