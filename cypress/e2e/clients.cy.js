describe('Clients Page', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('/login');

    // Enter test credentials
    cy.get('input[type="email"]').type('victor@ss.com');
    cy.get('input[type="password"]').type('Passw0rd!');

    // Click the Login button
    cy.get('button').contains('Login').click();

    // Verify login was successful (e.g., redirected or element appears)
    // Assuming after login redirects to / or dashboard appears
    cy.url().should('not.include', '/login'); // Or verify a specific post-login element
  });

  it('should load the clients page', () => {
    // Navigate to the clients page (adjust route if different)
    cy.visit('/clients');

    // Verify the page loads (e.g., title or client list)
    cy.contains('Clients').should('be.visible'); // Adjust based on actual content
  });

  it('should display a list of clients', () => {
    cy.visit('/clients');
    // Wait for API to load and verify the list (uses <ul> from ClientList)
    cy.get('ul.divide-y').should('exist'); // Selector based on Tailwind classes in ClientList
  });

  // Add more tests based on functionalities (e.g., add client, edit)
});