const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// Create
router.post('/', async (req, res, next) => {
	try {
		const student = await Student.create(req.body);
		res.status(201).json(student);
	} catch (err) {
		next(err);
	}
});

// Read all with basic search and pagination
router.get('/', async (req, res, next) => {
	try {
		const { q = '', page = 1, limit = 50 } = req.query;
		const currentPage = Math.max(parseInt(page, 10) || 1, 1);
		const pageSize = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
		const filter = q
			? { $or: [
				{ name: { $regex: q, $options: 'i' } },
				{ email: { $regex: q, $options: 'i' } },
				{ course: { $regex: q, $options: 'i' } },
			] }
			: {};

		const [items, total] = await Promise.all([
			Student.find(filter)
				.sort({ createdAt: -1 })
				.skip((currentPage - 1) * pageSize)
				.limit(pageSize),
			Student.countDocuments(filter),
		]);

		res.json({ items, total, page: currentPage, pages: Math.ceil(total / pageSize) });
	} catch (err) {
		next(err);
	}
});

// Read one
router.get('/:id', async (req, res, next) => {
	try {
		const student = await Student.findById(req.params.id);
		if (!student) return res.status(404).json({ message: 'Student not found' });
		res.json(student);
	} catch (err) {
		next(err);
	}
});

// Update
router.put('/:id', async (req, res, next) => {
	try {
		const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!student) return res.status(404).json({ message: 'Student not found' });
		res.json(student);
	} catch (err) {
		next(err);
	}
});

// Delete
router.delete('/:id', async (req, res, next) => {
	try {
		const result = await Student.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ message: 'Student not found' });
		res.json({ message: 'Deleted' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;

