import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
const exampleEnvPath = path.join(__dirname, 'ENV.example');
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else if (fs.existsSync(exampleEnvPath)) {
	dotenv.config({ path: exampleEnvPath });
	console.warn('Using ENV.example as fallback. Create server/.env to override.');
} else {
	dotenv.config();
}

const app = express();

app.use(cors());
app.use(express.json());

function validateContact({ name, email, message }) {
	const errors = {};
	if (!name || name.trim().length < 2) {
		errors.name = 'Please enter your full name (min 2 characters).';
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
	if (!email || !emailRegex.test(email)) {
		errors.email = 'Please enter a valid email address.';
	}
	if (!message || message.trim().length < 10) {
		errors.message = 'Please write a message (min 10 characters).';
	}
	return { isValid: Object.keys(errors).length === 0, errors };
}

async function getTransporter() {
	const useEthereal = process.env.USE_ETHEREAL === 'true' || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS;
	if (useEthereal) {
		const testAccount = await nodemailer.createTestAccount();
		return {
			transporter: nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false,
				auth: { user: testAccount.user, pass: testAccount.pass },
			}),
			isEthereal: true,
		};
	}

	return {
		transporter: nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		}),
		isEthereal: false,
	};
}

app.post('/api/contact', async (req, res) => {
	const { name, email, message } = req.body || {};
	const { isValid, errors } = validateContact({ name, email, message });
	if (!isValid) {
		return res.status(400).json({ success: false, errors });
	}

	try {
		const { transporter, isEthereal } = await getTransporter();
		await transporter.verify();

		const info = await transporter.sendMail({
			from: `Portfolio Contact <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'}>`,
			to: process.env.TO_EMAIL || process.env.SMTP_USER || 'no-reply@example.com',
			subject: `New message from ${name}`,
			replyTo: email,
			html: `
				<h2>New Portfolio Contact</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p style=\"white-space:pre-line\">${message}</p>
			`,
		});

		const response = { success: true, message: 'Thanks! Your message has been sent.' };
		if (isEthereal) {
			response.previewUrl = nodemailer.getTestMessageUrl(info);
		}
		return res.json(response);
	} catch (err) {
		console.error('Email send error:', err);
		return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
	}
});

app.get('/health', (_req, res) => res.json({ ok: true }));

function startServerWithRetry(startPort, maxAttempts = 5){
	let attempt = 0;
	function tryListen(port){
		const server = app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
		server.on('error', (err) => {
			if (err && err.code === 'EADDRINUSE' && attempt < maxAttempts){
				attempt++;
				const nextPort = port + 1;
				console.warn(`Port ${port} in use. Retrying on ${nextPort}...`);
				setTimeout(() => tryListen(nextPort), 300);
			} else {
				console.error('Failed to start server:', err);
				process.exitCode = 1;
			}
		});
	}
	tryListen(startPort);
}

const desiredPort = Number(process.env.PORT) || 4001;
startServerWithRetry(desiredPort);
