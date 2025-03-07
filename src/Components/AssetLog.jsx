import React, { useEffect, useState } from "react";
import axios from "axios";

const AssetLog = () => {
  const [logs, setLogs] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    borrowing_time: "asc",
    return_time: "asc",
    duration: "asc",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    axios
      .get("http://localhost:3000/auth/assetlogs")
      .then((response) => {
        if (response.data.Status) {
          let sortedLogs = response.data.Result;
          sortedLogs = sortData(sortedLogs, "borrowing_time", sortConfig.borrowing_time);
          setLogs(sortedLogs);
        } else {
          alert("Failed to fetch asset logs");
        }
      })
      .catch((err) => console.error("Error fetching asset logs:", err));
  };

  const sortData = (data, key, order) => {
    return [...data].sort((a, b) => {
      if (key === "duration") {
        return order === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return order === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
    });
  };

  const handleSort = (key) => {
    let newOrder = sortConfig[key] === "asc" ? "desc" : "asc";
    setSortConfig({ ...sortConfig, [key]: newOrder });

    const sortedLogs = sortData(logs, key, newOrder);
    setLogs(sortedLogs);
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Asset Logs</h3>
      </div>

      <table className="table asset-log-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Asset Name</th>
            <th>Previous Holder</th>
            <th>Serial Number</th>
            <th onClick={() => handleSort("borrowing_time")} style={{ cursor: "pointer" }}>
              Borrowing Time {sortConfig.borrowing_time === "asc" ? "▲" : "▼"}
            </th>
            <th onClick={() => handleSort("duration")} style={{ cursor: "pointer" }}>
              Duration (hrs) {sortConfig.duration === "asc" ? "▲" : "▼"}
            </th>
            <th onClick={() => handleSort("return_time")} style={{ cursor: "pointer" }}>
              Return Time {sortConfig.return_time === "asc" ? "▲" : "▼"}
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={log.id}>
                <td>{index + 1}</td>
                <td>{log.asset_name}</td>
                <td>{log.previous_holder || "N/A"}</td>
                <td>{log.serial_number || "N/A"}</td>
                <td>{new Date(log.borrowing_time).toLocaleString()}</td>
                <td>{log.duration}</td>
                <td>{log.return_time ? new Date(log.return_time).toLocaleString() : "Not Returned"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No asset logs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetLog;
