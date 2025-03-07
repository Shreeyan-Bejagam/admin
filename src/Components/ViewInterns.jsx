import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewInterns = () => {
  const [interns, setInterns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/auth/interns").then((result) => {
      if (result.data.Status) {
        setInterns(result.data.Result);
      } else {
        alert(result.data.Error || "Failed to fetch interns.");
      }
    });
  }, []);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Interns List</h3>

      {/* Search by Team */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Team..."
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interns
            .filter((intern) => intern.team_name.toLowerCase().includes(searchQuery))
            .map((intern) => (
              <tr key={intern.id}>
                <td>{intern.name}</td>
                <td>{intern.team_name}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => navigate(`/dashboard/view_employee/${intern.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className="btn btn-secondary" onClick={() => navigate("/dashboard/departments")}>
        Back
      </button>
    </div>
  );
};

export default ViewInterns;
