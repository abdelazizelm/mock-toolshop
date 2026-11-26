# Mock Tool Store

A static test double for the LeBrain workflow "[AE] - New Sales Order Processing Automation".

The workflow was written against a public practice shop that now puts a bot check in front of the
platform's browsers, so runs on the "Platform" browser target can't get past the home page. This
mock reproduces only what the workflow uses, with the same `data-test` selectors:

| Workflow step | Element in the mock |
|---|---|
| Cliquer sur Accueil / Revenir à l'accueil | `[data-test='nav-home']` |
| Saisir le nom du produit | `[data-test='search-query']` |
| Valider la recherche | `[data-test='search-submit']` |
| Attendre les résultats de recherche | text "Searched for: …" (`h3[data-test='search-caption']`) |
| Vérifier la présence du produit / Cliquer sur la fiche produit | `a.card` containing the product name (search = name contains the term, case-insensitive) |
| Renseigner la quantité | `[data-test='quantity']` |
| Ajouter au panier | `[data-test='add-to-cart']` |
| Accéder au panier | `[data-test='nav-cart']` |
| Lire le montant total du panier | `[data-test='cart-total']` (format `$12.34`) |
| Clear Cart | `a.btn-danger` per cart line |

The catalogue is the 50 products, prices and categories of the original shop (`products.js`), so
the same orders are found or not found as before. The cart is kept in the browser's localStorage.

No build step: serve the folder as is (GitHub Pages, `python -m http.server`, or open `index.html`).
Routes use the URL hash (`#/`, `#/search?q=…`, `#/product/<id>`, `#/checkout`), so no server rewrites are needed.
