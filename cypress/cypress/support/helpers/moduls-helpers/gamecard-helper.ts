class GameCardHelper {
  elements = {
    favsIcon: () => cy.getByTestId('favs-icon'),
    gameCard: (nameOfCard: string) => {
      return cy.getByTestId(`${nameOfCard.toLowerCase()}-card`);
    },
    gameCardBtn: () => cy.getByTestId('game-card-btn')
  };

  clickFavsIcon() {
    this.elements
      .favsIcon()
      .click({ force: true, timeout: 5000, waitForAnimations: true });
  }

  defaultFavsIconFocusedGameCard() {
    this.elements.favsIcon().should('be.visible').and('contain.html', 'hidden');
  }

  addedToFavsIcon() {
    this.elements
      .favsIcon()
      .should('be.visible')
      .and('not.contain.html', 'hidden');
  }
}

export const gameCardHelper = new GameCardHelper();
