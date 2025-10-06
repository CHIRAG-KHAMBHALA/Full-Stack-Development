"use client"
import { useEffect, useState } from 'react'
import { useI18n } from '@/components/I18nProvider'

export default function ProfilePage(){
	const { t } = useI18n()
	const [user, setUser] = useState(null)
	const [items, setItems] = useState([])
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [deletingId, setDeletingId] = useState(null)

	useEffect(() => { load() }, [])

	async function load(){
		try{
			const me = await fetch('/api/auth/me')
			if(!me.ok){ setError('Please login'); return }
			const u = await me.json(); setUser(u)
			const comps = await fetch('/api/complaints')
			if(comps.ok){ setItems(await comps.json()) }
		}catch(e){ setError('Network error') }
	}

	async function downloadPDF(complaintId) {
		try {
			const res = await fetch(`/api/complaints/${complaintId}/pdf`)
			if (res.ok) {
				const blob = await res.blob()
				const url = window.URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = `complaint-${complaintId}.pdf`
				document.body.appendChild(a)
				a.click()
				window.URL.revokeObjectURL(url)
				document.body.removeChild(a)
			} else {
				console.error('Failed to download PDF:', await res.json())
			}
		} catch (error) {
			console.error('PDF download failed:', error)
		}
	}

	async function deleteComplaint(complaintId) {
		if (!confirm(t('delete_confirm_message'))) {
			return
		}

		setDeletingId(complaintId)
		setError('')
		setSuccess('')

		try {
			const res = await fetch(`/api/complaints/${complaintId}`, {
				method: 'DELETE'
			})

			if (res.ok) {
				setSuccess(t('complaint_deleted_success'))
				// Remove the deleted complaint from the list
				setItems(prev => prev.filter(item => item._id !== complaintId))
			} else {
				const data = await res.json()
				setError(data.error || t('delete_failed'))
			}
		} catch (error) {
			setError(t('network_error'))
		} finally {
			setDeletingId(null)
		}
	}

	if(error) return <main className="container" style={{padding:'24px 0'}}><p style={{color:'var(--danger)'}}>{error}</p></main>
	if(!user) return <main className="container" style={{padding:'24px 0'}}><p>{t('loading')}</p></main>

	return (
		<main className="container profile-page" style={{padding:'24px 0'}}>
			<h1 className="profile-title">{t('profile')}</h1>
			
			{error && <div className="error-message">{error}</div>}
			{success && <div className="success-message">{success}</div>}
			
			<div className="card user-info-card">
				<p><strong>{t('full_name')}:</strong> {user.name}</p>
				<p><strong>{t('email')}:</strong> {user.email}</p>
				{user.phone && <p><strong>{t('phone')}:</strong> {user.phone}</p>}
				<p><strong>{t('role')}:</strong> {user.role}</p>
			</div>

			<div className="card complaints-card">
				<h3>{t('your_complaints')}</h3>
				
				{/* Desktop Table View */}
				<div className="desktop-table">
					<table className="table">
						<thead>
							<tr>
								<th>{t('id')}</th>
								<th>{t('category')}</th>
								<th>{t('summary')}</th>
								<th>{t('status')}</th>
								<th>{t('date')}</th>
								<th>{t('actions')}</th>
							</tr>
						</thead>
						<tbody>
							{items.map(c => (
								<tr key={c._id}>
									<td className="complaint-id">{c._id}</td>
									<td><span className="category-badge">{c.category}</span></td>
									<td className="complaint-summary">{c.summary}</td>
									<td><span className={`status ${c.status}`}>{t(c.status)}</span></td>
									<td>{new Date(c.createdAt).toLocaleDateString()}</td>
									<td>
										<div className="action-buttons">
											<button
												onClick={() => downloadPDF(c._id)}
												className="btn btn-ghost"
												title={t('download_pdf')}
											>
												📄 PDF
											</button>
											<button
												onClick={() => deleteComplaint(c._id)}
												className="btn btn-danger"
												disabled={deletingId === c._id}
												title={t('delete_complaint')}
											>
												{deletingId === c._id ? '🗑️...' : '🗑️'}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Mobile Card View */}
				<div className="mobile-cards">
					{items.map(c => (
						<div key={c._id} className="complaint-card">
							<div className="complaint-header">
								<span className="category-badge">{c.category}</span>
								<span className={`status ${c.status}`}>{t(c.status)}</span>
							</div>
							<div className="complaint-content">
								<p className="complaint-summary">{c.summary}</p>
								<p className="complaint-id">ID: {c._id}</p>
								<p className="complaint-date">{new Date(c.createdAt).toLocaleDateString()}</p>
							</div>
							<div className="complaint-actions">
								<button
									onClick={() => downloadPDF(c._id)}
									className="btn btn-ghost"
									title={t('download_pdf')}
								>
									📄 PDF
								</button>
								<button
									onClick={() => deleteComplaint(c._id)}
									className="btn btn-danger"
									disabled={deletingId === c._id}
									title={t('delete_complaint')}
								>
									{deletingId === c._id ? '🗑️...' : '🗑️'}
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}


