import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	category: {
		type: String,
		required: false,
		enum: ['Health', 'Education', 'Transport', 'Water & Sanitation', 'Electricity', 'Corruption', 'Other'],
		default: 'Other'
	},
	summary: {
		type: String,
		required: true,
		trim: true
	},
	details: {
		type: String,
		required: true,
		trim: true
	},
	language: {
		type: String,
		enum: ['en', 'hi'],
		default: 'en'
	},
	location: {
		taluka: String,
		district: String,
		state: String
	},
	status: {
		type: String,
		enum: ['pending', 'forwarded', 'acknowledged', 'resolved'],
		default: 'pending'
	},
	timeline: [{
		at: {
			type: Date,
			default: Date.now
		},
		text: String,
		action: String
	}],
	images: [{
		filename: String,
		originalName: String,
		mimeType: String,
		size: Number,
		base64Data: String, // Base64 data for PDF embedding
		uploadedAt: {
			type: Date,
			default: Date.now
		}
	}],
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

// Update timestamp on save
complaintSchema.pre('save', function(next) {
	this.updatedAt = Date.now()
	next()
})

// Export the model properly
export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema)
