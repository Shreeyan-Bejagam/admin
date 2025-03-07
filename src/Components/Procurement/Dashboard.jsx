import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProcurementDashboard = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userId, setUserId] = useState(null);

  // ✅ Fetch user details & notifications on load
  useEffect(() => {
    axios.get("http://localhost:3000/auth/user-details", { withCredentials: true })
        .then((res) => {
            if (res.data.Status && res.data.role === "Procurement TL") {
                const { email, role, id } = res.data;
                setUserDetails({ email, role });
                setUserId(id);
                fetchNotifications(id);  // Fetch notifications after successful auth
            } else {
                fallbackToToken();  // If session cookie fails, fall back to token
            }
        })
        .catch(() => {
            fallbackToToken();  // If error, also fall back to token
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
        if (res.data.valid && res.data.user.role === "Procurement TL") {
            const { email, role, id } = res.data.user;
            setUserDetails({ email, role });
            setUserId(id);
            fetchNotifications(id);  // Re-fetch notifications after token validation
        } else {
            navigate("/adminlogin");
        }
    })
    .catch(() => {
        navigate("/adminlogin");
    });
};


  // ✅ Fetch notifications for Procurement TL
  const fetchNotifications = (id) => {
    axios
      .get(`http://localhost:3000/notifications/${id}/ProcurementTL`)
      .then((res) => {
        if (res.data.Status) {
          setNotifications(res.data.Notifications);
        }
      })
      .catch((err) => console.error("❌ Error fetching notifications:", err));
  };

  // ✅ Handle notification click (mark as read & navigate to review page)
  const handleNotificationClick = (notificationId, indentId) => {
    axios
      .post(`http://localhost:3000/notifications/mark_as_read/${notificationId}`)
      .then(() => {
        navigate(`/procurement-dashboard/review_indent/${indentId}`);  // ✅ Correct path
      })
      .catch((err) => console.error("❌ Error marking notification as read:", err));
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    window.location.href = "/adminlogin";
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* ✅ Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark min-vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            <div className="text-center mt-2">
              <img
                src="http://localhost:3000/images/default-profile.png"
                alt="Procurement TL Profile"
                className="rounded-circle"
                style={{ width: "80px", height: "80px", objectFit: "cover", border: "2px solid white" }}
              />
              <h5 className="mt-2">Procurement TL</h5>
              <p className="text-white-50">{userDetails.email}</p>
              <span className="badge bg-primary">Procurement TL</span>
            </div>

            {/* ✅ Sidebar Links */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start mt-4">
              <li className="w-100">
                <Link to="/procurement-dashboard" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-speedometer2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/approvals" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box"></i>
                  <span className="ms-2 d-none d-sm-inline">Approvals</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/vendor-management" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-2 d-none d-sm-inline">Vendor Management</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/purchase-orders" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-receipt"></i>
                  <span className="ms-2 d-none d-sm-inline">Purchase Orders</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/procurement-dashboard/inventory" className="nav-link text-white px-3 d-flex align-items-center">
                  <i className="fs-4 bi-box-seam"></i>
                  <span className="ms-2 d-none d-sm-inline">Inventory</span>
                </Link>
              </li>
              <li className="w-100">
                <button className="btn nav-link text-white px-3 d-flex align-items-center" onClick={handleLogout} style={{ background: "none", border: "none" }}>
                  <i className="fs-4 bi-power"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ✅ Main Content */}
        <div className="col p-0 m-0 offset-md-3">
          <div className="p-3 d-flex justify-content-between align-items-center shadow">
            <h4>Procurement TL Dashboard</h4>

            {/* 🔔 Notification Bell */}
            <div className="position-relative">
              <span className="fs-3 bi-bell text-dark" onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: "pointer" }}></span>
              {notifications.length > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {/* 🔔 Notification Panel */}
          {showNotifications && (
            <div className="position-fixed top-0 end-0 p-3 bg-white shadow" style={{ width: "300px", height: "100vh", overflowY: "auto", zIndex: "1050" }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5>Notifications</h5>
                <button className="btn btn-sm btn-outline-dark" onClick={() => setShowNotifications(false)}>
                  ✖
                </button>
              </div>
              <hr />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 border-bottom"
                    onClick={() => handleNotificationClick(notification.id, notification.indent_id)} // ✅ Pass correct parameters
                    style={{ cursor: "pointer" }}
                  >
                    <p className="mb-1">{notification.message}</p>
                    <small className="text-muted">{new Date(notification.created_at).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No new notifications</p>
              )}
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
