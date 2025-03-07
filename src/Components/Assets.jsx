import React, { useEffect, useState } from "react";
import axios from "axios";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [type, setType] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    asset_name: "",
    asset_type: "",
    stock: 0,
    date_issued: "",
    liable_person: "",
    serial_number: "",
  });

  useEffect(() => {
    fetchAssets();
  }, [type, sortOrder]);

  const fetchAssets = () => {
    const endpoint = type === "All" ? "/auth/assets" : `/auth/assets?type=${type}`;
    
    axios.get(`http://localhost:3000${endpoint}`)
      .then((response) => {
        if (response.data.Status) {
          let sortedAssets = response.data.Result.sort((a, b) => 
            sortOrder === "asc"
              ? new Date(a.date_issued) - new Date(b.date_issued)
              : new Date(b.date_issued) - new Date(a.date_issued)
          );
          setAssets(sortedAssets);
        } else {
          alert("Failed to fetch assets");
        }
      })
      .catch((err) => console.error("Error fetching assets:", err));
  };

  const handleAddAsset = () => {
    if (
      !newAsset.asset_name ||
      !newAsset.asset_type ||
      !newAsset.stock ||
      !newAsset.date_issued ||
      !newAsset.liable_person ||
      (newAsset.asset_type === "License" && !newAsset.serial_number)
    ) {
      alert("Please fill all required fields!");
      return;
    }

    axios
      .post("http://localhost:3000/auth/add_asset", newAsset)
      .then((response) => {
        if (response.data.Status) {
          alert("Asset added successfully!");
          fetchAssets();
          setShowForm(false);
          setNewAsset({
            asset_name: "",
            asset_type: "",
            stock: 0,
            date_issued: "",
            liable_person: "",
            serial_number: "",
          });
        } else {
          alert(response.data.Error || "Error adding asset!");
        }
      })
      .catch((err) => {
        console.error("Error adding asset:", err);
        alert("An unexpected error occurred.");
      });
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_asset/${id}`)
        .then((response) => {
          if (response.data.Status) {
            alert("Asset deleted successfully!");
            setAssets(assets.filter((asset) => asset.id !== id)); // Remove from UI
          } else {
            alert("Failed to delete asset");
          }
        })
        .catch((err) => console.error("Error deleting asset:", err));
    }
  };

  const handleStartUsage = (id, assetName, serialNumber) => {
    const user = prompt("Enter your name:");
    if (!user) return;

    const duration = prompt("Enter duration in hours:");
    if (!duration || isNaN(duration) || duration <= 0) {
      alert("Please enter a valid duration in hours.");
      return;
    }

    axios.post(`http://localhost:3000/auth/start_asset/${id}`, { user, duration, assetName, serialNumber })
      .then((response) => {
        console.log("API Response:", response.data);

        if (response.data.Status) {
          alert(response.data.Message || "Success!");
          fetchAssets();
        } else {
          alert(response.data.Error || "Error updating asset.");
        }
      })
      .catch((err) => {
        console.error("Error starting asset usage:", err);
        alert("Error starting asset usage.");
      });
  };

  const handleStopUsage = (id) => {
    axios
      .post(`http://localhost:3000/auth/stop_asset/${id}`)
      .then((response) => {
        alert(response.data.Message);
        fetchAssets();
      })
      .catch((err) => console.error("Error stopping asset usage:", err));
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Assets</h3>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Asset"}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="d-flex justify-content-center mb-3">
        {["All", "Software", "Hardware", "License", "Other"].map((assetType) => (
          <button
            key={assetType}
            className={`btn me-2 ${type === assetType ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setType(assetType)}
          >
            {assetType}
          </button>
        ))}
      </div>
      {/* Single Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Liable Person, Status, or Current Holder"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <form
          className="mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAsset();
          }}
        >
          <div className="mb-2">
            <input
              type="text"
              placeholder="Asset Name"
              className="form-control"
              value={newAsset.asset_name}
              onChange={(e) =>
                setNewAsset({ ...newAsset, asset_name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select"
              value={newAsset.asset_type}
              onChange={(e) =>
                setNewAsset({ ...newAsset, asset_type: e.target.value })
              }
              required
            >
              <option value="">Select Type</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="License">License</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <input
              type="number"
              placeholder="Stock"
              className="form-control"
              value={newAsset.stock}
              onChange={(e) =>
                setNewAsset({ ...newAsset, stock: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              className="form-control"
              value={newAsset.date_issued}
              onChange={(e) =>
                setNewAsset({ ...newAsset, date_issued: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Liable Person"
              className="form-control"
              value={newAsset.liable_person}
              onChange={(e) =>
                setNewAsset({ ...newAsset, liable_person: e.target.value })
              }
              required
            />
          </div>
          {newAsset.asset_type === "License" && (
            <div className="mb-2">
              <input
                type="text"
                placeholder="Serial Number"
                className="form-control"
                value={newAsset.serial_number}
                onChange={(e) =>
                  setNewAsset({ ...newAsset, serial_number: e.target.value })
                }
                required
              />
            </div>
          )}
          <button className="btn btn-primary" type="submit">
            Add Asset
          </button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Stock</th>
            <th onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} style={{ cursor: "pointer" }}>
              Date Issued {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>Liable Person</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Current Holder</th>
            <th>Previous Holder</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets
            .filter(asset => 
              asset.liable_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.current_holder?.toLowerCase().includes(searchTerm.toLowerCase()) // Ensure current_holder exists
            )
            .map((asset, index) => (
              <tr key={asset.id}>
              <td>{index + 1}</td>
              <td>{asset.asset_name}</td>
              <td>{asset.asset_type}</td>
              <td>{asset.stock}</td>
              <td>{asset.date_issued}</td>
              <td>{asset.liable_person}</td>
              <td>{asset.serial_number || "N/A"}</td>
              <td>{asset.status}</td>
              <td>{asset.current_holder || "N/A"}</td>
              <td>{asset.previous_holder || "N/A"}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => handleDeleteAsset(asset.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assets;