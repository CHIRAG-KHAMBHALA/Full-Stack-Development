"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const statusColors = {
	pending: 'status pending',
	forwarded: 'status forwarded',
	acknowledged: 'status acknowledged',
	resolved: 'status resolved'
}

export default function AdminDashboard(){
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [items, setItems] = useState([])
	const [counts, setCounts] = useState({ total: 0, pending: 0, forwarded: 0, resolved: 0 })
    const router = useRouter()

	useEffect(() => { init() }, [])

	async function init(){
		try{
			const me = await fetch('/api/auth/me')
			if(!me.ok){ router.push('/login?redirect=/admin'); return }
			const u = await me.json()
			if(u.role !== 'admin'){ setError('Access denied. Admin only.'); setLoading(false); return }
			await fetchAll()
		}catch{ setError('Failed to authenticate'); setLoading(false) }
	}

	async function fetchAll(){
		setLoading(true)
		setError('')
		try{
			const res = await fetch('/api/admin/complaints')
			const j = await res.json()
			if(res.ok){
				setItems(j.items)
				setCounts(j.counts)
			}else{ setError(j.error || 'Failed to fetch') }
		}catch(e){ setError('Network error') }
		finally{ setLoading(false) }
	}

	async function updateStatus(id, status){
		const res = await fetch(`/api/admin/complaints/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) })
		if(res.ok){ fetchAll() }
	}

	if(loading) return <main className="container" style={{padding:'24px 0'}}><p>Loading...</p></main>
	if(error) return <main className="container" style={{padding:'24px 0'}}><p style={{color:'var(--danger)'}}>{error}</p></main>

	return (
		<main className="container admin-page" style={{padding:'24px 0'}}>
			<h1 className="admin-title">Admin Dashboard</h1>
			<p className="muted">Manage and track citizen complaints efficiently</p>

			<div className="stats-grid">
				<div className="stat-card">
					<h3>Total</h3>
					<p className="stat-number">{counts.total}</p>
					<p className="muted">All time submissions</p>
				</div>
				<div className="stat-card">
					<h3>Pending</h3>
					<p className="stat-number">{counts.pending}</p>
					<p className="muted">Awaiting review</p>
				</div>
				<div className="stat-card">
					<h3>Forwarded</h3>
					<p className="stat-number">{counts.forwarded}</p>
					<p className="muted">Sent to authorities</p>
				</div>
				<div className="stat-card">
					<h3>Resolved</h3>
					<p className="stat-number">{counts.resolved}</p>
					<p className="muted">Successfully closed</p>
				</div>
			</div>

			<div className="card complaints-section">
				<h3>Recent Complaints</h3>
				
				{/* Desktop Table View */}
				<div className="desktop-table">
					<table className="table">
						<thead>
							<tr>
								<th>Summary</th>
								<th>Location</th>
								<th>Status</th>
								<th>Lang</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{items.map((c) => (
								<tr key={c._id}>
									<td><strong>{c.summary}</strong><div className="muted complaint-id">{c._id}</div></td>
									<td className="muted">{[c.location?.taluka,c.location?.district,c.location?.state].filter(Boolean).join(', ')}</td>
									<td><span className={statusColors[c.status] || 'status'}>{c.status}</span></td>
									<td>{c.language}</td>
									<td>{new Date(c.createdAt).toLocaleDateString()}</td>
									<td>
										<select value={c.status} onChange={(e)=>updateStatus(c._id, e.target.value)}>
											<option value="pending">Pending</option>
											<option value="forwarded">Forwarded</option>
											<option value="acknowledged">Acknowledged</option>
											<option value="resolved">Resolved</option>
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Mobile Card View */}
				<div className="mobile-cards">
					{items.map((c) => (
						<div key={c._id} className="complaint-card">
							<div className="complaint-header">
								<span className={statusColors[c.status] || 'status'}>{c.status}</span>
								<span className="language-badge">{c.language}</span>
							</div>
							<div className="complaint-content">
								<p className="complaint-summary"><strong>{c.summary}</strong></p>
								<p className="complaint-id">ID: {c._id}</p>
								<p className="complaint-location">{[c.location?.taluka,c.location?.district,c.location?.state].filter(Boolean).join(', ')}</p>
								<p className="complaint-date">{new Date(c.createdAt).toLocaleDateString()}</p>
							</div>
							<div className="complaint-actions">
								<select value={c.status} onChange={(e)=>updateStatus(c._id, e.target.value)}>
									<option value="pending">Pending</option>
									<option value="forwarded">Forwarded</option>
									<option value="acknowledged">Acknowledged</option>
									<option value="resolved">Resolved</option>
								</select>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}


