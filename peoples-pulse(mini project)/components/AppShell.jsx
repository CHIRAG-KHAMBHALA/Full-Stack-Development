"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { LocaleToggle } from '@/components/LocaleToggle'
import { AuthNav } from '@/components/AuthNav'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useI18n } from '@/components/I18nProvider'

export default function AppShell({ children }){
	const { t } = useI18n()
	const [isLoading, setIsLoading] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setIsLoading(true)
		const timer = setTimeout(() => setIsLoading(false), 500)
		return () => clearTimeout(timer)
	}, [pathname])

	return (
		<>
			{isLoading && <LoadingSpinner />}
			<header className="site-header">
				<div className="container header-inner">
					<Link href="/" className="brand">
						<span className="brand-mark" aria-hidden>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<g transform="translate(12, 12) scale(1.8) translate(-12, -12)">
									<path d="M12 17s-5-2.686-5-6a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 3.314-5 6-5 6z" fill="#fff"/>
								</g>
							</svg>
						</span> 
						<span className="brand-name">{t('brand')}</span>
					</Link>
					<nav className="main-nav">
						<Link href="/" className="nav-link">{t('nav_home')}</Link>
						<Link href="/submit" className="nav-link">{t('nav_submit')}</Link>
						<Link href="/track" className="nav-link">{t('nav_track')}</Link>
						<Link href="/policies" className="nav-link">{t('nav_policies')}</Link>
					</nav>
					<div className="nav-controls">
						<LocaleToggle />
						<AuthNav />
					</div>
				</div>
			</header>
			{children}
			<footer className="site-footer">
				<div className="container footer-top">
					<div className="footer-brand">
						<div className="footer-logo" aria-hidden>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="2" y="2" width="20" height="20" rx="6" fill="#2563eb"/>
								<path d="M12 17s-5-2.686-5-6a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 3.314-5 6-5 6z" fill="#fff"/>
							</svg>
						</div>
						<div>
							<div className="footer-brand-name">{t('brand')}</div>
							<p className="footer-tagline">{t('footer_tagline')}</p>
							<div className="footer-socials">
								<a href="#" aria-label="Facebook" className="social-link">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
								</a>
								<a href="#" aria-label="Twitter" className="social-link">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 7.5v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
								</a>
								<a href="#" aria-label="Instagram" className="social-link">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
								</a>
							</div>
						</div>
					</div>

					<div className="footer-col">
						<h4>{t('quick_links')}</h4>
						<ul>
							<li><Link href="/">{t('nav_home')}</Link></li>
							<li><Link href="/submit">{t('nav_submit')}</Link></li>
							<li><Link href="/track">{t('nav_track')}</Link></li>
							<li><Link href="/policies">{t('nav_policies')}</Link></li>
						</ul>
					</div>

					<div className="footer-col">
						<h4>{t('contact')}</h4>
						<ul className="contact-list">
							<li><span className="contact-icon">✉</span> support@peoplespulse.gov.in</li>
							<li><span className="contact-icon">☎</span> 1800-123-4567</li>
							<li><span className="contact-icon">📍</span> New Delhi, India</li>
						</ul>
					</div>
				</div>
				<div className="footer-bottom">
					<div className="container">
						© {new Date().getFullYear()} {t('brand')}. {t('all_rights_reserved')} <span className="heart">♥</span> {t('for_citizens')}
					</div>
				</div>
			</footer>
		</>
	)
}


