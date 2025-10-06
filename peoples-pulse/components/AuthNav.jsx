"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useI18n } from '@/components/I18nProvider'

export function AuthNav(){
	const { t } = useI18n()
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		checkAuth()
		// Also refresh auth when the page becomes visible again
		const onFocus = () => checkAuth()
		window.addEventListener('focus', onFocus)
		
		// Allow other parts of the app to notify auth changes
		const onAuthChanged = () => checkAuth()
		window.addEventListener('auth-changed', onAuthChanged)
		
		return () => {
			window.removeEventListener('focus', onFocus)
			window.removeEventListener('auth-changed', onAuthChanged)
		}
	}, [])

	// Re-check auth whenever the route changes (client navigation)
	useEffect(() => {
		checkAuth()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	async function checkAuth(){
		try {
			const res = await fetch('/api/auth/me')
			if (res.ok) {
				const userData = await res.json()
				setUser(userData)
			} else {
				setUser(null)
			}
		} catch (error) {
			console.error('Auth check failed:', error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	async function handleLogout(){
		try {
			await fetch('/api/auth/logout', { method: 'POST' })
			setUser(null)
			// Notify others and navigate home
			window.dispatchEvent(new Event('auth-changed'))
			router.push('/')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	if (loading) return <div className="auth-nav-loading">Loading...</div>

	if (user) {
		return (
			<div className="auth-nav">
				<Link href="/profile" className="auth-nav-link profile-link">{t('profile')}</Link>
				{user.role === 'admin' && <Link href="/admin" className="auth-nav-link admin-link">{t('admin')}</Link>}
				<button onClick={handleLogout} className="auth-nav-link logout-btn">{t('logout')}</button>
			</div>
		)
	}

	return (
		<div className="auth-nav">
			<Link href="/login" className="auth-nav-link">{t('login')}</Link>
			<Link href="/signup" className="auth-nav-link">{t('signup')}</Link>
		</div>
	)
}
