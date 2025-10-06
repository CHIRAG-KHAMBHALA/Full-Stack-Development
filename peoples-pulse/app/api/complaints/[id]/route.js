import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import Complaint from '@/backend/models/Complaint.js'
import jwt from 'jsonwebtoken'
import User from '@/backend/models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(req, { params }) {
	try {
		const cookies = req.cookies
		const token = cookies.get('token')?.value
		
		if (!token) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const decoded = jwt.verify(token, JWT_SECRET)
		
		await connectDB()
		
		const complaint = await Complaint.findById(params.id)
			.populate('userId', 'name email')
			.select('-__v')
			.lean()

		if (!complaint) {
			return NextResponse.json(
				{ error: 'Complaint not found' },
				{ status: 404 }
			)
		}

		// Check if user owns this complaint or is admin
		const reqUser = await User.findById(decoded.userId)
		const isOwner = complaint.userId._id.toString() === decoded.userId
		const isAdmin = reqUser?.role === 'admin'
		if (!isOwner && !isAdmin) {
			return NextResponse.json(
				{ error: 'Access denied' },
				{ status: 403 }
			)
		}

		return NextResponse.json(complaint)
	} catch (error) {
		console.error('Get complaint error:', error)
		return NextResponse.json(
			{ error: 'Internal server error: ' + error.message },
			{ status: 500 }
		)
	}
}

export async function DELETE(req, { params }) {
	try {
		const cookies = req.cookies
		const token = cookies.get('token')?.value
		
		if (!token) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const decoded = jwt.verify(token, JWT_SECRET)
		
		await connectDB()
		
		const complaint = await Complaint.findById(params.id)
			.populate('userId', 'name email')

		if (!complaint) {
			return NextResponse.json(
				{ error: 'Complaint not found' },
				{ status: 404 }
			)
		}

		// Check if user owns this complaint or is admin
		const reqUser = await User.findById(decoded.userId)
		const isOwner = complaint.userId._id.toString() === decoded.userId
		const isAdmin = reqUser?.role === 'admin'
		
		if (!isOwner && !isAdmin) {
			return NextResponse.json(
				{ error: 'Access denied. You can only delete your own complaints.' },
				{ status: 403 }
			)
		}

		// Delete the complaint
		await Complaint.findByIdAndDelete(params.id)

		return NextResponse.json(
			{ message: 'Complaint deleted successfully' },
			{ status: 200 }
		)
	} catch (error) {
		console.error('Delete complaint error:', error)
		return NextResponse.json(
			{ error: 'Internal server error: ' + error.message },
			{ status: 500 }
		)
	}
}
