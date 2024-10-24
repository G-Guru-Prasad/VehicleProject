// src/components/RevenueGraph.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueGraph = () => {
    const [revenueData, setRevenueData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/revenue_summary/');
                setRevenueData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
                setError('Failed to load revenue data.');
                setLoading(false);
            }
        };
        fetchRevenueData();
    }, []);

    const graphData = [
        { name: 'Daily', revenue: revenueData.daily_revenue || 0 },
        { name: 'Monthly', revenue: revenueData.monthly_revenue || 0 },
        { name: 'Yearly', revenue: revenueData.yearly_revenue || 0 }
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Revenue Summary</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueGraph;
