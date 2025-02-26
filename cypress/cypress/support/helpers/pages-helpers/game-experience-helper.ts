import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { eGamesBtns, submitBtn } from '../enums/btn-names-enums';

class GameExperienceHelper {
  elements = {
    iframeOfGame: () => cy.getByTestId('iframe'),
    closeGameBtn: () => cy.getByTestId('close-game-btn'),
    fullScreenBtn: () => cy.getByTestId('full-screen-btn'),
    exitLobbyPopup: () => cy.getByTestId('exit-lobby-popup'),
    confirmBtn: () => cy.getByTestId('confirm-btn'),
    cancelBtn: () => cy.getByTestId('cancel-btn')
  };

  clickCloseIframeBtn() {
    this.elements.closeGameBtn().click({ timeout: 5000, force: true });
  }

  clickFullScreenIframeBtn() {
    this.elements.fullScreenBtn().click({ timeout: 5000, force: true });
  }

  fullScreenIframeOpened() {
    this.elements.closeGameBtn().should('not.be.visible');
    this.elements.fullScreenBtn().should('not.be.visible');
  }

  openeGame(
    nameOfCard: string,
    nameOfButton: string,
    nameOfGame: string,
    notExist?: string
  ) {
    gameCardHelper.elements
      .gameCard(nameOfCard)
      // .contains(nameOfGame)
      // .parentsUntil(`article.${nameOfCard}-card`)
      .first()
      .within(($card) => {
        cy.wrap($card)
          .find('div.hidden')
          .invoke('removeClass', 'hidden')
          .then(() => {
            const assertion = notExist ? 'not.exist' : 'exist';

            gameCardHelper.elements.favsIcon().should(assertion);
            gameCardHelper.elements
              .gameCardBtn()
              .contains(nameOfButton)
              .click({ force: true, timeout: 15000 });
          });
      });
  }

  openCasinoGame(
    nameOfCard: string,
    nameOfButton: string,
    nameOfGame: string,
    notExist?: string
  ) {
    gameCardHelper.elements
      .gameCard(nameOfCard)
      .contains(nameOfGame)
      .parentsUntil(`article.${nameOfCard}-card`)
      .then(($card) => {
        cy.wrap($card)
          .find('div.hidden')
          .invoke('removeClass', 'hidden')
          .then(() => {
            const assertion = notExist ? 'not.exist' : 'exist';

            gameCardHelper.elements.favsIcon().should(assertion);
            gameCardHelper.elements
              .gameCardBtn()
              .contains(nameOfButton)
              .click({ force: true, timeout: 15000 });
          });
      });
  }

  openExitLobbyPopup() {
    this.clickCloseIframeBtn();
    this.elements.exitLobbyPopup().should('be.visible');
    this.elements.cancelBtn().should('be.visible');
    this.elements.confirmBtn().should('be.visible');
  }

  closeExitLobbyPopup() {
    this.elements
      .cancelBtn()
      .contains(eGamesBtns.cancel)
      .click({ timeout: 5000 });
    this.elements.exitLobbyPopup().should('not.exist');
  }

  closeGameIframe() {
    this.openExitLobbyPopup();
    this.elements
      .confirmBtn()
      .contains(submitBtn.confirm)
      .click({ timeout: 5000, waitForAnimations: true });
  }

  gameIframeOpened() {
    this.elements.iframeOfGame().should('be.visible');
    this.elements.closeGameBtn().should('be.visible');
    this.elements.fullScreenBtn().should('be.visible');
  }

  gameIframeLoaded() {
    return this.elements
      .iframeOfGame()
      .its('0.contentDocument.body')
      .should('not.be.empty');
  }

  findElementInIframe(selector: string, content?: string) {
    this.elements
      .iframeOfGame()
      .its('0.contentDocument.body')
      .find(selector, { timeout: 60000, includeShadowDom: true })
      .should('contain', content)
      .and('be.visible');
  }

  clickElementInIframe(selector: string, text: string) {
    this.elements
      .iframeOfGame()
      .its('0.contentDocument.body')
      .find(selector)
      .contains(text)
      .click();
  }
}
export const gameExperienceHelper = new GameExperienceHelper();
