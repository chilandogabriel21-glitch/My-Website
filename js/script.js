/* =========================================================
   ICT251 Activity 3 — Interactive Personal Website
   Mac Gabriel — chilandogabriel21-glitch
   ========================================================= */


/* =========================================================
   FEATURE 0 (from A2): NAVIGATION SCROLL HIGHLIGHT
   Highlights the nav link of the section currently in view.
   ========================================================= */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});


/* =========================================================
   FEATURE 1 (COMPULSORY): CONTACT FORM VALIDATION & PREVIEW
   ========================================================= */

const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const formPreview = document.getElementById('form-preview');

// Simple email pattern: something@something.something
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Clears error message and invalid styling from a field. */
function clearError(input, errorEl) {
    if (!input || !errorEl) return;
    input.classList.remove('invalid');
    errorEl.textContent = '';
}

/** Shows an error message and marks the field invalid. */
function showError(input, errorEl, message) {
    if (!input || !errorEl) return;
    input.classList.add('invalid');
    errorEl.textContent = message;
}

/** Validates the Name field. Returns true if valid. */
function validateName() {
    const value = nameInput.value.trim();
    if (value === '') {
        showError(nameInput, nameError, 'Name cannot be empty or only spaces.');
        return false;
    }
    clearError(nameInput, nameError);
    return true;
}

/** Validates the Email field. Returns true if valid. */
function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
        showError(emailInput, emailError, 'Email is required.');
        return false;
    }
    if (!emailPattern.test(value)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        return false;
    }
    clearError(emailInput, emailError);
    return true;
}

/** Validates the Message field. Returns true if valid. */
function validateMessage() {
    const value = messageInput.value.trim();
    if (value === '') {
        showError(messageInput, messageError, 'Message cannot be empty or only spaces.');
        return false;
    }
    clearError(messageInput, messageError);
    return true;
}

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameOK = validateName();
        const emailOK = validateEmail();
        const messageOK = validateMessage();

        if (!(nameOK && emailOK && messageOK)) {
            if (formPreview) formPreview.hidden = true;
            return;
        }

        // Build preview using textContent (safe from HTML injection)
        formPreview.innerHTML = '';

        const heading = document.createElement('h3');
        heading.textContent = '✅ Data Validated — Browser Demonstration';
        formPreview.appendChild(heading);

        const intro = document.createElement('p');
        intro.textContent = 'No message was sent. Here is the validated information you entered:';
        formPreview.appendChild(intro);

        const list = document.createElement('ul');
        const topicValue = document.getElementById('topic')
            ? document.getElementById('topic').value.trim()
            : '';

        const rows = [
            ['Name', nameInput.value.trim()],
            ['Email', emailInput.value.trim()],
            ['Topic', topicValue || '(not provided)'],
            ['Message', messageInput.value.trim()]
        ];

        rows.forEach(row => {
            const li = document.createElement('li');
            li.textContent = row[0] + ': ' + row[1];
            list.appendChild(li);
        });

        formPreview.appendChild(list);
        formPreview.hidden = false;
    });

    // Live validation: clear the error once the user fixes the field
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (emailInput) emailInput.addEventListener('input', validateEmail);
    if (messageInput) messageInput.addEventListener('input', validateMessage);
}


/* =========================================================
   FEATURE 2: EXPANDABLE PROJECT DETAILS
   ========================================================= */

const toggleButtons = document.querySelectorAll('.toggle-details');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const details = button.nextElementSibling;
        if (!details) return;

        const isOpen = !details.hidden;
        details.hidden = isOpen;
        button.textContent = isOpen ? 'Show Details' : 'Hide Details';
        button.setAttribute('aria-expanded', String(!isOpen));
    });
});


/* =========================================================
   FEATURE 3: GALLERY VIEWER (PREV / NEXT)
   ========================================================= */

const photos = [
    { src: 'images/photo1.jpg', caption: 'My First photo caption.' },
    { src: 'images/photo2.jpg', caption: 'My Second photo caption.' },
    { src: 'images/photo3.jpg', caption: 'My Third photo caption.' }
];

let photoIndex = 0;

const viewerImage = document.getElementById('viewer-image');
const viewerCaption = document.getElementById('viewer-caption');
const prevBtn = document.getElementById('prev-photo');
const nextBtn = document.getElementById('next-photo');

/** Renders the photo at the current index into the viewer. */
function renderPhoto() {
    if (!viewerImage || !viewerCaption) return;
    viewerImage.src = photos[photoIndex].src;
    viewerImage.alt = photos[photoIndex].caption;
    viewerCaption.textContent = photos[photoIndex].caption;
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        photoIndex = (photoIndex - 1 + photos.length) % photos.length;
        renderPhoto();
    });

    nextBtn.addEventListener('click', () => {
        photoIndex = (photoIndex + 1) % photos.length;
        renderPhoto();
    });

    renderPhoto();
}

/* =========================================================
   FEATURE 4: THEME SWITCH (LIGHT / DARK)
   ========================================================= */

const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    // Apply saved theme on load (default = dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-theme');
    themeToggle.textContent = savedTheme === 'light' ? '☀️ Theme' : '🌙 Theme';

    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');

        // Remove both, then apply the new one
        document.body.classList.remove('light-theme', 'dark-theme');

        if (isLight) {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '🌙 Theme';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '☀️ Theme';
            localStorage.setItem('theme', 'light');
        }
    });
}

/* =========================================================
   MOBILE NAV TOGGLE
   Opens / closes the nav on narrow screens.
   ========================================================= */

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        const open = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.textContent = open ? '✕ Close' : '☰ Menu';
    });
}


/* =========================================================
   STUDY HOURS CALCULATOR (optional extra)
   Only runs if the calculator HTML exists on the page.
   ========================================================= */

const calcBtn = document.getElementById('calc-hours');

if (calcBtn) {
    calcBtn.addEventListener('click', () => {
        const hoursEl = document.getElementById('hours-per-day');
        const daysEl = document.getElementById('days-per-week');
        const result = document.getElementById('calc-result');

        const hours = parseFloat(hoursEl.value);
        const days = parseFloat(daysEl.value);

        if (isNaN(hours) || hours < 0) {
            result.textContent = '⚠️ Please enter a valid, non-negative number of hours.';
            return;
        }
        if (isNaN(days) || days < 1 || days > 7) {
            result.textContent = '⚠️ Days per week must be between 1 and 7.';
            return;
        }
        const total = hours * days;
        result.textContent = `📚 You plan to study ${total} hour(s) per week.`;
    });
}