import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Approvals = ({ role }) => {
    const [indents, setIndents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/approvals/${role}`)
            .then((res) => {
                if (res.data.Status) {
                    setIndents(res.data.Indents);
                } else {
                    setIndents([]);  // No data found
                }
            })
            .catch((err) => console.error("❌ Error fetching approvals:", err));
    }, [role]);
    
    return (
        <div className="container mt-4">
            <h2 className="text-center">Approval Requests ({role})</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Date</th>
                        <th>Indent Form</th>
                    </tr>
                </thead>
                <tbody>
                    {indents.length > 0 ? (
                        indents.map((indent, index) => (
                            <tr key={indent.id}>
                                <td>{index + 1}</td>
                                <td>{new Date(indent.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/md-dashboard/review_indent/${indent.id}`)}
                                    >
                                        Open Indent Form
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">No approvals found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Approvals;
