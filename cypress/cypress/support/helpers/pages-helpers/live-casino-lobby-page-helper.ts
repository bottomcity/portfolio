import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { LobbyPagesHelper } from './lobby-pages-helper';
import { liveCasinoHelper } from './live-casino-helper';
import { backLobbyBtn } from '../enums/btn-names-enums';
import { registrationPageHelper } from './registration-helper';
import { gamesTableText } from '../enums/body-text-enums';
import { urlText, urlLiveCasino } from '../enums/url-enum';

class LiveCasinoLobbyPageHelper extends LobbyPagesHelper {
  liveCasinoLobbyElements = {
    ...this.elements
  };

  urlCasinoLobby(expectedText: string) {
    registrationPageHelper.checkUrlText(expectedText.toLowerCase());
  }

  openCasinoLobbyPageByClickMoreBtn(
    nameOfSection: string,
    notContainFilteredOutGames1: string,
    notContainFilteredOutGames2: string
  ) {
    liveCasinoHelper.openLobbyPageByClickMoreBtn(nameOfSection);
    this.checkFilterAppliedCorrectly(
      // nameOfGame,
      nameOfSection,
      notContainFilteredOutGames1,
      notContainFilteredOutGames2
    );
    this.searchBarLiveCasinoLobby();
  }

  clickBackToLiveCasinoBtn() {
    this.clickBackBtn(backLobbyBtn.liveCasino);
  }

  searchBarLiveCasinoLobby() {
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.baccarat)
      .should(($a) => {
        expect($a)
          .to.have.attr('href')
          .equal(
            `/${urlText.en}/${urlText.liveCasino}/${urlLiveCasino.baccarat}`
          );
        expect($a).to.be.visible;
      });
    // searchBarHelper.elements
    //   .sectionInLobbyFilterBtn(gamesTableText.stadium)
    //   .should(($a) => {
    //     expect($a)
    //       .to.have.attr('href')
    //       .equal(
    //         `/${urlText.en}/${urlText.liveCasino}/${urlLiveCasino.stadium}`
    //       );
    //     expect($a).to.be.visible;
    //   });
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.sicbo)
      .should(($a) => {
        expect($a)
          .to.have.attr('href')
          .equal(`/${urlText.en}/${urlText.liveCasino}/${urlLiveCasino.sicbo}`);
        expect($a).to.be.visible;
      });
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.roulette)
      .should(($a) => {
        expect($a)
          .to.have.attr('href')
          .equal(
            `/${urlText.en}/${urlText.liveCasino}/${urlLiveCasino.roulette}`
          );
        expect($a).to.be.visible;
      });
    searchBarHelper.elements.sortingDropdown().should('be.visible');
  }

  checkFilterAppliedCorrectly(
    // nameOfGame: string,
    nameOfFilterBtn: string,
    notContainFilteredOutGames1: string,
    notContainFilteredOutGames2: string
  ) {
    let capitalized: String = nameOfFilterBtn;
    capitalized = capitalized[0].toUpperCase() + capitalized.slice(1);
    this.elements.gamesTable().should('be.visible');
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(nameOfFilterBtn)
      .should('have.class', 'text-yellow-1');
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(notContainFilteredOutGames1)
      .should('not.have.class', 'text-yellow-1');
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(notContainFilteredOutGames2)
      .should('not.have.class', 'text-yellow-1');
    // .children()
    // .should('contain', capitalized)
    // .and('not.contain', notContainFilteredOutGames1)
    // .and('not.contain', notContainFilteredOutGames2);
    this.urlCasinoLobby(nameOfFilterBtn);
  }
}

export const liveCasinoLobbyPageHelper = new LiveCasinoLobbyPageHelper();
