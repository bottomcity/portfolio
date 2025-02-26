describe('Button Component Tests', () => {
  it('should interact with the primary button', () => {
    cy.visit('http://localhost:6006/');
    cy.contains('Button').click();
  });
});
