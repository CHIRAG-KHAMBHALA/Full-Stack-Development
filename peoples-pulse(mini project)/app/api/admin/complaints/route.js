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

export async function GET(req){
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

    const items = await Complaint.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-__v')
      .lean()

    const countsAgg = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    
    const counts = { 
      total: await Complaint.countDocuments(), 
      pending: 0, 
      forwarded: 0, 
      acknowledged: 0,
      resolved: 0 
    }
    
    countsAgg.forEach(r => { 
      if (r._id && counts.hasOwnProperty(r._id)) {
        counts[r._id] = r.count 
      }
    })
    
    return NextResponse.json({ items, counts })
  } catch (error) {
    console.error('Admin complaints error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}


