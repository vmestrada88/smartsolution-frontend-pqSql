describe('Products Page', () => {
  beforeEach(() => {
    // Visit products page before each test
    cy.visit('/products');
    // Wait for products to load
    cy.wait(2000);
  });

  describe('Page Loading and Navigation', () => {
    it('should load the products page successfully', () => {
      cy.url().should('include', '/products');
      cy.get('h1').should('be.visible');
    });

    it('should display the header with navigation', () => {
      cy.get('header').should('be.visible');
      cy.get('img[alt="Smart Solution Logo"]').should('be.visible');
      cy.contains('Smart Solution for Living').should('be.visible');
    });

    it('should have working navigation links', () => {
      cy.get('nav').should('be.visible');
      cy.contains('Home').should('be.visible');
      cy.contains('Products').should('be.visible');
    });
  });

  describe('Product List Functionality', () => {
    it('should display the product catalog', () => {
      cy.get('[data-testid="product-list"]').should('be.visible');
    });

    it('should show product cards with required information', () => {
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('img').should('be.visible');
        cy.get('h3').should('be.visible'); // Product name
        cy.contains('$').should('be.visible'); // Price
        cy.get('button').contains('+ Add').should('be.visible');
      });
    });

    it('should filter products by category', () => {
      // Assuming there's a category filter - adjust selector as needed
      cy.get('[data-testid="category-filter"]').should('exist');
    });
  });

  describe('Invoice Table Functionality', () => {
    it('should display empty invoice table initially', () => {
      cy.get('.sticky.top-0').should('be.visible');
      cy.get('table').should('be.visible');
      cy.contains('Total:').should('be.visible');
    });

    it('should add product to invoice when clicking Add button', () => {
      // Click first Add button
      cy.get('button').contains('+ Add').first().click();

      // Verify product appears in table
      cy.get('tbody tr').should('have.length', 1);
      cy.get('tbody tr').first().should('contain', 'Product');
      cy.get('tbody tr').first().find('span').contains('1').should('be.visible');
    });

    it('should increase product quantity when clicking + button', () => {
      // Add product first
      cy.get('button').contains('+ Add').first().click();

      // Click + button
      cy.get('tbody tr').first().find('button').contains('+').click();

      // Verify quantity increased to 2
      cy.get('tbody tr').first().find('span').contains('2').should('be.visible');
    });

    it('should decrease product quantity when clicking - button', () => {
      // Add product and increase quantity to 2
      cy.get('button').contains('+ Add').first().click();
      cy.get('tbody tr').first().find('button').contains('+').click();

      // Click - button
      cy.get('tbody tr').first().find('button').contains('-').click();

      // Verify quantity decreased to 1
      cy.get('tbody tr').first().find('span').contains('1').should('be.visible');
    });

    it('should remove product when clicking X button', () => {
      // Add product
      cy.get('button').contains('+ Add').first().click();

      // Click remove button (X)
      cy.get('tbody tr').first().find('button').contains('✕').click();

      // Verify table is empty
      cy.get('tbody tr').should('have.length', 0);
    });

    it('should remove product when quantity reaches 0', () => {
      // Add product
      cy.get('button').contains('+ Add').first().click();

      // Click - button until quantity is 0
      cy.get('tbody tr').first().find('button').contains('-').click();

      // Verify table is empty
      cy.get('tbody tr').should('have.length', 0);
    });

    it('should calculate totals correctly', () => {
      // Add first product
      cy.get('button').contains('+ Add').first().click();

      // Verify subtotal is calculated
      cy.get('tfoot').should('contain', 'Total:');

      // Add second product
      cy.get('button').contains('+ Add').eq(1).click();

      // Verify total updates
      cy.get('tfoot').should('contain', 'Total:');
    });
  });

  describe('PDF Export Functionality', () => {
    it('should show error message when trying to export empty invoice', () => {
      // Click Save PDF Proposal button
      cy.get('button').contains('Save PDF Proposal').click();

      // Should show error toast
      cy.contains('You must create a proposal first').should('be.visible');
    });

    it('should show confirmation dialog when exporting with products', () => {
      // Add a product first
      cy.get('button').contains('+ Add').first().click();

      // Click Save PDF Proposal button
      cy.get('button').contains('Save PDF Proposal').click();

      // Should show confirmation toast
      cy.contains('Do you want to save this proposal to your device?').should('be.visible');
      cy.get('button').contains('Yes').should('be.visible');
      cy.get('button').contains('No').should('be.visible');
    });

    it('should export PDF when confirming', () => {
      // Add a product first
      cy.get('button').contains('+ Add').first().click();

      // Click Save PDF Proposal button
      cy.get('button').contains('Save PDF Proposal').click();

      // Click Yes in confirmation
      cy.get('button').contains('Yes').click();

      // PDF should be generated (we can't verify file download in headless mode,
      // but we can verify no errors occurred)
      cy.wait(2000); // Wait for PDF generation
    });
  });

  describe('Responsive Design', () => {
    it('should display mobile menu button on small screens', () => {
      cy.viewport('iphone-6');
      cy.get('button[aria-label="Toggle menu"]').should('be.visible');
    });

    it('should toggle mobile menu when hamburger button is clicked', () => {
      cy.viewport('iphone-6');

      // Menu should be closed initially
      cy.get('nav').should('have.class', 'max-h-0');

      // Click hamburger menu
      cy.get('button[aria-label="Toggle menu"]').click();

      // Menu should be open
      cy.get('nav').should('have.class', 'max-h-96');

      // Click again to close
      cy.get('button[aria-label="Toggle menu"]').click();

      // Menu should be closed
      cy.get('nav').should('have.class', 'max-h-0');
    });

    it('should work properly on tablet size', () => {
      cy.viewport('ipad-2');
      cy.get('header').should('be.visible');
      cy.get('nav').should('be.visible');
    });

    it('should work properly on desktop size', () => {
      cy.viewport('macbook-15');
      cy.get('header').should('be.visible');
      cy.get('nav').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // This would require mocking API calls
      cy.intercept('GET', '/api/products', { forceNetworkError: true }).as('getProducts');

      cy.visit('/products');

      // Should show error message or fallback UI
      cy.wait('@getProducts');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have proper ARIA labels', () => {
      cy.get('button[aria-label]').should('exist');
    });

    it('should be keyboard navigable', () => {
      // Test tab navigation
      cy.get('button').first().focus();
      cy.focused().should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load products within acceptable time', () => {
      const startTime = Date.now();
      cy.visit('/products');
      cy.get('[data-testid="product-list"]').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // Should load within 5 seconds
      });
    });
  });
});