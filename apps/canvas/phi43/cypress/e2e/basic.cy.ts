describe('kaleidoscope', () => {
  it('rotates monocle', () => {
    cy.visit('/play/kaleidoscope');
    cy.wait(600);
    cy.get('canvas').should('exist');
  });
});
