import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    contact_number: "",
    address: "",
    parent_name: "",
    parent_number: "",
    dob: "",
    joining_date: "",
    department_id: "",
    teams: [],
    image: null,
    resume: null,
    tenth_memo: null,
    inter_memo: null,
    aadhar: null,
    pan: null,
  });

  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  // Fetch departments & teams on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/departments")
      .then((result) => {
        if (result.data.Status) {
          setDepartments(result.data.Result);
        } else {
          alert(result.data.Error || "Failed to fetch departments");
        }
      })
      .catch((err) => console.error("Error fetching departments:", err));

    axios
      .get("http://localhost:3000/auth/teams") // ✅ Fetch teams
      .then((result) => {
        if (result.data.Status) {
          setTeams(result.data.Result);
        } else {
          alert(result.data.Error || "Failed to fetch teams");
        }
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  const handleTeamChange = (teamId) => {
    setEmployee((prev) => {
      const updatedTeams = prev.teams.includes(teamId)
        ? prev.teams.filter((id) => id !== teamId) // Remove team if already selected
        : [...prev.teams, teamId]; // Add team if not selected
      return { ...prev, teams: updatedTeams };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (
      !employee.name ||
      !employee.email ||
      !employee.password ||
      !employee.contact_number ||
      !employee.address ||
      !employee.parent_name ||
      !employee.parent_number ||
      !employee.dob ||
      !employee.joining_date ||
      !employee.department_id
    ) {
      alert("All fields except teams and file uploads are required");
      return;
    }

    const formData = new FormData();
    Object.keys(employee).forEach((key) => {
      if (key === "teams") {
        formData.append("teams", JSON.stringify(employee.teams)); // ✅ Convert array to JSON
      } else {
        formData.append(key, employee[key]);
      }
    });

    axios
      .post("http://localhost:3000/auth/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          alert("Employee added successfully");
          navigate("/dashboard/employee");
        } else {
          console.error("Error response:", result.data);
          alert(result.data.Error || "Unknown error occurred");
        }
      })
      .catch((err) => {
        console.error("Request failed:", err);
        alert("An unexpected error occurred while submitting the form.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Office Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Contact Number</label> {/* ✅ Updated Label */}
            <input
              type="text"
              className="form-control"
              placeholder="Enter Contact Number"
              onChange={(e) => setEmployee({ ...employee, contact_number: e.target.value })} // ✅ Updated field name
            />
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Address"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Parent Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Parent Name"
              onChange={(e) => setEmployee({ ...employee, parent_name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Parent Contact Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Parent Contact Number"
              onChange={(e) => setEmployee({ ...employee, parent_number: e.target.value })}
            />
          </div>

          <div className="col-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setEmployee({ ...employee, dob: e.target.value })}
            />
          </div>

          <div className="col-6">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setEmployee({ ...employee, joining_date: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              onChange={(e) =>
                setEmployee({ ...employee, department_id: parseInt(e.target.value) })
              }
            >
              <option value="" disabled selected>
                Select a Department
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          {/* ✅ Clickable Multi-Select Teams */}
          <div className="col-12">
            <label className="form-label">Teams (Optional)</label>
            <div className="d-flex flex-wrap">
              {teams.map((t) => (
                <div key={t.id} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`team-${t.id}`}
                    checked={employee.teams.includes(t.id)}
                    onChange={() => handleTeamChange(t.id)}
                  />
                  <label className="form-check-label" htmlFor={`team-${t.id}`}>
                    {t.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          {/* File Uploads */}
          <div className="col-12">
            <label className="form-label d-block">Upload Documents (Optional)</label>

            <label className="form-label mt-1">Resume/CV</label>
            <input type="file" className="form-control" onChange={(e) => setEmployee({ ...employee, resume: e.target.files[0] })} />

            <label className="form-label mt-1">10th Memo</label>
            <input type="file" className="form-control" onChange={(e) => setEmployee({ ...employee, tenth_memo: e.target.files[0] })} />

            <label className="form-label mt-1">Inter Memo</label>
            <input type="file" className="form-control" onChange={(e) => setEmployee({ ...employee, inter_memo: e.target.files[0] })} />

            <label className="form-label mt-1">Aadhar</label>
            <input type="file" className="form-control" onChange={(e) => setEmployee({ ...employee, aadhar: e.target.files[0] })} />

            <label className="form-label mt-1">Pan Card</label>
            <input type="file" className="form-control" onChange={(e) => setEmployee({ ...employee, pan: e.target.files[0] })} />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
