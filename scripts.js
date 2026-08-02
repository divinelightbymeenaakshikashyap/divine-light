/*
  OWNER-ONLY FESTIVAL ANIMATION CONTROL
  Change "none" to: "diwali", "independence-day", "republic-day", or "new-year",
  then publish the site. Visitors cannot change this setting.
*/
const activeFestivalAnimation = 'none';

window.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-list a');
  const themeToggle = document.querySelector('.theme-toggle');
  const faqButtons = document.querySelectorAll('.faq-question');
  const festivalAnimation = document.querySelector('.festival-animation');
  const contactForm = document.querySelector('.contact-form');
  const emailField = contactForm?.querySelector('input[name="email"]');
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  const statusMessage = contactForm?.querySelector('.contact-form-status');
  const emailPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  const formAction = contactForm?.getAttribute('action') || '';

  const addFestivalAnimation = (festival) => {
    if (!festivalAnimation || festival === 'none') return;

    const festivalOptions = {
      diwali: { symbols: ['✦', '✧', '✨'], colors: ['#f2c94c', '#ff9d32', '#fff4c7'] },
      'independence-day': { symbols: ['●'], colors: ['#ff9933', '#ffffff', '#138808'] },
      'republic-day': { symbols: ['●'], colors: ['#ff9933', '#ffffff', '#138808', '#1a4f9c'] },
      'new-year': { symbols: ['✦', '•', '✧'], colors: ['#f2c94c', '#c49aff', '#78b7ff', '#ffffff'] },
    };
    const options = festivalOptions[festival];
    if (!options) return;

    festivalAnimation.classList.add(`festival-animation--${festival}`);
    for (let index = 0; index < 22; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'festival-particle';
      particle.textContent = options.symbols[index % options.symbols.length];
      particle.style.setProperty('--left', `${(index * 17 + 5) % 100}%`);
      particle.style.setProperty('--delay', `${(index % 8) * -1.1}s`);
      particle.style.setProperty('--duration', `${10 + (index % 6) * 1.4}s`);
      particle.style.setProperty('--drift', `${-70 + (index % 7) * 24}px`);
      particle.style.setProperty('--size', `${0.8 + (index % 4) * 0.22}rem`);
      particle.style.color = options.colors[index % options.colors.length];
      festivalAnimation.appendChild(particle);
    }
  };

  addFestivalAnimation(activeFestivalAnimation);

  const updateThemeToggle = () => {
    if (!themeToggle) return;
    const isDark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀' : '☾';
    themeToggle.querySelector('.theme-toggle-text').textContent = isDark ? 'Light mode' : 'Dark mode';
  };

  updateThemeToggle();

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('divine-light-theme', nextTheme);
    updateThemeToggle();
  });

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('nav-open');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('nav-open');
    });
  });

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.faq-card');
      const isOpen = card?.classList.contains('open');

      faqButtons.forEach((otherButton) => {
        const otherCard = otherButton.closest('.faq-card');
        otherCard?.classList.remove('open');
        otherButton.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        card?.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const updateEmailValidationState = () => {
    if (!emailField || !submitButton) return false;

    const email = emailField.value.trim();
    const isValid = emailPattern.test(email);
    const isPlaceholderAction = formAction.includes('YOUR_FORM_ID') || formAction === '#';

    emailField.setCustomValidity(isValid ? '' : 'Please enter a valid email address.');
    emailField.setAttribute('aria-invalid', String(!isValid));
    submitButton.disabled = !isValid || isPlaceholderAction;

    if (!isValid) {
      statusMessage.textContent = '';
    } else if (isPlaceholderAction) {
      statusMessage.textContent = '';
      emailField.setCustomValidity('');
    } else {
      statusMessage.textContent = '';
    }

    return isValid && !isPlaceholderAction;
  };

  emailField?.addEventListener('input', () => {
    updateEmailValidationState();
  });

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!emailField || !submitButton) return;

    const isReadyToSubmit = updateEmailValidationState();
    if (!isReadyToSubmit) {
      emailField.reportValidity();
      emailField.focus();
      return;
    }

    emailField.setCustomValidity('');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const formData = new FormData(contactForm);
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        statusMessage.textContent = 'Thanks! Your message has been submitted successfully.';
        statusMessage.style.color = '#8bd7c6';
        contactForm.reset();
      } else {
        statusMessage.textContent = 'Something went wrong. Please try again or contact us directly.';
        statusMessage.style.color = '#ffcf82';
      }
    } catch (error) {
      statusMessage.textContent = 'Something went wrong. Please try again or contact us directly.';
      statusMessage.style.color = '#ffcf82';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });

  updateEmailValidationState();
});
