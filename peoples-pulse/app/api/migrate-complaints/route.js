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

		// Find complaints with old images schema (string array)
		const oldComplaints = await Complaint.find({
			$or: [
				{ images: { $exists: false } },
				{ images: { $type: 'array' } }
			]
		})

		console.log(`Found ${oldComplaints.length} complaints to migrate`)

		let migratedCount = 0
		for (const complaint of oldComplaints) {
			// If images is missing or is a string array, convert to new format
			if (!complaint.images || Array.isArray(complaint.images)) {
				complaint.images = []
				await complaint.save()
				migratedCount++
			}
		}

		return NextResponse.json({ 
			message: `Migration completed. ${migratedCount} complaints updated.`,
			totalFound: oldComplaints.length,
			migrated: migratedCount
		})

	} catch (error) {
		console.error('Migration error:', error)
		return NextResponse.json(
			{ error: 'Migration failed: ' + error.message },
			{ status: 500 }
		)
	}
}
