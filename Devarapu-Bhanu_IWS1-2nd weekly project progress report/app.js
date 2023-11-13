// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitness_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Example API endpoint for user registration (signup)
app.post('/signup', (req, res) => {
    const { firstName, lastName, sex, dateOfBirth, address, email, password } = req.body;

    const sql = 'INSERT INTO users (first_name, last_name, sex, date_of_birth, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, sex, dateOfBirth, address, email, password], (err, result) => {
        if (err) {
            console.error('Error:', err);
            res.json({ success: false, message: 'Error in signup' });
            return;
        }
        console.log('User registered:', result);
        res.json({ success: true, message: 'User registered successfully' });
    });
});

// Example API endpoint for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.json({ success: false, message: 'Error in login' });
            return;
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
