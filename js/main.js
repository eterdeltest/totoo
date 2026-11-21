/* ================================================================
   totoo jeżyckie spa - wspólne skrypty
   ================================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Płynne przewijanie (Lenis) ----------
     Tylko na komputerach z myszką/gładzikiem i bez „ogranicz ruch”. Lenis
     wygładza kółko myszy (interpolacja do celu), ale przewija NATYWNIE —
     pasek, Ctrl+F, kotwice i wszystkie efekty przy scrollu działają jak dotąd.
     Na dotyku zostaje systemowe przewijanie. */
  let lenis = null;
  if (window.Lenis && matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 2026-11-21: o ok. 10% bardziej zdecydowany — każdy ząbek kółka przewija dalej
    // (wheelMultiplier 1 → 1.1) i strona szybciej dochodzi do celu (lerp .085 → .095)
    lenis = new window.Lenis({ lerp: 0.095, wheelMultiplier: 1.1, smoothWheel: true, syncTouch: false });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    window.ttLenis = lenis;
  }
  // przewiń do pozycji (płynnie przez Lenis albo natywnie)
  function scrollToY(y, immediate) {
    if (lenis) lenis.scrollTo(y, { immediate: !!immediate, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
  }

  /* Realna szerokość okna (bez scrollbara) dla elementów fixed */
  function setVpw() {
    document.documentElement.style.setProperty('--vpw', document.documentElement.clientWidth + 'px');
  }
  setVpw();
  window.addEventListener('resize', setVpw);

  /* ---------- Wstrzyknięcie overlayów wspólnych (menu mobilne + RODO) ---------- */
  const overlaysHTML = `
  <div class="overlay-backdrop" id="backdrop"></div>

  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="top">
      <a href="index.html" aria-label="totoo jeżyckie spa - strona główna"><img src="assets/svg/logo-green.svg" alt="totoo jeżyckie spa" width="111" height="42"></a>
      <button class="close-btn" data-close aria-label="Zamknij menu"><span>Menu</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11"/></svg>
      </button>
    </div>
    <nav class="links" aria-label="Menu mobilne">
      <a href="o-nas.html" style="--mi:0">O nas</a>
      <a href="oferta.html" style="--mi:1">Oferta</a>
      <a href="vouchery.html" style="--mi:2">Vouchery</a>
      <a href="kontakt.html" style="--mi:3">Kontakt</a>
    </nav>
    <div class="bottom">
      <a class="btn btn-peach" href="tel:+48608544344">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Zadzwoń <span class="num">608 544 344</span>
      </a>
    </div>
  </div>

  <aside class="side-panel" id="rodoPanel" data-lenis-prevent aria-hidden="true" role="dialog" aria-label="Klauzula RODO">
    <button class="close-btn" data-close aria-label="Zamknij panel">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <h3>Klauzula RODO</h3>
    <div class="panel-body">
      <p>Wyrażam zgodę na przetwarzanie przez Administratora moich danych osobowych zawartych w formularzu w celu realizacji usługi. Oświadczam, że zapoznałem/am się z informacją o Administratorze danych oraz moich prawach, w tym prawie dostępu do treści moich danych i ich poprawiania.</p>
      <p>Podanie danych jest dobrowolne, jednak niezbędne do przetworzenia zapytania/zrealizowania usługi. Dane będą przetwarzane wyłącznie w zakresie niezbędnym do świadczenia usług oferowanych przez Administratora i nie będą udostępniane podmiotom trzecim bez wyraźnej zgody osoby, której dane dotyczą, z wyjątkiem przypadków przewidzianych prawem.</p>
      <p>Administrator oświadcza, że stosuje odpowiednie środki techniczne i organizacyjne w celu zapewnienia bezpieczeństwa przetwarzanych danych osobowych i ochrony ich przed nieuprawnionym dostępem, utratą czy zniszczeniem. Dane będą przechowywane przez okres niezbędny do realizacji celu przetwarzania, a następnie zostaną usunięte.</p>
      <p>W każdej chwili zgoda na przetwarzanie danych może zostać wycofana, co nie wpływa na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej wycofaniem. Wycofanie zgody można zgłosić Administratorowi pisemnie lub mailowo na adres wskazany w polityce prywatności.</p>
    </div>
  </aside>`;
  document.body.insertAdjacentHTML('beforeend', overlaysHTML);

  const backdrop = document.getElementById('backdrop');
  const mobileMenu = document.getElementById('mobileMenu');
  const rodoPanel = document.getElementById('rodoPanel');
  let openEl = null;

  function openOverlay(el) {
    closeOverlay();
    openEl = el;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }
  function closeOverlay() {
    if (!openEl) return;
    openEl.classList.remove('open');
    openEl.setAttribute('aria-hidden', 'true');
    openEl = null;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }
  window.ttOpenOverlay = openOverlay;
  window.ttCloseOverlay = closeOverlay;

  backdrop.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlay(); });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeOverlay();
    const rodoLink = e.target.closest('[data-open-rodo]');
    if (rodoLink) { e.preventDefault(); openOverlay(rodoPanel); }
    const toTop = e.target.closest('[data-to-top]');
    if (toTop) { e.preventDefault(); scrollToY(0); }
  });

  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', () => openOverlay(mobileMenu));

  /* ---------- Nawigacja: tło po przewinięciu + bieżąca strona ---------- */
  const nav = document.getElementById('siteNav');
  const page = document.body.dataset.page || '';
  if (nav && page !== 'home') nav.classList.add('solid');
  let lastY = window.scrollY;
  const heroEl = document.querySelector('.hero');
  const cue = document.querySelector('.hero .scroll-cue');
  if (cue) cue.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.getElementById('powitanie');
    if (t) scrollToY(t.getBoundingClientRect().top + window.scrollY);
  });
  function onScroll() {
    if (!nav) return;   // strony bez paska (np. styleguide)
    const y = window.scrollY;
    if (page === 'home') nav.classList.toggle('solid', y > 40);
    if (heroEl) heroEl.classList.toggle('is-scrolled', y > 50);
    // chowanie navbara przy scrollu w dół, pokazywanie przy scrollu w górę
    if (y > 320 && y > lastY + 4) nav.classList.add('nav-hidden');
    else if (y < lastY - 4 || y < 320) nav.classList.remove('nav-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav .links a, .mobile-menu .links a').forEach((a) => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Scroll reveal ---------- */
  const RV_CLASSES = ['rv', 'rv-left', 'rv-right', 'rv-scale', 'rv-fade', 'rv-big', 'rv-mist', 'rv-row', 'rv-wipe', 'rv-words', 'rv-form', 'in'];
  const revealables = document.querySelectorAll('.rv, .rv-left, .rv-right, .rv-scale, .rv-fade, .rv-big, .rv-mist, .rv-row, .rv-wipe, .rv-words, .rv-form');
  const rvNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nagłówki .rv-words: każde słowo w osobnym <span class="wi"> (zachowuje <b>, <br>
  // i twarde spacje) — CSS animuje słowa po kolei przez --wi.
  document.querySelectorAll('.rv-words').forEach((h) => {
    if (!rvNoMotion) {
      let wi = 0;
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach((node) => {
        if (!node.nodeValue.trim()) return;
        const frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const span = document.createElement('span');
          span.className = 'wi';
          span.style.setProperty('--wi', wi++);
          span.textContent = part;
          frag.appendChild(span);
        });
        node.parentNode.replaceChild(frag, node);
      });
    }
    h.classList.add('split');
  });

  // Po zakończeniu animacji wejścia zdejmujemy klasy reveal — inaczej ich
  // tranzycje (i opóźnienia ze staggera) psują hovery, np. fade cienia buttonów.
  function revealEl(el, queueDelay) {
    if (el.classList.contains('in')) return;
    let delay = 0;
    const td = getComputedStyle(el).transitionDelay;
    if (td) delay = (parseFloat(td) || 0) * 1000;
    if (queueDelay) {
      delay += queueDelay;
      el.style.transitionDelay = delay + 'ms';
    }
    el.style.setProperty('--rvd', delay + 'ms');
    el.classList.add('in');
    let dur = 1350;
    if (el.classList.contains('rv-words')) dur = 1100 + el.querySelectorAll('.wi').length * 65;
    else if (el.classList.contains('rv-wipe')) dur = 1750;
    setTimeout(() => {
      el.classList.remove(...RV_CLASSES);
      el.style.transitionDelay = '0s';
      el.style.removeProperty('--rvd');
    }, dur + delay);
  }

  // Kaskada podstron: elementy, które wchodzą w kadr razem, odsłaniają się
  // PO KOLEI w porządku czytania (góra→dół, lewa→prawa), z hierarchią:
  // po nagłówku dłuższy oddech, potem lead, potem reszta. Wspólny „zegar”
  // (slot) sprawia, że kolejne partie nie nakładają się na poprzednie.
  // Strona główna ma własne, zaakceptowane staggery — tam bez kolejki.
  const useQueue = page !== 'home' && !rvNoMotion;
  let slot = 0;
  function stepOf(el) {
    if (el.classList.contains('rv-words')) return 220;
    if (el.classList.contains('rv-wipe')) return 130;
    if (el.classList.contains('rv-mist')) return 120;
    return 70;
  }
  // Segmenty: kontener [data-seq] odsłania się ZAWSZE w całości — gdy jego
  // góra wejdzie wyraźnie w kadr, wszystkie elementy segmentu startują jedną
  // kaskadą (także te, które są jeszcze pod linią ekranu). Dzięki temu nie ma
  // sytuacji „dwa z trzech zdjęć” albo dogrywania wierszy akordeonu przy scrollu.
  const seqOf = (el) => el.closest('[data-seq]');
  const seqGroups = new Map();
  revealables.forEach((el) => {
    const g = seqOf(el);
    if (!g) return;
    if (!seqGroups.has(g)) seqGroups.set(g, []);
    seqGroups.get(g).push(el);
  });
  function dueGroups() {
    const vh = window.innerHeight;
    const out = [];
    seqGroups.forEach((els, g) => {
      const r = g.getBoundingClientRect();
      // start: góra segmentu ~18% nad dolną krawędzią okna (albo segment już minięty)
      if (r.top < vh * 0.82 || r.bottom < vh) { out.push(...els); seqGroups.delete(g); }
    });
    return out;
  }
  function revealBatch(els) {
    // element segmentu pociąga za sobą cały segment
    const extra = [];
    els.forEach((el) => {
      const g = seqOf(el);
      if (g && seqGroups.has(g)) { extra.push(...seqGroups.get(g)); seqGroups.delete(g); }
    });
    els = Array.from(new Set(els.concat(extra))).filter((el) => !el.classList.contains('in'));
    if (!els.length) return;
    if (!useQueue) { els.forEach((el) => revealEl(el)); return; }
    const rects = new Map(els.map((el) => [el, el.getBoundingClientRect()]));
    els.sort((a, b) => {
      const ra = rects.get(a), rb = rects.get(b);
      const dy = ra.top - rb.top;
      return Math.abs(dy) > 44 ? dy : ra.left - rb.left;
    });
    const now = performance.now();
    if (slot < now) slot = now;
    els.forEach((el) => {
      revealEl(el, Math.min(slot - now, 1500));
      slot += stepOf(el);
    });
  }
  // .rv-wipe startuje z clip-path: inset(100%) — IntersectionObserver uwzględnia
  // własny clip elementu i nigdy nie zgłosiłby przecięcia. Te elementy
  // sprawdzamy więc po geometrii boxa (getBoundingClientRect ignoruje clip).
  const wipes = Array.from(document.querySelectorAll('.rv-wipe'));
  function visibleWipes() {
    const vh = window.innerHeight;
    return wipes.filter((el) => {
      if (el.classList.contains('in') || !el.classList.contains('rv-wipe') || seqOf(el)) return false;
      const r = el.getBoundingClientRect();
      return r.top < vh - 36 - Math.min(r.height * 0.12, 90);
    });
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const batch = visibleWipes().concat(dueGroups());
      entries.forEach((en) => {
        // odsłoń też elementy, które są już NAD viewportem (szybki scroll/skok)
        if (en.isIntersecting || en.boundingClientRect.top < 0) {
          // elementy segmentów czekają na próg segmentu (dueGroups), chyba że już go minęliśmy
          if (!seqOf(en.target) || en.boundingClientRect.top < 0) batch.push(en.target);
          io.unobserve(en.target);
        }
      });
      revealBatch(batch);
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    // start obserwacji dopiero po pierwszym paintcie, żeby wejściowe animacje
    // zawsze miały płynną tranzycję (a nie pojawiały się skokowo)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      revealables.forEach((el) => { if (!el.classList.contains('rv-wipe')) io.observe(el); });
      revealBatch(visibleWipes().concat(dueGroups()));
    }));
    // siatka bezpieczeństwa: podczas scrolla odsłoń wszystko, co minęło viewport
    let rafPending = false;
    window.addEventListener('scroll', () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const late = visibleWipes().concat(dueGroups());
        revealables.forEach((el) => {
          if (!el.classList.contains('in') && !late.includes(el) && el.getBoundingClientRect().top < window.innerHeight * 0.4) late.push(el);
        });
        revealBatch(late);
      });
    }, { passive: true });
  } else {
    revealables.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Ozdobniki: organiczne pojawianie + delikatny parallax ---------- */
  const noMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const decos = Array.from(document.querySelectorAll('.deco, .blob'));
  if (decos.length) {
    if ('IntersectionObserver' in window) {
      const dio = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting || en.boundingClientRect.top < 0) {
            const el = en.target;
            el.style.transitionDelay = (Math.random() * 0.5).toFixed(2) + 's';
            el.classList.add('deco-in');
            el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
            dio.unobserve(el);
          }
        });
      }, { threshold: 0.03 });
      decos.forEach((el) => dio.observe(el));
    } else {
      decos.forEach((el) => el.classList.add('deco-in'));
    }

    if (!noMotionGlobal) {
      const meta = decos.map((el) => {
        // --plx > 0: tło (wolniej niż strona); --plx < 0: pierwszy plan (szybciej)
        let sp = parseFloat(getComputedStyle(el).getPropertyValue('--plx'));
        if (!isFinite(sp)) sp = 0.15;
        return { el, sp, off: 0 };
      });
      let plxPending = false;
      function applyPlx() {
        plxPending = false;
        const vh = window.innerHeight;
        meta.forEach((m) => {
          const r = m.el.getBoundingClientRect();
          const baseC = r.top + r.height / 2 - m.off;
          if (baseC < -900 || baseC > vh + 900) return;
          m.off = (vh / 2 - baseC) * m.sp;
          m.el.style.setProperty('--plxy', m.off.toFixed(1) + 'px');
        });
      }
      window.addEventListener('scroll', () => {
        if (!plxPending) { plxPending = true; requestAnimationFrame(applyPlx); }
      }, { passive: true });
      applyPlx();
    }
  }

  /* ---------- Ozdobniki: wygaszanie przy krawędzi okna ----------
     Każdy ozdobnik/światło, który wychodzi poza okno, dostaje inline maskę:
     alfa spada do zera ~24px PRZED krawędzią (zapas na oddech skalą), więc
     okno nigdy nie ucina go prostą linią. Liczone przy starcie i zmianie
     szerokości; elementy z własną maską w CSS są pomijane. */
  const fadeEls = Array.from(document.querySelectorAll('.deco, .blob, .extras .ellipse, .m-deco'));
  function edgeFade() {
    const vw = document.documentElement.clientWidth;
    fadeEls.forEach((el) => {
      el.style.webkitMaskImage = el.style.maskImage = '';
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || (cs.maskImage && cs.maskImage !== 'none') || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none')) return;
      const r = el.getBoundingClientRect();
      if (!r.width || (r.left >= 0 && r.right <= vw)) return;
      const k = el.offsetWidth / r.width;                  // px ekranu → px elementu
      const M = 24, F = Math.min(170, Math.max(40, (Math.min(r.right, vw) - Math.max(r.left, 0)) * 0.35));
      const stops = [];
      if (r.left < 0) { const z = (-r.left + M) * k; stops.push(`transparent ${z.toFixed(0)}px`, `#000 ${(z + F * k).toFixed(0)}px`); }
      else stops.push('#000 0');
      if (r.right > vw) { const z = (vw - r.left - M) * k; stops.push(`#000 ${(z - F * k).toFixed(0)}px`, `transparent ${z.toFixed(0)}px`); }
      else stops.push('#000 100%');
      const g = `linear-gradient(to right, ${stops.join(', ')})`;
      el.style.webkitMaskImage = el.style.maskImage = g;
    });
  }
  edgeFade();
  window.addEventListener('resize', () => { clearTimeout(edgeFade.t); edgeFade.t = setTimeout(edgeFade, 120); });
  window.addEventListener('load', edgeFade);

  /* ---------- Pływający przycisk „Vouchery” (wariant „Pigułka”) ----------
     Nie występuje na stronie Vouchery. Pokazuje się:
       · na stronie głównej po minięciu ~60% pierwszego ekranu (nie zasłania hero),
       · na podstronach po lekkim przewinięciu (160px),
       · od razu (po 1,2 s), jeśli strona jest za krótka, żeby tyle przewinąć
         (np. Oferta ze zwiniętymi kategoriami).
     Przy stopce nie znika — podjeżdża nad nią (--fab-lift). Chowa się tylko
     pod otwartym panelem/menu. Raz, przy pierwszym pojawieniu, rozwija napis. */
  // 2026-11-21: przycisk UKRYTY decyzją Otisa (desktop + mobile) — wrócimy do niego później.
  // Żeby go przywrócić, wystarczy ustawić FAB_ENABLED = true.
  const FAB_ENABLED = false;
  if (FAB_ENABLED && page !== 'vouchery' && document.querySelector('.site-footer')) {
    const GIFT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>';
    const ARR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>';
    const fab = document.createElement('a');
    fab.className = 'fab fab-2';
    fab.href = 'vouchery.html';
    fab.setAttribute('aria-label', 'Vouchery podarunkowe - podaruj relaks w totoo');
    fab.innerHTML = '<span class="fab-ic">' + GIFT + '</span><span class="fab-lbl"><span>Podaruj voucher</span>' + ARR + '</span>';
    document.body.appendChild(fab);
    const footer = document.querySelector('.site-footer');
    let fabTick = false, fabReady = false, fabPeeked = false;
    function fabUpdate() {
      fabTick = false;
      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      let threshold = page === 'home' ? vh * 0.6 : 160;
      if (maxScroll < threshold + 80) threshold = 0;                 // krótka strona: nie ma czego przewijać
      const lift = Math.max(0, vh - footer.getBoundingClientRect().top);
      fab.style.setProperty('--fab-lift', lift.toFixed(0) + 'px');
      const show = fabReady && window.scrollY >= threshold && !document.body.style.overflow && lift < vh - 120;
      const wasShown = fab.classList.contains('show');
      fab.classList.toggle('show', show);
      if (show && !wasShown && !fabPeeked) {
        fabPeeked = true;
        fab.classList.add('peek'); setTimeout(() => fab.classList.remove('peek'), 3200);
      }
    }
    const fabQueue = () => { if (!fabTick) { fabTick = true; requestAnimationFrame(fabUpdate); } };
    window.addEventListener('scroll', fabQueue, { passive: true });
    window.addEventListener('resize', fabQueue, { passive: true });
    // wysokość strony zmienia się bez scrolla (akordeony, panele) — stopka się przesuwa
    if ('ResizeObserver' in window) new ResizeObserver(fabQueue).observe(document.body);
    new MutationObserver(fabQueue).observe(document.body, { attributes: true, attributeFilter: ['style'] });
    setTimeout(() => { fabReady = true; fabUpdate(); }, 1200);
  }

  /* ---------- Licznik statystyk ---------- */
  const nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    const nio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        nio.unobserve(en.target);
        const el = en.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const t0 = performance.now();
        function tick(t) {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach((el) => nio.observe(el));
  }

  /* ---------- Karuzela: nieskończona pętla, sprężynowy dojazd, akcent środka ---------- */
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.carousel').forEach((car) => {
    const track = car.querySelector('.track');
    if (!track) return;
    const originals = Array.from(track.querySelectorAll('.item'));
    const n = originals.length;
    originals.forEach((it, i) => {
      it.dataset.k = i;
      // Transformacje (skala/rozsunięcie) idą na wewnętrzny wrapper, a sam .item
      // zostaje nieruszony: przeglądarka liczy punkty scroll-snap z
      // PRZETRANSFORMOWANEGO boxa, więc transformacja na .item dawała
      // sprzężenie zwrotne (pozycja → transformacja → nowy punkt snapa → drganie).
      const inner = document.createElement('div');
      inner.className = 'item-in';
      while (it.firstChild) inner.appendChild(it.firstChild);
      it.appendChild(inner);
    });

    // Pętla: zestaw sklonowany przed i po oryginale; przy zbliżaniu się do
    // brzegów przeskakujemy o szerokość zestawu (niewidocznie).
    if (n > 1) {
      const mkClone = (it) => {
        const c = it.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('img').forEach((img) => { img.alt = ''; img.loading = 'lazy'; });
        c.querySelectorAll('a, button').forEach((f) => f.setAttribute('tabindex', '-1'));
        return c;
      };
      const before = document.createDocumentFragment();
      const after = document.createDocumentFragment();
      originals.forEach((it) => { before.appendChild(mkClone(it)); after.appendChild(mkClone(it)); });
      track.insertBefore(before, track.firstChild);
      track.appendChild(after);
    }

    const items = Array.from(track.querySelectorAll('.item'));
    const inners = items.map((it) => it.querySelector('.item-in'));

    // Geometria z LAYOUTU (offsetLeft), nie z getBoundingClientRect — rect
    // zawiera transformacje kafelków (rozsunięcie/skalę), przez co cel dojazdu
    // wypadał obok punktu snapa i na końcu ruchu karuzelę „dociągało” skokiem.
    let lefts = [], itemW = 0, viewW = 0, setW = 0;
    // parametry akcentu środka z CSS (mobile ma inne: 3 kafelki bez wygaszania)
    const P = { max: 1.1, min: 0, drop: 0.44, push: 16, fade: 0.45 };
    function measure() {
      const cs = getComputedStyle(car);
      const num = (name, def) => { const v = parseFloat(cs.getPropertyValue(name)); return isFinite(v) ? v : def; };
      P.max = num('--car-max', 1.1); P.min = num('--car-min', 0); P.drop = num('--car-drop', 0.44);
      P.push = num('--car-push', 16); P.fade = num('--car-fade', 0.45);
      lefts = items.map((it) => it.offsetLeft);
      itemW = items[0] ? items[0].offsetWidth : 0;
      viewW = track.clientWidth;
      setW = items.length > n ? lefts[n] - lefts[0] : 0;
    }
    measure();
    const centerOf = (i) => Math.round(lefts[i] - (viewW - itemW) / 2);   // scrollLeft, przy którym kafelek i jest w osi
    function nearest(x) {
      let best = 0, bd = Infinity;
      for (let i = 0; i < items.length; i++) {
        const d = Math.abs(centerOf(i) - x);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }

    let pos = 0;          // bieżący scrollLeft (z ułamkiem - nie czytamy go z DOM w trakcie ruchu)
    let vel = 0, target = 0, targetIdx = 0, raf = null, lastT = 0;

    // akcent środka: schodki skali + lekkie rozsunięcie sąsiadów + wygaszenie boków
    function emphasize() {
      if (noMotion || !viewW) return;
      const half = viewW / 2;
      const mid = pos + half;
      // scrollLeft bywa zaokrąglany do pełnych pikseli — resztę ułamkową
      // dokładamy transformacją, żeby końcówka ruchu nie „stąpała” po 1 px
      const subpx = pos - track.scrollLeft;
      for (let i = 0; i < items.length; i++) {
        const c = lefts[i] + itemW / 2 - mid;
        const d = Math.min(Math.abs(c) / half, 1);
        const push = Math.sign(c) * Math.sin(Math.min(d, 0.5) * Math.PI) * P.push;
        // schodki jak w makiecie: środek 400px, sąsiad 320 (80%), skraj 240 (60%)
        inners[i].style.transform = `translateX(${(push - subpx).toFixed(2)}px) scale(${Math.max(P.min, P.max - d * P.drop).toFixed(4)})`;
        items[i].style.setProperty('--fade', (1 - d * P.fade).toFixed(3));
      }
    }

    // start: środkowy element środkowego zestawu wyśrodkowany
    targetIdx = Math.min(items.length - 1, (n > 1 ? n : 0) + Math.floor(n / 2));
    track.classList.add('no-snap');
    pos = centerOf(targetIdx);
    track.scrollLeft = pos;
    emphasize();
    requestAnimationFrame(() => track.classList.remove('no-snap'));

    // przesunięcie o cały zestaw klonów (obraz identyczny, więc niewidoczne)
    function shiftSets(k) {
      track.classList.add('no-snap');
      pos += k * setW;
      track.scrollLeft = pos;
      emphasize();
    }
    function wrapIdle() {
      if (raf || !setW || n < 2) return;
      pos = track.scrollLeft;
      const base = lefts[0];
      if (pos < base + setW * 0.25) shiftSets(1);
      else if (pos > base + setW * 1.75) shiftSets(-1);
      else return;
      requestAnimationFrame(() => { if (!raf) track.classList.remove('no-snap'); });
    }

    // Dojazd: krytycznie tłumiona sprężyna. Rusza miękko, wyhamowuje płynnie
    // do zera, a kolejne kliknięcie w trakcie ruchu tylko przestawia cel
    // (prędkość zostaje — bez szarpnięć i bez restartu animacji).
    const K = 70, C = 2 * Math.sqrt(K);
    function frame(t) {
      const dt = Math.min(0.034, Math.max(0.001, (t - lastT) / 1000));
      lastT = t;
      const h = dt / 3;
      for (let s = 0; s < 3; s++) {
        vel += (-K * (pos - target) - C * vel) * h;
        pos += vel * h;
      }
      if (Math.abs(target - pos) < 0.35 && Math.abs(vel) < 3) {
        pos = target; vel = 0; raf = null;
        track.scrollLeft = pos;
        emphasize();
        // snap wraca dopiero, gdy stoimy DOKŁADNIE w punkcie snapa → zero korekty
        requestAnimationFrame(() => { if (!raf) track.classList.remove('no-snap'); });
        return;
      }
      track.scrollLeft = pos;
      emphasize();
      raf = requestAnimationFrame(frame);
    }
    function goTo(idx) {
      if (!items.length) return;
      if (!raf) pos = track.scrollLeft;
      // zapas klonów po obu stronach celu
      if (n > 1 && setW) {
        if (idx < 2) { shiftSets(1); idx += n; }
        else if (idx > items.length - 3) { shiftSets(-1); idx -= n; }
      }
      idx = Math.max(0, Math.min(items.length - 1, idx));
      targetIdx = idx;
      target = centerOf(idx);
      if (noMotion) { pos = target; track.scrollLeft = pos; return; }
      track.classList.add('no-snap');
      if (!raf) { vel = 0; lastT = performance.now(); raf = requestAnimationFrame(frame); }
    }
    const currentIdx = () => (raf ? targetIdx : nearest(track.scrollLeft));

    car.querySelectorAll('.arrow').forEach((btn) => {
      btn.addEventListener('click', () => goTo(currentIdx() + Number(btn.dataset.dir)));
    });
    // klik w boczny kafelek łagodnie przekręca karuzelę, by go wycentrować
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.item');
      if (!item) return;
      const idx = items.indexOf(item);
      if (idx !== currentIdx()) { e.preventDefault(); goTo(idx); }
    });

    // natywny scroll (dotyk / gładzik): akcent na bieżąco, pętla po zatrzymaniu
    let idleT = null, emphPending = false;
    track.addEventListener('scroll', () => {
      car.classList.add('is-moving');
      clearTimeout(idleT);
      idleT = setTimeout(() => { car.classList.remove('is-moving'); wrapIdle(); }, 140);
      if (raf) return;                    // w trakcie dojazdu akcent liczy pętla sprężyny
      pos = track.scrollLeft;
      if (!emphPending) {
        emphPending = true;
        requestAnimationFrame(() => { emphPending = false; if (!raf) { pos = track.scrollLeft; emphasize(); } });
      }
    }, { passive: true });
    // użytkownik łapie tor w trakcie dojazdu → oddajemy mu sterowanie
    const cancelSpring = () => {
      if (!raf) return;
      cancelAnimationFrame(raf); raf = null; vel = 0;
      track.classList.remove('no-snap');
    };
    track.addEventListener('touchstart', cancelSpring, { passive: true });
    track.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) cancelSpring(); }, { passive: true });

    window.addEventListener('resize', () => {
      const keep = currentIdx();
      if (raf) { cancelAnimationFrame(raf); raf = null; vel = 0; }
      measure();
      track.classList.add('no-snap');
      pos = centerOf(keep); targetIdx = keep;
      track.scrollLeft = pos;
      emphasize();
      requestAnimationFrame(() => track.classList.remove('no-snap'));
    });

    // Hover po „logicznej” pozycji (oryginał + klony razem), żeby niewidoczny
    // przeskok pętli nie gasił stanu hover pod kursorem.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let hoverK = null, leaveT = null, moveRaf = null, lastMove = null;
      const setHover = (k) => {
        if (k === hoverK) return;
        hoverK = k;
        items.forEach((it) => {
          const on = k !== null && it.dataset.k === k;
          it.classList.toggle('is-hover', on);
          if (!on) {
            const ph = it.querySelector('.ph');
            if (ph) { ph.style.setProperty('--rx', 0); ph.style.setProperty('--ry', 0); }
          }
        });
      };
      track.addEventListener('pointerover', (e) => {
        const it = e.target.closest('.item');
        if (!it) return;
        clearTimeout(leaveT);
        setHover(it.dataset.k);
      });
      track.addEventListener('pointerout', (e) => {
        const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('.item') : null;
        if (to) return;
        clearTimeout(leaveT);
        leaveT = setTimeout(() => setHover(null), 70);
      });
      track.addEventListener('pointermove', (e) => {
        lastMove = e;
        if (moveRaf || noMotion) return;
        moveRaf = requestAnimationFrame(() => {
          moveRaf = null;
          const it = lastMove.target.closest ? lastMove.target.closest('.item') : null;
          if (!it) return;
          const ph = it.querySelector('.ph');
          if (!ph) return;
          const r = ph.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (lastMove.clientX - r.left) / r.width));
          const y = Math.max(0, Math.min(1, (lastMove.clientY - r.top) / r.height));
          items.forEach((o) => {
            if (o.dataset.k !== it.dataset.k) return;
            const p = o.querySelector('.ph');
            p.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            p.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            p.style.setProperty('--rx', ((0.5 - y) * 8.4).toFixed(2));
            p.style.setProperty('--ry', ((x - 0.5) * 10.8).toFixed(2));
          });
        });
      });
    }
  });

  /* ---------- Klisze: pętla bez końca przy każdej szerokości okna ---------- */
  const igStrip = document.querySelector('.instagram .strip');
  if (igStrip) {
    const firstSet = igStrip.querySelector('.set');
    const fillStrip = () => {
      const w = firstSet.offsetWidth;
      if (!w) return;
      const need = Math.ceil(window.innerWidth / w) + 1;      // okno + jeden zestaw zapasu
      while (igStrip.children.length < need) {
        const c = firstSet.cloneNode(true);
        c.querySelectorAll('a').forEach((a) => { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); });
        c.querySelectorAll('img').forEach((i) => { i.alt = ''; });
        igStrip.appendChild(c);
      }
      igStrip.style.setProperty('--ig-shift', `${-w}px`);
    };
    fillStrip();
    window.addEventListener('resize', fillStrip, { passive: true });
    window.addEventListener('load', fillStrip);
  }

  /* ---------- Hero: delikatny parallax za kursorem ---------- */
  const heroBg = document.querySelector('.hero .bg');
  if (heroBg && !noMotion && matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function tick() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      heroBg.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(tick) : null;
    }
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -18;
      ty = (e.clientY / window.innerHeight - 0.5) * -12;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  }

  /* ---------- Płynne przejścia między podstronami ---------- */
  if (!noMotion) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.hasAttribute('data-open-rodo') || a.hasAttribute('data-to-top')) return;
      e.preventDefault();
      document.body.classList.add('page-out');
      setTimeout(() => { location.href = href; }, 170);
    });
    window.addEventListener('pageshow', () => document.body.classList.remove('page-out'));
  }

  /* ---------- Mobile: drobne dopasowania treści ---------- */
  const mqMobile = window.matchMedia('(max-width: 760px)');
  const treatOpt = document.querySelector('select[name="treatment"] option[value=""]');
  if (treatOpt) {
    const longLabel = treatOpt.textContent;
    const setLabel = () => { treatOpt.textContent = mqMobile.matches ? 'Jaki zabieg Cię interesuje? *' : longLabel; };
    setLabel();
    mqMobile.addEventListener('change', setLabel);
  }
  // w makiecie mobilnej imię i zdjęcie w karcie zespołu prowadzą do panelu osoby
  document.querySelectorAll('.team-card').forEach((card) => {
    const btn = card.querySelector('.btn-more');
    if (!btn) return;
    // zdjęcie otwiera panel zawsze; imię — na telefonie (jak w makiecie mobilnej)
    const photo = card.querySelector('.photo');
    if (photo) photo.addEventListener('click', () => btn.click());
    const name = card.querySelector('.name');
    if (name) name.addEventListener('click', () => { if (mqMobile.matches) btn.click(); });
  });

  /* ---------- Akordeony (Oferta, FAQ) ----------
     Wzorzec: kliknięty nagłówek ZOSTAJE pod kursorem. Gdy otwarcie zwija inną
     pozycję powyżej, strona jest na bieżąco korygowana tak, by nagłówek nie
     drgnął. Jeśli po rozwinięciu treść byłaby prawie niewidoczna, nagłówek
     płynnie podjeżdża w górę - w tym samym ruchu, bez osobnego skoku. */
  const accHeads = document.querySelectorAll('.acc-head');
  if (accHeads.length) {
    document.querySelectorAll('.acc .acc-inner').forEach((inner) => {
      Array.from(inner.children).forEach((ch, i) => ch.style.setProperty('--i', i));
    });
    let accRaf = null;
    function toggleAcc(head) {
      const acc = head.parentElement;
      const willOpen = !acc.classList.contains('open');
      const y0 = head.getBoundingClientRect().top;
      document.querySelectorAll('.acc.open').forEach((o) => {
        if (o !== acc) { o.classList.remove('open'); o.querySelector('.acc-head').setAttribute('aria-expanded', 'false'); }
      });
      acc.classList.toggle('open', willOpen);
      head.setAttribute('aria-expanded', willOpen);
      if (noMotionGlobal) return;
      // ile nagłówek ma podjechać: tylko gdy otwieramy nisko na ekranie
      const vh = window.innerHeight;
      const navH = nav && !nav.classList.contains('nav-hidden') ? nav.offsetHeight : 0;
      let lift = 0;
      if (willOpen && y0 > vh * 0.55 && y0 < vh) lift = Math.min(y0 - (navH + 32), y0 - vh * 0.3);
      const t0 = performance.now(), dur = 620;
      const html = document.documentElement;
      html.style.scrollBehavior = 'auto';
      cancelAnimationFrame(accRaf);
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        const want = y0 - lift * e;
        const dy = head.getBoundingClientRect().top - want;
        if (Math.abs(dy) > 0.5) scrollToY(window.scrollY + dy, true);
        if (p < 1) accRaf = requestAnimationFrame(step);
        else html.style.scrollBehavior = '';
      })(t0);
    }
    accHeads.forEach((head) => head.addEventListener('click', () => toggleAcc(head)));
    // link z kotwicą (#pielegnacja itd.) otwiera właściwą kategorię
    const hashAcc = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (hashAcc && hashAcc.classList.contains('acc')) {
      hashAcc.classList.add('open');
      hashAcc.querySelector('.acc-head').setAttribute('aria-expanded', 'true');
    }
  }

  /* ---------- Home / powitanie: nagłówek w osi zdjęcia po prawej ---------- */
  const intro = document.querySelector('.about-intro');
  if (intro) {
    const h1 = intro.querySelector('h1'), ph = intro.querySelector('.photo-r');
    const absTop = (el) => { let y = 0; while (el && el !== intro) { y += el.offsetTop; el = el.offsetParent; } return y; };
    const fitIntro = () => {
      h1.style.top = '';
      if (window.innerWidth <= 920) return;
      const shift = (absTop(ph) + ph.offsetHeight / 2) - (absTop(h1) + h1.offsetHeight / 2);
      h1.style.position = 'relative';
      h1.style.top = shift.toFixed(1) + 'px';
    };
    fitIntro();
    window.addEventListener('resize', fitIntro);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitIntro);
  }

  /* ---------- Selecty: własna, zaokrąglona lista (desktop) ----------
     Natywny <select> zostaje w DOM (wartość, walidacja, czytniki), ale na
     urządzeniach z myszką zastępuje go przycisk + lista o wyglądzie pól
     formularza. Na dotyku zostaje natywny wybierak systemu. */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.select-wrap select').forEach((sel) => {
    const markEmpty = () => sel.classList.toggle('is-empty', !sel.value);
    markEmpty();
    sel.addEventListener('change', markEmpty);
    if (!finePointer) return;
    const wrap = sel.parentElement;
    wrap.classList.add('has-custom');
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'sel-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', sel.getAttribute('aria-label') || '');
    const list = document.createElement('ul');
    list.className = 'sel-list'; list.setAttribute('role', 'listbox'); list.tabIndex = -1; list.setAttribute('data-lenis-prevent', '');
    const opts = Array.from(sel.options).filter((o) => o.value !== '' || !o.disabled);
    let active = -1;
    const items = opts.map((o, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option'); li.textContent = o.textContent; li.dataset.i = i;
      list.appendChild(li);
      return li;
    });
    const sync = () => {
      const cur = sel.options[sel.selectedIndex];
      btn.textContent = cur ? cur.textContent : '';
      btn.classList.toggle('is-empty', !sel.value);
      items.forEach((li, i) => li.setAttribute('aria-selected', opts[i].selected && !!sel.value));
    };
    const setActive = (i) => {
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach((li, k) => li.classList.toggle('is-active', k === active));
      items[active].scrollIntoView({ block: 'nearest' });
    };
    const open = () => {
      wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      setActive(Math.max(0, opts.findIndex((o) => o.selected && sel.value)));
    };
    const close = () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    const choose = (i) => {
      sel.value = opts[i].value;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      sync(); close(); btn.focus();
    };
    btn.addEventListener('click', () => (wrap.classList.contains('open') ? close() : open()));
    list.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) choose(+li.dataset.i); });
    list.addEventListener('mousemove', (e) => { const li = e.target.closest('li'); if (li) setActive(+li.dataset.i); });
    btn.addEventListener('keydown', (e) => {
      const isOpen = wrap.classList.contains('open');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) open(); else setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      } else if ((e.key === 'Enter' || e.key === ' ') && isOpen) { e.preventDefault(); choose(active); }
      else if (e.key === 'Escape' && isOpen) { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'Tab') close();
    });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
    sel.addEventListener('change', sync);
    sel.form && sel.form.addEventListener('reset', () => setTimeout(() => { sync(); markEmpty(); }, 0));
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    wrap.insertBefore(btn, sel.nextSibling);
    wrap.appendChild(list);
    sync();
  });

  /* ---------- Home: wejście zdjęć „Oddech” (powitanie + „Zapraszamy”) ---------- */
  const breathEls = document.querySelectorAll('.fx-breath');
  if (breathEls.length) {
    if ('IntersectionObserver' in window && !noMotionGlobal) {
      const bio = new IntersectionObserver((ens) => {
        ens.forEach((en) => {
          if (!en.isIntersecting && en.boundingClientRect.top > 0) return;
          en.target.classList.add('fx-play');
          bio.unobserve(en.target);
        });
      }, { threshold: 0.25 });
      breathEls.forEach((el) => bio.observe(el));
    } else breathEls.forEach((el) => el.classList.add('fx-play'));
  }

  /* ---------- Formularze ----------
     Wysyłka przez Netlify Forms (atrybut data-netlify w HTML). Na hostingu
     Netlify zgłoszenie trafia do panelu i na skonfigurowany tam e-mail.
     Lokalnie (localhost / sieć domowa) i na GitHub Pages (*.github.io — hosting
     bez obsługi formularzy) nie ma dokąd wysłać: formularz przechodzi walidację
     i pokazuje potwierdzenie z dopiskiem „podgląd”, ale nic nie wysyła. */
  const isLocal = /^(localhost|127\.|192\.168\.|10\.|\[::1\])/.test(location.hostname) || location.protocol === 'file:' ||
    /\.github\.io$/.test(location.hostname);
  const ERR_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v5.5"/><path d="M12 16.6h.01"/></svg>';
  // treść błędu pola ('' = pole poprawne); komunikaty z atrybutów data-err / data-err-format
  function fieldError(f) {
    const v = f.value.trim();
    if (!v) return f.dataset.err || 'To pole jest wymagane';
    if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return f.dataset.errFormat || 'Podaj poprawny adres e-mail';
    return '';
  }
  function setFieldError(form, f, msg) {
    const wrap = f.parentElement && f.parentElement.classList.contains('select-wrap') ? f.parentElement : null;
    const cb = wrap && wrap.querySelector('.sel-btn');
    f.classList.toggle('is-invalid', !!msg);
    if (cb) cb.classList.toggle('is-invalid', !!msg);
    let m = f._errEl;
    if (msg) {
      if (!m) {
        m = f._errEl = document.createElement('div');
        m.className = 'field-err';
        m.id = 'err-' + (form.getAttribute('name') || 'form') + '-' + f.name;
        m.setAttribute('role', 'alert');
        (form.classList.contains('news-form') ? form : (wrap || f)).insertAdjacentElement('afterend', m);
      }
      m.innerHTML = ERR_ICON + '<span></span>';
      m.lastChild.textContent = msg;
      m.hidden = false;
      f.setAttribute('aria-invalid', 'true');
      f.setAttribute('aria-describedby', m.id);
    } else {
      if (m) m.hidden = true;
      f.removeAttribute('aria-invalid');
      f.removeAttribute('aria-describedby');
    }
  }
  document.querySelectorAll('form[data-netlify], form.news-form').forEach((form) => {
    // po pierwszej próbie wysyłki błąd znika od razu, gdy pole zostanie poprawione
    form.querySelectorAll('[required]').forEach((f) => {
      const recheck = () => { if (form.dataset.tried) setFieldError(form, f, fieldError(f)); };
      f.addEventListener('input', recheck);
      f.addEventListener('change', recheck);
    });
    form.addEventListener('reset', () => {
      delete form.dataset.tried;
      form.querySelectorAll('[required]').forEach((f) => setFieldError(form, f, ''));
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // walidacja przy wysyłce: każde wymagane pole dostaje własny komunikat pod spodem
      form.dataset.tried = '1';
      let firstBad = null;
      form.querySelectorAll('[required]').forEach((f) => {
        const msg = fieldError(f);
        setFieldError(form, f, msg);
        if (msg && !firstBad) firstBad = f;
      });
      if (firstBad) {
        const cb = firstBad.parentElement && firstBad.parentElement.querySelector('.sel-btn');
        (cb || firstBad).focus({ preventScroll: false });
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const prev = btn ? btn.innerHTML : '';
      const show = (html, ms) => {
        if (!btn) return;
        btn.innerHTML = html; btn.disabled = true;
        setTimeout(() => { btn.innerHTML = prev; btn.disabled = false; }, ms);
      };
      if (isLocal) { show('Dziękujemy! &#10003; <small style="opacity:.7;font-weight:400">(podgląd)</small>', 3200); form.reset(); return; }
      if (btn) { btn.disabled = true; btn.innerHTML = 'Wysyłanie…'; }
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show('Dziękujemy! &#10003;', 4000);
      } catch (err) {
        show('Nie udało się wysłać - zadzwoń: 608 544 344', 6000);
      }
    });
  });
})();
