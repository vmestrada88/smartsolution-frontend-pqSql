/**
 * @file Cypress end-to-end test for the full flow of adding a client as admin.
 * This test logs in as admin, adds a new client, and verifies the client appears in the list.
 */

/**
 * End-to-end test: add client as admin and verify in list.
 */
describe('Full flow: add client as admin', () => {
  /**
   * Should allow admin to add a new client and see it in the list.
   */
  it('should allow admin to add a new client and see it in the list', () => {
    // 1. Login as admin
    cy.visit('http://localhost:5173/login');
    cy.get('input[placeholder="Email"]').type('victor@ss.com');
    cy.get('input[placeholder="Password"]').type('Passw0rd!');
    cy.get('button[type="submit"]').click();

    // 2. Go to the clients page
    cy.contains('Clients').click(); // Adjust the text according to your menu

    // 3. Press the "Add New Client" button
    cy.contains('Add New Client').click();

    // 4. Fill out the form
    cy.get('input[placeholder="Company Name"]').type('Empresa Test');
    cy.get('input[placeholder="Address"]').type('Calle Falsa 123');
    cy.get('input[placeholder="City"]').type('Ciudad Test');
    cy.get('input[placeholder="State"]').type('Estado Test');
    cy.get('input[placeholder="Zip Code"]').type('12345');
    cy.get('input[placeholder="Name"]').type('Juan Pérez');
    cy.get('input[placeholder="Email"]').type('juan@test.com');
    cy.get('input[placeholder="Phone"]').type('5551234567');
    cy.get('input[placeholder="Role (e.g. owner, assistant)"]').type('Dueño');
    cy.get('button[type="submit"]').click();

    // 5. Check that the client appears in the list
    cy.contains('Empresa Test').should('exist');
  });
});