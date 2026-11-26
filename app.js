(() => {
  const app = document.getElementById("app");
  const CART_KEY = "mockToolStoreCart";
  const P = window.PRODUCTS;
  const A = window.ART;
  const money = n => "$" + n.toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => P.find(p => p.id === id);
  const slug = s => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Departments group the shop categories (used by the top navigation).
  const DEPARTMENTS = {
    "hand-tools": { name: "Hand Tools", cats: ["Pliers", "Hammer", "Hand Saw", "Wrench", "Screwdriver", "Chisels"] },
    "power-tools": { name: "Power Tools", cats: ["Drill", "Sander", "Saw"] },
    "measures": { name: "Measuring", cats: ["Measures"] },
    "safety-gear": { name: "Safety Gear", cats: ["Safety Gear"] },
    "fasteners": { name: "Fasteners", cats: ["Fasteners"] },
    "storage": { name: "Storage & Workbenches", cats: ["Storage Solutions", "Workbench", "Tool Belts"] },
  };
  const CATEGORIES = [...new Set(P.map(p => p.category))];

  // Sample product details, derived from the product so they stay stable between visits.
  const BRANDS = ["Torvik", "Brandel", "Kestro", "Ulmar", "Hollis & Kade"];
  const meta = p => {
    const h = A.hash(p.id);
    const rating = Math.round((3.6 + (h % 15) / 10) * 10) / 10;
    const reviews = 12 + (h % 340);
    const brand = BRANDS[h % BRANDS.length];
    const was = h % 4 === 0 ? Math.round(p.price * 1.25 * 100) / 100 : null;
    const sku = "FB-" + (10000 + (h % 89999));
    return { rating: Math.min(rating, 5), reviews, brand, was, sku };
  };
  const DESCRIPTIONS = {
    Pliers: "Drop-forged chrome-vanadium steel with induction-hardened cutting edges and comfortable dual-material grips for a secure hold.",
    Hammer: "Balanced head with a hardened striking face, designed to reduce vibration and give you clean, accurate blows all day.",
    "Hand Saw": "Precision-ground teeth for fast, clean cuts in softwood and hardwood, with an ergonomic closed handle.",
    Wrench: "Chrome-vanadium body with polished jaws that grip firmly without rounding off nuts and bolts.",
    Screwdriver: "Magnetic hardened tip and a soft-grip handle that turns comfortably even under high torque.",
    Chisels: "Hardened, sharpened blades with a beveled edge for paring, chopping and fine woodworking detail.",
    Measures: "Easy-to-read markings and a durable housing for quick, accurate measurements on site or in the workshop.",
    "Safety Gear": "Certified protection that stays comfortable over long working days, with adjustable fit.",
    Fasteners: "Zinc-plated steel for corrosion resistance, sold in handy workshop quantities.",
    "Storage Solutions": "Powder-coated steel with smooth ball-bearing drawers and a central lock to keep tools organised and safe.",
    Workbench: "Solid worktop on a rigid frame, with storage underneath so everything you need is within reach.",
    "Tool Belts": "Full-grain leather with reinforced stitching and pockets sized for the tools you reach for most.",
    Sander: "Low-vibration motor and an efficient dust collection system for a smooth, clean finish.",
    Saw: "Powerful motor with a carbide-tipped blade and an adjustable depth and bevel for precise cuts.",
    Drill: "Brushless motor, two-speed gearbox and a keyless chuck, with an LED work light for dark corners.",
  };
  const specsOf = p => {
    const m = meta(p);
    const h = A.hash(p.name);
    return [
      ["Brand", m.brand], ["SKU", m.sku], ["Category", p.category],
      ["Weight", (0.2 + (h % 40) / 10).toFixed(1) + " kg"],
      ["Material", /Safety Gear/.test(p.category) ? "Polycarbonate / textile" : /Workbench|Tool Belts/.test(p.category) ? "Wood / leather / steel" : "Chrome-vanadium steel"],
      ["Warranty", /Drill|Sander|Saw/.test(p.category) ? "2 years" : "1 year"],
    ];
  };

  const stars = r => {
    const full = Math.floor(r), half = r - full >= 0.5;
    return `<span class="stars" aria-label="Rated ${r} out of 5">${"★".repeat(full)}${half ? "<i>★</i>" : ""}<s>${"★".repeat(5 - full - (half ? 1 : 0))}</s></span>`;
  };

  // ---------- cart ----------
  let memoryCart = [];
  const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return memoryCart; } };
  const saveCart = cart => { memoryCart = cart; try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* memory only */ } updateBadge(true); };
  const updateBadge = bump => {
    const qty = loadCart().reduce((n, l) => n + l.quantity, 0);
    const b = document.querySelector("[data-test='cart-quantity']");
    b.textContent = qty;
    b.classList.toggle("is-zero", qty === 0);
    if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  };

  const toast = (msg, kind = "ok") => {
    const t = document.createElement("div");
    t.className = "toast " + kind;
    t.setAttribute("role", "status");
    t.setAttribute("data-test", "toast");
    t.innerHTML = msg;
    document.querySelector(".toasts").appendChild(t);
    setTimeout(() => t.classList.add("out"), 2600);
    setTimeout(() => t.remove(), 3000);
  };

  // ---------- building blocks ----------
  // Product cards are the only a.card elements on a page (the workflow counts and clicks them).
  const card = p => {
    const m = meta(p);
    return `
    <a class="card" href="#/product/${p.id}" data-test="product-${p.id}">
      <div class="card-img">${A.product(p)}
        ${m.was ? `<span class="tag sale">-${Math.round((1 - p.price / m.was) * 100)}%</span>` : ""}
        ${p.inStock ? "" : '<span class="tag oos" data-test="out-of-stock">Out of stock</span>'}
      </div>
      <div class="card-body">
        <div class="card-brand">${esc(m.brand)}</div>
        <h5 class="card-title" data-test="product-name">${esc(p.name)}</h5>
        <div class="card-rating">${stars(m.rating)} <span>(${m.reviews})</span></div>
        <div class="card-price"><span data-test="product-price">${money(p.price)}</span>${m.was ? `<del>${money(m.was)}</del>` : ""}</div>
      </div>
    </a>`;
  };

  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([t, href]) => href ? `<a href="${href}">${esc(t)}</a>` : `<span>${esc(t)}</span>`).join("<b>/</b>")}</nav>`;

  const setSearchBox = q => { document.querySelector("[data-test='search-query']").value = q || ""; };

  // ---------- pages ----------
  function renderHome() {
    document.title = "Forge & Bolt · Tools for every workshop (mock store)";
    const featured = ["cordless-drill-20v", "claw-hammer-with-shock-reduction-grip", "safety-goggles", "adjustable-wrench", "circular-saw", "tape-measure-7-5m", "combination-pliers", "drawer-tool-cabinet"].map(byId).filter(Boolean);
    const tiles = [
      ["hand-tools", "hammer", "#e4572e"], ["power-tools", "drill", "#2e86ab"], ["measures", "tape", "#f3a712"],
      ["safety-gear", "helmet", "#ff7f11"], ["fasteners", "screws", "#7768ae"], ["storage", "cabinet", "#d7263d"],
    ];
    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <span class="eyebrow">Autumn workshop event</span>
          <h1>Pro-grade tools.<br>Workshop-ready prices.</h1>
          <p>Up to 25% off selected hand and power tools. Free delivery on orders over $75.</p>
          <div class="hero-cta"><a class="btn btn-primary btn-lg" href="#/category/power-tools">Shop power tools</a><a class="btn btn-ghost btn-lg" href="#/deals">See all deals</a></div>
        </div>
        <div class="hero-art">
          <div class="hero-blob"></div>
          <div class="hero-item a">${A.icon("drill", "#2e86ab", { noShadow: true })}</div>
          <div class="hero-item b">${A.icon("hammer", "#e4572e", { noShadow: true })}</div>
          <div class="hero-item c">${A.icon("wrench", "#f3a712", { noShadow: true })}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Shop by category</h2></div>
        <div class="tiles">
          ${tiles.map(([key, kind, color]) => `<a class="tile" href="#/category/${key}">${A.icon(kind, color)}<span>${esc(DEPARTMENTS[key].name)}</span></a>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Best sellers</h2><a href="#/category/hand-tools">View all</a></div>
        <div class="grid">${featured.map(card).join("")}</div>
      </section>
      <section class="promo">
        <div>${A.icon("toolbelt", "#c44536", { noShadow: true })}</div>
        <div><h3>Build your kit, save 10%</h3><p>Pick any three hand tools and get 10% off at checkout. Sample promotion for this demo store.</p><a class="btn btn-light" href="#/category/hand-tools">Start building</a></div>
      </section>`;
  }

  function filterSort(items, sort) {
    const list = items.slice();
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "rating") list.sort((a, b) => meta(b).rating - meta(a).rating);
    return list;
  }

  // Search results, department pages and deals share one listing layout.
  function renderListing({ title, caption, items, base, params, crumbsTrail, emptyText }) {
    const sort = params.get("sort") || "relevance";
    const cats = params.getAll("cat");
    const inStock = params.get("stock") === "1";
    const pool = items;
    let list = pool.filter(p => (!cats.length || cats.includes(slug(p.category))) && (!inStock || p.inStock));
    list = filterSort(list, sort);
    const counts = CATEGORIES.map(c => [c, pool.filter(p => p.category === c).length]).filter(([, n]) => n);
    document.title = `${title} · Forge & Bolt`;
    app.innerHTML = `
      <div class="page">
        ${crumbs(crumbsTrail)}
        <div class="listing">
          <aside class="filters" aria-label="Filters">
            <h4>Category</h4>
            ${counts.map(([c, n]) => `<label class="check"><input type="checkbox" data-cat="${slug(c)}" ${cats.includes(slug(c)) ? "checked" : ""}> ${esc(c)} <span>${n}</span></label>`).join("") || '<p class="muted">No categories</p>'}
            <h4>Availability</h4>
            <label class="check"><input type="checkbox" data-stock ${inStock ? "checked" : ""}> In stock only</label>
            <h4>Need help?</h4>
            <p class="muted">Our tool experts answer Mon–Sat, 8am–6pm.</p>
          </aside>
          <section class="results">
            ${caption}
            <div class="toolbar">
              <span class="count">${list.length} product${list.length === 1 ? "" : "s"}</span>
              <label>Sort by
                <select data-test="sort">
                  ${[["relevance", "Relevance"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["rating", "Top rated"], ["name", "Name A–Z"]].map(([v, t]) => `<option value="${v}" ${v === sort ? "selected" : ""}>${t}</option>`).join("")}
                </select>
              </label>
            </div>
            ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `
              <div class="empty" data-test="no-results">
                ${A.icon("box", "#c9d2de", { noShadow: true })}
                <h3>There are no products found.</h3>
                <p>${emptyText || "Try another search term or browse our categories."}</p>
                <a class="btn btn-primary" href="#/">Back to the shop</a>
              </div>`}
          </section>
        </div>
      </div>`;
    const go = mutate => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      const qs = next.toString();
      location.hash = base + (qs ? "?" + qs : "");
    };
    app.querySelector("[data-test='sort']").addEventListener("change", e => go(n => n.set("sort", e.target.value)));
    app.querySelectorAll("[data-cat]").forEach(cb => cb.addEventListener("change", () => go(n => {
      const keep = n.getAll("cat").filter(c => c !== cb.dataset.cat);
      n.delete("cat");
      (cb.checked ? [...keep, cb.dataset.cat] : keep).forEach(c => n.append("cat", c));
    })));
    const st = app.querySelector("[data-stock]");
    st.addEventListener("change", () => go(n => st.checked ? n.set("stock", "1") : n.delete("stock")));
  }

  function renderSearch(params) {
    const q = params.get("q") || "";
    const term = q.trim().toLowerCase();
    setSearchBox(q);
    const items = term ? P.filter(p => p.name.toLowerCase().includes(term)) : P.slice();
    renderListing({
      title: term ? `Search: ${q}` : "All products",
      caption: `<h3 class="caption" data-test="search-caption">Searched for: <span data-test="search-term">${esc(q)}</span></h3>`,
      items, base: "#/search", params,
      crumbsTrail: [["Home", "#/"], ["Search"]],
      emptyText: `We couldn't find anything for “${esc(q)}”. Check the spelling or try a more general term.`,
    });
  }

  function renderDepartment(key, params) {
    const d = DEPARTMENTS[key];
    if (!d) return renderNotFound();
    setSearchBox("");
    renderListing({
      title: d.name,
      caption: `<h1 class="page-title">${esc(d.name)}</h1>`,
      items: P.filter(p => d.cats.includes(p.category)), base: "#/category/" + key, params,
      crumbsTrail: [["Home", "#/"], [d.name]],
    });
  }

  function renderDeals(params) {
    setSearchBox("");
    renderListing({
      title: "Deals",
      caption: '<h1 class="page-title">Deals of the week</h1>',
      items: P.filter(p => meta(p).was), base: "#/deals", params,
      crumbsTrail: [["Home", "#/"], ["Deals"]],
    });
  }

  function renderProduct(id) {
    const p = byId(id);
    if (!p) return renderNotFound();
    setSearchBox("");
    const m = meta(p);
    const dept = Object.entries(DEPARTMENTS).find(([, d]) => d.cats.includes(p.category));
    const related = P.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    document.title = `${p.name} · Forge & Bolt`;
    app.innerHTML = `
      <div class="page">
        ${crumbs([["Home", "#/"], dept ? [dept[1].name, "#/category/" + dept[0]] : [p.category], [p.name]])}
        <div class="product">
          <div class="gallery">
            <div class="gallery-main">${A.product(p)}${m.was ? `<span class="tag sale">-${Math.round((1 - p.price / m.was) * 100)}%</span>` : ""}</div>
            <div class="gallery-thumbs" aria-hidden="true">
              <div class="thumb active">${A.product(p)}</div><div class="thumb alt1">${A.product(p)}</div><div class="thumb alt2">${A.product(p)}</div>
            </div>
          </div>
          <div class="buybox">
            <div class="card-brand">${esc(m.brand)}</div>
            <h1 data-test="product-name">${esc(p.name)}</h1>
            <div class="card-rating">${stars(m.rating)} <a href="#/product/${p.id}">${m.reviews} reviews</a> <span class="muted">· SKU ${m.sku}</span></div>
            <div class="price-row"><span class="price" data-test="unit-price">${p.price.toFixed(2)}</span>${m.was ? `<del>${money(m.was)}</del><span class="save">Save ${money(m.was - p.price)}</span>` : ""}</div>
            <p class="stock ${p.inStock ? "in" : "out"}">${p.inStock ? "● In stock · ships within 24h" : "● Out of stock"}</p>
            <p class="desc" data-test="product-description">${esc(DESCRIPTIONS[p.category] || "")}</p>
            <div class="buy-row">
              <div class="qty">
                <button type="button" data-test="decrease-quantity" aria-label="Decrease quantity">−</button>
                <input type="number" min="1" value="1" id="quantity-input" data-test="quantity" aria-label="Quantity">
                <button type="button" data-test="increase-quantity" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="btn btn-primary btn-lg add" data-test="add-to-cart" ${p.inStock ? "" : "disabled"}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.6L21 7H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="9.5" cy="19.5" r="1.6" fill="currentColor"/><circle cx="17" cy="19.5" r="1.6" fill="currentColor"/></svg>
                Add to cart
              </button>
              <button type="button" class="btn btn-icon" data-test="add-to-favorites" aria-label="Add to favourites">♡</button>
            </div>
            <ul class="assurances">
              <li><b>Free delivery</b> on orders over $75</li>
              <li><b>30-day returns</b>, free of charge</li>
              <li><b>${/Drill|Sander|Saw/.test(p.category) ? "2-year" : "1-year"} warranty</b> included</li>
            </ul>
          </div>
        </div>
        <section class="section">
          <div class="section-head"><h2>Specifications</h2></div>
          <table class="specs" data-test="product-specs">${specsOf(p).map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join("")}</table>
        </section>
        ${related.length ? `<section class="section"><div class="section-head"><h2>You may also like</h2></div><div class="grid">${related.map(card).join("")}</div></section>` : ""}
      </div>`;
    const qty = app.querySelector("[data-test='quantity']");
    app.querySelector("[data-test='decrease-quantity']").onclick = () => { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); };
    app.querySelector("[data-test='increase-quantity']").onclick = () => { qty.value = (parseInt(qty.value, 10) || 0) + 1; };
    app.querySelector("[data-test='add-to-favorites']").onclick = e => { e.currentTarget.classList.toggle("on"); toast("Saved to your favourites."); };
    app.querySelector("[data-test='add-to-cart']").onclick = () => {
      const n = Math.max(1, parseInt(qty.value, 10) || 1);
      const cart = loadCart();
      const line = cart.find(l => l.id === p.id);
      if (line) line.quantity += n; else cart.push({ id: p.id, quantity: n });
      saveCart(cart);
      toast(`<b>Added to cart</b> ${n} × ${esc(p.name)}`);
    };
  }

  function renderCart() {
    setSearchBox("");
    document.title = "Cart · Forge & Bolt";
    const lines = loadCart().map(l => ({ ...l, p: byId(l.id) })).filter(l => l.p);
    const items = lines.reduce((n, l) => n + l.quantity, 0);
    const total = lines.reduce((s, l) => s + l.p.price * l.quantity, 0);
    const steps = `<ol class="steps"><li class="on">Cart</li><li>Sign in</li><li>Delivery</li><li>Payment</li></ol>`;
    if (!lines.length) {
      app.innerHTML = `<div class="page">${steps}<div class="empty cart-empty" data-test="cart-empty">${A.icon("toolbelt", "#c9d2de", { noShadow: true })}<h3>Your cart is empty</h3><p>The cart is empty. Nothing to display.</p><a class="btn btn-primary" href="#/" data-test="continue-shopping">Continue shopping</a></div></div>`;
      return;
    }
    app.innerHTML = `
      <div class="page">
        ${steps}
        <div class="cart-layout">
          <section>
            <h1 class="page-title">Your cart <span class="muted">(${items} item${items === 1 ? "" : "s"})</span></h1>
            <table class="cart">
              <thead><tr><th colspan="2">Item</th><th>Quantity</th><th>Price</th><th>Total</th><th><span class="sr">Remove</span></th></tr></thead>
              <tbody>
                ${lines.map(l => `
                  <tr>
                    <td class="cart-thumb">${A.product(l.p)}</td>
                    <td><a href="#/product/${l.p.id}" data-test="product-title">${esc(l.p.name)}</a><div class="muted small">${esc(meta(l.p).brand)} · ${esc(l.p.category)}</div></td>
                    <td><input type="number" min="1" value="${l.quantity}" data-test="product-quantity" data-id="${l.p.id}" aria-label="Quantity"></td>
                    <td data-test="product-price">${money(l.p.price)}</td>
                    <td data-test="line-price"><b>${money(l.p.price * l.quantity)}</b></td>
                    <td><a href="#/checkout" class="btn btn-danger" role="button" aria-label="Remove ${esc(l.p.name)}" data-id="${l.p.id}">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                    </a></td>
                  </tr>`).join("")}
              </tbody>
              <tfoot><tr><td colspan="4" class="right">Total</td><td data-test="cart-total">${money(total)}</td><td></td></tr></tfoot>
            </table>
            <a href="#/" class="btn btn-ghost" data-test="continue-shopping">← Continue shopping</a>
          </section>
          <aside class="summary">
            <h3>Order summary</h3>
            <div class="row"><span>Items (${items})</span><span>${money(total)}</span></div>
            <div class="row"><span>Delivery</span><span>${total >= 75 ? "Free" : "Calculated at checkout"}</span></div>
            <div class="row big"><span>Estimated total</span><span>${money(total)}</span></div>
            <button type="button" class="btn btn-primary btn-lg block" data-test="proceed-1">Proceed to checkout</button>
            <p class="muted small">Demo store: checkout is disabled.</p>
          </aside>
        </div>
      </div>`;
    app.querySelectorAll("a.btn-danger").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      saveCart(loadCart().filter(l => l.id !== a.dataset.id));
      renderCart();
    }));
    app.querySelectorAll("[data-test='product-quantity']").forEach(inp => inp.addEventListener("change", () => {
      const cart = loadCart();
      const line = cart.find(l => l.id === inp.dataset.id);
      if (line) { line.quantity = Math.max(1, parseInt(inp.value, 10) || 1); saveCart(cart); renderCart(); }
    }));
    app.querySelector("[data-test='proceed-1']").onclick = () => toast("This is a demo store: checkout is disabled.", "info");
  }

  function renderInfo(title, text) {
    setSearchBox("");
    document.title = `${title} · Forge & Bolt`;
    app.innerHTML = `<div class="page">${crumbs([["Home", "#/"], [title]])}<div class="info"><h1 class="page-title">${esc(title)}</h1><p>${text}</p><a class="btn btn-primary" href="#/">Back to the shop</a></div></div>`;
  }

  function renderNotFound() {
    renderInfo("Page not found", "The page you are looking for doesn't exist in this demo store.");
  }

  // ---------- routing ----------
  function route() {
    const h = location.hash || "#/";
    const [path, query] = h.slice(1).split("?");
    const params = new URLSearchParams(query || "");
    if (path.startsWith("/product/")) renderProduct(decodeURIComponent(path.slice(9)));
    else if (path === "/checkout") renderCart();
    else if (path === "/search") renderSearch(params);
    else if (path.startsWith("/category/")) renderDepartment(path.slice(10), params);
    else if (path === "/deals") renderDeals(params);
    else if (path === "/account") renderInfo("Account", "Accounts are not available in this demo store. Your cart is kept in this browser.");
    else if (path === "/help") renderInfo("Help", "Delivery, returns and warranty details are sample content in this demo store.");
    else if (path === "/" || path === "") { setSearchBox(""); renderHome(); }
    else renderNotFound();
    updateBadge(false);
    window.scrollTo(0, 0);
  }

  document.getElementById("search-form").addEventListener("submit", e => {
    e.preventDefault();
    const q = document.querySelector("[data-test='search-query']").value;
    const target = "#/search?q=" + encodeURIComponent(q);
    if (location.hash === target) route(); else location.hash = target;
  });
  window.addEventListener("hashchange", route);
  route();
})();
