/* Bascule de langue FR/EN — CSS-driven (spans .i18n-fr / .i18n-en), persistance via ?lang= dans l'URL */
(function () {
  function getLangFromURL() {
    var p = new URLSearchParams(window.location.search);
    return p.get('lang') === 'en' ? 'en' : 'fr';
  }

  function rewriteInternalLinks(lang) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
      if (/^https?:\/\//i.test(href) && href.indexOf('loan881.github.io') === -1) return;
      try {
        var url = new URL(href, window.location.href);
        if (lang === 'en') url.searchParams.set('lang', 'en');
        else url.searchParams.delete('lang');
        a.setAttribute('href', url.pathname + url.search + url.hash);
      } catch (e) { /* ignore */ }
    });
  }

  function applyLang(lang) {
    if (lang === 'en') {
      document.documentElement.setAttribute('data-lang', 'en');
      document.documentElement.setAttribute('lang', 'en');
    } else {
      document.documentElement.removeAttribute('data-lang');
      document.documentElement.setAttribute('lang', 'fr');
    }

    document.querySelectorAll('[data-i18n-placeholder-fr]').forEach(function (el) {
      var key = lang === 'en' ? 'data-i18n-placeholder-en' : 'data-i18n-placeholder-fr';
      var val = el.getAttribute(key);
      if (val !== null) el.setAttribute('placeholder', val);
    });

    // Pour les éléments qui ne peuvent pas contenir de spans (ex : <option>, aria-label)
    document.querySelectorAll('[data-i18n-text-fr]').forEach(function (el) {
      var key = lang === 'en' ? 'data-i18n-text-en' : 'data-i18n-text-fr';
      var val = el.getAttribute(key);
      if (val !== null) el.textContent = val;
    });

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    rewriteInternalLinks(lang);
    window.currentLang = lang;
  }

  function init() {
    var lang = getLangFromURL();
    applyLang(lang);

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-lang') === 'en' ? 'en' : 'fr';
        var url = new URL(window.location.href);
        if (next === 'en') url.searchParams.set('lang', 'en');
        else url.searchParams.delete('lang');
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        applyLang(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
