import React, { useState } from 'react';
import './Todo.css';

const Todo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEdit = (index) => {
    const editedTask = prompt('Edit task:', tasks[index]);
    if (editedTask !== null && editedTask.trim() !== '') {
      const updatedTasks = tasks.map((t, i) => (i === index ? editedTask : t));
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="todo-container">
      <h2>Get Things Done !</h2>
      <div className="input-section">
        <input
          type="text"
          value={task}
          placeholder="What is the task today?"
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAdd}>Add Task</button>
      </div>

      {tasks.map((t, index) => (
        <div key={index} className="task">
          <span>{t}</span>
          <div>
            <button onClick={() => handleEdit(index)}>✏️</button>
            <button onClick={() => handleDelete(index)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );  
};

export default Todo;
