/* ============================================================================
   MERY COFFEE CLUB — INTERACTIONS
   No frameworks, no external requests. Plain ES2019.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "mery.lang";
  var lang = "fa";
  var t = MERY_I18N.fa;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* callbacks that need to re-run when the language changes */
  var langHooks = [];

  /* -- helpers ------------------------------------------------------------ */

  function lookup(dict, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, dict);
  }

  function digits(str) {
    // Persian reads better with Persian-Indic numerals
    if (lang !== "fa") return String(str);
    var fa = "۰۱۲۳۴۵۶۷۸۹";
    return String(str).replace(/[0-9]/g, function (d) { return fa[+d]; });
  }

  function formatPrice(value) {
    if (value == null) return null;
    var n = value * (MERY_CURRENCY.multiplier || 1);
    var grouped = n.toLocaleString("en-US");
    return digits(grouped) + " " + (lang === "fa" ? MERY_CURRENCY.fa : MERY_CURRENCY.en);
  }

  function hasAnyPrice() {
    return MERY_MENU.some(function (cat) {
      return cat.items.some(function (i) { return i.price != null; });
    });
  }

  /* -- language ----------------------------------------------------------- */

  function applyLanguage(next) {
    lang = next;
    t = MERY_I18N[lang];

    var html = document.documentElement;
    html.setAttribute("lang", t.lang);
    html.setAttribute("dir", t.dir);

    // pages other than the homepage (e.g. /comments, via <body data-page="…">)
    // get their own title/description text instead of the homepage's
    var pageText = (document.body.getAttribute("data-page") === "comments" && t.commentsPage) ? t.commentsPage : t;
    document.title = pageText.htmlTitle;

    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", pageText.metaDesc);

    $$("[data-i18n]").forEach(function (el) {
      var v = lookup(t, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });

    $$("[data-i18n-aria]").forEach(function (el) {
      var v = lookup(t, el.getAttribute("data-i18n-aria"));
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });

    $$("[data-i18n-placeholder]").forEach(function (el) {
      var v = lookup(t, el.getAttribute("data-i18n-placeholder"));
      if (typeof v === "string") el.setAttribute("placeholder", v);
    });

    $$("[data-cfg]").forEach(function (el) {
      var v = MERY_CONFIG[el.getAttribute("data-cfg")];
      if (v && typeof v === "object") v = v[lang];
      if (typeof v === "string") el.textContent = v;
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }

    renderMenu();
    renderGallery();
    langHooks.forEach(function (fn) { fn(); });
  }

  /* -- config-driven links ------------------------------------------------ */

  function wireConfig() {
    $$(".ig-link").forEach(function (a) { a.href = MERY_CONFIG.instagram; });

    var dir = $("#directionsBtn");
    var map = $("#mapCard");
    if (dir) dir.href = MERY_CONFIG.mapsUrl;
    if (map) map.href = MERY_CONFIG.mapsUrl;

    var call = $("#callBtn");
    if (call) {
      if (MERY_CONFIG.phone) {
        call.href = "tel:" + MERY_CONFIG.phone.replace(/\s+/g, "");
        call.hidden = false;
      } else {
        call.hidden = true;
      }
    }

    var year = $("#year");
    if (year) year.textContent = digits(new Date().getFullYear());
  }

  /* -- menu --------------------------------------------------------------- */

  var MENU_ICONS = {
    "warm-coffee": '<path d="M5 9h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V9Z"/><path d="M17 10.5h1a2 2 0 1 1 0 4h-1"/><path d="M9 3.2c0 .9-1 .9-1 1.8s1 .9 1 1.8M13 3.2c0 .9-1 .9-1 1.8s1 .9 1 1.8" stroke-linecap="round"/>',
    "iced-coffee": '<path d="M6.2 8h11.6l-1.15 10.8a2 2 0 0 1-2 1.8H9.35a2 2 0 0 1-2-1.8L6.2 8Z"/><path d="M14.5 3.3 16 8" stroke-linecap="round"/><rect x="9.3" y="11" width="3" height="3" rx=".5"/>',
    "smoothies": '<path d="M8.2 4h7.6l-1.15 14.7a1.8 1.8 0 0 1-1.8 1.6h-1.7a1.8 1.8 0 0 1-1.8-1.6L8.2 4Z"/><path d="M8 4h8"/><path d="M12.5 1.3 14.5 4" stroke-linecap="round"/><circle cx="12" cy="9" r="1.6"/>',
    "mocktails": '<path d="M4.5 4.2h15L12.6 12v6.8"/><path d="M9.2 19.4h5.6" stroke-linecap="round"/><path d="M10.6 5.6c1-1.2 2.6-1.2 3 0" stroke-linecap="round"/>',
    "matcha-bar": '<path d="M4.2 10h15.6a7.9 7.9 0 0 1-7.8 9 7.9 7.9 0 0 1-7.8-9Z"/><path d="M9.3 10c0-3 1-4.9 2.9-6.4M12.4 10c0-3.3 1.1-5.2 2.9-6.9" stroke-linecap="round"/>',
    "milkshakes": '<path d="M6.6 9.2h10.8l-1.3 9.8a2 2 0 0 1-2 1.75H9.9a2 2 0 0 1-2-1.75L6.6 9.2Z"/><path d="M5.7 9.2c0-1.9 2.8-3.1 6.3-3.1s6.3 1.2 6.3 3.1"/><path d="M13 2.2l1.1 3.9" stroke-linecap="round"/>',
    "hot-drinks": '<path d="M3.3 11h11.9a4.6 4.6 0 0 1 4.6 4.6.9.9 0 0 1-.9.9h-1.1"/><path d="M3.3 11v2.6A5.4 5.4 0 0 0 8.7 19h2.6a5.4 5.4 0 0 0 5.4-5.4V11"/><path d="M8 7.8c0 .8-.9.8-.9 1.6s.9.8.9 1.6M11.4 7.8c0 .8-.9.8-.9 1.6s.9.8.9 1.6" stroke-linecap="round"/>',
    "iced-tea": '<path d="M7.3 4h9.4l-1.05 14.85A2 2 0 0 1 13.66 20.7h-3.3a2 2 0 0 1-2-1.85L7.3 4Z"/><path d="M15.3 1.3 16.7 4" stroke-linecap="round"/><path d="M8.5 10h7M8.85 14.3h6.3" stroke-linecap="round"/>',
    "dessert": '<path d="M4 19h16" stroke-linecap="round"/><path d="M4.3 19 12 5.2l7.7 13.8"/><path d="M12 5.2v4.3M8.6 19v-6.2M15.4 19v-6.2" stroke-linecap="round"/>',
    "breakfast": '<path d="M3.3 15.2c.7-6.1 4.6-10.4 8.9-10.4 2.6 0 4.6 1.6 4.6 3.6 0 1.7-1.5 2.2-3.6 1.5-2.4-.8-4.9-.6-6 1.3-1.1 1.9-.2 4 1.7 5.3-1 1.2-2.2 1.8-3.4 1.8-1.9 0-2.5-1.6-2.2-3.1Z"/>',
  };

  var activeCategory = MERY_MENU[0].id;
  var menuSearchQuery = "";

  function menuItemMatches(item, q) {
    var qLower = q.toLowerCase();
    return (item.fa && item.fa.indexOf(q) !== -1) ||
           (item.en && item.en.toLowerCase().indexOf(qLower) !== -1);
  }

  function buildMenuCard(item, categoryId, showPrices) {
    var li = document.createElement("li");
    li.className = "reveal is-in overflow-hidden rounded-xl border border-navy-900/10 bg-bone-50";

    var media = document.createElement("div");
    media.className = "aspect-square w-full overflow-hidden bg-navy-900/5";
    if (item.img) {
      var pic = picture(
        "assets/img/menu/" + item.img + ".webp",
        "assets/img/menu/" + item.img + ".jpg",
        item[lang] || item.en,
        "size-full object-cover",
        640, 640
      );
      media.appendChild(pic);
    } else {
      var iconBadge = document.createElement("div");
      iconBadge.className = "flex size-full items-center justify-center text-oak-ink/70";
      iconBadge.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" class="size-10">' +
        (MENU_ICONS[categoryId] || '<circle cx="12" cy="12" r="8"/>') + "</svg>";
      media.appendChild(iconBadge);
    }
    li.appendChild(media);

    var body = document.createElement("div");
    body.className = "p-3";

    var name = document.createElement("p");
    name.className = "text-navy-900";
    name.textContent = item[lang] || item.en;
    body.appendChild(name);

    if (item.signature) {
      var star = document.createElement("span");
      star.className =
        "mt-1 inline-block rounded-full bg-oak/20 px-2 py-0.5 text-[0.6875rem] text-oak-ink";
      star.textContent = t.menu.signature;
      body.appendChild(star);
    }

    if (item.promo) {
      var promo = document.createElement("span");
      promo.className =
        "mt-1 inline-flex items-center rounded-full bg-amber-soft px-2.5 py-0.5 text-[0.6875rem] font-semibold text-navy-900";
      promo.textContent = t.menu.signature;
      body.appendChild(promo);
    }

    var alt = document.createElement("p");
    alt.className = "alt-name mt-0.5 text-xs text-navy-900/50";
    alt.setAttribute("lang", lang === "fa" ? "en" : "fa");
    alt.setAttribute("dir", lang === "fa" ? "ltr" : "rtl");
    alt.textContent = lang === "fa" ? item.en : item.fa;
    body.appendChild(alt);

    if (showPrices) {
      var price = document.createElement("p");
      price.className = "tnum mt-1.5 text-sm text-navy-700";
      var p = formatPrice(item.price);
      if (p) {
        price.textContent = p;
      } else {
        price.textContent = t.menu.priceSoon;
        price.className += " text-navy-900/35";
      }
      body.appendChild(price);
    }

    li.appendChild(body);
    return li;
  }

  function renderMenu() {
    var tabs = $("#menuFilters");
    var panel = $("#menuGrid");
    if (!tabs || !panel) return;

    var showPrices = hasAnyPrice();
    var note = $("#priceNote");
    if (note) note.hidden = showPrices;

    var searching = menuSearchQuery.length > 0;

    /* category tabs — one category visible at a time */
    tabs.textContent = "";
    MERY_MENU.forEach(function (cat) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.dataset.cat = cat.id;
      var on = !searching && cat.id === activeCategory;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.textContent = cat.name[lang] || cat.name.en;

      b.className =
        "inline-flex shrink-0 cursor-pointer items-center rounded-full border px-5 py-2.5 text-sm whitespace-nowrap transition-colors " +
        (on
          ? "border-navy-700 bg-navy-700 text-bone"
          : "border-navy-700/20 text-navy-900/75 hover:border-navy-700/60 hover:text-navy-700");
      b.addEventListener("click", function () {
        activeCategory = cat.id;
        menuSearchQuery = "";
        var input = $("#menuSearch");
        if (input) input.value = "";
        var clearBtn = $("#menuSearchClear");
        if (clearBtn) clearBtn.hidden = true;
        renderMenu();
        var y = panel.getBoundingClientRect().top + window.scrollY - 190;
        window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
      });
      tabs.appendChild(b);
    });

    panel.textContent = "";
    var grid = document.createElement("ul");
    grid.className = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

    if (searching) {
      /* search results — flat, across every category */
      var matches = [];
      MERY_MENU.forEach(function (cat) {
        cat.items.forEach(function (item) {
          if (item.hidden) return;
          if (menuItemMatches(item, menuSearchQuery)) matches.push({ item: item, catId: cat.id });
        });
      });

      var header = document.createElement("div");
      header.className = "reveal is-in mb-8 text-center";
      var h2 = document.createElement("p");
      h2.className = "text-navy-900/60";
      h2.textContent = matches.length
        ? t.menu.searchResults(matches.length, menuSearchQuery)
        : t.menu.searchEmpty(menuSearchQuery);
      header.appendChild(h2);
      panel.appendChild(header);

      matches.forEach(function (m) {
        grid.appendChild(buildMenuCard(m.item, m.catId, showPrices));
      });
    } else {
      var cat = MERY_MENU.filter(function (c) { return c.id === activeCategory; })[0] || MERY_MENU[0];

      var catHeader = document.createElement("div");
      catHeader.className = "reveal is-in mb-8 flex flex-col items-center gap-4 text-center";
      var iconWrap = document.createElement("span");
      iconWrap.className = "inline-flex size-16 items-center justify-center rounded-full bg-oak/12 text-oak-ink";
      iconWrap.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="size-8">' +
        (MENU_ICONS[cat.id] || '<circle cx="12" cy="12" r="8"/>') + "</svg>";
      var titleWrap = document.createElement("div");
      var catH2 = document.createElement("p");
      catH2.className = "font-display text-2xl text-navy-700";
      catH2.textContent = cat.name[lang] || cat.name.en;
      titleWrap.appendChild(catH2);
      catHeader.appendChild(iconWrap);
      catHeader.appendChild(titleWrap);
      panel.appendChild(catHeader);

      cat.items.forEach(function (item) {
        if (item.hidden) return;
        grid.appendChild(buildMenuCard(item, cat.id, showPrices));
      });
    }

    panel.appendChild(grid);
    observeReveals(panel);
  }

  function wireMenuSearch() {
    var input = $("#menuSearch");
    var clearBtn = $("#menuSearchClear");
    if (!input || !clearBtn) return;

    var timer;
    input.addEventListener("input", function () {
      clearBtn.hidden = input.value.length === 0;
      clearTimeout(timer);
      timer = setTimeout(function () {
        menuSearchQuery = input.value.trim();
        renderMenu();
      }, 150);
    });

    clearBtn.addEventListener("click", function () {
      input.value = "";
      clearBtn.hidden = true;
      menuSearchQuery = "";
      renderMenu();
      input.focus();
    });
  }

  /* -- instagram ---------------------------------------------------------- */

  function picture(webp, jpg, alt, cls, w, h) {
    var pic = document.createElement("picture");
    var src = document.createElement("source");
    src.srcset = webp;
    src.type = "image/webp";
    var img = document.createElement("img");
    img.src = jpg;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = w;
    img.height = h;
    img.className = cls;
    pic.appendChild(src);
    pic.appendChild(img);
    return pic;
  }

  function renderGallery() {
    var ring = $("#storyRing");
    var grid = $("#postGrid");
    if (!ring || !grid) return;

    ring.textContent = "";
    grid.textContent = "";

    MERY_GALLERY.forEach(function (item, index) {
      var alt = item.alt[lang] || item.alt.en;

      /* --- story bubble --- */
      var li = document.createElement("li");
      li.className = "shrink-0";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "group flex w-24 cursor-pointer flex-col items-center gap-2.5 text-center";
      btn.addEventListener("click", function () { openViewer(index); });

      var rings = document.createElement("span");
      rings.className =
        "block rounded-full bg-gradient-to-tr from-oak via-amber to-amber-soft p-[2.5px] " +
        "transition-transform duration-300 group-hover:scale-105";

      var inner = document.createElement("span");
      inner.className = "block overflow-hidden rounded-full border-2 border-navy-950 size-20";
      inner.appendChild(
        picture(
          "assets/img/stories/" + item.slug + "-thumb.webp",
          "assets/img/stories/" + item.slug + "-thumb.jpg",
          "", "size-full object-cover", 240, 240
        )
      );
      rings.appendChild(inner);

      btn.appendChild(rings);
      li.appendChild(btn);
      ring.appendChild(li);

      /* --- post tile --- */
      if (item.post === false) return;

      var pli = document.createElement("li");
      pli.className = "reveal";
      pli.style.setProperty("--reveal-delay", Math.min(index, 8) * 45 + "ms");

      var pbtn = document.createElement("button");
      pbtn.type = "button";
      pbtn.className =
        "group relative block w-full cursor-pointer overflow-hidden rounded-xl bg-navy-900";
      pbtn.addEventListener("click", function () { openViewer(index); });

      pbtn.appendChild(
        picture(
          "assets/img/posts/" + item.slug + ".webp",
          "assets/img/posts/" + item.slug + ".jpg",
          alt,
          "aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105",
          640, 640
        )
      );

      pli.appendChild(pbtn);
      grid.appendChild(pli);
    });

    observeReveals(grid);
  }

  /* -- story viewer ------------------------------------------------------- */

  var viewer, viewerImg, viewerCaption, viewerStatus, viewerIndex = 0, lastFocus = null;

  function openViewer(index) {
    viewerIndex = index;
    lastFocus = document.activeElement;
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
    paintViewer();
    $("#viewerClose").focus();
    document.addEventListener("keydown", onViewerKey);
  }

  function closeViewer() {
    viewer.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onViewerKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stepViewer(delta) {
    var n = MERY_GALLERY.length;
    viewerIndex = (viewerIndex + delta + n) % n;
    paintViewer();
  }

  function paintViewer() {
    var item = MERY_GALLERY[viewerIndex];
    viewerImg.src = "assets/img/stories/" + item.slug + ".jpg";
    viewerImg.alt = item.alt[lang] || item.alt.en;
    viewerCaption.textContent = item.caption[lang] || item.caption.en;
    viewerStatus.textContent = t.ig.counter(digits(viewerIndex + 1), digits(MERY_GALLERY.length));
  }

  function onViewerKey(e) {
    if (e.key === "Escape") { closeViewer(); return; }
    // arrows follow reading direction
    var rtl = document.documentElement.getAttribute("dir") === "rtl";
    if (e.key === "ArrowRight") stepViewer(rtl ? -1 : 1);
    if (e.key === "ArrowLeft")  stepViewer(rtl ?  1 : -1);
    if (e.key === "Tab") {
      var f = $$("button", viewer).filter(function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* Wiring is guarded on #storyViewer's presence, unlike the rest of this
     block, because init() calls this before any other page content loads —
     a page without the story-viewer markup (e.g. /comments) must not crash
     init() and take every other feature on the page down with it. */
  function wireViewer() {
    viewer        = $("#storyViewer");
    viewerImg     = $("#viewerImg");
    viewerCaption = $("#viewerCaption");
    viewerStatus  = $("#viewerStatus");
    if (!viewer) return;

    $("#viewerClose").addEventListener("click", closeViewer);
    $("#viewerPrev").addEventListener("click", function () { stepViewer(-1); });
    $("#viewerNext").addEventListener("click", function () { stepViewer(1); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) closeViewer(); });
  }

  /* -- reveal on scroll ---------------------------------------------------- */

  var revealObserver = null;

  /* Belt-and-suspenders: IntersectionObserver is the primary trigger, but a
     browser extension, a slow/blocked observer callback, or any other
     unforeseen failure must never leave real content permanently invisible
     (opacity:0 forever). A plain getBoundingClientRect() sweep — run right
     after observing and on every scroll — catches anything the observer
     misses, without disturbing the normal scroll-triggered fade-in. */
  function isInViewport(n) {
    var r = n.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh * 1.15;
  }

  function sweepReveals() {
    $$(".reveal:not(.is-in)").forEach(function (n) {
      if (isInViewport(n)) {
        n.classList.add("is-in");
        if (revealObserver) revealObserver.unobserve(n);
      }
    });
  }

  var sweepScheduled = false;
  function scheduleSweep() {
    if (sweepScheduled) return;
    sweepScheduled = true;
    requestAnimationFrame(function () { sweepScheduled = false; sweepReveals(); });
  }

  function observeReveals(root) {
    var nodes = $$(".reveal", root || document).filter(function (n) {
      return !n.classList.contains("is-in");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            revealObserver.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

      window.addEventListener("scroll", scheduleSweep, { passive: true });
      window.addEventListener("resize", scheduleSweep);
    }
    nodes.forEach(function (n) { revealObserver.observe(n); });

    /* immediate catch-up for anything already on screen right now */
    scheduleSweep();
    setTimeout(sweepReveals, 1200);
  }

  /* -- header + nav -------------------------------------------------------- */

  function wireChrome() {
    var header = $("#siteHeader");
    // The header starts transparent so it blends into the hero video, then
    // solidifies on scroll. Pages with no hero (e.g. /comments) have nothing
    // dark for a transparent header to blend into, so keep it solid always.
    var hasHero = !!$("#top");
    var onScroll = function () {
      var solid = !hasHero || window.scrollY > 40;
      header.classList.toggle("bg-navy-950/85", solid);
      header.classList.toggle("backdrop-blur-xl", solid);
      header.classList.toggle("border-bone/10", solid);
      header.classList.toggle("border-transparent", !solid);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = $("#navToggle");
    var nav = $("#mobileNav");
    toggle.addEventListener("click", function () {
      var open = nav.hidden;
      nav.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? t.nav.closeMenu : t.nav.openMenu);
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", t.nav.openMenu);
      });
    });

    $("#langToggle").addEventListener("click", function () {
      applyLanguage(lang === "fa" ? "en" : "fa");
    });
  }

  /* -- looping footage: reduced-motion default + a pause control ----------- */

  function wireVideo() {
    var videos = $$("video");
    var btn = $("#videoToggle");
    var iPause = $("#videoIconPause");
    var iPlay = $("#videoIconPlay");
    if (!btn) return;

    /* Someone who asked the system for less motion should not be handed an
       autoplaying loop; they get the poster frame and can opt in. */
    var paused = reduceMotion;

    function paint() {
      videos.forEach(function (v) {
        if (paused) { v.pause(); }
        else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
      iPause.classList.toggle("hidden", paused);
      iPlay.classList.toggle("hidden", !paused);
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      btn.setAttribute("aria-label", paused ? t.hero.playVideo : t.hero.pauseVideo);
    }

    if (reduceMotion) {
      videos.forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
    }
    paint();

    btn.addEventListener("click", function () { paused = !paused; paint(); });
    langHooks.push(paint);
  }

  /* -- customer club signup form -------------------------------------------- */

  function wireClub() {
    var form = $("#clubForm");
    if (!form) return;

    var fields = $("#clubFields");
    var message = $("#clubMessage");
    var submitBtn = $("#clubSubmit");
    var submitLabel = $("#clubSubmitLabel");
    var loadedAtInput = $("#clubFormLoadedAt");
    var IRAN_MOBILE = /^09\d{9}$/;

    loadedAtInput.value = String(Date.now());

    /* last outcome, kept so a language toggle can re-render the same
       message (success or error) without another round trip */
    var lastOutcome = null;

    function formatExpiry(iso) {
      var d = new Date(iso);
      try {
        return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US", {
          year: "numeric", month: "long", day: "numeric",
        });
      } catch (e) {
        return d.toISOString().slice(0, 10);
      }
    }

    function renderMessage() {
      message.innerHTML = "";
      if (!lastOutcome) return;

      if (lastOutcome.type === "success") {
        fields.classList.add("hidden");

        var wrap = document.createElement("div");
        wrap.className = "rounded-lg border border-oak/30 bg-amber/10 p-4";

        var title = document.createElement("p");
        title.className = "font-medium text-navy-900";
        title.textContent = t.club.successTitle;

        var body = document.createElement("p");
        body.className = "mt-1 text-sm text-navy-900/75";
        body.textContent = t.club.successBody(lastOutcome.description, formatExpiry(lastOutcome.expiresAt));

        var again = document.createElement("button");
        again.type = "button";
        again.className = "btn btn-outline mt-4 border-navy-900/25! text-navy-900! hover:border-oak! hover:text-oak!";
        again.textContent = t.club.joinAnother;
        again.addEventListener("click", function () {
          lastOutcome = null;
          form.reset();
          loadedAtInput.value = String(Date.now());
          fields.classList.remove("hidden");
          renderMessage();
        });

        wrap.appendChild(title);
        wrap.appendChild(body);
        wrap.appendChild(again);
        message.appendChild(wrap);
      } else if (lastOutcome.type === "error") {
        var errP = document.createElement("p");
        errP.className = "text-sm text-red-700";
        errP.textContent = (t.club.errors[lastOutcome.code]) || lastOutcome.fallback || t.club.errors.generic;
        message.appendChild(errP);
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitLabel.textContent = t.club.submitting;
      lastOutcome = null;
      renderMessage();

      fetch("/api/club/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: $("#clubName").value,
          phone: $("#clubPhone").value,
          website: $("#clubWebsite").value,
          formLoadedAt: Number(loadedAtInput.value),
        }),
      })
        .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
        .then(function (res) {
          if (res.data.ok) {
            lastOutcome = { type: "success", description: res.data.reward.description, expiresAt: res.data.reward.expiresAt };
          } else {
            lastOutcome = { type: "error", code: res.data.code, fallback: res.data.error };
          }
          renderMessage();
        })
        .catch(function () {
          lastOutcome = { type: "error", code: "network" };
          renderMessage();
        })
        .then(function () {
          submitBtn.disabled = false;
          submitLabel.textContent = t.club.submit;
        });
    });

    /* client-side hint only — the server is the real gatekeeper */
    $("#clubPhone").addEventListener("blur", function () {
      var v = this.value.trim();
      if (v && !IRAN_MOBILE.test(v)) {
        this.setCustomValidity(t.club.errors.invalid_phone);
      } else {
        this.setCustomValidity("");
      }
    });

    langHooks.push(renderMessage);
  }

  /* -- reviews & suggestions: shared helpers ---------------------------------
     Shared by the homepage carousel (wireReviewsCarousel), the /comments full
     grid (wireCommentsGrid), and the submission modal (wireReviewSubmitModal).
     Any one of the three can be absent depending on which page is loaded, so
     nothing here assumes the others are wired. */

  var HEART_OUTLINE =
    '<svg class="size-4 fill-none stroke-current" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s-7.5-4.6-10-9.1C.4 8.6 2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5 18 5 19.6 8.6 22 11.9 19.5 16.4 12 21 12 21z"/></svg>';
  var HEART_FILLED =
    '<svg class="size-4 fill-amber" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s-7.5-4.6-10-9.1C.4 8.6 2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5 18 5 19.6 8.6 22 11.9 19.5 16.4 12 21 12 21z"/></svg>';

  /* re-fetch hooks for whichever review view(s) are wired on this page, run
     after a successful submission from the shared modal */
  var reviewSubmittedHooks = [];

  function getFingerprint() {
    var KEY = "mery.reviewFingerprint";
    try {
      var v = localStorage.getItem(KEY);
      if (v) return v;
      v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("fp-" + Date.now() + "-" + Math.random().toString(36).slice(2));
      localStorage.setItem(KEY, v);
      return v;
    } catch (e) {
      return "fp-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    }
  }

  var REACTED_KEY = "mery.reactedReviewIds";
  function loadReactedSet() {
    try {
      var raw = localStorage.getItem(REACTED_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (e) { return new Set(); }
  }
  function saveReactedSet() {
    try { localStorage.setItem(REACTED_KEY, JSON.stringify(Array.from(reactedSet))); } catch (e) { /* private mode */ }
  }
  var reactedSet = loadReactedSet();

  function formatRelative(s) {
    // SQLite's datetime('now') yields "YYYY-MM-DD HH:MM:SS" (UTC, no offset marker)
    var d = new Date(String(s).replace(" ", "T") + "Z");
    var diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays <= 0) return t.reviews.today;
    if (diffDays === 1) return t.reviews.yesterday;
    return t.reviews.daysAgo(digits(diffDays));
  }

  /* review text is user-submitted — always set via textContent, never innerHTML */
  function buildReviewCard(review, rank) {
    var card = document.createElement("div");
    card.className = "reviews-card";

    var top = document.createElement("div");
    top.className = "mb-4 flex items-start justify-between gap-4";

    var quote = document.createElement("span");
    quote.setAttribute("aria-hidden", "true");
    quote.innerHTML = '<svg class="h-[26px] w-9 fill-amber/90" viewBox="0 0 48 36"><path d="M0 36V20.7C0 9.3 6.9 1.7 18.4 0l1.8 5.4C13 7 9.8 11 9.8 16.6h9.6V36H0zm27.6 0V20.7C27.6 9.3 34.5 1.7 46 0l1.8 5.4c-7.2 1.6-10.4 5.6-10.4 11.2h9.6V36H27.6z"/></svg>';
    top.appendChild(quote);

    var badge = document.createElement("span");
    badge.className = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-soft px-3 py-1.5 text-xs font-semibold text-navy-900";
    badge.innerHTML = '<svg class="size-3 fill-navy-900" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7L5.8 21l1.6-7-5.4-4.8 7.1-.7z"/></svg>';
    var badgeText = document.createElement("span");
    badgeText.textContent = t.reviews.rankBadge(digits(rank));
    badge.appendChild(badgeText);
    top.appendChild(badge);
    card.appendChild(top);

    var body = document.createElement("p");
    body.className = "mb-7 line-clamp-6 font-display text-[clamp(1.15rem,2.4vw,1.4rem)] leading-snug text-bone-50";
    body.textContent = review.body;
    card.appendChild(body);

    var bottom = document.createElement("div");
    bottom.className = "flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-5";

    var person = document.createElement("div");
    person.className = "flex items-center gap-3";

    var avatar = document.createElement("div");
    avatar.className = "flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-soft text-base font-bold text-navy-900";
    avatar.textContent = (review.display_name || "").trim().charAt(0) || "?";
    person.appendChild(avatar);

    var info = document.createElement("div");
    var nameEl = document.createElement("p");
    nameEl.className = "text-sm font-semibold text-bone-50";
    nameEl.textContent = review.display_name;
    info.appendChild(nameEl);

    var metaEl = document.createElement("p");
    metaEl.className = "mt-0.5 text-xs text-bone-300";
    var metaParts = [formatRelative(review.created_at), t.reviews.memberLabel];
    if (review.item_tag) metaParts.push(review.item_tag);
    metaEl.textContent = metaParts.join(" · ");
    info.appendChild(metaEl);

    person.appendChild(info);
    bottom.appendChild(person);

    var reacted = reactedSet.has(review.id);
    var reactBtn = document.createElement("button");
    reactBtn.type = "button";
    reactBtn.className = "reaction-btn inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-sm tabular-nums text-bone-300 transition-colors hover:text-amber disabled:cursor-default disabled:hover:text-bone-300";
    reactBtn.setAttribute("data-react-id", String(review.id));
    reactBtn.setAttribute("aria-label", t.reviews.reactAria);
    reactBtn.setAttribute("aria-pressed", reacted ? "true" : "false");
    if (reacted) reactBtn.disabled = true;

    var heartWrap = document.createElement("span");
    heartWrap.className = "reaction-heart inline-flex";
    heartWrap.innerHTML = reacted ? HEART_FILLED : HEART_OUTLINE;
    reactBtn.appendChild(heartWrap);

    var countEl = document.createElement("span");
    countEl.className = "reaction-count";
    countEl.textContent = digits(review.reaction_count);
    reactBtn.appendChild(countEl);

    bottom.appendChild(reactBtn);
    card.appendChild(bottom);

    return card;
  }

  /* shared POST handler for the heart/reaction button, used by both the
     carousel and the /comments grid — same endpoint, same counter either way */
  function sendReaction(id, btn, onUpdated) {
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    fetch("/api/reviews/" + id + "/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ fingerprint: getFingerprint() }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) { btn.disabled = false; return; }
        reactedSet.add(id);
        saveReactedSet();
        btn.setAttribute("aria-pressed", "true");
        var countEl = btn.querySelector(".reaction-count");
        if (countEl) countEl.textContent = digits(data.reactionCount);
        var heartWrap = btn.querySelector(".reaction-heart");
        if (heartWrap) heartWrap.innerHTML = HEART_FILLED;
        if (onUpdated) onUpdated(data.reactionCount);
      })
      .catch(function () { btn.disabled = false; });
  }

  /* -- reviews & suggestions: homepage carousel ------------------------------ */

  function wireReviewsCarousel() {
    var stageEl = $("#reviewsStage");
    if (!stageEl) return;

    var navEl = $("#reviewsNav");
    var dotsEl = $("#reviewsDots");
    var prevBtn = $("#reviewsPrev");
    var nextBtn = $("#reviewsNext");

    var reviews = [];
    var current = 0;
    var isAnimating = false;
    var timer = null;
    var cardEl = null;
    var stageState = "loading";

    function renderDots() {
      dotsEl.innerHTML = "";
      reviews.forEach(function (r, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "reviews-dot" + (i === current ? " active" : "");
        dot.setAttribute("aria-label", t.reviews.dotAria(digits(i + 1)));
        dot.addEventListener("click", function () {
          if (i === current) return;
          goTo(i, i > current ? "next" : "prev");
        });
        dotsEl.appendChild(dot);
      });
    }

    function renderStatus(key) {
      navEl.hidden = true;
      stageEl.innerHTML = "";
      var p = document.createElement("p");
      p.id = "reviewsStatus";
      p.className = "rounded-2xl border border-navy-900/10 bg-bone px-6 py-16 text-center text-navy-900/60";
      p.textContent = t.reviews[key];
      stageEl.appendChild(p);
    }

    function restartAutoplay() {
      if (reduceMotion || reviews.length <= 1) return;
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1, "next"); }, 6000);
    }

    function renderReviews() {
      if (!reviews.length) { stageState = "empty"; renderStatus("empty"); return; }
      stageState = "ready";
      current = Math.min(current, reviews.length - 1);
      stageEl.innerHTML = "";
      cardEl = buildReviewCard(reviews[current], current + 1);
      stageEl.appendChild(cardEl);
      renderDots();
      navEl.hidden = reviews.length <= 1;
      restartAutoplay();
    }

    // direction 'next' = incoming card enters from the right, outgoing exits left.
    // direction 'prev' = incoming card enters from the left, outgoing exits right.
    function goTo(newIndexRaw, direction) {
      if (!reviews.length) return;
      var newIndex = (newIndexRaw + reviews.length) % reviews.length;
      if (isAnimating || newIndex === current) return;
      current = newIndex;
      renderDots();
      restartAutoplay();

      if (reduceMotion) {
        var plain = buildReviewCard(reviews[current], current + 1);
        cardEl.replaceWith(plain);
        cardEl = plain;
        return;
      }

      isAnimating = true;
      var rect = stageEl.getBoundingClientRect();
      stageEl.style.height = rect.height + "px";

      var oldCard = cardEl;
      oldCard.classList.add("is-sliding");

      var newCard = buildReviewCard(reviews[current], current + 1);
      newCard.classList.add("is-sliding");
      newCard.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
      newCard.style.opacity = "0";
      stageEl.appendChild(newCard);

      // force reflow so the starting transform is committed before we animate
      newCard.getBoundingClientRect();

      requestAnimationFrame(function () {
        oldCard.style.transition = "transform .45s cubic-bezier(.22,.61,.36,1), opacity .45s ease";
        newCard.style.transition = "transform .45s cubic-bezier(.22,.61,.36,1), opacity .45s ease";
        oldCard.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
        oldCard.style.opacity = "0";
        newCard.style.transform = "translateX(0)";
        newCard.style.opacity = "1";
      });

      function settle() {
        newCard.removeEventListener("transitionend", settle);
        oldCard.remove();
        newCard.classList.remove("is-sliding");
        newCard.style.transform = "";
        newCard.style.opacity = "";
        newCard.style.transition = "";
        stageEl.style.height = "";
        cardEl = newCard;
        isAnimating = false;
      }
      newCard.addEventListener("transitionend", settle);
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1, "prev"); });
    nextBtn.addEventListener("click", function () { goTo(current + 1, "next"); });
    stageEl.addEventListener("mouseenter", function () { clearInterval(timer); });
    stageEl.addEventListener("mouseleave", restartAutoplay);

    /* reactions are delegated on the stage since cardEl gets replaced on every slide */
    stageEl.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-react-id]") : null;
      if (!btn || btn.disabled) return;
      var id = Number(btn.getAttribute("data-react-id"));
      sendReaction(id, btn, function (count) {
        var reviewData = reviews.filter(function (r) { return r.id === id; })[0];
        if (reviewData) reviewData.reaction_count = count;
      });
    });

    function fetchTop8() {
      fetch("/api/reviews/top8", { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.ok) throw new Error("bad response");
          reviews = data.reviews || [];
          current = 0;
          renderReviews();
        })
        .catch(function () { stageState = "loadError"; renderStatus("loadError"); });
    }

    langHooks.push(function () {
      if (stageState === "ready" && reviews.length) {
        stageEl.innerHTML = "";
        cardEl = buildReviewCard(reviews[current], current + 1);
        stageEl.appendChild(cardEl);
        renderDots();
      } else if (stageState !== "loading") {
        renderStatus(stageState);
      }
    });

    reviewSubmittedHooks.push(fetchTop8); // a fresh submission doesn't crack the top 8 (12h cache), but keep data current

    fetchTop8();
  }

  /* -- reviews & suggestions: full /comments grid ---------------------------- */

  function wireCommentsGrid() {
    var gridEl = $("#commentsGrid");
    if (!gridEl) return;

    var reviews = [];
    var gridState = "loading";

    function renderStatus(key) {
      gridEl.innerHTML = "";
      var p = document.createElement("p");
      p.className = "col-span-full rounded-2xl border border-navy-900/10 bg-bone px-6 py-16 text-center text-navy-900/60";
      p.textContent = t.reviews[key];
      gridEl.appendChild(p);
    }

    function renderGrid() {
      if (!reviews.length) { gridState = "empty"; renderStatus("empty"); return; }
      gridState = "ready";
      gridEl.innerHTML = "";
      reviews.forEach(function (review, i) {
        gridEl.appendChild(buildReviewCard(review, i + 1));
      });
    }

    gridEl.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-react-id]") : null;
      if (!btn || btn.disabled) return;
      var id = Number(btn.getAttribute("data-react-id"));
      sendReaction(id, btn, function (count) {
        var reviewData = reviews.filter(function (r) { return r.id === id; })[0];
        if (reviewData) reviewData.reaction_count = count;
      });
    });

    function fetchAll() {
      fetch("/api/reviews", { credentials: "same-origin" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.ok) throw new Error("bad response");
          reviews = data.reviews || [];
          renderGrid();
        })
        .catch(function () { gridState = "loadError"; renderStatus("loadError"); });
    }

    langHooks.push(function () {
      if (gridState === "ready" && reviews.length) {
        renderGrid();
      } else if (gridState !== "loading") {
        renderStatus(gridState);
      }
    });

    reviewSubmittedHooks.push(fetchAll);

    fetchAll();
  }

  /* -- reviews & suggestions: submission modal --------------------------------
     Shared by the homepage carousel and the /comments grid — both pages ship
     the same #reviewModal markup and open it via the same #reviewOpenModal
     button, so this wires whichever one of the two pages happens to be loaded. */

  function wireReviewSubmitModal() {
    var modal = $("#reviewModal");
    if (!modal) return;

    var openModalBtn = $("#reviewOpenModal");
    var modalClose = $("#reviewModalClose");
    var steps = {
      phone: $("#reviewStepPhone"),
      notMember: $("#reviewStepNotMember"),
      form: $("#reviewStepForm"),
      success: $("#reviewStepSuccess"),
    };
    var phoneForm = $("#reviewPhoneForm");
    var phoneInput = $("#reviewPhone");
    var phoneSubmitBtn = $("#reviewPhoneSubmit");
    var phoneSubmitLabel = $("#reviewPhoneSubmitLabel");
    var phoneMsg = $("#reviewPhoneMsg");
    var tryAnotherBtn = $("#reviewTryAnother");
    var joinLink = $("#reviewJoinLink");
    var reviewForm = $("#reviewForm");
    var displayNameInput = $("#reviewDisplayName");
    var itemTagInput = $("#reviewItemTag");
    var bodyInput = $("#reviewBody");
    var websiteInput = $("#reviewWebsite");
    var formLoadedAtInput = $("#reviewFormLoadedAt");
    var formMsg = $("#reviewFormMsg");
    var formSubmitBtn = $("#reviewFormSubmit");
    var formSubmitLabel = $("#reviewFormSubmitLabel");
    var doneBtn = $("#reviewModalDone");

    var verifiedPhone = null;
    var lastFocusBeforeModal = null;

    var modalTitle = $("#reviewModalTitle");
    function showStep(name) {
      Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== name; });
      // keep the dialog's accessible name (sr-only, aria-labelledby target) in
      // sync with whichever step is visible — it doesn't update on its own
      var heading = steps[name].querySelector(".font-display");
      if (modalTitle && heading) modalTitle.textContent = heading.textContent;
    }

    function populateItemDatalist() {
      var datalist = $("#reviewMenuItems");
      if (!datalist || typeof MERY_MENU === "undefined") return;
      var seen = {};
      datalist.innerHTML = "";
      MERY_MENU.forEach(function (cat) {
        cat.items.forEach(function (item) {
          var name = item[lang] || item.en;
          if (!name || seen[name]) return;
          seen[name] = true;
          var opt = document.createElement("option");
          opt.value = name;
          datalist.appendChild(opt);
        });
      });
    }

    function onModalKey(e) {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;
      var focusables = $$("button, input, a[href], textarea", modal).filter(function (el) {
        return el.offsetParent !== null && !el.disabled;
      });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function openModal() {
      lastFocusBeforeModal = document.activeElement;
      verifiedPhone = null;
      phoneForm.reset();
      phoneMsg.innerHTML = "";
      showStep("phone");
      populateItemDatalist();
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onModalKey);
      phoneInput.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onModalKey);
      if (lastFocusBeforeModal && lastFocusBeforeModal.focus) lastFocusBeforeModal.focus();
    }

    openModalBtn.addEventListener("click", openModal);
    modalClose.addEventListener("click", closeModal);
    doneBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    joinLink.addEventListener("click", closeModal);

    tryAnotherBtn.addEventListener("click", function () {
      showStep("phone");
      phoneForm.reset();
      phoneMsg.innerHTML = "";
      phoneInput.focus();
    });

    function showMsg(container, text) {
      container.innerHTML = "";
      var p = document.createElement("p");
      p.className = "text-sm text-red-700";
      p.textContent = text;
      container.appendChild(p);
    }

    phoneForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (phoneSubmitBtn.disabled) return;
      phoneMsg.innerHTML = "";
      phoneSubmitBtn.disabled = true;
      phoneSubmitLabel.textContent = t.reviews.form.checking;

      fetch("/api/reviews/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone: phoneInput.value }),
      })
        .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
        .then(function (res) {
          if (res.data.ok) {
            verifiedPhone = phoneInput.value.trim();
            formLoadedAtInput.value = String(Date.now());
            reviewForm.reset();
            formMsg.innerHTML = "";
            showStep("form");
            displayNameInput.focus();
          } else if (res.data.code === "not_member") {
            showStep("notMember");
          } else {
            showMsg(phoneMsg, (t.reviews.form.errors[res.data.code]) || res.data.error || t.reviews.form.errors.generic);
          }
        })
        .catch(function () { showMsg(phoneMsg, t.reviews.form.errors.network); })
        .then(function () {
          phoneSubmitBtn.disabled = false;
          phoneSubmitLabel.textContent = t.reviews.form.continueBtn;
        });
    });

    reviewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formSubmitBtn.disabled) return;
      formMsg.innerHTML = "";
      formSubmitBtn.disabled = true;
      formSubmitLabel.textContent = t.reviews.form.submitting;

      fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          phone: verifiedPhone,
          displayName: displayNameInput.value,
          body: bodyInput.value,
          itemTag: itemTagInput.value,
          website: websiteInput.value,
          formLoadedAt: Number(formLoadedAtInput.value),
        }),
      })
        .then(function (r) { return r.json().then(function (data) { return { status: r.status, data: data }; }); })
        .then(function (res) {
          if (res.data.ok) {
            showStep("success");
            reviewSubmittedHooks.forEach(function (fn) { fn(); });
          } else if (res.data.code === "not_member") {
            showStep("notMember");
          } else {
            showMsg(formMsg, (t.reviews.form.errors[res.data.code]) || res.data.error || t.reviews.form.errors.generic);
          }
        })
        .catch(function () { showMsg(formMsg, t.reviews.form.errors.network); })
        .then(function () {
          formSubmitBtn.disabled = false;
          formSubmitLabel.textContent = t.reviews.form.submit;
        });
    });
  }

  /* -- boot ---------------------------------------------------------------- */

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }

    /* One misbehaving step (a missing element, a third-party interference)
       must not stop the rest of the page from initializing — most critically,
       observeReveals must always run or content stays invisible forever. */
    function safe(fn) {
      try { fn(); } catch (e) { if (window.console) console.error(e); }
    }

    safe(wireConfig);
    safe(function () { applyLanguage(saved === "en" ? "en" : "fa"); });
    safe(wireChrome);
    safe(wireVideo);
    safe(wireViewer);
    safe(wireClub);
    safe(wireReviewsCarousel);
    safe(wireReviewSubmitModal);
    safe(wireCommentsGrid);
    safe(wireMenuSearch);
    safe(function () { observeReveals(document); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
