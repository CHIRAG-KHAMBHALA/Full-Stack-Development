import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import Complaint from '@/backend/models/Complaint.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function ensureAdmin(req){
  const cookies = req.cookies
  const token = cookies.get('token')?.value
  if(!token) return { error: 'Authentication required', status: 401 }
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    return { userId: decoded.userId }
  }catch{
    return { error: 'Invalid token', status: 401 }
  }
}

export async function PATCH(req, { params }){
  try {
    const auth = ensureAdmin(req)
    if(auth.error){
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    await connectDB()
    const user = await User.findById(auth.userId)
    if(!user || user.role !== 'admin'){
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { status } = await req.json()
    const allowed = ['pending','forwarded','acknowledged','resolved']
    if(!allowed.includes(status)){
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const complaint = await Complaint.findById(params.id)
    if(!complaint){
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    complaint.status = status
    complaint.timeline.push({ 
      at: new Date(), 
      text: `Status changed to ${status}`, 
      action: 'admin-update' 
    })
    
    await complaint.save()
    return NextResponse.json({ message: 'Updated successfully' })
    
  } catch (error) {
    console.error('Admin update error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}


