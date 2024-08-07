import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDeadlineDate, setEditDeadlineDate] = useState('');
  const [editDeadlineTime, setEditDeadlineTime] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos.map(todo => ({
      ...todo,
      deadline: new Date(todo.deadline),
      created: new Date(todo.created)
    })));
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() && deadlineDate && deadlineTime) {
      const deadline = new Date(`${deadlineDate}T${deadlineTime}`);
      setTodos([...todos, { text: input, deadline: deadline.toISOString(), done: false, created: new Date().toISOString() }]);
      setInput('');
      setDeadlineDate('');
      setDeadlineTime('');
    }
  };

  const toggleEdit = (index) => {
    const todo = todos[index];
    setEditIndex(index);
    setEditText(todo.text);
    setEditDeadlineDate(new Date(todo.deadline).toISOString().split('T')[0]);
    setEditDeadlineTime(new Date(todo.deadline).toTimeString().split(' ')[0].slice(0, 5));
  };

  const saveEdit = () => {
    if (editText.trim() && editDeadlineDate && editDeadlineTime) {
      const deadline = new Date(`${editDeadlineDate}T${editDeadlineTime}`).toISOString();
      const updatedTodos = todos.map((todo, index) =>
        index === editIndex ? { ...todo, text: editText, deadline } : todo
      );
      setTodos(updatedTodos);
      setEditIndex(null);
      setEditText('');
      setEditDeadlineDate('');
      setEditDeadlineTime('');
    }
  };

  const deleteTodo = (index) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const updatedTodos = todos.filter((_, i) => i !== index);
            setTodos(updatedTodos);
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const markAllAsDone = () => {
    setTodos(todos.map(todo => ({ ...todo, done: true })));
  };

  const markAllAsUndone = () => {
    setTodos(todos.map(todo => ({ ...todo, done: false })));
  };

  const deleteAllTodos = () => {
    confirmAlert({
      title: 'Confirm Delete All',
      message: 'Are you sure you want to delete all tasks?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => setTodos([])
        },
        {
          label: 'No'
        }
      ]
    });
  };

  return (
    <div className="app">
      <div className="title">To Do List</div>
      <div className="form-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a Task"
        />
        <input
          type="date"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
        />
        <input
          type="time"
          value={deadlineTime}
          onChange={(e) => setDeadlineTime(e.target.value)}
        />
        <button className="create-button" onClick={addTodo}>Create</button>
      </div>
      <div className="button-container">
        <button onClick={markAllAsDone}>Mark All as Done</button>
        <button onClick={markAllAsUndone}>Mark All as Undone</button>
        <button onClick={deleteAllTodos}>Delete All</button>
      </div>
      <div className="tasks-container">
        {todos.length === 0 ? (
          <div className="no-tasks">No Tasks Available</div>
        ) : (
          todos.map((todo, index) => (
            <div key={index} className={`todo-box ${todo.done ? 'done' : ''}`}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => setTodos(todos.map((t, i) => i === index ? { ...t, done: !t.done } : t))}
                />
                <div className="todo-details">
                  <div className="todo-text">{todo.text}</div>
                  <div className="date-created">Created: {new Date(todo.created).toLocaleString()}</div>
                  <div className="deadline">Deadline: {new Date(todo.deadline).toLocaleString()}</div>
                </div>
              </div>
              <div className="button-group">
                <button onClick={() => toggleEdit(index)}>Edit</button>
                <button onClick={() => deleteTodo(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      {editIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <input
              type="date"
              value={editDeadlineDate}
              onChange={(e) => setEditDeadlineDate(e.target.value)}
            />
            <input
              type="time"
              value={editDeadlineTime}
              onChange={(e) => setEditDeadlineTime(e.target.value)}
            />
            <div className="button-group">
              <button className="edit-save-button" onClick={saveEdit}>Save</button>
              <button className="edit-cancel-button" onClick={() => setEditIndex(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
