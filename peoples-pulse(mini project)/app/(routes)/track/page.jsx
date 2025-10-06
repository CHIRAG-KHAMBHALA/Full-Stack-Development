"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'

const statusClass = s => ({ 
	pending:'status pending', 
	forwarded:'status forwarded', 
	acknowledged:'status acknowledged', 
	resolved:'status resolved' 
}[s] || 'status')

export default function TrackPage(){
	const { language } = useI18n()
	const [id, setId] = useState('')
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	useEffect(() => {
		// Check if user is authenticated
		checkAuth()
		
		// Check for ID in URL
		const url = new URL(window.location.href)
		const q = url.searchParams.get('id')
		if(q){ setId(q); fetchStatus(q) }
	}, [])

	async function checkAuth(){
		try {
			const res = await fetch('/api/auth/me')
			if (!res.ok) {
				router.push('/login?redirect=/track')
			}
		} catch (error) {
			router.push('/login?redirect=/track')
		}
	}

	async function fetchStatus(cid){
		setLoading(true)
		setError('')
		try{
			const res = await fetch(`/api/complaints/${cid}`)
			const j = await res.json()
			if(res.ok) {
				setData(j)
			} else {
				setError(j.error || 'Failed to fetch complaint')
			}
		} catch (error) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="track-page">
			<div className="container">
				<div className="track-header">
					<h1>Track Your Complaint</h1>
					<p className="muted">Enter your complaint ID to check the current status</p>
				</div>
				
				{error && <div className="error-message">{error}</div>}

				<div className="track-form-card">
					<div className="field">
						<label>Complaint ID</label>
						<div className="input-with-icon">
							<span className="input-icon">🔍</span>
							<input 
								value={id} 
								onChange={e => setId(e.target.value)} 
								placeholder="PP-ABC123XY" 
							/>
						</div>
					</div>
					<div className="search-actions">
						<button 
							className="btn btn-primary search-btn" 
							onClick={() => fetchStatus(id)} 
							disabled={!id || loading}
						>
							<span className="btn-icon">🔍</span>
							{loading ? 'Searching...' : 'Search'}
						</button>
					</div>
				</div>

				{data && (
					<div className="track-result-card">
						<h3>{data.summary}</h3>
						<p className="muted">
							{data.location?.taluka && `${data.location.taluka}, `}
							{data.location?.district && `${data.location.district}, `}
							{data.location?.state && data.location.state}
						</p>
						<p>Status: <span className={statusClass(data.status)}>{data.status}</span></p>
						<p>Language: {data.language === 'hi' ? 'हिंदी' : 'English'}</p>
						<p>Submitted: {new Date(data.createdAt).toLocaleDateString()}</p>
						
						{data.timeline && data.timeline.length > 0 && (
							<div className="timeline-section">
								<h4>Timeline</h4>
								<ul className="timeline-list">
									{data.timeline.map((t,i)=> (
										<li key={i}>
											<span className="muted">{new Date(t.at).toLocaleString()}:</span> {t.text}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}

				<div className="track-actions">
					<Link href="/submit" className="btn btn-secondary">Submit New Complaint</Link>
				</div>
			</div>
		</main>
	)
}
