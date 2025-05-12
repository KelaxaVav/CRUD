import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const db = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    console.log('POST /users body:', req.body);

    if (!name || !email || name.length > 25 || email.length > 30) {
        return res.status(400).json({ message: 'Invalid input: name or email missing or too long.' });
    }

    db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        (err, result) => {
            if (err) {
                console.error('Database INSERT error:', err);
                return res.status(500).json({ message: 'Database insert failed', error: err });
            }
            res.status(201).json({ id: result.insertId, name, email });
        }
    );
});

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Database SELECT error:', err);
            return res.status(500).json({ message: 'Database select failed', error: err });
        }
        res.json(results);
    });
});

// Update a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email || name.length > 25 || email.length > 30) {
        return res.status(400).json({ message: 'Invalid input for update' });
    }

    db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (err) => {
            if (err) {
                console.error('Database UPDATE error:', err);
                return res.status(500).json({ message: 'Database update failed', error: err });
            }
            res.json({ id, name, email });
        }
    );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Database DELETE error:', err);
            return res.status(500).json({ message: 'Database delete failed', error: err });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
