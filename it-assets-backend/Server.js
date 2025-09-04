const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'it_asset_management'
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
    connection.release();
});

app.get('/api/assets', (req, res) => {
    db.query('SELECT * FROM it_assets', (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/assets', (req, res) => {
    const newAsset = req.body;
    db.query('INSERT INTO it_assets SET ?', newAsset, (err, result) => {
        if (err) throw err;
        res.status(201).send({ message: 'Asset added successfully', id: result.insertId });
    });
});

app.put('/api/assets/:id', (req, res) => {
    const id = req.params.id;
    const updatedAsset = req.body;
    db.query('UPDATE it_assets SET ? WHERE id = ?', [updatedAsset, id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Asset updated successfully' });
    });
});

app.delete('/api/assets/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM it_assets WHERE id = ?', id, (err, result) => {
        if (err) throw err;
        res.send({ message: 'Asset deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});