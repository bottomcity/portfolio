import { commonBtn, eGamesBtns } from '../enums/btn-names-enums';
import { mainBannerHelper } from '../moduls-helpers/main-banner-helper';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { liveCasinoHelper } from './live-casino-helper';
import { getDictionary } from '../common-functions/locale-functions';

export class LandingPagesHelper {
  elements = {
    favsSection: () => cy.getByTestId('Carousel-favourites'),
    sectionOfLanding: (nameOfSection: string) => {
      return cy.getByTestId(`Carousel-${nameOfSection.toLowerCase()}`);
    },
    loader: () => cy.getByTestId('loader'),
    seoSection: () => cy.getByTestId('seo-section')
  };

  loggedOutFavs() {
    this.elements.favsSection().should('not.exist');
  }

  loggedInFavs() {
    this.elements.favsSection().should('exist').and('be.visible');
  }

  defaultStateFavs() {
    this.elements.favsSection().contains(commonBtn.favs);
    this.elements.favsSection().should('not.contain', commonBtn.moreGame);
  }
  openLobbyPageByClickMoreBtn(nameOfSection: string) {
    this.elements
      .sectionOfLanding(nameOfSection)
      .contains(commonBtn.moreGame)
      .click({ force: true, timeout: 5000 });
    this.elements.loader().click();
  }

  checkAfterActionWithGameInFavs(gameTitle: string, notContain: string) {
    const assertion = notContain ? 'not.contain.text' : 'contain.text';
    this.elements.favsSection().should(assertion, gameTitle);
  }

  addToFavsGame(cardName: string, gameCardIndex: number) {
    let gameTitleOfAddedToFavsGame: string;

    gameCardHelper.elements
      .gameCard(cardName)
      .eq(gameCardIndex)
      .find('h4')
      .first()
      .invoke('text')
      .then((gameTitle: string) => {
        gameTitleOfAddedToFavsGame = gameTitle;
      });

    gameCardHelper.elements
      .gameCard(cardName)
      .eq(gameCardIndex)
      .within(() => {
        gameCardHelper.clickFavsIcon();
      })
      .then(() => {
        liveCasinoHelper.checkAfterActionWithGameInFavs(
          gameTitleOfAddedToFavsGame,
          ''
        );
      });
  }

  removeFromFavsGame(cardName: string) {
    let gameTitleOfAddedToFavsGame: string;

    this.elements
      .favsSection()
      .first()
      .within(() => {
        gameCardHelper.elements
          .gameCard(cardName)
          .first()
          .invoke('text')
          .then((gameTitle: string) => {
            gameTitleOfAddedToFavsGame = gameTitle;
          });
      });

    this.elements
      .favsSection()
      .first()
      .within(() => {
        return gameCardHelper.elements
          .gameCard(cardName)
          .first()
          .within(() => {
            gameCardHelper.clickFavsIcon();
          });
      })
      .then(() => {
        liveCasinoHelper.checkAfterActionWithGameInFavs(
          gameTitleOfAddedToFavsGame,
          'not.'
        );
      });
  }

  swipingCycleBanner() {
    const clickSwipeLeftUntilDisabled = () => {
      mainBannerHelper.elements.swipeLeftBtn().then(($leftBtn) => {
        if ($leftBtn.is(':enabled')) {
          mainBannerHelper.clickSwipeLeftBtn();
          mainBannerHelper.elements
            .playNowBtn()
            .should('be.visible')
            .should(($btn) => {
              const buttonText = $btn.text();
              expect(buttonText).to.include(eGamesBtns.play);
            });
          clickSwipeLeftUntilDisabled(); // Recursive call for left swipe
        }
      });
    };

    const clickSwipeRightUntilDisabled = () => {
      mainBannerHelper.elements.swipeRightBtn().then(($rightBtn) => {
        if ($rightBtn.is(':enabled')) {
          mainBannerHelper.clickSwipeRightBtn();
          // mainBannerHelper.elements
          //   .playNowBtn()
          //   .should('be.visible')
          //   .should(($btn) => {
          //     const buttonText = $btn.text();
          //     expect(buttonText).to.include(eGamesBtns.play);
          //   });
          clickSwipeRightUntilDisabled(); // Recursive call for right swipe
        } else {
          clickSwipeLeftUntilDisabled(); // Start swiping left once right is disabled
        }
      });
    };
    // Start the swiping cycle with right swipe
    clickSwipeRightUntilDisabled();
  }

  checkLoader(locale: string) {
    cy.log('Checking loader...');
    const navBar = getDictionary(locale).nav;

    return this.elements.loader().should('contain', navBar.loading);
  }
}
