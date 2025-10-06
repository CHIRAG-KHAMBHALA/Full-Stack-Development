import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import Complaint from '@/backend/models/Complaint.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'
import jsPDF from 'jspdf'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(req, { params }) {
	try {
		console.log('Starting PDF generation for complaint:', params.id)
		
		const token = req.cookies.get('token')?.value

		if (!token) {
			console.log('No token found')
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const decoded = jwt.verify(token, JWT_SECRET)
		console.log('Token verified for user:', decoded.userId)

		await connectDB()
		console.log('Database connected')

		const complaint = await Complaint.findById(params.id)
			.populate('userId', 'name email')
			.select('-__v')

		if (!complaint) {
			console.log('Complaint not found')
			return NextResponse.json(
				{ error: 'Complaint not found' },
				{ status: 404 }
			)
		}

		console.log('Complaint found:', complaint._id)

		// Check if user owns this complaint or is admin
		const reqUser = await User.findById(decoded.userId)
		const isOwner = complaint.userId._id.toString() === decoded.userId
		const isAdmin = reqUser?.role === 'admin'
		
		if (!isOwner && !isAdmin) {
			console.log('Access denied for user:', decoded.userId)
			return NextResponse.json(
				{ error: 'Access denied' },
				{ status: 403 }
			)
		}

		console.log('Generating PDF...')
		
		// Generate PDF content
		const pdfBuffer = generatePDF(complaint)
		
		console.log('PDF generated successfully, size:', pdfBuffer.byteLength)

		// Return the PDF buffer
		const response = new NextResponse(pdfBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="complaint-${params.id}.pdf"`
			}
		})

		return response
	} catch (error) {
		console.error('PDF generation error:', error)
		console.error('Error stack:', error.stack)
		return NextResponse.json(
			{ error: 'Internal server error: ' + error.message },
			{ status: 500 }
		)
	}
}

function generatePDF(complaint) {
	try {
		// Create new PDF document
		const doc = new jsPDF()
		
		// Set font
		doc.setFont('helvetica')
		
		// Title
		doc.setFontSize(20)
		doc.setFont('helvetica', 'bold')
		doc.text("COMPLAINT DETAILS", 105, 20, { align: 'center' })
		
		// Add line separator
		doc.setLineWidth(0.5)
		doc.line(20, 30, 190, 30)
		
		let yPosition = 45
		
		// Complaint ID
		doc.setFontSize(12)
		doc.setFont('helvetica', 'bold')
		doc.text("Complaint ID:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint._id.toString(), 60, yPosition)
		yPosition += 10
		
		// Category
		doc.setFont('helvetica', 'bold')
		doc.text("Category:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.category || 'Not specified', 60, yPosition)
		yPosition += 10
		
		// Status
		doc.setFont('helvetica', 'bold')
		doc.text("Status:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.status, 60, yPosition)
		yPosition += 10
		
		// Language
		doc.setFont('helvetica', 'bold')
		doc.text("Language:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.language === 'hi' ? 'हिंदी' : 'English', 60, yPosition)
		yPosition += 10
		
		// Submitted Date
		doc.setFont('helvetica', 'bold')
		doc.text("Submitted:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(new Date(complaint.createdAt).toLocaleString(), 60, yPosition)
		yPosition += 15
		
		// Submitter Information
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(14)
		doc.text("SUBMITTER INFORMATION", 20, yPosition)
		yPosition += 10
		
		doc.setFontSize(12)
		doc.setFont('helvetica', 'bold')
		doc.text("Name:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.userId?.name || 'N/A', 60, yPosition)
		yPosition += 10
		
		doc.setFont('helvetica', 'bold')
		doc.text("Email:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.userId?.email || 'N/A', 60, yPosition)
		yPosition += 15
		
		// Complaint Details
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(14)
		doc.text("COMPLAINT DETAILS", 20, yPosition)
		yPosition += 10
		
		doc.setFontSize(12)
		doc.setFont('helvetica', 'bold')
		doc.text("Summary:", 20, yPosition)
		yPosition += 7
		
		// Handle long summary text
		const summaryLines = doc.splitTextToSize(complaint.summary || '', 160)
		doc.setFont('helvetica', 'normal')
		doc.text(summaryLines, 20, yPosition)
		yPosition += (summaryLines.length * 7) + 10
		
		doc.setFont('helvetica', 'bold')
		doc.text("Details:", 20, yPosition)
		yPosition += 7
		
		// Handle long details text
		const detailsLines = doc.splitTextToSize(complaint.details || '', 160)
		doc.setFont('helvetica', 'normal')
		doc.text(detailsLines, 20, yPosition)
		yPosition += (detailsLines.length * 7) + 15
		
		// Location
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(14)
		doc.text("LOCATION", 20, yPosition)
		yPosition += 10
		
		doc.setFontSize(12)
		doc.setFont('helvetica', 'bold')
		doc.text("Taluka:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.location?.taluka || 'N/A', 60, yPosition)
		yPosition += 10
		
		doc.setFont('helvetica', 'bold')
		doc.text("District:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.location?.district || 'N/A', 60, yPosition)
		yPosition += 10
		
		doc.setFont('helvetica', 'bold')
		doc.text("State:", 20, yPosition)
		doc.setFont('helvetica', 'normal')
		doc.text(complaint.location?.state || 'N/A', 60, yPosition)
		yPosition += 15
		
		// Timeline
		if (complaint.timeline && complaint.timeline.length > 0) {
			doc.setFont('helvetica', 'bold')
			doc.setFontSize(14)
			doc.text("TIMELINE", 20, yPosition)
			yPosition += 10
			
			doc.setFontSize(10)
			doc.setFont('helvetica', 'normal')
			
			complaint.timeline.forEach((entry, index) => {
				if (yPosition > 250) {
					doc.addPage()
					yPosition = 20
				}
				
				const timelineText = `${new Date(entry.at).toLocaleString()}: ${entry.text}`
				const timelineLines = doc.splitTextToSize(timelineText, 160)
				doc.text(timelineLines, 20, yPosition)
				yPosition += (timelineLines.length * 5) + 5
			})
		}
		
		// Photos Section
		if (complaint.images && complaint.images.length > 0) {
			if (yPosition > 200) {
				doc.addPage()
				yPosition = 20
			}
			
			doc.setFont('helvetica', 'bold')
			doc.setFontSize(14)
			doc.text("PHOTOS", 20, yPosition)
			yPosition += 15
			
			// Add informational note about images
			doc.setFontSize(8)
			doc.setFont('helvetica', 'italic')
			doc.text("Note: Images are embedded directly in this PDF for complete documentation.", 20, yPosition)
			yPosition += 8
			doc.text("Older complaints may show metadata only due to system updates.", 20, yPosition)
			yPosition += 15
			
			// Add photos with actual images
			complaint.images.forEach((img, index) => {
				if (yPosition > 200) {
					doc.addPage()
					yPosition = 20
				}
				
				// Photo metadata
				doc.setFontSize(10)
				doc.setFont('helvetica', 'bold')
				doc.text(`Photo ${index + 1}:`, 20, yPosition)
				doc.setFont('helvetica', 'normal')
				doc.text(`${img.originalName || 'Unknown'} (${img.size || 0} bytes)`, 50, yPosition)
				yPosition += 8
				
				// Embed actual image if base64 data exists
				if (img.base64Data && img.base64Data.startsWith('data:')) {
					try {
						// Check if it's a real image or placeholder
						if (img.base64Data.startsWith('data:image/')) {
							// Real image data
							const maxWidth = 160
							const maxHeight = 120
							
							// Add image to PDF
							doc.addImage(img.base64Data, 'JPEG', 20, yPosition, maxWidth, maxHeight)
							yPosition += maxHeight + 10
							
							// Add success indicator
							doc.setFontSize(8)
							doc.setFont('helvetica', 'italic')
							doc.text("✓ Image embedded successfully", 20, yPosition)
							yPosition += 8
						} else {
							// Placeholder data (from migration)
							doc.setFontSize(8)
							doc.setFont('helvetica', 'italic')
							doc.text("ℹ Placeholder data (original image not available)", 20, yPosition)
							yPosition += 15
						}
					} catch (imageError) {
						console.error('Error embedding image:', imageError)
						// Fallback to text if image embedding fails
						doc.setFontSize(8)
						doc.setFont('helvetica', 'italic')
						doc.text("⚠ Image embedding failed - check image format", 20, yPosition)
						yPosition += 15
					}
				} else {
					// No base64 data available or invalid format
					doc.setFontSize(8)
					doc.setFont('helvetica', 'italic')
					if (!img.base64Data) {
						doc.text("ℹ Image data not available (uploaded before base64 support)", 20, yPosition)
					} else {
						doc.text("ℹ Image data format not supported", 20, yPosition)
					}
					yPosition += 15
				}
			})
		}
		
		// Footer
		const pageCount = doc.internal.getNumberOfPages()
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i)
			doc.setFontSize(8)
			doc.setFont('helvetica', 'italic')
			doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280)
			doc.text(`Page ${i} of ${pageCount}`, 170, 280)
		}
		
		// Return PDF as buffer
		return doc.output('arraybuffer')
	} catch (error) {
		console.error('Error in generatePDF function:', error)
		throw error
	}
}
