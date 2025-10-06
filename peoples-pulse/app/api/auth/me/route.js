import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(req) {
	try {
		const token = req.cookies.get('token')?.value
		
		if (!token) {
			return NextResponse.json(
				{ error: 'No token provided' },
				{ status: 401 }
			)
		}

		// Verify token
		const decoded = jwt.verify(token, JWT_SECRET)
		
		await connectDB()
		
		// Get user data
		const user = await User.findById(decoded.userId).select('-password')
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(user)
	} catch (error) {
		console.error('Auth check error:', error)
		return NextResponse.json(
			{ error: 'Invalid token' },
			{ status: 401 }
		)
	}
}
