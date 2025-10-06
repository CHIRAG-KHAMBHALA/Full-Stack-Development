const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for rep counts
let repData = {};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get rep count for a specific exercise
app.get('/api/reps/:exercise', (req, res) => {
    const exercise = req.params.exercise;
    const count = repData[exercise] || 0;
    res.json({ exercise, count });
});

// Update rep count
app.post('/api/reps/:exercise', (req, res) => {
    const exercise = req.params.exercise;
    const { action, count } = req.body;
    
    if (!repData[exercise]) {
        repData[exercise] = 0;
    }
    
    if (action === 'increment') {
        repData[exercise]++;
    } else if (action === 'decrement') {
        repData[exercise] = Math.max(0, repData[exercise] - 1);
    } else if (action === 'reset') {
        repData[exercise] = 0;
    } else if (action === 'set' && typeof count === 'number') {
        repData[exercise] = Math.max(0, count);
    }
    
    res.json({ exercise, count: repData[exercise] });
});

// Get all exercises and their counts
app.get('/api/reps', (req, res) => {
    res.json(repData);
});

// Reset all counts
app.delete('/api/reps', (req, res) => {
    repData = {};
    res.json({ message: 'All rep counts reset' });
});

app.listen(PORT, () => {
    console.log(`🏋️‍♂️ Gym Rep Counter Server running on http://localhost:${PORT}`);
});
