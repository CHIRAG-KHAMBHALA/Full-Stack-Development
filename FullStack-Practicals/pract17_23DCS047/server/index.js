require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const studentsRouter = require('../src/routes/students');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static UI
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/students', studentsRouter);

// Health route
app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
	console.error('Error:', err);
	res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tuition_admin';

async function start() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('MongoDB connected');
		app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

start();

