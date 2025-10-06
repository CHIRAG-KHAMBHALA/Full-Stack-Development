import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import User from '@/backend/models/User.js'

export async function POST(req) {
	try {
		await connectDB()
		
		const { name, email, phone, password } = await req.json()

		// Check if user already exists
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 400 }
			)
		}

		// Create new user
		const user = new User({
			name,
			email,
			phone,
			password
		})

		await user.save()

		return NextResponse.json(
			{ message: 'User created successfully' },
			{ status: 201 }
		)
	} catch (error) {
		console.error('Signup error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
