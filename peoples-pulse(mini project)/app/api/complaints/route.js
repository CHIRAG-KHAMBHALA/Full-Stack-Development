import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import Complaint from '@/backend/models/Complaint.js'
import jwt from 'jsonwebtoken'
import User from '@/backend/models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req) {
	try {
		console.log('Starting complaint submission...')
		
		// Get token from cookies - Next.js 14+ method
		const cookies = req.cookies
		const token = cookies.get('token')?.value
		
		if (!token) {
			console.log('No token found')
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		// Verify token
		const decoded = jwt.verify(token, JWT_SECRET)
		console.log('Token verified for user:', decoded.userId)
		
		await connectDB()
		console.log('Database connected')
		
		const formData = await req.formData()
		const category = formData.get('category') || 'Other'
		const summary = formData.get('summary')
		const details = formData.get('details')
		const language = formData.get('language') || 'en'
		const taluka = formData.get('taluka')
		const district = formData.get('district')
		const state = formData.get('state')
		const photos = formData.getAll('photos')

		console.log('Form data received:', { category, summary, details, language, photos: photos.length })

		// Validate required fields
		if (!summary || !details) {
			console.log('Missing required fields')
			return NextResponse.json(
				{ error: 'Summary and details are required' },
				{ status: 400 }
			)
		}

		// Process photos - convert to base64 for PDF generation
		const processedPhotos = []
		for (const photo of photos) {
			if (photo instanceof File && photo.size > 0) {
				try {
					// Convert file to base64
					const arrayBuffer = await photo.arrayBuffer()
					const base64 = Buffer.from(arrayBuffer).toString('base64')
					const dataUrl = `data:${photo.type};base64,${base64}`
					
					processedPhotos.push({
						filename: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
						originalName: photo.name,
						mimeType: photo.type,
						size: photo.size,
						base64Data: dataUrl, // Store base64 data for PDF
						uploadedAt: new Date()
					})
				} catch (error) {
					console.error('Error processing photo:', error)
					// Still add the photo with metadata even if base64 conversion fails
					processedPhotos.push({
						filename: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
						originalName: photo.name,
						mimeType: photo.type,
						size: photo.size,
						uploadedAt: new Date()
					})
				}
			}
		}

		console.log('Processed photos:', processedPhotos.length)
		console.log('Creating complaint object...')
		
		// Create complaint with explicit structure
		const complaintData = {
			userId: decoded.userId,
			category: category,
			summary: summary,
			details: details,
			language: language,
			location: { 
				taluka: taluka || '', 
				district: district || '', 
				state: state || '' 
			},
			images: processedPhotos,
			timeline: [{ 
				at: new Date(), 
				text: 'Complaint submitted', 
				action: 'submitted' 
			}]
		}

		console.log('Complaint data to save:', JSON.stringify(complaintData, null, 2))
		
		// Create and save complaint
		const complaint = new Complaint(complaintData)
		console.log('Complaint object created, saving...')
		
		await complaint.save()
		console.log('Complaint saved successfully:', complaint._id)

		return NextResponse.json(
			{ 
				id: complaint._id,
				message: 'Complaint submitted successfully' 
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Complaint submission error:', error)
		console.error('Error stack:', error.stack)
		
		// Return more specific error messages
		if (error.name === 'ValidationError') {
			return NextResponse.json(
				{ error: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ') },
				{ status: 400 }
			)
		}
		
		return NextResponse.json(
			{ error: 'Internal server error: ' + error.message },
			{ status: 500 }
		)
	}
}

export async function GET(req) {
	try {
		// Get token from cookies - Next.js 14+ method
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
		
		const requester = await User.findById(decoded.userId)
		const filter = requester?.role === 'admin' ? {} : { userId: decoded.userId }
		const complaints = await Complaint.find(filter)
			.sort({ createdAt: -1 })
			.select('-__v')

		return NextResponse.json(complaints)
	} catch (error) {
		console.error('Get complaints error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
