import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${id}`)
        .then((result) => {
          if (result.data.Status) {
            alert("Employee deleted successfully!");
            setEmployee(employee.filter((emp) => emp.id !== id)); // Remove from UI
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Designation</th> {/* ✅ Changed from Address to Designation */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="employee_image"
                    alt={e.name}
                  />
                </td>
                <td>{e.email}</td>
                {/* ✅ Display Department Name Under Designation */}
                <td>{e.department_name ? e.department_name : "N/A"}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => navigate(`/dashboard/employee/${e.id}`)}
                  >
                    View More
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Employee;
