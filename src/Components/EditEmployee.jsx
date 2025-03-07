import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]); // ✅ Store all teams
  const [selectedTeams, setSelectedTeams] = useState([]); // ✅ Store selected teams
  const navigate = useNavigate();

  // Fetch employee details, departments, and teams
  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result[0]);
        } else {
          alert(result.data.Error || "Failed to fetch employee details.");
        }
      })
      .catch((err) => console.error("Error fetching employee details:", err));

    axios
      .get("http://localhost:3000/auth/departments")
      .then((result) => {
        if (result.data.Status) {
          setDepartments(result.data.Result);
        } else {
          alert(result.data.Error || "Failed to fetch departments.");
        }
      })
      .catch((err) => console.error("Error fetching departments:", err));

    axios
      .get("http://localhost:3000/auth/teams") // ✅ Fetch all available teams
      .then((result) => {
        if (result.data.Status) {
          setTeams(result.data.Result);
        } else {
          alert(result.data.Error || "Failed to fetch teams.");
        }
      })
      .catch((err) => console.error("Error fetching teams:", err));

    axios
      .get(`http://localhost:3000/auth/employee_teams/${id}`) // ✅ Fetch assigned teams
      .then((result) => {
        if (result.data.Status) {
          setSelectedTeams(result.data.Result.map((team) => team.id)); // ✅ Store selected team IDs
        } else {
          alert(result.data.Error || "Failed to fetch employee teams.");
        }
      })
      .catch((err) => console.error("Error fetching employee teams:", err));
  }, [id]);

  // Handle text input changes
  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.files[0] });
  };

  // ✅ Handle team selection (checkbox)
  const handleTeamChange = (teamId) => {
    setSelectedTeams((prevTeams) =>
      prevTeams.includes(teamId)
        ? prevTeams.filter((id) => id !== teamId) // ✅ Remove if unchecked
        : [...prevTeams, teamId] // ✅ Add if checked
    );
  };

  // Handle Save
  const handleSave = () => {
    const formData = new FormData();

    // Format date fields to `YYYY-MM-DD`
    if (employee.dob) {
      const formattedDob = new Date(employee.dob).toISOString().split("T")[0];
      formData.append("dob", formattedDob);
    }

    if (employee.joining_date) {
      const formattedJoiningDate = new Date(employee.joining_date).toISOString().split("T")[0];
      formData.append("joining_date", formattedJoiningDate);
    }

    // Append all text fields except files
    Object.keys(employee).forEach((key) => {
      if (key !== "dob" && key !== "joining_date" && key !== "image" && key !== "resume" && key !== "tenth_memo" && key !== "inter_memo" && key !== "aadhar" && key !== "pan") {
        formData.append(key, employee[key]);
      }
    });

    // ✅ Append selected teams
    formData.append("teams", JSON.stringify(selectedTeams));

    // Append files if a new file is selected
    ["image", "resume", "tenth_memo", "inter_memo", "aadhar", "pan"].forEach((fileKey) => {
      if (employee[fileKey] instanceof File) {
        formData.append(fileKey, employee[fileKey]);
      } else {
        formData.append(`existing_${fileKey}`, employee[fileKey]); // Preserve existing file
      }
    });

    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, formData)
      .then((result) => {
        if (result.data.Status) {
          alert("Employee details updated successfully!");
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error || "Failed to update employee details.");
        }
      })
      .catch((err) => console.error("Error updating employee details:", err));
  };

  return (
    <div className="container mt-3">
      <h3 className="text-center">Edit Employee Details</h3>
      <div className="card p-4">
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={employee.name || ""} onChange={handleInputChange} />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={employee.email || ""} onChange={handleInputChange} />
        </div>

        {/* Date of Birth */}
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" name="dob" value={employee.dob ? employee.dob.split("T")[0] : ""} onChange={handleInputChange} />
        </div>

        {/* Contact Number */}
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input type="text" className="form-control" name="contact_number" value={employee.contact_number || ""} onChange={handleInputChange} />
        </div>

        {/* Department */}
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select className="form-select" name="department_id" value={employee.department_id || ""} onChange={handleInputChange}>
            <option value="">Select a Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Team Selection (Checkboxes) */}
        <div className="mb-3">
          <label className="form-label">Teams (Optional)</label>
          {teams.map((team) => (
            <div key={team.id} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={`team_${team.id}`}
                value={team.id}
                checked={selectedTeams.includes(team.id)}
                onChange={() => handleTeamChange(team.id)}
              />
              <label className="form-check-label" htmlFor={`team_${team.id}`}>
                {team.name}
              </label>
            </div>
          ))}
        </div>
        {/* Joining Date */}
        <div className="mb-3">
          <label className="form-label">Joining Date</label>
          <input type="date" className="form-control" name="joining_date" value={employee.joining_date ? employee.joining_date.split("T")[0] : ""} onChange={handleInputChange} />
        </div>

        {/* Parent Name */}
        <div className="mb-3">
          <label className="form-label">Parent Name</label>
          <input type="text" className="form-control" name="parent_name" value={employee.parent_name || ""} onChange={handleInputChange} />
        </div>

        {/* Parent Contact */}
        <div className="mb-3">
          <label className="form-label">Parent Contact</label>
          <input type="text" className="form-control" name="parent_number" value={employee.parent_number || ""} onChange={handleInputChange} />
        </div>

        {/* Profile Image */}
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input type="file" className="form-control" name="image" onChange={handleFileChange} />
        </div>

        {/* File Uploads */}
        {["resume", "tenth_memo", "inter_memo", "aadhar", "pan"].map((fileKey) => (
          <div className="mb-3" key={fileKey}>
            <label className="form-label">{fileKey.replace("_", " ").toUpperCase()}</label>
            <input type="file" className="form-control" name={fileKey} onChange={handleFileChange} />
          </div>
        ))}

        {/* Buttons */}
        <div className="text-center">
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => navigate("/dashboard/employee")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
