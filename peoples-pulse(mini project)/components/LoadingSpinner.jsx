"use client"
import { useI18n } from '@/components/I18nProvider'

export default function LoadingSpinner({ message = null }) {
	const { t } = useI18n()
	
	return (
		<div className="loading-overlay">
			<div className="loading-spinner">
				<div className="spinner"></div>
				<p className="loading-text">{message || t('loading') || 'Loading...'}</p>
			</div>
		</div>
	)
}
