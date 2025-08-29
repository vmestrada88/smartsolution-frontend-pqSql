describe('Login', () => {
it('should display the login form and allow entering credentials', () => {
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('test123');
    cy.get('button[type="submit"]').click();

   cy.contains('Test User').should('exist');
});
});