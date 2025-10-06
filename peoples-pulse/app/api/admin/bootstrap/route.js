import { NextResponse } from 'next/server'
import connectDB from '@/backend/config/db.js'
import User from '@/backend/models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req){
  const token = req.cookies.get('token')?.value
  if(!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  let decoded
  try { decoded = jwt.verify(token, JWT_SECRET) } catch { return NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
  await connectDB()
  const adminCount = await User.countDocuments({ role: 'admin' })
  if(adminCount > 0) return NextResponse.json({ error: 'Admin already exists' }, { status: 403 })
  const user = await User.findById(decoded.userId)
  if(!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  user.role = 'admin'
  await user.save()
  return NextResponse.json({ message: 'Promoted to admin' })
}


