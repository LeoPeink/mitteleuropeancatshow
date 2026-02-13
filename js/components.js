// Component loader for modular HTML includes
class ComponentLoader {
  static async loadComponent(elementId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentPath}`);
      }
      const html = await response.text();
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }

  static async loadAllComponents() {
    // Load navbar
    await this.loadComponent('navbar-container', 'components/navbar.html');
    
    // Load footer
    await this.loadComponent('footer-container', 'components/footer.html');
    
    // Reinitialize any JavaScript that depends on the loaded components
    this.initializeComponents();
  }

  static initializeComponents() {
    // Initialize mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
      });
    }

    // Ensure sticky header behavior after dynamic loading
    const header = document.querySelector('.header');
    if (header) {
      // Force browser to recalculate sticky positioning
      header.style.position = 'sticky';
      header.style.top = '0';
      header.style.zIndex = '1000';
      
      // Trigger a reflow to ensure sticky positioning works
      header.offsetHeight;
    }
  }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  ComponentLoader.loadAllComponents();
});
