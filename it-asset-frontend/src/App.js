import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AssetDashboard from './components/AssetDashboard';
import AdminPage from './components/AdminPage';
import AssetForm from './components/AssetForm';
import './App.css'; // Add some basic styling

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="nav-bar">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/admin" className="nav-link">Admin</Link>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<AssetDashboard />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/add-asset" element={<AssetForm />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;