export function windowStub() {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('open');
  });
}

export function urlNewTab(urlText: string, target?: string) {
  if (target === '_blank') {
    cy.get('@open').should('be.calledWith', urlText, '_blank');
  }
}
