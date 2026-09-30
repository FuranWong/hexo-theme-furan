class MobileNav {
  constructor() {
    this.init();
  }

  init() {
    const toggle = document.querySelector('[data-mobile-nav-toggle]');
    const sidebar = document.querySelector('[data-mobile-nav-target]');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      sidebar.classList.toggle('is-visible');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
});