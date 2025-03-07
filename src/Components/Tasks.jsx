import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal"; // Import Modal
import "./style.css"; // Styling

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      project: "Website Development",
      tasks: [
        { title: "UI Design", priority: "High", startDate: "2025-02-10", dueDate: "2025-02-20", bucket: "To Do", assignedTo: "IT Team", file: "design_docs.pdf" },
        { title: "Backend API", priority: "Medium", startDate: "2025-02-12", dueDate: "2025-02-25", bucket: "In Progress", assignedTo: "John Doe", file: "" },
      ],
    },
  ]);

  const addNewTask = (newTask) => {
    const updatedTasks = [...tasks];
    const projectIndex = updatedTasks.findIndex((p) => p.project === newTask.project);
    
    if (projectIndex !== -1) {
      updatedTasks[projectIndex].tasks.push(newTask);
    } else {
      updatedTasks.push({ project: newTask.project, tasks: [newTask] });
    }

    setTasks(updatedTasks);
  };

  return (
    <div className="tasks-container">
      <h3>📌 Task Management</h3>
      
      <button className="add-task-btn" onClick={() => setShowModal(true)}>+ Add New Task</button>

      {tasks.map((project, idx) => (
        <div key={idx} className="task-project">
          <h4>{project.project}</h4>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Bucket</th>
                <th>Assigned To</th>
                <th>Files</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.startDate}</td>
                  <td>{task.dueDate}</td>
                  <td>{task.bucket}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    {task.file ? (
                      <a href={`http://localhost:3001/uploads/${task.file}`} target="_blank" rel="noopener noreferrer">
                        📂 View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Add Task Modal */}
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onSave={addNewTask} />}
    </div>
  );
};

export default Tasks;
