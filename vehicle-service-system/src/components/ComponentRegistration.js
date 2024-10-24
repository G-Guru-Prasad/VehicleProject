// src/components/ComponentRegistration.js
import React, { useState } from 'react';
import axios from 'axios';

const ComponentRegistration = () => {
    const [name, setName] = useState('');
    const [repairPrice, setRepairPrice] = useState('');
    const [isNew, setIsNew] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const component = { name, repair_price: repairPrice, is_new: isNew };
        await axios.post('/api/components/', component);
        // Clear fields or show success message
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Component Name" required />
            <input type="number" value={repairPrice} onChange={(e) => setRepairPrice(e.target.value)} placeholder="Repair Price" required />
            <label>
                New
                <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
            </label>
            <button type="submit">Register Component</button>
        </form>
    );
};

export default ComponentRegistration;
