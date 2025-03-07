import React, { useState } from "react";

const Attendance = () => {
  // Hardcoded data for now; can be replaced with dynamic backend data
  const [employees, setEmployees] = useState([
    { name: "Bhargavi", status: "Present", time: "09:20 AM" },
    { name: "PoojaSindhuri", status: "Present", time: "09:00 AM" },
    { name: "Shreeyan", status: "Present", time: "09:00 AM" },
    { name: "Varun", status: "Present", time: "09:30 AM" },
    { name: "Suhas", status: "Present", time: "09:30 AM" },
    { name: "Sharath", status: "Present", time: "09:10 AM" },
    { name: "Bharath", status: "Absent", time: "-" },
    { name: "Bhargav", status: "Present", time: "09:10 AM" },
    { name: "Hema", status: "Present", time: "09:30 AM" },
    { name: "Harshith", status: "Present", time: "09:20 AM" },
    { name: "Yashaswi", status: "Present", time: "09:20 AM" },
  ]);

  // Calculate summary
  const totalEmployees = employees.length;
  const presentCount = employees.filter((e) => e.status === "Present").length;
  const absentCount = employees.filter((e) => e.status === "Absent").length;
  const onTimeCount = 10; // Example hardcoded value; replace with real data if needed

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Attendance</h3>

      {/* Summary Section */}
      <div className="row mb-4">
        {/* Total Employees */}
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Employees</h5>
            <h3 className="text-primary">{totalEmployees}</h3>
          </div>
        </div>

        {/* Present Today */}
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Present Today</h5>
            <h3 className="text-success">{presentCount}</h3>
          </div>
        </div>

        {/* Absent Today */}
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Absent Today</h5>
            <h3 className="text-danger">{absentCount}</h3>
          </div>
        </div>

        {/* On Time Today */}
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h5>On Time Today</h5>
            <h3 className="text-success">{onTimeCount}</h3>
          </div>
        </div>
      </div>

      {/* Date Display */}
      <div className="d-flex justify-content-center mb-3">
        <h5>Date: {today}</h5>
      </div>

      {/* Attendance Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>
                <span
                  className={`badge ${
                    employee.status === "Present" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td>{employee.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
