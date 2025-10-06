import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function authMiddleware(req, res, next) {
	try {
		const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '')
		
		if (!token) {
			return res.status(401).json({ error: 'Access denied. No token provided.' })
		}

		const decoded = jwt.verify(token, JWT_SECRET)
		const user = await User.findById(decoded.userId).select('-password')
		
		if (!user) {
			return res.status(401).json({ error: 'Invalid token.' })
		}

		req.user = user
		next()
	} catch (error) {
		res.status(401).json({ error: 'Invalid token.' })
	}
}

export function adminMiddleware(req, res, next) {
	if (req.user && req.user.role === 'admin') {
		next()
	} else {
		res.status(403).json({ error: 'Access denied. Admin role required.' })
	}
}
