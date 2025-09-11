import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DownloadButton } from './AssetPDF';
import './AdminPage.css';

const AdminPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search state
    const navigate = useNavigate();

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
                fetchAssets(); 
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    const handleEdit = (asset) => {
        navigate('/add-asset', { state: { assetData: asset } });
    };

    // 🔍 Filtered list
    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.employee_id.toString().includes(searchQuery) ||
        asset.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.laptop_tag_num?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Loading admin page...</div>;

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin Asset Management</h1>

            <div className="admin-actions">
                <Link to="/add-asset" className="add-button">Add New Asset</Link>
                
                {/* 🔍 Global Search */}
                <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* ⬇ Download All */}
                <button 
                    className="download-all-btn" 
                    onClick={() => downloadAll(filteredAssets)}
                >
                    Download All
                </button>
            </div>

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
                    {filteredAssets.map(asset => (
                        <tr key={asset.id}>
                            <td>{asset.employee_id}</td>
                            <td>{asset.name}</td>
                            <td>{asset.position}</td>
                            <td>{asset.laptop_tag_num || 'N/A'}</td>
                            <td className={asset.status === 'Active' ? 'status-active' : 'status-inactive'}>
                                {asset.status}
                            </td>
                            <td className="actions-cell">
                                <button onClick={() => handleEdit(asset)} className="edit-btn">Edit</button>
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

// 📥 Download All Function
const downloadAll = (assets) => {
    const csvRows = [];
    const headers = ["Employee ID", "Name", "Position", "Laptop Tag #", "Status"];
    csvRows.push(headers.join(","));

    assets.forEach(asset => {
        csvRows.push([
            asset.employee_id,
            asset.name,
            asset.position,
            asset.laptop_tag_num || "N/A",
            asset.status
        ].join(","));
    });

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(csvData);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "assets.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export default AdminPage;
