import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditAsset = ({ fetchAssets }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "",
    stock: 0,
    date_issued: "",
    holding_person: "",
    serial_number: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/assets/${id}`)
      .then((response) => {
        if (response.data.Status) {
          setFormData(response.data.Result[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_asset/${id}`, formData)
      .then((response) => {
        if (response.data.Status) {
          fetchAssets();
          alert("Asset updated successfully!");
        } else {
          alert("Error updating asset!");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Asset Name:</label>
        <input
          type="text"
          value={formData.asset_name}
          onChange={(e) =>
            setFormData({ ...formData, asset_name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Asset Type:</label>
        <select
          value={formData.asset_type}
          onChange={(e) =>
            setFormData({ ...formData, asset_type: e.target.value })
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
      <div>
        <label>Stock:</label>
        <input
          type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Date Issued:</label>
        <input
          type="date"
          value={formData.date_issued}
          onChange={(e) =>
            setFormData({ ...formData, date_issued: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Holding Person:</label>
        <input
          type="text"
          value={formData.holding_person}
          onChange={(e) =>
            setFormData({ ...formData, holding_person: e.target.value })
          }
          required
        />
      </div>
      {formData.asset_type === "License" && (
        <div>
          <label>Serial Number:</label>
          <input
            type="text"
            value={formData.serial_number}
            onChange={(e) =>
              setFormData({ ...formData, serial_number: e.target.value })
            }
            required
          />
        </div>
      )}
      <button type="submit">Edit Asset</button>
    </form>
  );
};

export default EditAsset;
