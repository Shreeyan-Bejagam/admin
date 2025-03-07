import React, { useState } from "react";
import "./style.css";

const AddTaskModal = ({ onClose, onSave }) => {
  const [taskData, setTaskData] = useState({
    project: "",
    title: "",
    priority: "Medium",
    startDate: "",
    dueDate: "",
    bucket: "To Do",
    assignedTo: "",
    uploadFile: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "uploadFile") {
      setTaskData({ ...taskData, uploadFile: e.target.files[0] });
    } else {
      setTaskData({ ...taskData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (!taskData.project || !taskData.title || !taskData.startDate || !taskData.dueDate || !taskData.assignedTo) {
      alert("Please fill all fields");
      return;
    }

    // Handle file upload later with backend integration
    const formData = new FormData();
    formData.append("file", taskData.uploadFile);
    formData.append("taskData", JSON.stringify(taskData));

    onSave(taskData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📝 Add New Task</h3>

        <label>Project Name:</label>
        <input type="text" name="project" value={taskData.project} onChange={handleChange} placeholder="Enter Project Name" />

        <label>Task Title:</label>
        <input type="text" name="title" value={taskData.title} onChange={handleChange} placeholder="Enter Task Title" />

        <label>Priority:</label>
        <select name="priority" value={taskData.priority} onChange={handleChange}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label>Start Date:</label>
        <input type="date" name="startDate" value={taskData.startDate} onChange={handleChange} />

        <label>Due Date:</label>
        <input type="date" name="dueDate" value={taskData.dueDate} onChange={handleChange} />

        <label>Assign To:</label>
        <select name="assignedTo" value={taskData.assignedTo} onChange={handleChange}>
          <option value="">Select</option>
          <optgroup label="Individuals">
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
          </optgroup>
          <optgroup label="Groups">
            <option value="IT Team">IT Team</option>
            <option value="HR Department">HR Department</option>
          </optgroup>
        </select>

        <label>Upload File (Optional):</label>
        <input type="file" name="uploadFile" onChange={handleChange} />

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
