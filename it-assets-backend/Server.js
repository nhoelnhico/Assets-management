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




// SUPPLIES ROUTES
app.get('/api/supplies', (req, res) => {
    db.query('SELECT * FROM supplies', (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/supplies', (req, res) => {
    const newSupply = req.body;
    db.query('INSERT INTO supplies SET ?', newSupply, (err, result) => {
        if (err) throw err;
        res.status(201).send({ message: 'Supply added successfully', id: result.insertId });
    });
});

app.put('/api/supplies/:id', (req, res) => {
    const id = req.params.id;
    const updatedSupply = req.body;
    db.query('UPDATE supplies SET ? WHERE id = ?', [updatedSupply, id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Supply updated successfully' });
    });
});

app.delete('/api/supplies/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM supplies WHERE id = ?', id, (err, result) => {
        if (err) throw err;
        res.send({ message: 'Supply deleted successfully' });
    });
});


// SUPPLIES COUNT
app.get('/api/supplies/count', (req, res) => {
    const query = `
        SELECT status, COUNT(*) as count
        FROM supplies
        GROUP BY status
    `;
    db.query(query, (err, results) => {
        if (err) throw err;

        const counts = {
            Available: 0,
            'In Use': 0,
            Disposed: 0,
            Damaged: 0,
            Total: 0
        };

        results.forEach(row => {
            counts[row.status] = row.count;
            counts.Total += row.count;
        });

        res.json(counts);
    });
});