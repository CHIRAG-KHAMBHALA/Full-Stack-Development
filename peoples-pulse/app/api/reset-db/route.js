import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import Complaint from '@/backend/models/Complaint.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req) {
	try {
		// Check if user is admin
		const cookies = req.cookies
		const token = cookies.get('token')?.value
		
		if (!token) {
			return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
		}

		const decoded = jwt.verify(token, JWT_SECRET)
		await connectDB()
		
		const user = await User.findById(decoded.userId)
		if (!user || user.role !== 'admin') {
			return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
		}

		// Delete all complaints to reset schema
		const result = await Complaint.deleteMany({})
		
		return NextResponse.json({ 
			message: `Database reset completed. ${result.deletedCount} complaints removed.`,
			deletedCount: result.deletedCount
		})

	} catch (error) {
		console.error('Reset error:', error)
		return NextResponse.json(
			{ error: 'Reset failed: ' + error.message },
			{ status: 500 }
		)
	}
}
