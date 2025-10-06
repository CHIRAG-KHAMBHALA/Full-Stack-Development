import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'

export async function GET() {
	try {
		console.log('Testing database connection...')
		await connectDB()
		console.log('Database connection successful')
		return NextResponse.json({ message: 'Database connection successful' })
	} catch (error) {
		console.error('Database connection failed:', error)
		return NextResponse.json(
			{ error: 'Database connection failed: ' + error.message },
			{ status: 500 }
		)
	}
}
