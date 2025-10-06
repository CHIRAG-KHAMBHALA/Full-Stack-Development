"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'

export default function SubmitPage(){
	const { language, t } = useI18n()
	const [form, setForm] = useState({ 
		category: '',
		summary: '', 
		details: '', 
		language: 'en', 
		taluka: '', 
		district: '', 
		state: '' 
	})
	const [photos, setPhotos] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const router = useRouter()

	useEffect(() => {
		// Check if user is authenticated
		checkAuth()
	}, [])

	useEffect(() => {
		setForm(prev => ({ ...prev, language }))
	}, [language])

	async function checkAuth(){
		try {
			const res = await fetch('/api/auth/me')
			if (!res.ok) {
				router.push('/login?redirect=/submit')
			}
		} catch (error) {
			router.push('/login?redirect=/submit')
		}
	}

	function update(key, value){
		setForm(prev => ({ ...prev, [key]: value }))
	}

	function handlePhotoUpload(files) {
		const newPhotos = Array.from(files).slice(0, 5) // Max 5 photos
		setPhotos(prev => [...prev, ...newPhotos].slice(0, 5))
	}

	function removePhoto(index) {
		setPhotos(prev => prev.filter((_, i) => i !== index))
	}

	function handleDrop(e) {
		e.preventDefault()
		handlePhotoUpload(e.dataTransfer.files)
	}

	function handleDragOver(e) {
		e.preventDefault()
	}

	async function handleSubmit(e){
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		try {
			const formData = new FormData()
			Object.entries(form).forEach(([key, value]) => {
				formData.append(key, value)
			})
			
			// Add photos
			photos.forEach((photo, index) => {
				formData.append(`photos`, photo)
			})

			const res = await fetch('/api/complaints', {
				method: 'POST',
				body: formData
			})

			const data = await res.json()

			if (res.ok) {
				setSuccess(`Complaint submitted successfully! ID: ${data.id}`)
				setForm({ category: '', summary: '', details: '', language, taluka: '', district: '', state: '' })
				setPhotos([])
			} else {
				setError(data.error || 'Failed to submit complaint')
			}
		} catch (error) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="submit-page">
			<div className="container">
				<div className="submit-header">
					<h1>{t('submit_title')}</h1>
					<p className="muted">{t('submit_subtitle')}</p>
				</div>
				
				{error && <div className="error-message">{error}</div>}
				{success && <div className="success-message">{success}</div>}

				<form onSubmit={handleSubmit} className="submit-form">
					{/* Your Details Section */}
					<div className="form-section">
						<div className="section-header">
							<div className="section-icon">👤</div>
							<h3>{t('your_details')}</h3>
						</div>
						<div className="section-content">
							<div className="field">
								<label>{t('full_name')}</label>
								<input 
									type="text"
									placeholder={t('full_name_placeholder')}
									required
								/>
							</div>
							<div className="field">
								<label>{t('email')}</label>
								<input 
									type="email"
									placeholder={t('email_placeholder')}
									required
								/>
							</div>
							<div className="field">
								<label>{t('phone')}</label>
								<input 
									type="tel"
									placeholder={t('phone_placeholder')}
									required
								/>
							</div>
						</div>
					</div>

					{/* Complaint Details Section */}
					<div className="form-section">
						<div className="section-header">
							<div className="section-icon">📋</div>
							<h3>{t('complaint_details')}</h3>
						</div>
						<div className="section-content">
							<div className="field">
								<label>{t('category')}</label>
								<select 
									value={form.category} 
									onChange={e => update('category', e.target.value)} 
									required
								>
									<option value="">{t('select_category')}</option>
									<option value="Health">{t('health')}</option>
									<option value="Education">{t('education')}</option>
									<option value="Transport">Transport</option>
									<option value="Water & Sanitation">Water & Sanitation</option>
									<option value="Electricity">Electricity</option>
									<option value="Corruption">Corruption</option>
									<option value="Other">Other</option>
								</select>
							</div>
							<div className="field">
								<label>{t('subject')}</label>
								<input 
									value={form.summary} 
									onChange={e => update('summary', e.target.value)} 
									placeholder={t('subject_placeholder')}
									required
								/>
							</div>
							<div className="field">
								<label>{t('describe_complaint')}</label>
								<textarea 
									rows={5} 
									value={form.details} 
									onChange={e => update('details', e.target.value)} 
									placeholder={t('describe_placeholder')}
									required
								></textarea>
							</div>
						</div>
					</div>

					{/* Location Section */}
					<div className="form-section">
						<div className="section-header">
							<div className="section-icon">📍</div>
							<h3>{t('location')}</h3>
						</div>
						<div className="section-content">
							<div className="location-grid">
								<div className="field">
									<label>{t('state')}</label>
									<input 
										value={form.state} 
										onChange={e => update('state', e.target.value)} 
										placeholder={t('state_placeholder')}
										required
									/>
								</div>
								<div className="field">
									<label>{t('district')}</label>
									<input 
										value={form.district} 
										onChange={e => update('district', e.target.value)} 
										placeholder={t('district_placeholder')}
										required
									/>
								</div>
								<div className="field">
									<label>{t('taluka')}</label>
									<input 
										value={form.taluka} 
										onChange={e => update('taluka', e.target.value)} 
										placeholder={t('taluka_placeholder')}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Attachments Section */}
					<div className="form-section">
						<div className="section-header">
							<div className="section-icon">📤</div>
							<h3>{t('attachments')}</h3>
						</div>
						<div className="section-content">
							<div className="field">
								<label>{t('upload_photos')}</label>
								<div 
									className="photo-upload-area"
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									onClick={() => document.getElementById('photo-input').click()}
								>
									<input
										id="photo-input"
										type="file"
										multiple
										accept="image/*"
										onChange={(e) => handlePhotoUpload(e.target.files)}
										style={{ display: 'none' }}
									/>
									<div className="upload-content">
										<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
											<polyline points="7,10 12,15 17,10"/>
											<line x1="12" y1="15" x2="12" y2="3"/>
										</svg>
										<p>{t('upload_photos')}</p>
										<button type="button" className="btn btn-secondary">{t('choose_files')}</button>
									</div>
								</div>
								
								{photos.length > 0 && (
									<div className="photo-preview">
										{photos.map((photo, index) => (
											<div key={index} className="photo-item">
												<img 
													src={URL.createObjectURL(photo)} 
													alt={`Photo ${index + 1}`}
													style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
												/>
												<button 
													type="button" 
													onClick={() => removePhoto(index)}
													className="remove-photo"
												>
													×
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div className="submit-actions">
						<button 
							className="btn btn-primary submit-btn" 
							disabled={loading || !form.category || !form.summary || !form.details} 
							type="submit"
						>
							<span className="btn-icon">📤</span>
							{loading ? t('submitting') : t('submit_complaint')}
						</button>
						{success && (
							<Link className="btn btn-secondary" href={`/track?id=${success.split('ID: ')[1]}`}>
								{t('view_status')}
							</Link>
						)}
					</div>
				</form>
			</div>
		</main>
	)
}
