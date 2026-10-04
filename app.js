const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('#booking-status');
const tripType = document.querySelector('#trip-type');
const returnField = document.querySelector('.return-field');
const returnDate = document.querySelector('#return-date');
const pickupDate = document.querySelector('#pickup-date');
const cabResults = document.querySelector('#cab-results');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const whatsappFollowup = document.querySelector('#whatsapp-followup');

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
	.toISOString().slice(0, 10);
pickupDate.min = localToday;
returnDate.min = localToday;
document.querySelector('#year').textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
	const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
	menuToggle.setAttribute('aria-expanded', String(!isOpen));
	mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.addEventListener('click', (event) => {
	if (event.target.closest('a')) {
		menuToggle.setAttribute('aria-expanded', 'false');
		mainNav.classList.remove('is-open');
	}
});

document.querySelectorAll('.ride-tab').forEach((tab) => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.ride-tab').forEach((item) => {
			item.classList.toggle('is-active', item === tab);
			item.setAttribute('aria-pressed', String(item === tab));
		});
		tripType.value = tab.dataset.mode;
		const isRoundTrip = tab.dataset.mode === 'round-trip';
		const isLocal = tab.dataset.mode === 'local';
		returnField.hidden = !isRoundTrip;
		returnDate.required = isRoundTrip;
		bookingForm.elements.drop.required = !isLocal;
		bookingForm.elements.drop.placeholder = isLocal ? 'Optional for local hire' : 'Where are you going?';
	});
});

pickupDate.addEventListener('change', () => {
	returnDate.min = pickupDate.value || localToday;
	if (returnDate.value && returnDate.value < pickupDate.value) returnDate.value = pickupDate.value;
});

bookingForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(bookingForm);
	const pickup = formData.get('pickup').trim();
	const drop = formData.get('drop').trim() || 'Local hire';
	const summary = document.querySelector('#route-summary');
	summary.textContent = `${pickup} to ${drop} · ${formData.get('date')}`;
	bookingStatus.textContent = 'Choose a vehicle below and send an enquiry to confirm availability and your fare.';
	cabResults.hidden = false;
	cabResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function fillEnquiry(message) {
	contactForm.elements.message.value = message;
}

document.querySelectorAll('[data-cab]').forEach((link) => {
	link.addEventListener('click', () => {
		const booking = new FormData(bookingForm);
		fillEnquiry(`${link.dataset.cab} for ${booking.get('pickup') || 'pickup'} to ${booking.get('drop') || 'destination'} on ${booking.get('date') || 'my preferred date'}.`);
	});
});

document.querySelectorAll('[data-package]').forEach((link) => {
	link.addEventListener('click', () => fillEnquiry(`I'm interested in the ${link.dataset.package} tour package. Please share availability and a quote.`));
});

document.querySelectorAll('[data-vehicle]').forEach((link) => {
	link.addEventListener('click', () => fillEnquiry(`Please share availability and a quote for a ${link.dataset.vehicle}.`));
});

contactForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const details = new FormData(contactForm);
	const message = [
		'New trip enquiry for OmSai Tours & Travels',
		`Name: ${details.get('name')}`,
		`Phone: ${details.get('mobile')}`,
		`Email: ${details.get('email')}`,
		`Trip details: ${details.get('message')}`
	].join('\n');

	whatsappFollowup.href = `https://wa.me/919370890277?text=${encodeURIComponent(message)}`;
	whatsappFollowup.hidden = false;
	formStatus.textContent = 'Your enquiry is ready. Continue in WhatsApp and press Send to deliver it.';
});