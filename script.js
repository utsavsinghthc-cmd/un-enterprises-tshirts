document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const contactForm = document.querySelector('#contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();

      if (!name) {
        alert('Name cannot be empty');
        return;
      }

      if (!email) {
        alert('Email cannot be empty');
        return;
      }

      alert('Thank you for contacting UN Tees. We will get back to you soon!');
      contactForm.reset();
    });
  }
});
