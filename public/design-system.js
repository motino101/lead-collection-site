// ========================================
// Design System Page Interactions
// ========================================

gsap.registerPlugin(ScrollTrigger);

// DesignTokens is loaded from theme.js

// ========================================
// Design Controls UI
// ========================================
function initDesignControls() {
  // Font options
  document.querySelectorAll('.font-options').forEach(group => {
    const controlType = group.dataset.control;
    const currentValue = DesignTokens.get(controlType);
    
    group.querySelectorAll('.font-option').forEach(option => {
      const fontValue = option.dataset.font;
      
      // Set initial active state
      if (fontValue === currentValue) {
        option.classList.add('active');
      }
      
      option.addEventListener('click', () => {
        // Update active state
        group.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // Apply the font
        DesignTokens.set(controlType, fontValue);
        
        // Animate
        gsap.fromTo(option, 
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
        );
      });
    });
  });
  
  // Toggle options (spacing, radius, animation, blur)
  document.querySelectorAll('.toggle-options').forEach(group => {
    const controlType = group.dataset.control;
    const currentValue = DesignTokens.get(controlType);
    
    group.querySelectorAll('.toggle-option').forEach(option => {
      const value = option.dataset.value;
      
      // Set initial active state
      if (value === currentValue) {
        option.classList.add('active');
      }
      
      option.addEventListener('click', () => {
        // Update active state
        group.querySelectorAll('.toggle-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        
        // Apply the setting
        DesignTokens.set(controlType, value);
        
        // Animate
        gsap.fromTo(option, 
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
        );
      });
    });
  });
  
  // Reset button
  const resetBtn = document.getElementById('reset-all');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      DesignTokens.reset();
      
      // Reset all UI states
      document.querySelectorAll('.font-option, .toggle-option').forEach(option => {
        option.classList.remove('active');
      });
      
      // Re-apply default active states
      Object.entries(DesignTokens.defaults).forEach(([key, value]) => {
        const group = document.querySelector(`[data-control="${key}"]`);
        if (group) {
          const defaultOption = group.querySelector(`[data-font="${value}"], [data-value="${value}"]`);
          if (defaultOption) {
            defaultOption.classList.add('active');
          }
        }
      });
      
      // Animate reset button
      gsap.to(resetBtn.querySelector('svg'), {
        rotation: 360,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(resetBtn.querySelector('svg'), { rotation: 0 });
        }
      });
    });
  }
}

// ========================================
// Theme Selection
// ========================================
function initThemeSelection() {
  const cards = document.querySelectorAll('[data-theme-select]');
  
  // Mark current theme as active
  function updateActiveState() {
    const currentTheme = ThemeManager.getTheme();
    cards.forEach(card => {
      const isActive = card.dataset.themeSelect === currentTheme;
      card.classList.toggle('active', isActive);
    });
  }
  
  // Initial state
  updateActiveState();
  
  // Click handlers
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.themeSelect;
      ThemeManager.setTheme(theme);
      updateActiveState();
      
      // Animate the selected card
      gsap.fromTo(card, 
        { scale: 0.98 },
        { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
      );
    });
    
    // Add pointer cursor
    card.style.cursor = 'pointer';
  });
  
  // Listen for theme changes from other sources
  window.addEventListener('themechange', updateActiveState);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThemeSelection();
  initDesignControls();
});

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
  
  // Stagger animate style cards on scroll
  gsap.utils.toArray('.style-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate principles
  gsap.utils.toArray('.principle').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.principles-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate specimens
  gsap.utils.toArray('.specimen').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.type-specimens',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
});

// Hover effects on style cards - animate shapes
document.querySelectorAll('.style-card').forEach(card => {
  const shapes = card.querySelectorAll('.shape');
  
  card.addEventListener('mouseenter', () => {
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        scale: 1.15,
        rotation: 5 + i * 3,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
  
  card.addEventListener('mouseleave', () => {
    shapes.forEach(shape => {
      gsap.to(shape, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
});

// Color palette tooltip/copy
document.querySelectorAll('.color').forEach(color => {
  color.addEventListener('click', async () => {
    const bgColor = color.style.background;
    const colorName = color.getAttribute('title');
    
    try {
      await navigator.clipboard.writeText(bgColor);
      
      // Visual feedback
      gsap.to(color, {
        scale: 1.3,
        duration: 0.2,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
      
      // Show tooltip
      const tooltip = document.createElement('span');
      tooltip.textContent = 'Copied!';
      tooltip.style.cssText = `
        position: absolute;
        background: white;
        color: black;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        pointer-events: none;
        transform: translateY(-30px);
        z-index: 10;
      `;
      color.style.position = 'relative';
      color.appendChild(tooltip);
      
      gsap.from(tooltip, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      setTimeout(() => {
        gsap.to(tooltip, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => tooltip.remove()
        });
      }, 1000);
      
    } catch (err) {
      console.log('Could not copy color');
    }
  });
});

// Parallax effect on shapes
document.querySelectorAll('.style-preview').forEach(preview => {
  const shapes = preview.querySelectorAll('.shape');
  
  preview.addEventListener('mousemove', (e) => {
    const rect = preview.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 8;
      gsap.to(shape, {
        x: deltaX * depth,
        y: deltaY * depth,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
  
  preview.addEventListener('mouseleave', () => {
    shapes.forEach(shape => {
      gsap.to(shape, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });
});

// Back button hover
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.addEventListener('mouseenter', () => {
    gsap.to(backBtn.querySelector('svg'), {
      x: -3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  backBtn.addEventListener('mouseleave', () => {
    gsap.to(backBtn.querySelector('svg'), {
      x: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
}
