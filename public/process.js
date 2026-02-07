// ========================================
// Process Page Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // Copy to clipboard
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const prompt = this.getAttribute('data-prompt');
      const span = this.querySelector('span');
      const originalText = span.textContent;

      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = prompt;
        textarea.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      btn.classList.add('copied');
      span.textContent = 'Copied!';

      setTimeout(() => {
        btn.classList.remove('copied');
        span.textContent = originalText;
      }, 2000);
    });
  });

  // Simple blur fade-in for all animated elements
  const animateIn = (el) => {
    gsap.to(el, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  // Header - animate immediately
  gsap.delayedCall(0.2, () => animateIn('.blog-header'));

  // Everything else - animate on scroll
  document.querySelectorAll('.blog-body, .prompt-library-header, .prompt-card').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => animateIn(el)
    });
  });
});

