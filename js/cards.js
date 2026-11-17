/*
 * Card drawer for taetae.ca
 * Draws one card at a time from a shuffled deck, never repeating, until you reset.
 *
 * Mount point:  <div id="cards-app" data-jokers="2"></div>
 *   data-jokers = 0, 1 or 2 (default 2, i.e. a standard 54-card deck)
 *
 * Wrapped in an IIFE so it can't collide with the globals in script.js.
 */
(() => {
  "use strict";

  const app = document.getElementById("cards-app");
  if (!app) return;
  app.textContent = ""; // clears the "loading..." placeholder from index.html

  /* ---------- deck ---------- */

  const SUITS = [
    { key: "spades", name: "Spades", red: false },
    { key: "hearts", name: "Hearts", red: true },
    { key: "diamonds", name: "Diamonds", red: true },
    { key: "clubs", name: "Clubs", red: false },
  ];

  const RANKS = [
    ["A", "Ace"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
    ["8", "8"], ["9", "9"], ["10", "10"], ["J", "Jack"], ["Q", "Queen"], ["K", "King"],
  ];

  const parsedJokers = parseInt(app.dataset.jokers, 10);
  const JOKERS = Number.isNaN(parsedJokers) ? 2 : Math.max(0, Math.min(2, parsedJokers));

  function buildDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const [rank, word] of RANKS) {
        deck.push({
          kind: "suit",
          rank,
          suit: suit.key,
          red: suit.red,
          label: word + " of " + suit.name,
        });
      }
    }
    for (let i = 0; i < JOKERS; i++) {
      const red = i === 0;
      deck.push({ kind: "joker", red, label: red ? "Red Joker" : "Black Joker" });
    }
    return deck;
  }

  // Unbiased random integer in [0, n). Uses the browser's CSPRNG when available.
  function randInt(n) {
    const c = window.crypto;
    if (c && c.getRandomValues) {
      const limit = 0x100000000 - (0x100000000 % n);
      const buf = new Uint32Array(1);
      do {
        c.getRandomValues(buf);
      } while (buf[0] >= limit);
      return buf[0] % n;
    }
    return Math.floor(Math.random() * n);
  }

  let remaining = buildDeck();
  const TOTAL = remaining.length;

  /* ---------- artwork (inline SVG sprite, so suits look the same everywhere) ---------- */

  function starPoints(cx, cy, outer, inner) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(" ");
  }

  // Each shape is inlined into its own <svg> (not a <use> sprite): style.css sets
  // `color` on every element, which would turn sprite shapes white. Inline shapes
  // pick up the card's ink color from the reset in cards.css instead.
  const SHAPES = {
    hearts: '<path fill="currentColor" d="M50 92C18 66 4 46 4 30C4 14 16 6 28 6C38 6 46 12 50 22C54 12 62 6 72 6C84 6 96 14 96 30C96 46 82 66 50 92Z"/>',
    diamonds: '<path fill="currentColor" d="M50 3L91 50L50 97L9 50Z"/>',
    spades: '<path fill="currentColor" d="M50 4C50 4 8 38 8 62C8 78 20 86 32 86C40 86 46 82 48 76C48 86 44 92 36 96L64 96C56 92 52 86 52 76C54 82 60 86 68 86C80 86 92 78 92 62C92 38 50 4 50 4Z"/>',
    clubs: '<g fill="currentColor"><circle cx="50" cy="27" r="22"/><circle cx="26" cy="62" r="22"/><circle cx="74" cy="62" r="22"/><path d="M44 56C46 76 44 88 36 96L64 96C56 88 54 76 56 56Z"/></g>',
    star: '<polygon fill="currentColor" points="' + starPoints(50, 53, 46, 19) + '"/>',
  };

  const icon = (key, cls, style) =>
    '<svg class="' + cls + '" viewBox="0 0 100 100"' + (style ? ' style="' + style + '"' : "") +
    ' aria-hidden="true" focusable="false">' + SHAPES[key] + "</svg>";

  // Pip positions (x%, y%) for 2-10, laid out like a real deck. Pips in the lower half are flipped.
  const L = 35, C = 50, R = 65;
  const PIPS = {
    "2": [[C, 17], [C, 83]],
    "3": [[C, 17], [C, 50], [C, 83]],
    "4": [[L, 17], [R, 17], [L, 83], [R, 83]],
    "5": [[L, 17], [R, 17], [C, 50], [L, 83], [R, 83]],
    "6": [[L, 17], [R, 17], [L, 50], [R, 50], [L, 83], [R, 83]],
    "7": [[L, 17], [R, 17], [C, 33.5], [L, 50], [R, 50], [L, 83], [R, 83]],
    "8": [[L, 17], [R, 17], [C, 33.5], [L, 50], [R, 50], [C, 66.5], [L, 83], [R, 83]],
    "9": [[L, 17], [R, 17], [L, 39], [R, 39], [C, 50], [L, 61], [R, 61], [L, 83], [R, 83]],
    "10": [[L, 17], [R, 17], [C, 28], [L, 39], [R, 39], [L, 61], [R, 61], [C, 72], [L, 83], [R, 83]],
  };

  function suitFaceHTML(card) {
    const corner = (pos) =>
      '<div class="pc-corner pc-' + pos + '"><span class="pc-rank">' + card.rank + "</span>" +
      icon(card.suit, "pc-suit") + "</div>";

    let middle;
    if (card.rank === "A") {
      middle = icon(card.suit, "pc-pip pc-ace", "left:50%;top:50%");
    } else if (PIPS[card.rank]) {
      middle = PIPS[card.rank]
        .map(([x, y]) => icon(card.suit, "pc-pip" + (y > 50 ? " pc-flip" : ""), "left:" + x + "%;top:" + y + "%"))
        .join("");
    } else {
      middle =
        '<div class="pc-royal">' +
        icon(card.suit, "pc-royal-pip pc-royal-top") +
        '<span class="pc-royal-letter">' + card.rank + "</span>" +
        icon(card.suit, "pc-royal-pip pc-royal-bottom") +
        "</div>";
    }
    return corner("tl") + middle + corner("br");
  }

  function jokerFaceHTML() {
    const corner = (pos) =>
      '<div class="pc-corner pc-' + pos + ' pc-jk-corner"><span class="pc-jk-text">JOKER</span>' +
      icon("star", "pc-suit") + "</div>";
    return corner("tl") + icon("star", "pc-pip pc-joker-star", "left:50%;top:50%") + corner("br");
  }

  /* ---------- page UI ---------- */

  app.insertAdjacentHTML(
    "beforeend",
    '<div class="pc-card" role="button" tabindex="0" aria-label="Draw a card"></div>' +
      '<span class="typed-static-1 purple pc-name"></span>' +
      '<span class="typed-static-1"><span class="purple">{LEFT}</span> <span class="yellow pc-count"></span></span>' +
      '<span class="typed-static-1 grey pc-hint"></span>' +
      '<div class="pc-actions">' +
      '<button type="button" class="pc-btn pc-draw">draw card</button>' +
      '<button type="button" class="pc-btn pc-btn--reset pc-reset">reset deck</button>' +
      "</div>" +
      '<div class="pc-history" role="list" aria-label="Cards drawn so far"></div>' +
      '<div class="pc-sr" aria-live="polite"></div>'
  );

  const cardEl = app.querySelector(".pc-card");
  const nameEl = app.querySelector(".pc-name");
  const countEl = app.querySelector(".pc-count");
  const hintEl = app.querySelector(".pc-hint");
  const drawBtn = app.querySelector(".pc-draw");
  const resetBtn = app.querySelector(".pc-reset");
  const historyEl = app.querySelector(".pc-history");
  const liveEl = app.querySelector(".pc-sr");

  function showBack(animate) {
    const back = document.createElement("div");
    back.className = "pc-back" + (animate ? " pc-shuffle" : "");
    cardEl.replaceChildren(back);
    cardEl.setAttribute("aria-label", "Face-down card");
  }

  function showFace(card) {
    const face = document.createElement("div");
    face.className = "pc-face pc-deal" + (card.red ? " pc-red" : "");
    face.innerHTML = card.kind === "joker" ? jokerFaceHTML() : suitFaceHTML(card);
    cardEl.replaceChildren(face);
    cardEl.setAttribute("aria-label", card.label);
  }

  function addChip(card) {
    const prev = historyEl.querySelector(".pc-latest");
    if (prev) prev.classList.remove("pc-latest");

    const chip = document.createElement("span");
    chip.className = "pc-token pc-latest" + (card.red ? " pc-red" : "");
    chip.setAttribute("role", "listitem");
    chip.setAttribute("title", card.label);
    chip.setAttribute("aria-label", card.label);
    chip.innerHTML =
      card.kind === "joker"
        ? "<span>JK</span>" + icon("star", "pc-chip-icon")
        : "<span>" + card.rank + "</span>" + icon(card.suit, "pc-chip-icon");
    historyEl.appendChild(chip);
    historyEl.scrollLeft = historyEl.scrollWidth; // history is a sideways strip: keep the newest chip in view
  }

  // Set below if the cards can't be drawn properly, so it's visible on the page
  // instead of the card silently being invisible.
  let problem = "";

  function renderCounts() {
    countEl.textContent = remaining.length + " / " + TOTAL;
    const empty = remaining.length === 0;
    drawBtn.disabled = empty;
    resetBtn.classList.toggle("pc-attn", empty);
    hintEl.textContent = problem || (empty ? "deck is empty, reset to reshuffle" : "");
  }

  function announce(text) {
    liveEl.textContent = text;
  }

  function draw() {
    if (remaining.length === 0) return;
    const card = remaining.splice(randInt(remaining.length), 1)[0];

    showFace(card);
    addChip(card);
    nameEl.textContent = card.label;
    renderCounts();

    if (remaining.length === 0) {
      resetBtn.focus({ preventScroll: true }); // the draw button just got disabled
      announce("Drew " + card.label + ". No cards left. Reset the deck to shuffle again.");
    } else {
      announce("Drew " + card.label + ". " + remaining.length + (remaining.length === 1 ? " card left." : " cards left."));
    }
  }

  function reset() {
    remaining = buildDeck();
    historyEl.replaceChildren();
    showBack(true);
    nameEl.textContent = "shuffled and ready";
    renderCounts();
    announce("Deck reset and shuffled. " + TOTAL + " cards.");
    drawBtn.focus({ preventScroll: true });
  }

  drawBtn.addEventListener("click", draw);
  resetBtn.addEventListener("click", reset);

  showBack(false);
  if (!(window.CSS && CSS.supports && CSS.supports("width", "1cqw"))) {
    problem = "this browser is too old to draw the cards, try a newer one";
  } else if (getComputedStyle(cardEl).position !== "relative") {
    // (not offsetHeight: this page is display:none until its tab is opened)
    problem = "cards.css isn't loading, check it's in the css/ folder next to style.css";
  }
  if (problem) console.warn("[cards] " + problem);
  nameEl.textContent = "shuffled and ready";
  renderCounts();

  /* ---------- section heading: reuse the site's typewriter effect ---------- */

  const typed = document.getElementById("typed-main6");
  if (typed) {
    const holder = typed.closest("[data-type]");
    let words = ["draw a card"];
    try {
      if (holder) words = JSON.parse(holder.getAttribute("data-type"));
    } catch (e) {
      /* keep the default */
    }
    if (typeof window.txtTypeHome === "function") {
      new window.txtTypeHome(typed, words, holder && holder.getAttribute("data-period"));
    } else {
      typed.textContent = words[0];
    }
  }
})();
