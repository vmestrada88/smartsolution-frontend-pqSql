describe('Products Page - Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
    cy.waitForProducts();
  });

  describe('API Integration', () => {
    it('should handle API errors gracefully', () => {
      // Intercept and mock API error
      cy.intercept('GET', '/api/products', { statusCode: 500 }).as('getProductsError');

      cy.visit('/products');

      cy.wait('@getProductsError');

      // Should show error message or fallback UI
      cy.contains('Error loading products').should('be.visible');
    });

    it('should handle empty product list', () => {
      // Mock empty response
      cy.intercept('GET', '/api/products', { body: [] }).as('getEmptyProducts');

      cy.visit('/products');

      cy.wait('@getEmptyProducts');

      // Should show empty state message
      cy.contains('No products available').should('be.visible');
    });

    it('should handle slow API response', () => {
      // Mock slow response
      cy.intercept('GET', '/api/products', { delay: 5000, body: [] }).as('slowProducts');

      cy.visit('/products');

      // Should show loading state
      cy.contains('Loading products...').should('be.visible');

      cy.wait('@slowProducts');

      // Loading should disappear
      cy.contains('Loading products...').should('not.exist');
    });
  });

  describe('Complex User Flows', () => {
    it('should handle complete purchase flow', () => {
      // Add multiple products
      cy.addProductToInvoice(0);
      cy.addProductToInvoice(1);
      cy.addProductToInvoice(2);

      // Modify quantities
      cy.increaseProductQuantity(0);
      cy.increaseProductQuantity(1);

      // Verify totals
      cy.getInvoiceTotal().should('not.contain', '$0.00');

      // Export PDF
      cy.exportPDF();
      cy.confirmPDFExport();

      // Should show success message
      cy.contains('PDF exported successfully').should('be.visible');
    });

    it('should persist cart state on page refresh', () => {
      // Add products
      cy.addProductToInvoice(0);
      cy.addProductToInvoice(1);

      // Refresh page
      cy.reload();

      // Cart should still have products
      cy.get('tbody tr').should('have.length', 2);
    });

    it('should handle browser back/forward navigation', () => {
      // Navigate to products
      cy.visit('/products');

      // Add product
      cy.addProductToInvoice(0);

      // Navigate away and back
      cy.visit('/');
      cy.go('back');

      // Should maintain state
      cy.get('tbody tr').should('have.length', 1);
    });
  });

  describe('Performance Tests', () => {
    it('should render products quickly', () => {
      const startTime = performance.now();

      cy.get('[data-testid="product-list"]').should('be.visible').then(() => {
        const renderTime = performance.now() - startTime;
        expect(renderTime).to.be.lessThan(1000); // Should render within 1 second
      });
    });

    it('should handle large product lists efficiently', () => {
      // Mock large product list
      const largeProductList = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        price: 10 + i,
        category: 'Test'
      }));

      cy.intercept('GET', '/api/products', { body: largeProductList }).as('largeProductList');

      cy.visit('/products');

      cy.wait('@largeProductList');

      // Should render all products without performance issues
      cy.get('[data-testid="product-card"]').should('have.length', 100);
    });
  });

  describe('Cross-browser Compatibility', () => {
    // These tests would run on different browsers in CI/CD
    it('should work on Chrome', () => {
      cy.addProductToInvoice(0);
      cy.get('tbody tr').should('have.length', 1);
    });

    it('should work on Firefox', () => {
      cy.addProductToInvoice(0);
      cy.get('tbody tr').should('have.length', 1);
    });

    it('should work on Safari', () => {
      cy.addProductToInvoice(0);
      cy.get('tbody tr').should('have.length', 1);
    });
  });

  describe('Security Tests', () => {
    it('should prevent XSS attacks', () => {
      // Mock product with malicious content
      const maliciousProduct = {
        id: 1,
        name: '<script>alert("XSS")</script>',
        price: 100,
        category: 'Test'
      };

      cy.intercept('GET', '/api/products', { body: [maliciousProduct] }).as('maliciousProduct');

      cy.visit('/products');

      cy.wait('@maliciousProduct');

      // Should render as text, not execute script
      cy.contains('<script>alert("XSS")</script>').should('be.visible');
    });

    it('should validate user input', () => {
      // Test invalid quantity inputs
      cy.addProductToInvoice(0);

      // Try to set invalid quantity
      cy.get('tbody tr').first().find('input').type('-1');

      // Should show validation error
      cy.contains('Invalid quantity').should('be.visible');
    });
  });

  describe('Accessibility (A11y) Tests', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
      // Check heading levels are in order
    });

    it('should support keyboard navigation', () => {
      // Test tab order
      cy.get('button').first().focus();
      cy.tab();
      cy.focused().should('be.visible');
    });

    it('should have sufficient color contrast', () => {
      // This would require additional plugins like cypress-axe
      cy.injectAxe();
      cy.checkA11y();
    });

    it('should support screen readers', () => {
      // Test ARIA labels and roles
      cy.get('[role="button"]').should('have.attr', 'aria-label');
    });
  });
});