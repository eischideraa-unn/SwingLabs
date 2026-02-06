// small helper: set year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle (keeps semantic nav for a11y)
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  if (!expanded) {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.right = '20px';
    nav.style.top = '72px';
    nav.style.flexDirection = 'column';
    nav.style.background = 'rgba(7,20,34,0.9)';
    nav.style.padding = '12px';
    nav.style.borderRadius = '12px';
  } else {
    nav.style.display = '';
    nav.style.position = '';
  }
});

// Scroll reveal using IntersectionObserver
const reveals = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      // if you only want to reveal once
      observer.unobserve(entry.target);
    }
  });
}, { root: null, threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// playful 'cuckoo' trigger on hero emoji when user clicks it
const cuck = document.querySelector('.cuckoo');
if (cuck) {
  cuck.addEventListener('click', () => {
    cuck.style.animation = 'cuckoo .9s ease 0s 1';
    setTimeout(() => { cuck.style.animation = 'cuckoo 3.6s var(--easing) infinite'; }, 1000);
  });
}



// ===== CONTACT FORM - REAL BACKEND INTEGRATION =====
const contactForm = document.getElementById('contact-form');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Handle form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get values and trim whitespace
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Basic validation
  if (!email || !message) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  // Message length validation
  if (message.length < 10) {
    showNotification('Message is too short (minimum 10 characters)', 'error');
    return;
  }

  // Disable button and show loading state
  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';
  sendButton.style.transform = 'translateY(2px)';

  try {
    // Send to backend
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        message: message
      })
    });

    const data = await response.json();

    if (data.success) {
      // Success state
      sendButton.textContent = 'Sent ✓';
      sendButton.style.transform = '';
      sendButton.style.background = 'linear-gradient(90deg,#6ee7b7,#34d399)';

      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

      // Clear form
      contactForm.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        sendButton.disabled = false;
        sendButton.textContent = 'Send';
        sendButton.style.background = '';
      }, 3000);
    } else {
      // Error from backend
      showNotification(data.message || 'Failed to send message. Please try again.', 'error');
      resetButton();
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Network error. Please check your connection and try again.', 'error');
    resetButton();
  }
});

// Function to reset button state
function resetButton() {
  sendButton.disabled = false;
  sendButton.textContent = 'Send';
  sendButton.style.transform = '';
  sendButton.style.background = '';
}

// Function to show notifications
function showNotification(message, type) {
  // Remove any existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  // Style based on type
  if (type === 'success') {
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6ee7b7, #34d399);
      color: #0b1220;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(52, 211, 153, 0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
  } else {
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
  }

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);



// Optional: small parallax effect on mouse move for hero-right blob
const blob = document.querySelector('.blob');
const hero = document.querySelector('.hero');
if (blob && hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    blob.style.transform = `translate(${x * 20}px, ${y * 12}px) rotate(${x * 40}deg)`;
  });
  hero.addEventListener('mouseleave', () => { blob.style.transform = ''; });
}


// Animation catch me effect on Javascript
const shapes = document.querySelectorAll('.shape-bg');

// Slowly drift shapes randomly within their vicinity
setInterval(() => {
  shapes.forEach(shape => {
    const currentTop = parseFloat(shape.style.top) || 0;
    const currentLeft = parseFloat(shape.style.left) || 0;

    // Small random movement (-5 to +5px)
    const driftX = (Math.random() - 0.5) * 10;
    const driftY = (Math.random() - 0.5) * 10;

    shape.style.top = (currentTop + driftY) + 'px';
    shape.style.left = (currentLeft + driftX) + 'px';
  });
}, 3000); // slow update every 3s


