import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [teams, setTeams] = useState([]); // ✅ Store assigned teams separately
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result[0] || {}); // ✅ Ensure employee data is not undefined
        } else {
          alert(result.data.Error || "Failed to fetch employee details.");
        }
      })
      .catch((err) => console.error("Error fetching employee details:", err));

    // ✅ Fetch assigned teams separately
    axios
      .get(`http://localhost:3000/auth/employee_teams/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setTeams(result.data.Result || []); // ✅ Ensure teams is an array
        } else {
          alert(result.data.Error || "Failed to fetch employee teams.");
        }
      })
      .catch((err) => console.error("Error fetching employee teams:", err));
  }, [id]);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Employee Details</h3>
      <div className="card p-4">
        <div className="mb-3"><strong>Name:</strong> {employee.name || "N/A"}</div>
        <div className="mb-3"><strong>Email:</strong> {employee.email || "N/A"}</div>
        <div className="mb-3"><strong>Date of Birth:</strong> {employee.dob || "N/A"}</div>
        <div className="mb-3"><strong>Contact Number:</strong> {employee.contact_number || "N/A"}</div>
        <div className="mb-3"><strong>Joining Date:</strong> {employee.joining_date || "N/A"}</div>
        <div className="mb-3"><strong>Parent Name:</strong> {employee.parent_name || "N/A"}</div>
        <div className="mb-3"><strong>Parent Contact:</strong> {employee.parent_number || "N/A"}</div>
        <div className="mb-3"><strong>Department:</strong> {employee.department_name || "N/A"}</div>

        {/* ✅ Added Address Column */}
        <div className="mb-3"><strong>Address:</strong> {employee.address || "N/A"}</div>

        {/* ✅ Added Teams Section */}
        <div className="mb-3">
          <strong>Teams:</strong>{" "}
          {teams.length > 0 ? (
            <ul>
              {teams.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          ) : (
            "No teams assigned"
          )}
        </div>

        <div className="mb-3">
          <strong>Profile Image:</strong>
          {employee.image ? (
            <img
              src={`http://localhost:3000/Images/${employee.image}`}
              alt="Profile"
              className="img-thumbnail d-block mt-2"
              style={{ width: "100px", height: "100px" }}
            />
          ) : "N/A"}
        </div>

        {/* File Uploads */}
        <div className="mb-3"><strong>Resume:</strong> {employee.resume ? (
          <a href={`http://localhost:3000/Images/${employee.resume}`} download>Download Resume</a>) : "N/A"}</div>
        <div className="mb-3"><strong>10th Memo:</strong> {employee.tenth_memo ? (
          <a href={`http://localhost:3000/Images/${employee.tenth_memo}`} download>Download 10th Memo</a>) : "N/A"}</div>
        <div className="mb-3"><strong>Inter Memo:</strong> {employee.inter_memo ? (
          <a href={`http://localhost:3000/Images/${employee.inter_memo}`} download>Download Inter Memo</a>) : "N/A"}</div>
        <div className="mb-3"><strong>Aadhar:</strong> {employee.aadhar ? (
          <a href={`http://localhost:3000/Images/${employee.aadhar}`} download>Download Aadhar</a>) : "N/A"}</div>
        <div className="mb-3"><strong>PAN:</strong> {employee.pan ? (
          <a href={`http://localhost:3000/Images/${employee.pan}`} download>Download PAN</a>) : "N/A"}</div>

        {/* Buttons */}
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate(`/dashboard/edit_employee/${id}`)}>Edit</button>
          <button className="btn btn-secondary ms-2" onClick={() => navigate("/dashboard/employee")}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
