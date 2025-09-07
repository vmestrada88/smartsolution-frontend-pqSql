describe('Login Test', () => {
  it('should load login page and find form elements', () => {
    cy.visit('http://localhost:5173/login');
    cy.url().should('include', '/login');
    
    // Wait for page to load
    cy.get('body').should('be.visible');
    
    // Check for form elements
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    
    // Try to login
    cy.get('input[placeholder="Email"]').type('victor@ss.com');
    cy.get('input[placeholder="Password"]').type('Passw0rd!');
    cy.get('button[type="submit"]').click();
  });
});