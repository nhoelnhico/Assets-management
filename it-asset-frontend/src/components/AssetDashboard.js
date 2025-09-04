import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AssetDashboard.css';

const AssetDashboard = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/assets');
                setAssets(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assets:', error);
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const totalAssets = assets.length;
    const clearedAssets = assets.filter(asset => asset.status === 'Cleared').length;
    const notClearedAssets = totalAssets - clearedAssets;

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">IT Assets Management Dashboard</h1>
            <div className="stats-cards">
                <div className="card total-card">
                    <h2>Total Assets</h2>
                    <p>{totalAssets}</p>
                </div>
                <div className="card cleared-card">
                    <h2>Cleared</h2>
                    <p>{clearedAssets}</p>
                </div>
                <div className="card not-cleared-card">
                    <h2>Not Cleared</h2>
                    <p>{notClearedAssets}</p>
                </div>
            </div>
            
            <div className="quick-links">
                <Link to="/admin" className="link-button">Go to Admin Page</Link>
                <Link to="/add-asset" className="link-button">Add New Asset</Link>
            </div>
            
            <div className="asset-list-container">
                <h2 className="list-title">All IT Assets</h2>
                <div className="asset-list">
                    {assets.map(asset => (
                        <div key={asset.id} className="asset-item">
                            <p><strong>Employee:</strong> {asset.name}</p>
                            <p><strong>Laptop Tag #:</strong> {asset.laptop_tag_num || 'N/A'}</p>
                            <p><strong>Status:</strong> {asset.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssetDashboard;