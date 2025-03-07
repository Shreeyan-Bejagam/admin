import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewEmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result[0]);
        } else {
          alert("Failed to fetch employee details.");
        }
      })
      .catch((err) => console.error("Error fetching employee details:", err));
  }, [id]);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Employee Details</h3>
      <div className="card p-4">
        <div className="mb-3">
          <strong>Name:</strong> {employee.name || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {employee.email || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Date of Birth:</strong> {employee.dob || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Contact Number:</strong> {employee.contact_number || "N/A"}
        </div>
        <div className="mb-3">
          <strong>Department:</strong> {employee.department_name || "N/A"}
        </div>

        {/* Dummy Data for Leaves */}
        <div className="mb-3">
          <strong>Leaves Applied:</strong> 5 {/* Dummy Value */}
        </div>
        <div className="mb-3">
          <strong>Leaves Left:</strong> 10 {/* Dummy Value */}
        </div>
        <div className="mb-3">
          <strong>Number of Working Days:</strong> 230 {/* Dummy Value */}
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeDetails;
