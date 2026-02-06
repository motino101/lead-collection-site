// ========================================
// Theme Switcher - Central Design System
// ========================================

// ========================================
// Design Token Manager (for fonts, spacing, etc.)
// ========================================
const DesignTokens = {
  defaults: {
    'title-font': 'roca',
    'body-font': 'jetbrains',
    'spacing': 'default',
    'radius': 'default',
    'animation-speed': 'default',
    'blur': 'default'
  },
  
  fontStacks: {
    'title-font': {
      'roca': "'roca', 'Space Grotesk', system-ui, sans-serif",
      'space-grotesk': "'Space Grotesk', system-ui, sans-serif",
      'inter': "'Inter', system-ui, sans-serif",
      'system': "system-ui, -apple-system, sans-serif"
    },
    'body-font': {
      'jetbrains': "'JetBrains Mono', 'SF Mono', monospace",
      'fira': "'Fira Code', monospace",
      'sf-mono': "'SF Mono', 'Monaco', monospace",
      'system-mono': "ui-monospace, monospace"
    }
  },
  
  spacingScales: {
    'compact': { xs: '2px', sm: '4px', md: '12px', lg: '16px', xl: '24px' },
    'default': { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
    'relaxed': { xs: '6px', sm: '12px', md: '20px', lg: '32px', xl: '48px' }
  },
  
  radiusScales: {
    'sharp': { sm: '2px', md: '4px', lg: '8px', xl: '12px', full: '100px' },
    'default': { sm: '8px', md: '12px', lg: '20px', xl: '24px', full: '100px' },
    'rounded': { sm: '12px', md: '16px', lg: '28px', xl: '32px', full: '100px' },
    'pill': { sm: '100px', md: '100px', lg: '100px', xl: '100px', full: '100px' }
  },
  
  animationSpeeds: {
    'off': { fast: '0s', normal: '0s', slow: '0s' },
    'reduced': { fast: '0.05s', normal: '0.15s', slow: '0.25s' },
    'default': { fast: '0.15s', normal: '0.3s', slow: '0.5s' },
    'fast': { fast: '0.1s', normal: '0.2s', slow: '0.35s' }
  },
  
  blurLevels: {
    'off': '0px',
    'default': '20px',
    'intense': '40px'
  },
  
  get(key) {
    return localStorage.getItem(`design-${key}`) || this.defaults[key];
  },
  
  set(key, value) {
    localStorage.setItem(`design-${key}`, value);
    this.apply(key, value);
  },
  
  apply(key, value) {
    const root = document.documentElement;
    
    if (key === 'title-font') {
      root.style.setProperty('--font-title', this.fontStacks['title-font'][value]);
    }
    else if (key === 'body-font') {
      root.style.setProperty('--font-mono', this.fontStacks['body-font'][value]);
    }
    else if (key === 'spacing') {
      const scale = this.spacingScales[value];
      if (scale) {
        Object.entries(scale).forEach(([size, val]) => {
          root.style.setProperty(`--space-${size}`, val);
        });
      }
    }
    else if (key === 'radius') {
      const scale = this.radiusScales[value];
      if (scale) {
        Object.entries(scale).forEach(([size, val]) => {
          root.style.setProperty(`--radius-${size}`, val);
        });
      }
    }
    else if (key === 'animation-speed') {
      const speeds = this.animationSpeeds[value];
      if (speeds) {
        root.style.setProperty('--transition-fast', `${speeds.fast} var(--ease-out-expo)`);
        root.style.setProperty('--transition-normal', `${speeds.normal} var(--ease-out-expo)`);
        root.style.setProperty('--transition-slow', `${speeds.slow} var(--ease-out-expo)`);
      }
    }
    else if (key === 'blur') {
      root.style.setProperty('--blur-amount', this.blurLevels[value]);
    }
  },
  
  applyAll() {
    Object.keys(this.defaults).forEach(key => {
      this.apply(key, this.get(key));
    });
  },
  
  reset() {
    Object.keys(this.defaults).forEach(key => {
      localStorage.removeItem(`design-${key}`);
    });
    // Reset CSS custom properties by removing inline styles
    document.documentElement.style.cssText = '';
    // Re-apply defaults
    this.applyAll();
  }
};

// Apply saved design tokens immediately
DesignTokens.applyAll();

// Export for use in other scripts
window.DesignTokens = DesignTokens;

// ========================================
// Theme Manager
// ========================================
const ThemeManager = {
  themes: ['seoul', 'tokyo', 'shanghai', 'hanoi', 'kyoto', 'busan', 'osaka', 'singapore'],
  
  init() {
    // Apply saved theme or default to Seoul Pop
    const savedTheme = localStorage.getItem('theme') || 'osaka';
    this.setTheme(savedTheme, false);
  },
  
  setTheme(theme, animate = true) {
    if (!this.themes.includes(theme)) {
      console.warn(`Theme "${theme}" not found. Using default.`);
      theme = 'seoul';
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Dispatch event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme, animate } 
    }));
    
    // Optional: Animate transition
    if (animate) {
      this.animateTransition();
    }
    
    return theme;
  },
  
  getTheme() {
    return localStorage.getItem('theme') || 'osaka';
  },
  
  animateTransition() {
    // Brief overlay flash for smooth transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--color-bg);
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(overlay);
    
    // Animate
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.15s ease-out';
      overlay.style.opacity = '0.5';
      
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 150);
      }, 100);
    });
  },
  
  cycleTheme() {
    const current = this.getTheme();
    const currentIndex = this.themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    return this.setTheme(this.themes[nextIndex]);
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

// Export for use in other scripts
window.ThemeManager = ThemeManager;
