const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database connection using Env Variables (DevOps Best Practice)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false } // Required for Azure
});

app.post('/register', async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
        res.status(200).json({ message: "Registration Successful!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database Error" });
    }
});

app.get('/health', (req, res) => res.send("Backend is Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
