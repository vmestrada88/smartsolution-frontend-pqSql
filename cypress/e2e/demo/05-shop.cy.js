/**
 * DEMO 05 — Shop & Product Catalog
 * Muestra el catálogo de productos público y el flujo de la tienda.
 * Video: cypress/videos/05-shop.mp4
 */

describe('Demo 05 — Shop & Product Catalog', () => {
  it('browses the public product catalog', () => {
    // ── Catálogo de productos ────────────────────────────────────────────────
    cy.visit('/products');
    cy.demoPause(1200);

    // Esperar a que carguen los productos
    cy.get('body').should('be.visible');
    cy.demoPause(1000);

    // Scroll fluido por el catálogo
    cy.scrollTo('bottom', { duration: 3000 });
    cy.demoPause(1000);
    cy.scrollTo('top', { duration: 1500 });
    cy.demoPause(800);

    // Hover sobre el primer producto si hay cards
    cy.get('[data-testid="product-list"] > *, .product-card, article')
      .first()
      .then(($el) => {
        if ($el.length) {
          cy.wrap($el).trigger('mouseover');
          cy.demoPause(800);
        }
      });
  });

  it('browses the shop and adds to cart', () => {
    // ── Shop ─────────────────────────────────────────────────────────────────
    cy.visit('/shop');
    cy.demoPause(1200);

    cy.get('body').should('be.visible');
    cy.demoPause(1000);

    // Scroll para mostrar los productos de la tienda
    cy.scrollTo('bottom', { duration: 2500 });
    cy.demoPause(1000);
    cy.scrollTo('top', { duration: 1000 });
    cy.demoPause(600);

    // Agregar primer producto al carrito si hay botón
    cy.get('button').contains(/add to cart|agregar|add/i)
      .first()
      .then(($btn) => {
        if ($btn.length) {
          cy.wrap($btn).click();
          cy.demoPause(1000);
        }
      });

    // ── Ir al carrito ────────────────────────────────────────────────────────
    cy.visit('/cart');
    cy.demoPause(1200);

    cy.scrollTo('bottom', { duration: 1500 });
    cy.demoPause(800);
    cy.scrollTo('top', { duration: 800 });
    cy.demoPause(1000);
  });
});
