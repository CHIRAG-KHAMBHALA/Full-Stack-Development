"use client"
import { useI18n } from '@/components/I18nProvider'

export function LocaleToggle(){
	const { language, setLanguage } = useI18n()
	return (
		<div className="locale-toggle">
			<button className={language==='en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
			<button className={language==='hi' ? 'active' : ''} onClick={() => setLanguage('hi')}>हिंदी</button>
		</div>
	)
}
