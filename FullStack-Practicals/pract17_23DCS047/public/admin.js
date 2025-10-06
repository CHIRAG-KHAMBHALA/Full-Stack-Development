const apiBase = '/api/students';

const form = document.getElementById('student-form');
const studentIdInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const courseInput = document.getElementById('course');
const feePaidInput = document.getElementById('feePaid');
const resetBtn = document.getElementById('reset-btn');
const tableBody = document.querySelector('#students-table tbody');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

async function fetchJson(url, options) {
	const res = await fetch(url, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || res.statusText);
	}
	return res.json();
}

function renderRows(items) {
	tableBody.innerHTML = '';
	for (const s of items) {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${s.name}</td>
			<td>${s.email}</td>
			<td>${s.phone || ''}</td>
			<td>${s.course}</td>
			<td>${s.feePaid ? 'Yes' : 'No'}</td>
			<td>
				<button data-id="${s._id}" class="edit">Edit</button>
				<button data-id="${s._id}" class="delete">Delete</button>
			</td>
		`;
		tableBody.appendChild(tr);
	}
}

async function loadStudents(query = '') {
	const data = await fetchJson(`${apiBase}?q=${encodeURIComponent(query)}`);
	renderRows(data.items);
}

function resetForm() {
	studentIdInput.value = '';
	form.reset();
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const payload = {
		name: nameInput.value.trim(),
		email: emailInput.value.trim(),
		phone: phoneInput.value.trim() || undefined,
		course: courseInput.value.trim(),
		feePaid: !!feePaidInput.checked,
	};
	const id = studentIdInput.value;
	if (id) {
		await fetchJson(`${apiBase}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
	} else {
		await fetchJson(apiBase, { method: 'POST', body: JSON.stringify(payload) });
	}
	await loadStudents(searchInput.value.trim());
	resetForm();
});

resetBtn.addEventListener('click', () => resetForm());

searchBtn.addEventListener('click', async () => {
	await loadStudents(searchInput.value.trim());
});

searchInput.addEventListener('keydown', async (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		await loadStudents(searchInput.value.trim());
	}
});

tableBody.addEventListener('click', async (e) => {
	const target = e.target;
	if (!(target instanceof HTMLElement)) return;
	if (target.classList.contains('edit')) {
		const id = target.dataset.id;
		const s = await fetchJson(`${apiBase}/${id}`);
		studentIdInput.value = s._id;
		nameInput.value = s.name;
		emailInput.value = s.email;
		phoneInput.value = s.phone || '';
		courseInput.value = s.course;
		feePaidInput.checked = !!s.feePaid;
		nameInput.focus();
	}
	if (target.classList.contains('delete')) {
		const id = target.dataset.id;
		if (confirm('Delete this student?')) {
			await fetchJson(`${apiBase}/${id}`, { method: 'DELETE' });
			await loadStudents(searchInput.value.trim());
		}
	}
});

loadStudents().catch((err) => console.error(err));



