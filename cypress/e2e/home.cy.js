describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/'); // Asumiendo que Home se renderiza en la ruta principal
  });

  it('should display the logo', () => {
    cy.get('img[alt="Smart Solution Logo"]').should('be.visible');
  });

  it('should display the main title', () => {
    cy.contains('h1', 'Smart Solution for Living').should('be.visible');
  });

  it('should display the description paragraph', () => {
    cy.contains('p', 'We provide reliable, intelligent low-voltage and smart security solutions for modern homes and businesses.').should('be.visible');
  });

  it('should display the Contact Us button', () => {
    cy.contains('button', 'Contact Us').should('be.visible');
  });

  it('should open the contact modal when Contact Us button is clicked', () => {
    cy.contains('button', 'Contact Us').click();
    // El modal usa 'fixed inset-0' para el overlay, así que verifica ese selector
    cy.get('.fixed.inset-0').should('be.visible');
  });

  it('should display the Services component', () => {
    // Asumiendo que Services tiene un elemento identificable, e.g., un título o clase
    cy.contains('Services').should('be.visible'); // Ajusta si Services tiene un título específico
  });
});