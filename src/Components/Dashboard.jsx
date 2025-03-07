import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/adminlogin");
        } else {
          alert("Logout failed! Please try again.");
        }
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        alert("An error occurred during logout. Please try again.");
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                SSEV Soft Sols
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle d-flex align-items-center"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link px-0 align-middle text-white d-flex align-items-center"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Employees</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/departments"
                  className="nav-link px-0 align-middle text-white d-flex align-items-center"
                >
                  <i className="fs-4 bi-building ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Department</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/assets"
                  className="nav-link px-0 align-middle text-white d-flex align-items-center"
                >
                  <i className="fs-4 bi-box ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Assets</span>
                </Link>
                <li className="w-100">
                <Link
                  to="/dashboard/assetlogs"
                  className="nav-link px-0 align-middle text-white d-flex align-items-center"
                >
                  <i className="fs-4 bi-clipboard-data ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Asset Logs</span>
                </Link>
              </li>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/attendance"
                  className="nav-link px-0 align-middle text-white d-flex align-items-center"
                >
                  <i className="fs-4 bi-calendar-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/tasks" className="nav-link px-0 align-middle text-white d-flex align-items-center">
                  <i className="fs-4 bi-list-task ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Tasks</span>
                </Link>
              </li>
             
              
              <li className="w-100">
                <button
                  className="btn nav-link px-0 align-middle text-white d-flex align-items-center"
                  onClick={handleLogout}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
