const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 100,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
		phone: {
			type: String,
			trim: true,
			match: /^\+?[0-9\-\s]{7,20}$/,
		},
		course: {
			type: String,
			required: true,
			trim: true,
		},
		feePaid: {
			type: Boolean,
			default: false,
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

studentSchema.index({ name: 1, email: 1 });

module.exports = mongoose.model('Student', studentSchema);

