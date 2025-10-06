"use client"
import { useState, useMemo } from 'react'
import { useI18n } from '@/components/I18nProvider'

export default function PoliciesPage(){
	const { t } = useI18n()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedSector, setSelectedSector] = useState('')
	const [showFilterDropdown, setShowFilterDropdown] = useState(false)

	const policies = [
		{
			id: 1,
			title: "Digital India Initiative",
			description: "A flagship program to transform India into a digitally empowered society and knowledge economy",
			category: "Technology",
			lastUpdated: "January 10, 2024",
			link: "https://www.digitalindia.gov.in"
		},
		{
			id: 2,
			title: "Ayushman Bharat Scheme",
			description: "World's largest health insurance coverage up to 5 lakh per family",
			category: "Health",
			lastUpdated: "January 15, 2024",
			link: "https://pmjay.gov.in"
		},
		{
			id: 3,
			title: "Pradhan Mantri Awas Yojana",
			description: "Housing for all scheme providing affordable housing solutions for urban and rural areas",
			category: "Housing",
			lastUpdated: "January 8, 2024",
			link: "https://pmay.gov.in"
		},
		{
			id: 4,
			title: "National Education Policy 2020",
			description: "Holistic, flexible, multidisciplinary education for future-ready citizens",
			category: "Education",
			lastUpdated: "January 12, 2024",
			link: "https://www.education.gov.in"
		},
		{
			id: 5,
			title: "PM-KISAN Scheme",
			description: "Direct income support of ₹6,000 per year to eligible farmer families",
			category: "Agriculture",
			lastUpdated: "January 5, 2024",
			link: "https://pmkisan.gov.in"
		},
		{
			id: 6,
			title: "National Clean Air Programme",
			description: "Comprehensive plan to reduce air pollution levels across the country",
			category: "Environment",
			lastUpdated: "January 18, 2024",
			link: "https://moef.gov.in"
		},
		{
			id: 7,
			title: "PM Gati Shakti",
			description: "National Master Plan for multi-modal connectivity to reduce logistics costs",
			category: "Transportation",
			lastUpdated: "January 20, 2024",
			link: "https://pmgatishakti.gov.in"
		},
		{
			id: 8,
			title: "Jan Dhan Yojana",
			description: "Financial inclusion program providing banking services to all households",
			category: "Finance",
			lastUpdated: "January 3, 2024",
			link: "https://pmjdy.gov.in"
		},
		{
			id: 9,
			title: "Make in India",
			description: "Initiative to transform India into a global design and manufacturing hub",
			category: "Technology",
			lastUpdated: "January 16, 2024",
			link: "https://www.makeinindia.com"
		},
		{
			id: 10,
			title: "PM Fasal Bima Yojana",
			description: "Crop insurance scheme to provide financial support to farmers",
			category: "Agriculture",
			lastUpdated: "January 7, 2024",
			link: "https://pmfby.gov.in"
		},
		{
			id: 11,
			title: "Swachh Bharat Mission",
			description: "National campaign to achieve universal sanitation coverage",
			category: "Environment",
			lastUpdated: "January 14, 2024",
			link: "https://swachhbharat.gov.in"
		},
		{
			id: 12,
			title: "Skill India Mission",
			description: "National program to train over 400 million people in different skills",
			category: "Education",
			lastUpdated: "January 9, 2024",
			link: "https://www.msde.gov.in"
		}
	]

	const sectors = ["Technology", "Health", "Education", "Housing", "Agriculture", "Transportation", "Environment", "Finance"]

	const filteredPolicies = useMemo(() => {
		return policies.filter(policy => {
			const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
								 policy.description.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesSector = !selectedSector || policy.category === selectedSector
			return matchesSearch && matchesSector
		})
	}, [searchTerm, selectedSector])

	const getCategoryColor = (category) => {
		const colors = {
			"Technology": "#3b82f6",
			"Health": "#10b981",
			"Education": "#8b5cf6",
			"Housing": "#06b6d4",
			"Agriculture": "#f59e0b",
			"Transportation": "#ef4444",
			"Environment": "#84cc16",
			"Finance": "#ec4899"
		}
		return colors[category] || "#6b7280"
	}

	return (
		<main className="policies-page">
			<div className="container">
				{/* Page Header */}
				<div className="policies-header">
					<h1>{t('policies_title')}</h1>
					<p className="muted">{t('policies_subtitle')}</p>
				</div>

				{/* Search and Filter Section */}
				<div className="search-filter-section">
					<div className="search-box">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="11" cy="11" r="8"/>
							<path d="m21 21-4.35-4.35"/>
						</svg>
						<input
							type="text"
							placeholder={t('search_policies')}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					
					<div className="filter-dropdown">
						<button 
							className="filter-btn"
							onClick={() => setShowFilterDropdown(!showFilterDropdown)}
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
							</svg>
							{selectedSector || t('filter_sector')}
						</button>
						
						{showFilterDropdown && (
							<div className="filter-options">
															<div className="filter-option" onClick={() => {setSelectedSector(''); setShowFilterDropdown(false)}}>
								{t('all_sectors')}
							</div>
								{sectors.map(sector => (
									<div 
										key={sector}
										className={`filter-option ${selectedSector === sector ? 'active' : ''}`}
										onClick={() => {setSelectedSector(sector); setShowFilterDropdown(false)}}
									>
										{sector}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Policy Cards Section */}
				<div className="policies-grid">
					{filteredPolicies.map(policy => (
						<div key={policy.id} className="policy-card">
							<div className="policy-header">
								<span 
									className="category-tag"
									style={{backgroundColor: `${getCategoryColor(policy.category)}20`, color: getCategoryColor(policy.category)}}
								>
									{policy.category}
								</span>
								<div className="last-updated">
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
										<line x1="16" y1="2" x2="16" y2="6"/>
										<line x1="8" y1="2" x2="8" y2="6"/>
										<line x1="3" y1="10" x2="21" y2="10"/>
									</svg>
									<span>{t('last_updated')} {policy.lastUpdated}</span>
								</div>
							</div>
							<h3>{policy.title}</h3>
							<p>{policy.description}</p>
							<a href={policy.link} target="_blank" rel="noreferrer" className="read-policy-link">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
									<polyline points="15,3 21,3 21,9"/>
									<line x1="10" y1="14" x2="21" y2="3"/>
								</svg>
								{t('read_full_policy')}
							</a>
						</div>
					))}
				</div>

				{/* Featured Government Initiatives Section */}
				<div className="featured-initiatives">
					<h2>{t('featured_initiatives')}</h2>
					<div className="initiatives-grid">
						<div className="initiative-card digital-india">
							<h3>Digital India</h3>
							<p>Transforming India into a digitally empowered society through technology adoption and digital infrastructure development.</p>
							<a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="learn-more-btn">
								{t('learn_more')}
							</a>
						</div>
						<div className="initiative-card ayushman-bharat">
							<h3>Ayushman Bharat</h3>
							<p>World's largest health insurance scheme providing healthcare coverage to over 10 crore families across India.</p>
							<a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="learn-more-btn">
								{t('learn_more')}
							</a>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}


