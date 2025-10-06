"use client"
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const defaultMessages = {
	en: {
		brand: "People's Pulse",
		nav_home: 'Home',
		nav_submit: 'Submit Complaint',
		nav_track: 'Track Complaint',
		nav_policies: 'Policies',
		cta_submit: 'Submit Complaint',
		cta_track: 'Track Complaint',
		cta_policies: 'View Policies',
		hero_badge: 'Your Voice, Your Right',
		hero_title: 'Your Voice, Your Right. Make It Heard.',
		hero_desc: 'Empowering citizens to understand policies and file complaints in simple language. Mobile‑first and multilingual.',
		get_started: 'Get Started',
		signup: 'Sign Up',
		login: 'Login',
		logout: 'Logout',
		profile: 'Profile',
		admin: 'Admin',
		loading: 'Loading...',
		
		// Home page statistics
		stats_complaints: 'Complaints Resolved',
		stats_citizens: 'Active Citizens',
		stats_policies: 'Government Policies',
		stats_satisfaction: 'Satisfaction Rate',
		
		// Home page features
		features_title: 'Empowering Democracy Through Technology',
		features_subtitle: 'Simple, transparent, and effective tools for civic engagement',
		feature_easy_submission: 'Easy Complaint Submission',
		feature_easy_desc: 'Submit complaints in simple language with photo support.',
		feature_track: 'Track Progress',
		feature_track_desc: 'Monitor your complaint status in real-time.',
		feature_policies: 'Government Policies',
		feature_policies_desc: 'Access simplified policy information.',
		feature_impact: 'Community Impact',
		feature_impact_desc: 'See the outcomes of empowered citizens.',
		
		// Home page how it works
		how_it_works_title: 'How People\'s Pulse Works',
		step1_title: 'Submit Your Concern',
		step1_desc: 'Write your complaint in simple language, add photos if needed.',
		step2_title: 'We Process & Forward',
		step2_desc: 'Our team reviews and forwards to the right authorities.',
		step3_title: 'Track Progress',
		step3_desc: 'Get timely updates until your issue is resolved.',
		
		// Submit page
		submit_title: 'Submit Your Complaint',
		submit_subtitle: 'Tell us about your issue and we\'ll help you get it resolved',
		your_details: 'Your Details',
		full_name: 'Full Name *',
		full_name_placeholder: 'Enter your full name',
		email: 'Email Address *',
		email_placeholder: 'your.email@example.com',
		phone: 'Phone Number *',
		phone_placeholder: '+91 98765 43210',
		complaint_details: 'Complaint Details',
		category: 'Category *',
		select_category: 'Select a category',
		subject: 'Subject *',
		subject_placeholder: 'Brief description of your complaint',
		describe_complaint: 'Describe your complaint *',
		describe_placeholder: 'Please provide detailed information about your complaint...',
		location: 'Location',
		state: 'State *',
		state_placeholder: 'e.g. Maharashtra',
		district: 'District *',
		district_placeholder: 'e.g. Mumbai',
		taluka: 'Taluka/Block',
		taluka_placeholder: 'e.g. Andheri',
		attachments: 'Attachments',
		upload_photos: 'Upload Photos (Optional)',
		choose_files: 'Choose Files',
		submit_complaint: 'Submit Complaint',
		submitting: 'Submitting...',
		view_status: 'View status',
		complaint_submitted: 'Complaint submitted successfully! ID:',
		
		// Track page
		track_title: 'Track Your Complaint',
		track_subtitle: 'Enter your complaint ID to check the status',
		complaint_id: 'Complaint ID',
		id_placeholder: 'Enter your complaint ID',
		track_btn: 'Track Complaint',
		tracking: 'Tracking...',
		
		// Policies page
		policies_title: 'Government Policies',
		policies_subtitle: 'Easy-to-understand summaries of key government policies',
		search_policies: 'Search policies...',
		filter_sector: 'Filter by sector',
		all_sectors: 'All Sectors',
		last_updated: 'Last updated',
		read_full_policy: 'Read Full Policy',
		featured_initiatives: 'Featured Government Initiatives',
		learn_more: 'Learn More',
		
		// Policy categories
		tech: 'Technology',
		health: 'Health',
		education: 'Education',
		housing: 'Housing',
		agriculture: 'Agriculture',
		transportation: 'Transportation',
		environment: 'Environment',
		finance: 'Finance',
		
		// Footer
		footer_tagline: 'Empowering Citizens. Strengthening Democracy.',
		quick_links: 'Quick Links',
		contact: 'Contact',
		all_rights_reserved: 'All rights reserved. Made with',
		for_citizens: 'for the citizens of India.',
		
		// Auth pages
		login_title: 'Welcome Back',
		login_subtitle: 'Sign in to your account to continue',
		password: 'Password',
		password_placeholder: 'Enter your password',
		forgot_password: 'Forgot password?',
		no_account: 'Don\'t have an account?',
		signup_title: 'Create Account',
		signup_subtitle: 'Join us to make your voice heard',
		confirm_password: 'Confirm Password',
		confirm_password_placeholder: 'Confirm your password',
		has_account: 'Already have an account?',
		
		// Error messages
		network_error: 'Network error. Please try again.',
		failed_submit: 'Failed to submit complaint',
		invalid_id: 'Invalid complaint ID',
		complaint_not_found: 'Complaint not found',
		
		// Status messages
		pending: 'Pending',
		forwarded: 'Forwarded',
		acknowledged: 'Acknowledged',
		resolved: 'Resolved',
		
		// Profile page
		your_complaints: 'Your Complaints',
		id: 'ID',
		summary: 'Summary',
		status: 'Status',
		date: 'Date',
		actions: 'Actions',
		download_pdf: 'Download PDF',
		delete_complaint: 'Delete Complaint',
		delete_confirm_message: 'Are you sure you want to delete this complaint? This action cannot be undone.',
		complaint_deleted_success: 'Complaint deleted successfully!',
		delete_failed: 'Failed to delete complaint',
		role: 'Role'
	},
	hi: {
		brand: 'पीपल्स पल्स',
		nav_home: 'होम',
		nav_submit: 'शिकायत दर्ज करें',
		nav_track: 'शिकायत ट्रैक करें',
		nav_policies: 'नीतियाँ',
		cta_submit: 'शिकायत दर्ज करें',
		cta_track: 'शिकायत ट्रैक करें',
		cta_policies: 'नीतियाँ देखें',
		hero_badge: 'आपकी आवाज़, आपका अधिकार',
		hero_title: 'आपकी आवाज़, आपका अधिकार. प्रभावी बनाइए।',
		hero_desc: 'नागरिकों को सरल भाषा में नीतियाँ समझने और शिकायत दर्ज करने में सक्षम बनाना। मोबाइल‑प्रथम और बहुभाषी।',
		get_started: 'शुरू करें',
		signup: 'साइन अप',
		login: 'लॉगिन',
		logout: 'लॉगआउट',
		profile: 'प्रोफ़ाइल',
		admin: 'एडमिन',
		loading: 'लोड हो रहा है...',
		
		// Home page statistics
		stats_complaints: 'शिकायतें हल',
		stats_citizens: 'सक्रिय नागरिक',
		stats_policies: 'सरकारी नीतियाँ',
		stats_satisfaction: 'संतुष्टि दर',
		
		// Home page features
		features_title: 'प्रौद्योगिकी के माध्यम से लोकतंत्र को सशक्त बनाना',
		features_subtitle: 'नागरिक भागीदारी के लिए सरल, पारदर्शी और प्रभावी उपकरण',
		feature_easy_submission: 'आसान शिकायत दर्ज करना',
		feature_easy_desc: 'सरल भाषा में फोटो सहायता के साथ शिकायत दर्ज करें।',
		feature_track: 'प्रगति ट्रैक करें',
		feature_track_desc: 'अपनी शिकायत की स्थिति को वास्तविक समय में देखें।',
		feature_policies: 'सरकारी नीतियाँ',
		feature_policies_desc: 'सरलीकृत नीति जानकारी तक पहुंच।',
		feature_impact: 'समुदाय प्रभाव',
		feature_impact_desc: 'सशक्त नागरिकों के परिणाम देखें।',
		
		// Home page how it works
		how_it_works_title: 'पीपल्स पल्स कैसे काम करता है',
		step1_title: 'अपनी चिंता दर्ज करें',
		step1_desc: 'सरल भाषा में अपनी शिकायत लिखें, यदि आवश्यक हो तो फोटो जोड़ें।',
		step2_title: 'हम प्रोसेस और आगे भेजते हैं',
		step2_desc: 'हमारी टीम समीक्षा करती है और सही अधिकारियों को आगे भेजती है।',
		step3_title: 'प्रगति ट्रैक करें',
		step3_desc: 'आपके मुद्दे के हल होने तक समय पर अपडेट प्राप्त करें।',
		
		// Submit page
		submit_title: 'अपनी शिकायत दर्ज करें',
		submit_subtitle: 'हमें अपने मुद्दे के बारे में बताएं और हम आपकी मदद करेंगे',
		your_details: 'आपका विवरण',
		full_name: 'पूरा नाम *',
		full_name_placeholder: 'अपना पूरा नाम दर्ज करें',
		email: 'ईमेल पता *',
		email_placeholder: 'आपका.ईमेल@उदाहरण.com',
		phone: 'फोन नंबर *',
		phone_placeholder: '+91 98765 43210',
		complaint_details: 'शिकायत का विवरण',
		category: 'श्रेणी *',
		select_category: 'एक श्रेणी चुनें',
		subject: 'विषय *',
		subject_placeholder: 'आपकी शिकायत का संक्षिप्त विवरण',
		describe_complaint: 'अपनी शिकायत का वर्णन करें *',
		describe_placeholder: 'कृपया अपनी शिकायत के बारे में विस्तृत जानकारी प्रदान करें...',
		location: 'स्थान',
		state: 'राज्य *',
		state_placeholder: 'जैसे महाराष्ट्र',
		district: 'जिला *',
		district_placeholder: 'जैसे मुंबई',
		taluka: 'तालुका/ब्लॉक',
		taluka_placeholder: 'जैसे अंधेरी',
		attachments: 'संलग्नक',
		upload_photos: 'फोटो अपलोड करें (वैकल्पिक)',
		choose_files: 'फाइलें चुनें',
		submit_complaint: 'शिकायत दर्ज करें',
		submitting: 'दर्ज हो रहा है...',
		view_status: 'स्थिति देखें',
		complaint_submitted: 'शिकायत सफलतापूर्वक दर्ज की गई! आईडी:',
		
		// Track page
		track_title: 'अपनी शिकायत ट्रैक करें',
		track_subtitle: 'स्थिति जांचने के लिए अपनी शिकायत आईडी दर्ज करें',
		complaint_id: 'शिकायत आईडी',
		id_placeholder: 'अपनी शिकायत आईडी दर्ज करें',
		track_btn: 'शिकायत ट्रैक करें',
		tracking: 'ट्रैक हो रहा है...',
		
		// Policies page
		policies_title: 'सरकारी नीतियाँ',
		policies_subtitle: 'मुख्य सरकारी नीतियों के आसान-से-समझने योग्य सारांश',
		search_policies: 'नीतियाँ खोजें...',
		filter_sector: 'क्षेत्र के अनुसार फ़िल्टर करें',
		all_sectors: 'सभी क्षेत्र',
		last_updated: 'अंतिम अपडेट',
		read_full_policy: 'पूरी नीति पढ़ें',
		featured_initiatives: 'विशेष सरकारी पहल',
		learn_more: 'और जानें',
		
		// Policy categories
		tech: 'प्रौद्योगिकी',
		health: 'स्वास्थ्य',
		education: 'शिक्षा',
		housing: 'आवास',
		agriculture: 'कृषि',
		transportation: 'परिवहन',
		environment: 'पर्यावरण',
		finance: 'वित्त',
		
		// Footer
		footer_tagline: 'नागरिकों को सशक्त बनाना। लोकतंत्र को मजबूत करना।',
		quick_links: 'त्वरित लिंक',
		contact: 'संपर्क',
		all_rights_reserved: 'सर्वाधिकार सुरक्षित।',
		for_citizens: 'भारत के नागरिकों के लिए बनाया गया।',
		
		// Auth pages
		login_title: 'वापसी पर स्वागत है',
		login_subtitle: 'जारी रखने के लिए अपने खाते में साइन इन करें',
		password: 'पासवर्ड',
		password_placeholder: 'अपना पासवर्ड दर्ज करें',
		forgot_password: 'पासवर्ड भूल गए?',
		no_account: 'खाता नहीं है?',
		signup_title: 'खाता बनाएं',
		signup_subtitle: 'अपनी आवाज़ सुनाने के लिए हमसे जुड़ें',
		confirm_password: 'पासवर्ड की पुष्टि करें',
		confirm_password_placeholder: 'अपने पासवर्ड की पुष्टि करें',
		has_account: 'पहले से खाता है?',
		
		// Error messages
		network_error: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
		failed_submit: 'शिकायत दर्ज करने में विफल',
		invalid_id: 'अमान्य शिकायत आईडी',
		complaint_not_found: 'शिकायत नहीं मिली',
		
		// Status messages
		pending: 'लंबित',
		forwarded: 'आगे भेजा गया',
		acknowledged: 'स्वीकृत',
		resolved: 'हल',
		
		// Profile page
		your_complaints: 'आपकी शिकायतें',
		id: 'आईडी',
		summary: 'सारांश',
		status: 'स्थिति',
		date: 'तारीख',
		actions: 'कार्रवाई',
		download_pdf: 'पीडीएफ डाउनलोड करें',
		delete_complaint: 'शिकायत हटाएं',
		delete_confirm_message: 'क्या आप वाकई इस शिकायत को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
		complaint_deleted_success: 'शिकायत सफलतापूर्वक हटा दी गई!',
		delete_failed: 'शिकायत हटाने में विफल',
		role: 'भूमिका'
	}
}

const I18nContext = createContext({
	language: 'en',
	setLanguage: () => {},
	messages: defaultMessages.en,
	t: (k) => defaultMessages.en[k] || k
})

export function I18nProvider({ children }){
	const [language, setLanguage] = useState('en')

	useEffect(() => {
		try{
			const stored = typeof document !== 'undefined' ? document.cookie.split('; ').find(c=>c.startsWith('lang='))?.split('=')[1] : 'en'
			if (stored && (stored === 'en' || stored === 'hi')) setLanguage(stored)
		}catch{}
	}, [])

	const value = useMemo(() => {
		const t = (key) => defaultMessages[language]?.[key] || defaultMessages.en[key] || key
		const change = (lang) => {
			setLanguage(lang)
			try{ document.cookie = `lang=${lang}; path=/; max-age=${60*60*24*365}` }catch{}
		}
		return { language, setLanguage: change, messages: defaultMessages[language] || defaultMessages.en, t }
	}, [language])

	return (
		<I18nContext.Provider value={value}>
			{children}
		</I18nContext.Provider>
	)
}

export function useI18n(){
	return useContext(I18nContext)
}


