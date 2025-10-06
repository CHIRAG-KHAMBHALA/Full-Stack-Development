const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

function setError(field, message){
	const el = document.querySelector(`.error[data-for="${field}"]`);
	if(el){ el.textContent = message || ''; }
}

function validate(){
	let ok = true;
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const message = document.getElementById('message').value.trim();

	setError('name','');setError('email','');setError('message','');

	if(name.length < 2){ setError('name','Please enter at least 2 characters.'); ok=false; }
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
	if(!emailRegex.test(email)){ setError('email','Please enter a valid email.'); ok=false; }
	if(message.length < 10){ setError('message','Please write at least 10 characters.'); ok=false; }

	return { ok, data: { name, email, message } };
}

function setLoading(loading){
	if(loading){
		submitBtn.classList.add('loading');
		submitBtn.setAttribute('disabled','true');
	}else{
		submitBtn.classList.remove('loading');
		submitBtn.removeAttribute('disabled');
	}
}

function showToast(kind, message){
	toast.className = '';
	toast.classList.add(kind === 'success' ? 'success' : 'error');
	toast.textContent = message;
}

const API_BASE = 'http://localhost:4001';

form.addEventListener('submit', async (e)=>{
	e.preventDefault();
	const v = validate();
	if(!v.ok) return;

	setLoading(true);
	showToast('success','');

	try{
		const res = await fetch(`${API_BASE}/api/contact`,{
			method:'POST',
			headers:{'Content-Type':'application/json'},
			body: JSON.stringify(v.data)
		});
		const body = await res.json();
		if(!res.ok || !body.success){
			throw new Error(body.message || 'Failed to send message.');
		}
		const suffix = body.previewUrl ? ` Preview: ${body.previewUrl}` : '';
		showToast('success', (body.message || 'Message sent!') + suffix);
		form.reset();
	}catch(err){
		showToast('error', err.message || 'Something went wrong.');
	}finally{
		setLoading(false);
	}
});
