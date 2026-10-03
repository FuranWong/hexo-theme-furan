(function () {
  'use strict';

  function initHeroPoem() {
    var el = document.querySelector('[data-hero-poem]');
    if (!el) return;

    var API = 'https://v2.jinrishici.com/one.json';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', API, true);
    xhr.timeout = 5000;
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        el.style.display = 'none';
        return;
      }
      try {
        var json = JSON.parse(xhr.responseText);
        var content = (json.data && json.data.content) || '';
        var origin = (json.data && json.data.origin) || {};
        var author = origin.author || '';
        var title = origin.title || '';

        if (!content) {
          el.style.display = 'none';
          return;
        }

        el.innerHTML =
          '<span class="hero__poem-content">' + escapeHTML(content) + '</span>' +
          '<span class="hero__poem-author">—— ' + (author ? escapeHTML(author) : '') + (title ? '《' + escapeHTML(title) + '》' : '') + '</span>';
      } catch (e) {
        el.style.display = 'none';
      }
    };
    xhr.onerror = function () {
      el.style.display = 'none';
    };
    xhr.ontimeout = function () {
      el.style.display = 'none';
    };
    xhr.send();
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroPoem);
  } else {
    initHeroPoem();
  }
})();