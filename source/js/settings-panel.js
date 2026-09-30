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

    this.loadWallpapers();

    this.init();
  }

  loadWallpapers() {
    try {
      const raw = this.el.getAttribute('data-wallpapers');
      this.wallpapers = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.wallpapers = [];
    }
  }

  init() {
    this.loadState();
    this.bindToggle();
    this.bindThemeButtons();
    this.bindAccentButtons();
    if (this.wallpapers.length > 0) {
      this.bindWallpaperButtons();
      this.wallpapersPerPage = 12;
      this.totalWallpaperPages = Math.ceil(this.wallpapers.length / this.wallpapersPerPage);
      if (this.totalWallpaperPages > 1) {
        this.bindWallpaperPagination();
        const initialPage = Math.floor(this.currentWallpaper / this.wallpapersPerPage);
        this.goToWallpaperPage(initialPage);
      }
    }
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

    if (this.wallpapers.length > 0) {
      const savedWallpaper = localStorage.getItem('wallpaper-index');
      let idx;
      if (savedWallpaper !== null) {
        idx = parseInt(savedWallpaper, 10);
      } else {
        const defaultIdxAttr = this.el.getAttribute('data-default-wallpaper-index');
        idx = defaultIdxAttr !== null ? parseInt(defaultIdxAttr, 10) : 0;
      }
      if (idx >= 0 && idx < this.wallpapers.length) {
        this.currentWallpaper = idx;
      } else {
        this.currentWallpaper = 0;
      }
      this.applyWallpaper(this.currentWallpaper);
      this.syncWallpaperUI();
    }
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

  bindWallpaperButtons() {
    const buttons = this.el.querySelectorAll('[data-wallpaper-index]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-wallpaper-index'), 10);
        this.setWallpaper(idx);
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

  setWallpaper(idx) {
    if (idx === this.currentWallpaper) return;
    this.currentWallpaper = idx;
    localStorage.setItem('wallpaper-index', idx);
    this.applyWallpaper(idx);
    this.syncWallpaperUI();
  }

  applyWallpaper(idx) {
    const wp = this.wallpapers[idx];
    if (wp && wp.url) {
      document.documentElement.style.setProperty(
        '--wallpaper-url',
        `url(${wp.url})`
      );
    } else {
      document.documentElement.style.setProperty('--wallpaper-url', 'none');
    }
  }

  syncWallpaperUI() {
    const buttons = this.el.querySelectorAll('[data-wallpaper-index]');
    buttons.forEach((btn) => {
      const val = parseInt(btn.getAttribute('data-wallpaper-index'), 10);
      const isActive = val === this.currentWallpaper;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  bindWallpaperPagination() {
    this.wallpaperPrevBtn = this.el.querySelector('[data-wallpaper-prev]');
    this.wallpaperNextBtn = this.el.querySelector('[data-wallpaper-next]');
    this.wallpaperPageInfo = this.el.querySelector('[data-wallpaper-page-info]');

    if (this.wallpaperPrevBtn) {
      this.wallpaperPrevBtn.addEventListener('click', () => {
        this.goToWallpaperPage(this.currentWallpaperPage - 1);
      });
    }
    if (this.wallpaperNextBtn) {
      this.wallpaperNextBtn.addEventListener('click', () => {
        this.goToWallpaperPage(this.currentWallpaperPage + 1);
      });
    }
  }

  goToWallpaperPage(page) {
    if (page < 0 || page >= this.totalWallpaperPages || page === this.currentWallpaperPage) return;
    this.currentWallpaperPage = page;

    const buttons = this.el.querySelectorAll('[data-wallpaper-page]');
    buttons.forEach((btn) => {
      const btnPage = parseInt(btn.getAttribute('data-wallpaper-page'), 10);
      btn.style.display = btnPage === page ? '' : 'none';
    });

    if (this.wallpaperPageInfo) {
      this.wallpaperPageInfo.textContent = (page + 1) + ' / ' + this.totalWallpaperPages;
    }
    if (this.wallpaperPrevBtn) {
      this.wallpaperPrevBtn.disabled = page === 0;
    }
    if (this.wallpaperNextBtn) {
      this.wallpaperNextBtn.disabled = page >= this.totalWallpaperPages - 1;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SettingsPanel();
});