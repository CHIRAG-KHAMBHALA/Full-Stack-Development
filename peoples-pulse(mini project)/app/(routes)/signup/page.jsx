"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/I18nProvider'

export default function SignupPage(){
	const { t } = useI18n()
	const [form, setForm] = useState({ 
		name: '', 
		email: '', 
		phone: '', 
		password: '', 
		confirmPassword: '' 
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	function update(key, value){
		setForm(prev => ({ ...prev, [key]: value }))
	}

	async function handleSubmit(e){
		e.preventDefault()
		setLoading(true)
		setError('')

		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match')
			setLoading(false)
			return
		}

		try {
			const res = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: form.name,
					email: form.email,
					phone: form.phone,
					password: form.password
				})
			})

			const data = await res.json()

			if (res.ok) {
				router.push('/login?message=Account created successfully')
			} else {
				setError(data.error || 'Signup failed')
			}
		} catch (error) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="auth-container">
			<div className="auth-form">
				<h1>{t('signup')}</h1>
				<form onSubmit={handleSubmit} className="form">
					{error && <div style={{color:'var(--danger)',textAlign:'center'}}>{error}</div>}
					
					<div className="field">
						<label>Full Name</label>
						<input
							type="text"
							value={form.name}
							onChange={e => update('name', e.target.value)}
							placeholder="Your full name"
							required
						/>
					</div>

					<div className="field">
						<label>Email</label>
						<input
							type="email"
							value={form.email}
							onChange={e => update('email', e.target.value)}
							placeholder="your@email.com"
							required
						/>
					</div>

					<div className="field">
						<label>Phone (optional)</label>
						<input
							type="tel"
							value={form.phone}
							onChange={e => update('phone', e.target.value)}
							placeholder="Phone number"
						/>
					</div>

					<div className="field">
						<label>Password</label>
						<input
							type="password"
							value={form.password}
							onChange={e => update('password', e.target.value)}
							placeholder="Create a password"
							required
							minLength={6}
						/>
					</div>

					<div className="field">
						<label>Confirm Password</label>
						<input
							type="password"
							value={form.confirmPassword}
							onChange={e => update('confirmPassword', e.target.value)}
							placeholder="Confirm your password"
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? 'Creating account...' : t('signup')}
					</button>
				</form>

				<div className="auth-links">
					<p>Already have an account? <Link href="/login">{t('login')}</Link></p>
				</div>
			</div>
		</main>
	)
}
