import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req) {
	try {
		await connectDB()
		
		const { email, password } = await req.json()

		// Find user by email
		const user = await User.findOne({ email })
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password)
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: '7d' }
		)

		// Create response with user data (without password)
		const userData = user.toJSON()

		// Set cookie
		const response = NextResponse.json({
			message: 'Login successful',
			user: userData
		})

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		})

		return response
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
