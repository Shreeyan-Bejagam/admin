import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MDDashboard = () => {
  const navigate = useNavigate();
  const [mdEmail, setMdEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // Notification toggle

  // ✅ Fetch MD Details on Load
  useEffect(() => {
    axios.get("http://localhost:3000/auth/user-details", { withCredentials: true })
        .then((res) => {
            if (res.data.Status && res.data.role === "MD") {
                setMdEmail(res.data.email);
                localStorage.setItem("userId", res.data.id);  // Store user ID for later use
                fetchNotifications(res.data.id);               // Fetch notifications after user details
            } else {
                fallbackToToken();
            }
        })
        .catch(() => {
            fallbackToToken();
        });
}, [navigate]);

// ✅ Fallback to token if cookie-based session fails (e.g., after refresh or long idle time)
const fallbackToToken = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        navigate("/adminlogin");
        return;
    }

    axios.get("http://localhost:3000/auth/validate-token", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
        if (res.data.valid && res.data.user.role === "MD") {
            setMdEmail(res.data.user.email);
            localStorage.setItem("userId", res.data.user.id);  // Store user ID
            fetchNotifications(res.data.user.id);               // Fetch notifications
        } else {
            navigate("/adminlogin");
        }
    })
    .catch(() => {
        navigate("/adminlogin");
    });
};




  // ✅ Fetch Notifications
  // ✅ Fix - Pass role 'MD' along with userId
  const fetchNotifications = (userId) => {
    const token = localStorage.getItem("authToken");

    axios
        .get(`http://localhost:3000/notifications/${userId}/MD`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            if (res.data.Status) {
                setNotifications(res.data.Notifications);
            }
        })
        .catch((err) => console.error("❌ Error fetching notifications:", err));
};



  // ✅ Handle Notification Click
  // ✅ Corrected function - passing indent_id instead of request_id
  const handleNotificationClick = (notificationId, indentId) => {
    // ✅ Mark as read but do NOT remove it from the frontend
    axios.post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
        .then(() => {
            navigate(`/md-dashboard/review_indent/${indentId}`);
        })
        .catch(err => console.error("❌ Error marking notification as read:", err));
};



  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/adminlogin");
};


  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center text-white">
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="MD Profile"
                className="rounded-circle"
                style={{ width: "80px", border: "2px solid white" }}
              />
              <h5 className="mt-2">Managing Director</h5>
              <p className="text-white-50">{mdEmail || "Loading..."}</p>
              <span className="badge bg-primary">MD</span>
            </div>

            <ul className="nav flex-column mt-4 w-100">
              <li><Link to="/md-dashboard" className="nav-link text-white">Dashboard</Link></li>
              <li><Link to="/md-dashboard/departments" className="nav-link text-white">Departments</Link></li>
              <li><Link to="/md-dashboard/employees" className="nav-link text-white">Employees</Link></li>
              <li><Link to="/md-dashboard/assets" className="nav-link text-white">Assets</Link></li>
              <li><Link to="/md-dashboard/approvals" className="nav-link text-white">Approvals</Link></li>
              <li><Link to="/md-dashboard/attendance" className="nav-link text-white">Attendance</Link></li>
              <li><Link to="/md-dashboard/assetlogs" className="nav-link text-white">Asset Logs</Link></li>
              <li>
                <span className="nav-link text-white" onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0">
          <div className="p-3 shadow d-flex justify-content-between align-items-center">
            <h4 className="m-0">MD Dashboard</h4>

            {/* 🔔 Notification Bell with Dropdown & Close Button */}
            <div className="position-relative">
              <span
                className="fs-3 bi-bell text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => setShowNotifications(!showNotifications)}
              ></span>

              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}

              {showNotifications && (
                <div
                  className="position-absolute bg-white shadow rounded p-3 mt-2"
                  style={{
                    minWidth: "300px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    right: 0,
                    zIndex: 1000,
                  }}
                >
                  {/* Close Button */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-dark">Notifications</strong>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setShowNotifications(false)}
                    >
                      ❌
                    </button>
                  </div>

                  {/* Notifications List */}
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
    key={notif.id}
    className="p-2 border-bottom"
    onClick={() => handleNotificationClick(notif.id, notif.indent_id)}   // Ensure indent_id is here
    style={{ cursor: "pointer" }}
>
    <p className="mb-1">{notif.message}</p>
</div>


                    ))
                  ) : (
                    <p className="text-muted text-center">No new notifications</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Page Content (From Outlet) */}
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDDashboard;
