"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/components/I18nProvider'
import homeImg from '@/components/image/home.png'

export default function HomePage(){
	const { t } = useI18n()
	return (
		<main>
			{/* Hero Section */}
			<section className="hero">
				<div className="container">
					<span className="badge">{t('hero_badge')}</span>
					<h1>{t('hero_title')}</h1>
					<p>{t('hero_desc')}</p>
					<div className="cta">
						<Link className="btn btn-primary" href="/submit">{t('cta_submit')}</Link>
						<Link className="btn" href="/track">{t('cta_track')}</Link>
						<Link className="btn" href="/policies">{t('cta_policies')}</Link>
					</div>
					<div className="hero-image-card">
						<Image
							src={homeImg}
							alt="People collaborating at a desk"
							priority
							style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
						/>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="container stats">
				<div className="stat">
					<strong>10,000+</strong>
					<span>{t('stats_complaints')}</span>
				</div>
				<div className="stat">
					<strong>25,000+</strong>
					<span>{t('stats_citizens')}</span>
				</div>
				<div className="stat">
					<strong>500+</strong>
					<span>{t('stats_policies')}</span>
				</div>
				<div className="stat">
					<strong>98%</strong>
					<span>{t('stats_satisfaction')}</span>
				</div>
			</section>

			{/* Features Section */}
			<section className="container features">
				<h2>{t('features_title')}</h2>
				<p className="muted center">{t('features_subtitle')}</p>
				<div className="grid grid-4">
					<div className="card feature">
						<div className="icon">📝</div>
						<h3>{t('feature_easy_submission')}</h3>
						<p className="muted">{t('feature_easy_desc')}</p>
					</div>
					<div className="card feature">
						<div className="icon">📊</div>
						<h3>{t('feature_track')}</h3>
						<p className="muted">{t('feature_track_desc')}</p>
					</div>
					<div className="card feature">
						<div className="icon">🏛️</div>
						<h3>{t('feature_policies')}</h3>
						<p className="muted">{t('feature_policies_desc')}</p>
					</div>
					<div className="card feature">
						<div className="icon">🤝</div>
						<h3>{t('feature_impact')}</h3>
						<p className="muted">{t('feature_impact_desc')}</p>
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section className="container how-it-works">
				<h2>{t('how_it_works_title')}</h2>
				<div className="grid grid-3">
					<div className="step-card">
						<div className="step-num">1</div>
						<h4>{t('step1_title')}</h4>
						<p className="muted">{t('step1_desc')}</p>
					</div>
					<div className="step-card">
						<div className="step-num alt">2</div>
						<h4>{t('step2_title')}</h4>
						<p className="muted">{t('step2_desc')}</p>
					</div>
					<div className="step-card">
						<div className="step-num warn">3</div>
						<h4>{t('step3_title')}</h4>
						<p className="muted">{t('step3_desc')}</p>
					</div>
				</div>
			</section>

			{/* Final CTA Banner */}
			<section className="final-cta">
				<div className="container">
					<h2>Ready to Make Your Voice Heard?</h2>
					<p className="muted">Join thousands of citizens making a difference in their communities</p>
					<div className="cta">
						<Link className="btn btn-primary" href="/signup">Get Started Today</Link>
					</div>
				</div>
			</section>
		</main>
	)
}
