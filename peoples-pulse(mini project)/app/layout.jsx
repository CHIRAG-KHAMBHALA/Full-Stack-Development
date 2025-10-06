import './globals.css'
import { I18nProvider } from '@/components/I18nProvider'
import AppShell from '@/components/AppShell'

export const metadata = {
	title: "People's Pulse",
	description: "Your Voice, Your Right. Make It Heard."
}

export default function RootLayout({ children }){
	return (
		<html lang="en">
			<body>
				<I18nProvider>
					<AppShell>{children}</AppShell>
				</I18nProvider>
			</body>
		</html>
	)
}
