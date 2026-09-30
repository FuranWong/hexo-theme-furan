class SettingsPanel {
  constructor() {
    this.flavors = ['latte', 'frappe', 'macchiato', 'mocha'];
    this.accents = [
      'rosewater', 'flamingo', 'pink', 'mauve', 'red',
      'maroon', 'peach', 'yellow', 'green', 'teal',
      'sky', 'sapphire', 'blue', 'lavender'
    ];
    this.isOpen = false;

    this.el = document.querySelector('[data-settings]');
    if (!this.el) return;

    this.toggleBtn = this.el.querySelector('[data-settings-toggle]');
    this.panel = this.el.querySelector('[data-settings-panel]');

    this.init();
  }

  init() {
    this.loadState();
    this.bindToggle();
    this.bindThemeButtons();
    this.bindAccentButtons();
    this.bindOutsideClick();
    this.bindKeyboard();
  }

  loadState() {
    const savedFlavor = localStorage.getItem('theme-flavor');
    const savedAccent = localStorage.getItem('theme-accent');

    if (savedFlavor && this.flavors.includes(savedFlavor)) {
      this.currentFlavor = savedFlavor;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentFlavor = prefersDark ? 'mocha' : 'latte';
    }

    this.currentAccent = savedAccent && this.accents.includes(savedAccent)
      ? savedAccent
      : 'mauve';

    this.applyFlavor(this.currentFlavor);
    this.applyAccent(this.currentAccent);
    this.syncFlavorUI();
    this.syncAccentUI();
  }

  bindToggle() {
    if (!this.toggleBtn) return;

    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
  }

  bindThemeButtons() {
    const buttons = this.el.querySelectorAll('[data-theme-value]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const flavor = btn.getAttribute('data-theme-value');
        this.setFlavor(flavor);
      });
    });
  }

  bindAccentButtons() {
    const buttons = this.el.querySelectorAll('[data-accent-value]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const accent = btn.getAttribute('data-accent-value');
        this.setAccent(accent);
      });
    });
  }

  bindOutsideClick() {
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.el.contains(e.target)) {
        this.close();
      }
    });
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.toggleBtn?.focus();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.panel.classList.add('is-open');
    this.toggleBtn.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.isOpen = false;
    this.panel.classList.remove('is-open');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
  }

  setFlavor(flavor) {
    if (flavor === this.currentFlavor) return;
    this.currentFlavor = flavor;
    localStorage.setItem('theme-flavor', flavor);
    this.applyFlavor(flavor);
    this.syncFlavorUI();
  }

  applyFlavor(flavor) {
    document.documentElement.setAttribute('data-theme', flavor);
  }

  syncFlavorUI() {
    const buttons = this.el.querySelectorAll('[data-theme-value]');
    buttons.forEach((btn) => {
      const val = btn.getAttribute('data-theme-value');
      const isActive = val === this.currentFlavor;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  setAccent(accent) {
    if (accent === this.currentAccent) return;
    this.currentAccent = accent;
    localStorage.setItem('theme-accent', accent);
    this.applyAccent(accent);
    this.syncAccentUI();
  }

  applyAccent(accent) {
    document.documentElement.style.setProperty(
      '--accent',
      `var(--ctp-${accent})`
    );
  }

  syncAccentUI() {
    const buttons = this.el.querySelectorAll('[data-accent-value]');
    buttons.forEach((btn) => {
      const val = btn.getAttribute('data-accent-value');
      const isActive = val === this.currentAccent;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsPanel();
});