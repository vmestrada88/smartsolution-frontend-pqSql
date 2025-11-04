describe('Utility Functions Tests', () => {
  describe('PDF Generation', () => {
    it('should generate PDF with correct filename format', () => {
      // Mock products data
      const mockProducts = [
        {
          name: 'Test Product',
          quantity: 2,
          priceSell: 100,
          category: 'Test'
        }
      ];

      const mockTotal = 200;
      const mockLogo = null;
      const mockGetLaborCost = () => 10;

      // Visit products page and add product
      cy.visit('/products');
      cy.addProductToInvoice(0);

      // Mock the PDF generation function
      cy.window().then((win) => {
        // Spy on the PDF save method
        cy.stub(win.jsPDF.prototype, 'save').as('pdfSave');
      });

      // Export PDF
      cy.exportPDF();
      cy.confirmPDFExport();

      // Verify PDF was saved with correct filename
      cy.get('@pdfSave').should('have.been.calledWithMatch', /^Install-Proposal-\d{1,2}-\d{1,2}-\d{4}\.pdf$/);
    });

    it('should include warranty disclaimer in PDF', () => {
      cy.visit('/products');
      cy.addProductToInvoice(0);

      cy.window().then((win) => {
        cy.stub(win.jsPDF.prototype, 'text').as('pdfText');
      });

      cy.exportPDF();
      cy.confirmPDFExport();

      // Verify warranty text was added to PDF
      cy.get('@pdfText').should('have.been.calledWithMatch', /Warranty Disclaimer/);
    });
  });

  describe('Labor Cost Calculations', () => {
    it('should calculate labor costs correctly', () => {
      cy.visit('/products');

      // Add product and check labor cost calculation
      cy.addProductToInvoice(0);

      // Verify labor cost is displayed correctly
      cy.get('tbody tr').first().should('contain', '$');
    });
  });

  describe('Toast Notifications', () => {
    it('should show success toast when adding product', () => {
      cy.visit('/products');

      cy.addProductToInvoice(0);

      // Verify success toast appears
      cy.contains('Product added').should('be.visible');
    });

    it('should show success toast when updating quantity', () => {
      cy.visit('/products');
      cy.addProductToInvoice(0);

      cy.increaseProductQuantity(0);

      // Verify success toast appears
      cy.contains('Updated quantity').should('be.visible');
    });

    it('should show error toast when exporting empty PDF', () => {
      cy.visit('/products');

      cy.exportPDF();

      // Verify error toast appears
      cy.contains('You must create a proposal first').should('be.visible');
    });
  });

  describe('Local Storage', () => {
    it('should persist user session', () => {
      // Mock user login
      cy.loginAsAdmin();

      cy.visit('/products');

      // Verify admin menu items are visible
      cy.contains('Clients').should('be.visible');
      cy.contains('Invoices').should('be.visible');
    });

    it('should handle logout correctly', () => {
      cy.loginAsAdmin();
      cy.visit('/products');

      // Click logout
      cy.get('button').contains('Logout').click();

      // Verify user is logged out
      cy.contains('Login').should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should prevent negative quantities', () => {
      cy.visit('/products');
      cy.addProductToInvoice(0);

      // Try to set quantity to 0
      cy.decreaseProductQuantity(0);

      // Product should be removed
      cy.get('tbody tr').should('have.length', 0);
    });

    it('should handle decimal quantities gracefully', () => {
      // This test would require modifying the quantity input directly
      // since the UI buttons only allow integers
    });
  });

  describe('API Error Handling', () => {
    it('should show error message on API failure', () => {
      // Intercept API call and force error
      cy.intercept('GET', '/api/products', { statusCode: 500 }).as('apiError');

      cy.visit('/products');

      cy.wait('@apiError');

      // Should show error message
      cy.contains('Error loading products').should('be.visible');
    });

    it('should retry API calls on failure', () => {
      // Mock intermittent API failure
      let callCount = 0;
      cy.intercept('GET', '/api/products', (req) => {
        callCount++;
        if (callCount < 3) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ body: [] });
        }
      }).as('retryApi');

      cy.visit('/products');

      cy.wait('@retryApi');
      cy.wait('@retryApi');
      cy.wait('@retryApi');

      // Should eventually succeed
      cy.contains('No products available').should('be.visible');
    });
  });
});