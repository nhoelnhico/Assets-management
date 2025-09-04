import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import { DownloadButton } from './AssetPDF'; // Import the component

const AdminPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, []);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(`http://localhost:3001/api/assets/${id}`);
                fetchAssets(); // Refresh the list
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    if (loading) return <div>Loading admin page...</div>;

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin Asset Management</h1>
            <Link to="/add-asset" className="add-button">Add New Asset</Link>
            <table className="asset-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Laptop Tag #</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map(asset => (
                        <tr key={asset.id}>
                            <td>{asset.employee_id}</td>
                            <td>{asset.name}</td>
                            <td>{asset.position}</td>
                            <td>{asset.laptop_tag_num || 'N/A'}</td>
                            <td>{asset.status}</td>
                            <td className="actions-cell">
                            <button onClick={() => handleDelete(asset.id)} className="delete-btn">Delete</button>
                            <DownloadButton asset={asset} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;