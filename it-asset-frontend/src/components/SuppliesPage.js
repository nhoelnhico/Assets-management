import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SuppliesPage.css";

const SuppliesPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false); // modal toggle
  const [newSupply, setNewSupply] = useState({
    tag_name: "",
    device_name: "",
    status: "Available",
  });

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/supplies");
      setSupplies(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching supplies:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supply?")) {
      try {
        await axios.delete(`http://localhost:3001/api/supplies/${id}`);
        fetchSupplies();
      } catch (error) {
        console.error("Error deleting supply:", error);
      }
    }
  };

  const handleEdit = async (supply) => {
    const updatedStatus = prompt(
      "Enter new status (Available, In Use, Broken):",
      supply.status
    );
    if (updatedStatus) {
      try {
        await axios.put(`http://localhost:3001/api/supplies/${supply.id}`, {
          ...supply,
          status: updatedStatus,
        });
        fetchSupplies();
      } catch (error) {
        console.error("Error updating supply:", error);
      }
    }
  };

  // 👉 Handle Add New Supply Submit
  const handleAddSupply = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/supplies", newSupply);
      fetchSupplies();
      setShowForm(false);
      setNewSupply({ tag_name: "", device_name: "", status: "Available" });
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };

  // 👉 Download all to CSV
  const downloadAll = () => {
    const csvRows = [];
    const headers = ["Tag Name", "Device Name", "Status"];
    csvRows.push(headers.join(","));

    supplies.forEach((s) => {
      csvRows.push([s.tag_name, s.device_name, s.status].join(","));
    });

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(csvData);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplies.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredSupplies = supplies.filter(
    (s) =>
      s.tag_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading supplies...</div>;

  return (
    <div className="supplies-page">
      <div className="supplies-header">
        <h1 className="supplies-title">IT Supplies</h1>
        <div className="supplies-actions">
          <button
            className="btn btn-primary add-button"
            onClick={() => setShowForm(true)}
          >
            + Add New Supply
          </button>
          <button className="btn btn-primary download-btn" onClick={downloadAll}>
            Download All
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Tag, Device or Status"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Supplies Table */}
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
          {filteredSupplies.map((supply) => (
            <tr key={supply.id}>
              <td>{supply.tag_name}</td>
              <td>{supply.device_name}</td>
              <td>
                <span
                  className={
                    supply.status === "Available"
                      ? "status-badge available"
                      : "status-badge inuse"
                  }
                >
                  {supply.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-success edit-btn"
                  onClick={() => handleEdit(supply)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger delete-btn"
                  onClick={() => handleDelete(supply.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Supply Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Supply</h2>
            <form onSubmit={handleAddSupply} className="supply-form">
              <label>Tag Name</label>
              <input
                type="text"
                value={newSupply.tag_name}
                onChange={(e) =>
                  setNewSupply({ ...newSupply, tag_name: e.target.value })
                }
                required
              />

              <label>Device Name</label>
              <input
                type="text"
                value={newSupply.device_name}
                onChange={(e) =>
                  setNewSupply({ ...newSupply, device_name: e.target.value })
                }
                required
              />

              <label>Status</label>
              <select
                value={newSupply.status}
                onChange={(e) =>
                  setNewSupply({ ...newSupply, status: e.target.value })
                }
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Broken">Broken</option>
              </select>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliesPage;
