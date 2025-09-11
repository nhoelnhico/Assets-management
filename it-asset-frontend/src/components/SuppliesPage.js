import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SuppliesPage.css';

const SuppliesPage = () => {
    const [supplies, setSupplies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [supplyCounts, setSupplyCounts] = useState({
        total: 0,
        available: 0,
        inUse: 0,
        damaged: 0,
    });

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/supplies');
            setSupplies(res.data);
            calculateCounts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching supplies:', error);
            setLoading(false);
        }
    };

    const calculateCounts = (suppliesData) => {
        let available = 0;
        let inUse = 0;
        let damaged = 0;

        suppliesData.forEach(supply => {
            const status = supply.status?.toLowerCase();
            if (status === 'available') available++;
            else if (status === 'in use') inUse++;
            else damaged++;
        });

        setSupplyCounts({
            total: suppliesData.length,
            available,
            inUse,
            damaged,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supply?")) return;
        await axios.delete(`http://localhost:3001/api/supplies/${id}`);
        fetchSupplies();
    };

    const filteredSupplies = supplies.filter(supply =>
        supply.tag_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supply.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supply.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>Loading supplies...</p>;

    return (
        <div className="supplies-container">
            <div className="supplies-header">
                <h1>IT Supplies</h1>
                <button
                    className="download-btn"
                    onClick={() => window.print()}
                >
                    Download All
                </button>
            </div>

            {/* NEW: Supplies count cards */}
            <div className="asset-counts-grid">
                <div className="total-count-card count-card">
                    <span className="count-value">{supplyCounts.total}</span>
                    <span className="count-label">Total Supplies</span>
                </div>
                <div className="count-card">
                    <span className="count-value">{supplyCounts.available}</span>
                    <span className="count-label">Available</span>
                </div>
                <div className="count-card">
                    <span className="count-value">{supplyCounts.inUse}</span>
                    <span className="count-label">In Use</span>
                </div>
                <div className="count-card">
                    <span className="count-value">{supplyCounts.damaged}</span>
                    <span className="count-label">Damaged / Others</span>
                </div>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Tag, Device or Status"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <table className="supplies-table">
                <thead>
                    <tr>
                        <th>Tag Name</th>
                        <th>Device Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSupplies.map(supply => (
                        <tr key={supply.id}>
                            <td>{supply.tag_name}</td>
                            <td>{supply.device_name}</td>
                            <td>
                                <span className={`status-badge ${supply.status.toLowerCase()}`}>
                                    {supply.status}
                                </span>
                            </td>
                            <td>
                                <button className="edit-btn">Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(supply.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SuppliesPage;
