import React, { useState, useEffect } from 'react';
import supabase from './supabase-client';
import './Todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('TodoList')
          .select('*')
          .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching todos: ' + error.message);
        } else {
          setTodos(data);
        }
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newTodoItem = { user_id: user.id, name: newTodo, isCompleted: false };
      setTodos([...todos, { ...newTodoItem, id: Date.now() }]); // Temporarily add the new todo with a unique id
      setNewTodo('');
      const { error } = await supabase
        .from('TodoList')
        .insert([newTodoItem]);
      if (error) {
        console.error('Error adding todo: ' + error.message);
      } else {
        const { data, error: fetchError } = await supabase
          .from('TodoList')
          .select('*')
          .eq('user_id', user.id)
          .order('id', { ascending: false })
          .limit(1);
        if (fetchError) {
          console.error('Error fetching new todo: ' + fetchError.message);
        } else {
          setTodos(todos => todos.map(todo => todo.id === newTodoItem.id ? data[0] : todo));
        }
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('TodoList')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        console.error('Error deleting todo: ' + error.message);
      } else {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('TodoList')
        .update({ isCompleted: !isCompleted })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        console.error('Error updating todo: ' + error.message);
      } else {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo));
      }
    }
  };

  return (
    <div className="todo-container">
      <h2>My To-Do List</h2>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="todo-add-button">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
            <span onClick={() => handleToggleComplete(todo.id, todo.isCompleted)} className="todo-name">
              {todo.name}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)} className="todo-delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;