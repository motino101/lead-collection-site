// ========================================
// Scroll Header Background
// ========================================
const socialHeader = document.querySelector('.social-header');

if (socialHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      socialHeader.classList.add('scrolled');
    } else {
      socialHeader.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ========================================
// Custom Cursor
// ========================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Update cursor position
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor animation
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  
  followerX += (mouseX - followerX) * 0.08;
  followerY += (mouseY - followerY) * 0.08;
  
  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
  
  if (cursorFollower) {
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
  }
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .magnetic');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.classList.add('hovering');
    if (cursorFollower) cursorFollower.classList.add('hovering');
  });
  
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.classList.remove('hovering');
    if (cursorFollower) cursorFollower.classList.remove('hovering');
  });
});

// ========================================
// Magnetic Effect
// ========================================
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(el => {
  const strength = parseInt(el.dataset.strength) || 20;
  
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width * strength;
    const deltaY = (e.clientY - centerY) / rect.height * strength;
    
    gsap.to(el, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

// ========================================
// GSAP Scroll Animations
// ========================================
gsap.registerPlugin(ScrollTrigger);

// Hero animations - play immediately
const heroTimeline = gsap.timeline({ delay: 0.3 });

heroTimeline
  .to('.title-line', {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.8,
    ease: 'power2.out'
  })
  .to('.title-sub', {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.5')
  .to('.intro', {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');

// Add revealed class after hero animation
heroTimeline.eventCallback('onComplete', () => {
  document.querySelectorAll('.hero [data-animate]').forEach(el => {
    el.classList.add('revealed');
  });
});

// Scroll-triggered animations for other sections
const scrollElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate]):not(.work-item)');

scrollElements.forEach((el) => {
  // Special handling for dividers
  if (el.classList.contains('divider') || el.classList.contains('footer-line')) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed')
    });
    return;
  }
  
  gsap.to(el, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    onComplete: () => el.classList.add('revealed')
  });
});

// ========================================
// Staggered Work Items
// ========================================
document.querySelectorAll('.work-list').forEach(list => {
  const items = list.querySelectorAll('.work-item');
  
  ScrollTrigger.create({
    trigger: list,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(items, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        onComplete: () => items.forEach(item => item.classList.add('revealed'))
      });
    }
  });
});

// ========================================
// Form Elements Animation
// ========================================
const formElements = document.querySelectorAll('.form-input, .submit-btn');

if (formElements.length > 0) {
  ScrollTrigger.create({
    trigger: '.contact-form',
    start: 'top 80%',
    onEnter: () => {
      gsap.to(formElements, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        onComplete: () => formElements.forEach(el => el.classList.add('revealed'))
      });
    }
  });
}

// ========================================
// Form Submission
// ========================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : 'Send';
    
    if (btnText) btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      if (btnText) btnText.textContent = 'Try again';
      submitBtn.disabled = false;
      
      setTimeout(() => {
        if (btnText) btnText.textContent = originalText;
      }, 2000);
    }
  });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('loading');
});

// Prevent FOUC
document.documentElement.style.visibility = 'visible';
