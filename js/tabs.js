/*
 * Tabs for taetae.ca: every <section class="page" id="..."> is its own page.
 * The URL hash picks the page (#about, #weather, ...), so the back button and
 * direct links work. Without JS all the pages just show, stacked.
 */
(() => {
  "use strict";

  const pages = Array.from(document.querySelectorAll(".page"));
  const links = Array.from(document.querySelectorAll(".tabs a"));
  if (!pages.length) return;

  const FIRST = pages[0].id;
  const BASE_TITLE = document.title;
  const SHORT_TITLE = BASE_TITLE.split(" | ")[0]; // "Tae.py" from "Tae.py | Portfolio, Montréal"
  let current = "";

  function pageFromHash() {
    let id = "";
    try {
      id = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    } catch (e) {
      /* malformed hash, fall back to the first page */
    }
    return pages.some((p) => p.id === id) ? id : FIRST;
  }

  function show(id) {
    if (id === current) return;
    current = id;

    let active = null;
    for (const page of pages) {
      const on = page.id === id;
      page.classList.toggle("active", on);
      if (on) active = page;
    }
    for (const link of links) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    document.title = id === FIRST ? BASE_TITLE : id + " | " + SHORT_TITLE;
    window.scrollTo(0, 0);

    // retype this page's heading each time its tab opens (instances come from script.js)
    (window.typers || []).forEach((t) => {
      if (t.el && active.contains(t.el)) t.restart();
    });
  }

  window.addEventListener("hashchange", () => show(pageFromHash()));
  show(pageFromHash());

  // keep the page height math (footer sits at the bottom) in sync with the sticky header
  const header = document.querySelector("header");
  if (header) {
    const setHeaderHeight = () =>
      document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    setHeaderHeight();
    if ("ResizeObserver" in window) new ResizeObserver(setHeaderHeight).observe(header);
    else window.addEventListener("resize", setHeaderHeight);
  }
})();
