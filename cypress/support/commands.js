// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom commands for Products page testing
Cypress.Commands.add('addProductToInvoice', (productIndex = 0) => {
  cy.get('button').contains('+ Add').eq(productIndex).click();
});

Cypress.Commands.add('removeProductFromInvoice', (productIndex = 0) => {
  cy.get('tbody tr').eq(productIndex).find('button').contains('✕').click();
});

Cypress.Commands.add('increaseProductQuantity', (productIndex = 0) => {
  cy.get('tbody tr').eq(productIndex).find('button').contains('+').click();
});

Cypress.Commands.add('decreaseProductQuantity', (productIndex = 0) => {
  cy.get('tbody tr').eq(productIndex).find('button').contains('-').click();
});

Cypress.Commands.add('getInvoiceTotal', () => {
  return cy.get('tfoot').contains('Total:').parent().find('td').last();
});

Cypress.Commands.add('exportPDF', () => {
  cy.get('button').contains('Save PDF Proposal').click();
});

Cypress.Commands.add('confirmPDFExport', () => {
  cy.get('button').contains('Yes').click();
});

Cypress.Commands.add('cancelPDFExport', () => {
  cy.get('button').contains('No').click();
});

Cypress.Commands.add('waitForProducts', () => {
  cy.wait(2000); // Wait for products to load
});

Cypress.Commands.add('toggleMobileMenu', () => {
  cy.get('button[aria-label="Toggle menu"]').click();
});

Cypress.Commands.add('loginAsAdmin', () => {
  // Mock admin login - adjust based on your auth implementation
  const adminUser = { name: 'Admin User', role: 'admin' };
  localStorage.setItem('user', JSON.stringify(adminUser));
});

Cypress.Commands.add('loginAsClient', () => {
  // Mock client login - adjust based on your auth implementation
  const clientUser = { name: 'Client User', role: 'client' };
  localStorage.setItem('user', JSON.stringify(clientUser));
});

Cypress.Commands.add('logout', () => {
  localStorage.removeItem('user');
});