/* ============================================================
   个人主页交互
   - 中英文切换（记忆选择）
   - 滚动渐显动画
   - 作品灯箱
   - 导航高亮 + 吸顶阴影
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 中英文切换 ---------- */
  var LANG_KEY = 'portfolio-lang';
  var saved = localStorage.getItem(LANG_KEY);
  var current = saved || (navigator.language && navigator.language.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');

  function applyLang(lang) {
    current = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var value = el.dataset[lang];
      if (value !== undefined) el.textContent = value;
    });

    // 语言按钮高亮
    var zh = document.querySelector('.lang-zh');
    var en = document.querySelector('.lang-en');
    if (zh) zh.classList.toggle('active', lang === 'zh');
    if (en) en.classList.toggle('active', lang === 'en');

    // 灯箱打开时同步更新说明文字
    syncLightboxCaption();

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* 隐私模式下忽略 */ }
  }

  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyLang(current === 'zh' ? 'en' : 'zh');
    });
  }

  /* ---------- 滚动渐显动画 ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 作品灯箱 ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = document.getElementById('lightboxClose');

  function syncLightboxCaption() {
    if (!lightbox.classList.contains('open')) return;
    var fig = lightbox._figure;
    if (!fig) return;
    var cap = fig.dataset[current === 'zh' ? 'captionZh' : 'captionEn'];
    lightboxCaption.textContent = cap || '';
  }

  function openLightbox(fig, img) {
    lightbox._figure = fig;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    syncLightboxCaption();
    lightbox.hidden = false;
    // 触发过渡动画
    requestAnimationFrame(function () { lightbox.classList.add('open'); });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { lightbox.hidden = true; }, 260);
  }

  document.querySelectorAll('.work').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = fig.querySelector('img');
      if (img) openLightbox(fig, img);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- 导航高亮 + 吸顶阴影 ---------- */
  var header = document.getElementById('siteHeader');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 8);

    var currentId = '';
    sections.forEach(function (sec) {
      if (y + 140 >= sec.offsetTop) currentId = sec.getAttribute('id');
    });

    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初始化

  /* ---------- 初始化 ---------- */
  applyLang(current);
})();
