// filepath: /home/turki/Desktop/test/supatest/src/Todo.jsx
import React, { useState, useEffect } from 'react';
import supabase from './supabase-client';
import './Todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('TodoList')
      .select('*');
    if (error) console.error('Error fetching todos:', error);
    else setTodos(data);
  };

  const addTodo = async () => {
    const { data, error } = await supabase
      .from('TodoList')
      .insert([{ name: newTodo, isCompleted: false }]);
    if (error) {
      console.error('Error adding todo:', error);
    } else {
      if (data) {
        setTodos([...todos, ...data]); // Optimistically update the state
      } else {
        console.error('No data returned from insert operation');
      }
      setNewTodo(''); // Clear the input field
      fetchTodos(); // Fetch the updated list of todos
    }
  };

  const toggleTodoCompletion = async (id, isCompleted) => {
    const { error } = await supabase
      .from('TodoList')
      .update({ isCompleted: !isCompleted })
      .eq('id', id);
    if (error) {
      console.error('Error updating todo:', error);
    } else {
      fetchTodos(); // Fetch the updated list of todos
    }
  };

  const updateTodo = async (id, name) => {
    const { error } = await supabase
      .from('TodoList')
      .update({ name })
      .eq('id', id);
    if (error) {
      console.error('Error updating todo:', error);
    } else {
      setEditingTodo(null);
      fetchTodos(); // Fetch the updated list of todos
    }
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('TodoList')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      fetchTodos(); // Fetch the updated list of todos
    }
  };

  return (
    <div className="todo-container">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => toggleTodoCompletion(todo.id, todo.isCompleted)}
            />
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <span>{todo.name}</span>
            )}
            {editingTodo === todo.id ? (
              <>
                <button className="save" onClick={() => updateTodo(todo.id, editingText)}>Save</button>
                <button className="cancel" onClick={() => setEditingTodo(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="edit" onClick={() => {
                  setEditingTodo(todo.id);
                  setEditingText(todo.name);
                }}>Edit</button>
                <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;