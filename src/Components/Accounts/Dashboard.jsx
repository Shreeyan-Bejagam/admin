import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const AccountsDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ✅ Keep user logged in
  useEffect(() => {
    axios.get("http://localhost:3000/auth/user-details", { withCredentials: true })
        .then((res) => {
            if (res.data.Status && res.data.role === "Accounts TL") {
                setUserEmail(res.data.email);
                localStorage.setItem("userId", res.data.id);  // Save userId for later
                fetchNotifications(res.data.id);               // Fetch notifications after successful auth
            } else {
                fallbackToToken();  // Fallback if session cookie fails
            }
        })
        .catch(() => {
            fallbackToToken();  // Fallback on error (cookie might be expired or missing)
        });
}, [navigate]);

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
        if (res.data.valid && res.data.user.role === "Accounts TL") {
            setUserEmail(res.data.user.email);
            localStorage.setItem("userId", res.data.user.id);  // Store userId again to make sure
            fetchNotifications(res.data.user.id);               // Fetch notifications again
        } else {
            navigate("/adminlogin");
        }
    })
    .catch(() => {
        navigate("/adminlogin");
    });
};


  // ✅ Fetch Notifications
  const fetchNotifications = (userId) => {
    axios
      .get(`http://localhost:3000/notifications/${userId}/AccountsTL`)
      .then((res) => {
        if (res.data.Status) {
          setNotifications(res.data.Notifications);
        }
      })
      .catch((err) => console.error("❌ Error fetching notifications:", err));
  };

  // ✅ Open Indent Form & Stay Logged In
  const handleNotificationClick = (notificationId, indentId) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
      .then(() => {
        navigate(`/accounts-dashboard/review_indent/${indentId}`);
      })
      .catch((err) =>
        console.error("❌ Error marking notification as read:", err)
      );
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout", { withCredentials: true })
      .then(() => {
        localStorage.removeItem("userId");
        navigate("/adminlogin");
      })
      .catch((err) => console.error("❌ Logout Error:", err));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            {/* Profile Section */}
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="Accounts TL Profile"
                className="rounded-circle"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
              <h5 className="mt-2">Accounts TL</h5>
              <p className="text-white-50">{userEmail || "Loading..."}</p>
              <span className="badge bg-primary">Accounts TL</span>
            </div>

            {/* Sidebar Links */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link
                  to="/accounts-dashboard"
                  className="nav-link text-white px-3"
                >
                  Dashboard
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/accounts-dashboard/expenses"
                  className="nav-link text-white px-3"
                >
                  Expenses
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/accounts-dashboard/salaries"
                  className="nav-link text-white px-3"
                >
                  Salaries
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/accounts-dashboard/vendor-payments"
                  className="nav-link text-white px-3"
                >
                  Vendor Payments
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/accounts-dashboard/approvals"
                  className="nav-link text-white px-3"
                >
                  Approvals
                </Link>
              </li>
              <li className="w-100">
                <button
                  className="btn nav-link text-white px-3"
                  onClick={handleLogout}
                  style={{ background: "none", border: "none" }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-between align-items-center shadow">
            <h4>Accounts Dashboard</h4>

            {/* 🔔 Notification Bell */}
            <div className="position-relative">
              <span
                className="fs-3 bi-bell text-dark"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ cursor: "pointer" }}
              ></span>
              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}

              {/* 🔔 Notification Dropdown (Missing Part - Now Added) */}
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
                    <strong>Notifications</strong>
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
                        onClick={() =>
                          handleNotificationClick(
                            notif.id,
                            notif.indent_id
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <p className="mb-1">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">
                      No new notifications
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
