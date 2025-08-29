describe('Página principal', () => {
  it('debe cargar correctamente', () => {
    cy.visit('http://localhost:5173'); // Cambia el puerto si usas otro
    cy.contains('Home').should('exist'); // Cambia 'Home' por texto visible en tu página
  });
});