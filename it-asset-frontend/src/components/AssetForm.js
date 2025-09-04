import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AssetForm.css';

const AssetForm = ({ assetData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        date: assetData.date ? new Date(assetData.date).toISOString().split('T')[0] : '',
        employee_id: assetData.employee_id || '',
        name: assetData.name || '',
        position: assetData.position || '',
        department: assetData.department || '',
        email: assetData.email || '',
        company: assetData.company || '',
        laptop: assetData.laptop || '',
        laptop_status: assetData.laptop_status || '',
        laptop_tag_num: assetData.laptop_tag_num || '',
        company_phone: assetData.company_phone || '',
        phone_status: assetData.phone_status || '',
        phone_tag_num: assetData.phone_tag_num || '',
        company_desktop: assetData.company_desktop || '',
        desktop_status: assetData.desktop_status || '',
        desktop_tag_num: assetData.desktop_tag_num || '',
        others: assetData.others || '',
        others_status: assetData.others_status || '',
        others_tag_num: assetData.others_tag_num || '',
        software_list: assetData.software_list || '',
        intended_use: assetData.intended_use || '',
        remarks: assetData.remarks || '',
        status: assetData.status || '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/assets', formData);
            alert('Asset added successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error adding asset:', error);
            alert('Error adding asset.');
        }
    };

    return (
        <div className="asset-form-container">
            <h1>Add New IT Asset</h1>
            <form onSubmit={handleSubmit} className="asset-form">
                {/* Form fields based on your Google Sheet data */}
                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Employee ID:</label>
                    <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Position:</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} />
                </div>
                {/* Add the rest of the fields here */}
                {/* Example for the status dropdown */}
                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="">Select Status</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Not Cleared">Not Cleared</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Save Asset</button>
            </form>
        </div>
    );
};

export default AssetForm;