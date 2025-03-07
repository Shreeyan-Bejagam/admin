import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const IndentForm = ({ role }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name_and_designation_of_the_indenter: '',
        personal_file_no: '',
        office_project: '',
        project_no_and_title: '',
        budget_head: '',
        items_head: '',
        type_of_purchase: '',
        issue_gst_exemption_certificate: '',
        justification_of_procurement: '',
        item_details: [],
        checklist_budget_head_specified: '',
        checklist_space_available: '',
        checklist_specifications_enclosed: '',
        checklist_items_working_condition: '',
        checklist_any_deviation: '',
        procurement_mode: '',
        procurement_comments: '',
        pfc_chairman: '',
        pfc_indenter: '',
        pfc_expert1: '',
        pfc_expert2: '',
        pfc_finance_member: '',
        chairman_signature: '',
        accounts_budget_allocation: '',
        accounts_budget_utilized: '',
        accounts_available_balance: '',
        accounts_funds_available: '',
        accounts_comments: '',
    });

    const [isEditable, setIsEditable] = useState(false);
    const [editableFields, setEditableFields] = useState([]);

    const [loading, setLoading] = useState(true);

    const getEditableFields = (role) => {
        if (role === "AccountsTL") {
            return ["accounts_budget_allocation", "accounts_budget_utilized", "accounts_available_balance", "accounts_funds_available", "accounts_comments"];
        } else if (role === "FinanceTL") {
            return ["pfc_chairman", "pfc_indenter", "pfc_expert1", "pfc_expert2", "pfc_finance_member"];
        } else if (role === "ProcurementTL") {
            return ["checklist_budget_head_specified", "checklist_space_available", "checklist_specifications_enclosed", "checklist_items_working_condition", "checklist_any_deviation", "procurement_mode", "procurement_comments"];
        } else if (role === "MD") {
            return ["approval_section_PI", "approval_section_ProjectDirector", "approval_section_Chairman"];
        }
        return [];
    };

    const isFieldEditable = (name) => {
        return isEditable && editableFields.includes(name);
    };

    useEffect(() => {
        axios.get(`http://localhost:3000/indent_requests/${id}`)
            .then(res => {
                if (res.data.Status) {
                    let indentData = res.data.Indent;
    
                    if (typeof indentData.item_details === "string") {
                        try {
                            indentData.item_details = JSON.parse(indentData.item_details);
                        } catch {
                            indentData.item_details = [];
                        }
                    }
    
                    if (indentData.accounts_tl_fields) {
                        const accountsData = JSON.parse(indentData.accounts_tl_fields);
                        indentData = { ...indentData, ...accountsData };
                    }
    
                    if (indentData.finance_tl_fields) {
                        const financeData = JSON.parse(indentData.finance_tl_fields);
                        indentData = { ...indentData, ...financeData };
                    }
    
                    if (indentData.procurement_tl_fields) {
                        const procurementData = JSON.parse(indentData.procurement_tl_fields);
                        indentData = { ...indentData, ...procurementData };
                    }
    
                    indentData.chairman_signature = indentData.chairman_signature || "";
    
                    setFormData(indentData);
                    setLoading(false);
    
                    const sections = getEditableFields(role);
                    setEditableFields(sections);
    
                    if (role === "MD") {
                        setIsEditable(true);
                    } else if (["AccountsTL", "FinanceTL", "ProcurementTL"].includes(role)) {
                        const approvals = indentData.approval_section || {};
                        const anyApprovalGiven = ["PI", "ProjectDirector", "Chairman"].some(
                            (key) => approvals[key] === "Approved"
                        );
    
                        setIsEditable(anyApprovalGiven); // TLs can only edit if any approval exists
                    } else {
                        setIsEditable(false);
                    }
    
                    console.log("Approvals:", indentData.approval_section);
                    console.log("Is Editable for TLs:", isEditable);
    
                } else {
                    alert("Indent not found");
                    navigate(-1);
                }
            })
            .catch(() => {
                alert("Failed to load indent data");
                navigate(-1);
            });
    }, [id, role, navigate]);
    


    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        axios.post(`http://localhost:3000/indent_requests/${id}/update`, {
            ...formData,
            approval_section: formData.approval_section,
            updated_by: role
        })
            .then(() => {
                alert("Form updated successfully!");
                navigate(-1);
            })
            .catch(() => alert("Failed to update indent."));
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center">Purchase Indent Form</h2>

            {step === 1 && (
                <>
                    <h3>Page 1: Employee & Item Details (Read-Only)</h3>
                    <table className="table table-bordered">
                        <tbody>
                            {[
                                ['Name & Designation', 'name_and_designation_of_the_indenter'],
                                ['Personal File No', 'personal_file_no'],
                                ['Office/Project', 'office_project'],
                                ['Project No. & Title', 'project_no_and_title'],
                                ['Budget Head', 'budget_head'],
                                ['Items Head', 'items_head'],
                                ['Type of Purchase', 'type_of_purchase'],
                                ['GST Exemption Certificate', 'issue_gst_exemption_certificate']
                            ].map(([label, key]) => (
                                <tr key={key}>
                                    <td>{label}</td>
                                    <td><input type="text" value={formData[key] || ""} readOnly className="form-control" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>Item Details</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr><th>Name</th><th>Cost</th><th>Qty</th><th>Amount</th><th>Required By</th><th>Warranty</th><th>Remarks</th></tr>
                        </thead>
                        <tbody>
                            {formData.item_details.map((item, index) => (
                                <tr key={index}>
                                    {["name", "cost", "qty", "amount", "required_by", "warranty", "remarks"].map(field => (
                                        <td key={field}>{item[field]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-primary" onClick={() => setStep(2)}>Next - Review & Approval</button>
                </>
            )}

            {step === 2 && (
                <>
                <h3>Page 2: Review & Approval</h3>
            
                <h5>Justification of Procurement</h5>
                <textarea
                    className="form-control mb-3"
                    name="justification_of_procurement"
                    value={formData.justification_of_procurement || ""}
                    onChange={(e) => handleChange(e)}
                    disabled={!isFieldEditable('justification_of_procurement')}



                />
            
                {/* Procurement TL Section - Checklist */}
                <h4>For Office of Stores and Purchase only (Procurement TL)</h4>
<table className="table table-bordered">
    <tbody>
        {[
            { label: "1. Budget head specified", key: "checklist_budget_head_specified" },
            { label: "2. Availability of Space at Stores", key: "checklist_space_available" },
            { label: "3. Specifications enclosed", key: "checklist_specifications_enclosed" },
            { label: "4. Items working condition", key: "checklist_items_working_condition" },
            { label: "5. Any Deviation", key: "checklist_any_deviation" }
        ].map(({ label, key }, idx) => (
            <tr key={idx}>
                <td>{label}</td>
                <td>
                    {role === "ProcurementTL" && isEditable ? (
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ""}
                            className="form-control"
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{formData[key] || "______________________"}</span>
                    )}
                </td>
            </tr>
        ))}
    </tbody>
</table>
            
                {/* Mode of Purchase */}
                <h5 className="mt-3"><b>MODE OF PURCHASE</b></h5>
                {[
                    "Direct Purchase (below 50 K)",
                    "Three quotation basis (above 50 K to 5 Lac) Limited",
                    "Tender Enquiry",
                    "Open Tender Enquiry",
                    "Repeat Order",
                    "Proprietary"
                ].map((option) => (
                    <div key={option}>
                        <input
                            type="radio"
                            name="procurement_mode"
                            value={option}
                            checked={formData.procurement_mode === option}
                            onChange={handleChange}
                            disabled={!isFieldEditable('procurement_mode')}



                        /> {option}
                    </div>
                ))}
                <p className="mt-2"><i>(Tick whichever is applicable)</i></p>
            
                <h5>Procurement Comments</h5>
                <textarea
                    className="form-control"
                    name="procurement_comments"
                    value={formData.procurement_comments || ""}
                    onChange={handleChange}
                    disabled={!isFieldEditable('procurement_comments')}



                />
            
                {/* PFC Section */}
                
{/* PFC Section (Finance TL) */}
<h5 className="mt-4">Constitution of Purchase Finalization Committee (Finance TL)</h5>
<table className="table table-bordered">
    <tbody>
        {[
            { label: "Chairman (PI/CEO/PD/Nominated by Competent Authority)", key: "pfc_chairman" },
            { label: "Indenter", key: "pfc_indenter" },
            { label: "Expert 1 (Senior Employee/Nominated by Competent Authority)", key: "pfc_expert1" },
            { label: "Expert 2 (Honorary Member/Nominated by Competent Authority)", key: "pfc_expert2" },
            { label: "One Member from Finance Team (Nominated by Competent Authority)", key: "pfc_finance_member" }
        ].map(({ label, key }) => (
            <tr key={key}>
                <td>{label}</td>
                <td>
                    {role === "FinanceTL" && isEditable ? (
                        <input
                            type="text"
                            name={key}
                            value={formData[key] || ""}
                            className="form-control"
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{formData[key] || "______________________"}</span>
                    )}
                </td>
            </tr>
        ))}
    </tbody>
</table>
                <p className="text-end"><b>(Signature of Competent Authority)</b></p>
            
                <h5 className="mt-4 text-center">Approval Section</h5>
<table className="table table-bordered">
    <tbody>
        <tr>
            {/* PI Column */}
            <td>
                <b>PI</b><br />(Up to Rs. 5 Lakh)<br />
                <small>Note: Non-Recurring: Rs. 50,000<br />Recurring: Rs. 5,00,000 (For Project Purchase)</small>
                {role === "MD" ? (
                    <select
                        name="approval_section_PI"
                        className="form-control mt-2"
                        value={formData.approval_section?.PI || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                approval_section: {
                                    ...prev.approval_section,
                                    PI: e.target.value
                                }
                            }));
                        }}
                    >
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Not Approved">Not Approved</option>
                    </select>
                ) : (
                    <div className="mt-2"><b>{formData.approval_section?.PI || "Pending"}</b></div>
                )}
            </td>

            {/* Project Director/CEO Column */}
            <td>
                <b>PROJECT DIRECTOR/CEO</b><br />(Up to Rs. 50 Lac)
                {role === "MD" ? (
                    <select
                        name="approval_section_ProjectDirector"
                        className="form-control mt-2"
                        value={formData.approval_section?.ProjectDirector || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                approval_section: {
                                    ...prev.approval_section,
                                    ProjectDirector: e.target.value
                                }
                            }));
                        }}
                    >
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Not Approved">Not Approved</option>
                    </select>
                ) : (
                    <div className="mt-2"><b>{formData.approval_section?.ProjectDirector || "Pending"}</b></div>
                )}
            </td>

            {/* Chairman Column */}
            <td>
                <b>CHAIRMAN</b><br />(Full Power)
                {role === "MD" ? (
                    <select
                        name="approval_section_Chairman"
                        className="form-control mt-2"
                        value={formData.approval_section?.Chairman || ""}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                approval_section: {
                                    ...prev.approval_section,
                                    Chairman: e.target.value
                                }
                            }));
                        }}
                    >
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Not Approved">Not Approved</option>
                    </select>
                ) : (
                    <div className="mt-2"><b>{formData.approval_section?.Chairman || "Pending"}</b></div>
                )}
            </td>
        </tr>
    </tbody>
</table>

            
                {/* Accounts Office Section */}
                <h4>For Office of Accounts only(Accounts TL)</h4>
                <table className="table table-bordered">
    <tbody>
        {[
            { label: "Budget allocation of the Office/Project", key: "accounts_budget_allocation" },
            { label: "Budget utilized", key: "accounts_budget_utilized" },
            { label: "Available balance", key: "accounts_available_balance" },
            { label: "Are funds available in the budget head requested by the Project/Office?", key: "accounts_funds_available" },
            { label: "Comments (if any)", key: "accounts_comments" }
        ].map(({ label, key }) => (
            <tr key={key}>
                <td>{label}</td>
                <td>
                    <input
                        type="text"
                        name={key}
                        className="form-control"
                        value={formData[key] || ""}
                        onChange={handleChange}
                        disabled={!isFieldEditable(key)}
                    />
                </td>
            </tr>
        ))}
    </tbody>
</table>

                <p className="text-end"><b>Officer-in-Charge (Accounts)</b></p>
            
             
            
                {/* Navigation Buttons */}
                <div className="mt-4 d-flex justify-content-between">
    <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
    <button className="btn btn-success" onClick={handleSubmit}>Save</button>
</div>
            </>
            
            )}
        </div>
    );
};

export default IndentForm;
