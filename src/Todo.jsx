import React from 'react';

function Todo({ todo, onToggle, onDelete }) {
  return (
    <div className="todo">
      <span
        onClick={onToggle}
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      >
        {todo.text}
      </span>
      <button onClick={onDelete}>❌</button>
    </div>
  );
}

export default Todo;
