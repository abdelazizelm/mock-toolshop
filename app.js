(() => {
  const app = document.getElementById("app");
  const CART_KEY = "mockToolStoreCart";
  const money = n => "$" + n.toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => window.PRODUCTS.find(p => p.id === id);

  // Cart in localStorage, guarded: storage can be unavailable in some browsers.
  let memoryCart = [];
  const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return memoryCart; } };
  const saveCart = cart => { memoryCart = cart; try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* memory only */ } updateBadge(); };
  const updateBadge = () => {
    const qty = loadCart().reduce((n, l) => n + l.quantity, 0);
    document.querySelector("[data-test='cart-quantity']").textContent = qty;
  };

  const card = p => `
    <a class="card" href="#/product/${p.id}" data-test="product-${p.id}">
      <div class="thumb" aria-hidden="true">${esc(p.category.charAt(0))}</div>
      <div class="card-body">
        <h5 class="card-title" data-test="product-name">${esc(p.name)}</h5>
        <div class="card-category">${esc(p.category)}</div>
      </div>
      <div class="card-footer">
        <span data-test="product-price">${money(p.price)}</span>
        ${p.inStock ? "" : '<span class="oos" data-test="out-of-stock">Out of stock</span>'}
      </div>
    </a>`;

  const searchForm = q => `
    <form class="search" data-test="search-form" onsubmit="return false">
      <label for="search-query">Search</label>
      <input id="search-query" type="text" placeholder="Search" data-test="search-query" value="${esc(q || "")}">
      <button type="button" data-test="search-reset">X</button>
      <button type="submit" data-test="search-submit">Search</button>
    </form>`;

  function renderList(q) {
    const term = (q || "").trim().toLowerCase();
    const items = term ? window.PRODUCTS.filter(p => p.name.toLowerCase().includes(term)) : window.PRODUCTS.slice(0, 9);
    app.innerHTML = `
      <div class="layout">
        <aside>${searchForm(q)}</aside>
        <section>
          ${term ? `<h3 data-test="search-caption">Searched for: <span data-test="search-term">${esc(q)}</span></h3>` : ""}
          <div class="grid">${items.map(card).join("")}</div>
          ${term && !items.length ? '<div class="empty" data-test="no-results">There are no products found.</div>' : ""}
        </section>
      </div>`;
    const form = app.querySelector("[data-test='search-form']");
    const input = app.querySelector("[data-test='search-query']");
    form.addEventListener("submit", () => { location.hash = "#/search?q=" + encodeURIComponent(input.value); });
    app.querySelector("[data-test='search-reset']").addEventListener("click", () => { location.hash = "#/"; });
  }

  function renderProduct(id) {
    const p = byId(id);
    if (!p) { app.innerHTML = '<h1 data-test="not-found">Product not found</h1>'; return; }
    app.innerHTML = `
      <div class="product">
        <div class="thumb big" aria-hidden="true">${esc(p.category.charAt(0))}</div>
        <div>
          <h1 data-test="product-name">${esc(p.name)}</h1>
          <p class="card-category">${esc(p.category)}</p>
          <p class="price"><span data-test="unit-price">${p.price.toFixed(2)}</span> $</p>
          <div class="qty">
            <button type="button" data-test="decrease-quantity">-</button>
            <input type="number" min="1" value="1" id="quantity-input" data-test="quantity" aria-label="Quantity">
            <button type="button" data-test="increase-quantity">+</button>
          </div>
          <button type="button" class="btn btn-primary" data-test="add-to-cart" ${p.inStock ? "" : "disabled"}>Add to cart</button>
          <div class="toast" role="status" data-test="toast" hidden>Product added to shopping cart.</div>
        </div>
      </div>`;
    const qty = app.querySelector("[data-test='quantity']");
    app.querySelector("[data-test='decrease-quantity']").onclick = () => { qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) - 1); };
    app.querySelector("[data-test='increase-quantity']").onclick = () => { qty.value = (parseInt(qty.value, 10) || 0) + 1; };
    app.querySelector("[data-test='add-to-cart']").onclick = () => {
      const n = Math.max(1, parseInt(qty.value, 10) || 1);
      const cart = loadCart();
      const line = cart.find(l => l.id === p.id);
      if (line) line.quantity += n; else cart.push({ id: p.id, quantity: n });
      saveCart(cart);
      const t = app.querySelector("[data-test='toast']");
      t.hidden = false; setTimeout(() => { t.hidden = true; }, 2500);
    };
  }

  function renderCart() {
    const lines = loadCart().map(l => ({ ...l, p: byId(l.id) })).filter(l => l.p);
    const total = lines.reduce((s, l) => s + l.p.price * l.quantity, 0);
    app.innerHTML = lines.length ? `
      <h2>Cart</h2>
      <table class="cart">
        <thead><tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th><th></th></tr></thead>
        <tbody>
          ${lines.map(l => `
            <tr>
              <td data-test="product-title">${esc(l.p.name)}</td>
              <td><input type="number" min="1" value="${l.quantity}" data-test="product-quantity" aria-label="Quantity" readonly></td>
              <td data-test="product-price">${money(l.p.price)}</td>
              <td data-test="line-price">${money(l.p.price * l.quantity)}</td>
              <td><a href="#/checkout" class="btn btn-danger" role="button" aria-label="Remove ${esc(l.p.name)}" data-id="${l.id}">&times;</a></td>
            </tr>`).join("")}
        </tbody>
        <tfoot><tr><td colspan="3"></td><td data-test="cart-total">${money(total)}</td><td></td></tr></tfoot>
      </table>
      <a href="#/" class="btn" data-test="continue-shopping">Continue Shopping</a>`
      : '<h2>Cart</h2><p data-test="cart-empty">The cart is empty. Nothing to display.</p><a href="#/" class="btn" data-test="continue-shopping">Continue Shopping</a>';
    app.querySelectorAll("a.btn-danger").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      saveCart(loadCart().filter(l => l.id !== a.dataset.id));
      renderCart();
    }));
  }

  function route() {
    const h = location.hash || "#/";
    const [path, query] = h.slice(1).split("?");
    const params = new URLSearchParams(query || "");
    if (path.startsWith("/product/")) renderProduct(decodeURIComponent(path.slice(9)));
    else if (path === "/checkout") renderCart();
    else if (path === "/search") renderList(params.get("q") || "");
    else renderList("");
    updateBadge();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();
