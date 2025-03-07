import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewDepartmentEmployees = () => {
  const { id } = useParams();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/department_employees/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching department employees:", err));
  }, [id]);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Department Employees</h3>

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name..."
        onChange={(e) => setSearch(e.target.value)}
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
          {employees
            .filter((emp) =>
              emp.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.team_name || "No Team Assigned"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => navigate(`/dashboard/view_employee/${emp.id}`)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDepartmentEmployees;
