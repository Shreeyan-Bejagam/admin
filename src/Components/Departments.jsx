import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = axios.get("http://localhost:3000/auth/departments");
    const fetchTeams = axios.get("http://localhost:3000/auth/teams");
  
    Promise.all([fetchDepartments, fetchTeams])
      .then(([departmentsRes, teamsRes]) => {
        if (departmentsRes.data.Status) {
          setDepartments(departmentsRes.data.Result);
        } else {
          console.warn("❌ Department Fetch Error:", departmentsRes.data.Error);
        }
  
        if (teamsRes.data.Status) {
          setTeams(teamsRes.data.Result);
        } else {
          console.warn("❌ Team Fetch Error:", teamsRes.data.Error);
        }
      })
      .catch((err) => console.error("❌ Error fetching data:", err));
  }, []); // ✅ Runs only once when the component mounts
  

  // Handle Delete Department
  const handleDeleteDepartment = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      axios.delete(`http://localhost:3000/auth/delete_department/${id}`)
        .then((res) => {
          if (res.data.Status) {
            alert("Department deleted successfully!");
            setDepartments(departments.filter(dept => dept.id !== id)); // Update state
          } else {
            alert(res.data.Error);
          }
        })
        .catch((err) => console.error("Error deleting department:", err));
    }
  };

  // Handle Add Team
  const handleAddTeam = () => {
    if (!newTeam.trim()) {
      alert("Team name cannot be empty!");
      return;
    }

    axios.post("http://localhost:3000/auth/add_team", { name: newTeam })
      .then((res) => {
        if (res.data.Status) {
          setTeams([...teams, { id: res.data.id, name: newTeam }]);
          setNewTeam("");
          setShowTeamModal(false);
        } else {
          alert(res.data.Error);
        }
      });
  };

  // Handle Delete Team
  const handleDeleteTeam = (id) => {
    axios.delete(`http://localhost:3000/auth/delete_team/${id}`).then((res) => {
      if (res.data.Status) {
        setTeams(teams.filter((team) => team.id !== id));
      } else {
        alert(res.data.Error);
      }
    });
  };

  return (
    <div className="container mt-3">
      <h3 className="text-center">Department List</h3>
      <div className="d-flex justify-content-between mb-3">
      <button className="btn btn-success" onClick={() => navigate("/dashboard/add_department")}>
  Add Department
</button>
        
        <button className="btn btn-primary" onClick={() => setShowTeamModal(true)}>Add Team</button>
      </div>

      {/* Departments Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.name}</td>
              <td>
              <button className="btn btn-info btn-sm me-2" onClick={() => handleDeleteDepartment(dept.id)}>Delete</button>

                <button className="btn btn-info btn-sm" onClick={() => navigate(`/dashboard/view_department/${dept.id}`)}>
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-center mt-5">Teams List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleDeleteTeam(team.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Team Modal */}
      {showTeamModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Team</h5>
                <button className="btn-close" onClick={() => setShowTeamModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Team Name"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowTeamModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddTeam}>Add Team</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
