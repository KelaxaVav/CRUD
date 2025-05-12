import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', id: null });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (form.id) {
                await axios.put(`http://localhost:5000/users/${form.id}`, form);
            } else {
                await axios.post('http://localhost:5000/users', form);
            }
            setForm({ name: '', email: '', id: null });
            fetchUsers();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.response?.data?.message || 'Server error. Please try again.');
        }
    };

    const handleEdit = (user) => {
        setForm(user);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    return (
        <div className="container">
            <h2>USER MANAGEMENT</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    maxLength={25}
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    maxLength={30}
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                />
                <button type="submit">{form.id ? "Update" : "Add"} User</button>
            </form>

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <span>{user.name} — {user.email}</span>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
