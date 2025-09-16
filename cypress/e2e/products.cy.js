describe('Products Page', () => {
  it('should load the products page', () => {
    // Navigate to the products page
    cy.visit('/products');

    // Verify the page loads with the title
    cy.contains('Our Catalog').should('be.visible');
  });

  it('should display the product list', () => {
    cy.visit('/products');
    // Verify ProductList renders (check for product items or list)
    cy.get('ul.space-y-3').should('exist'); // Based on ProductList.jsx structure
  });

  it('should add a product to the invoice', () => {
    cy.visit('/products');
    // Click the first "Add" button in ProductList
    cy.get('button').contains('+ Add').first().click();
    // Verify the product appears in the floating table
    cy.get('table').should('contain', 'Product'); // Check if table has content
  });

  it('should display the floating invoice table', () => {
    cy.visit('/products');
    // Verify the sticky table is present
    cy.get('.sticky.top-0').should('be.visible');
  });

  it('should add multiple products to the invoice', () => {
    cy.visit('/products');
    // Wait for products to load
    cy.wait(2000);
    // Add the first product twice (to simulate multiple additions)
    cy.get('button').contains('+ Add').first().click();
    cy.get('button').contains('+ Add').first().click();
    // Verify the table has at least 1 row and quantity is 2
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').first().find('span').contains('2').should('be.visible');
  });

  it('should update product quantity in the invoice', () => {
    cy.visit('/products');
    // Add a product
    cy.get('button').contains('+ Add').first().click();
    // Click the + button to increase quantity
    cy.get('tbody tr').first().find('button').contains('+').click();
    // Verify quantity is 2
    cy.get('tbody tr').first().find('span').contains('2').should('be.visible');
  });

  it('should remove a product from the invoice', () => {
    cy.visit('/products');
    // Add a product
    cy.get('button').contains('+ Add').first().click();
    // Click the remove button (✕)
    cy.get('tbody tr').first().find('button').contains('✕').click();
    // Verify the table is empty or has no rows
    cy.get('tbody tr').should('have.length', 0);
  });

  // Add more tests as needed (e.g., export PDF)
});