import { searchBarHelper, SearchBarHelper } from './search-bar-helper';
import { eGamesHelper } from '../pages-helpers/egames-helper';
import {
  eGamesBodyTitle,
  gamesTableText,
  inputsPlaceholders
} from '../enums/body-text-enums';
import { urlText } from '../enums/url-enum';
import { gameCardHelper } from './gamecard-helper';
import { randomNumber } from '../common-functions/generate-number';
import { eGamesLobbyHelper } from '../pages-helpers/egames-lobby-helper';

class FilterModalHelper extends SearchBarHelper {
  filterModalElements = {
    categorySection: () => cy.getByTestId('category-section'),
    providerSection: () => cy.getByTestId('provider-section'),
    headerOfModal: () => cy.getByTestId('header-modal')
  };

  openFilterSortingModalBtn() {
    searchBarHelper.clickFilterSortingModalBtn();
    this.elements
      .modalOfSearchBar(inputsPlaceholders.filter)
      .should('be.visible');
  }

  defaultFilterModalState() {
    this.elements.modalOfSearchBar(inputsPlaceholders.filter).each(() => {
      eGamesHelper.searchBarEgamesLoggedOut();
      this.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.evolution)
        .should('be.visible');
      this.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.evoplay)
        .should('be.visible');
      this.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.netent)
        .should('be.visible');
      this.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.noLimitCity.replace(/\s/g, ''))
        .should('be.visible');
      this.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.redtiger)
        .should('be.visible');
    });
  }

  searchWithNoResultsFilterModal(nameOfModal: string) {
    this.elements.modalOfSearchBar(inputsPlaceholders.filter).each(($modal) => {
      cy.wrap($modal)
        .within(() => {
          searchBarHelper.elements.searchInput().last().type(randomNumber);
        })
        .then(() => {
          // Wait for the modal to update
          cy.wait(1000);

          this.elements
            .modalOfSearchBar(nameOfModal)
            .should('contain.text', gamesTableText.nothingFound);
          searchBarHelper.elements.searchInput().last().clear();
          cy.wait(1000);
        });
    });
  }

  changingOfShowedGamesAfterSearch(gameTitle: string) {
    this.elements
      .modalOfSearchBar(inputsPlaceholders.filter)
      .find('h2')
      .invoke('text');
  }

  searchWithResultsFilterModal() {
    let beforeSearchText: string;

    // Refactor later within cypress custom command
    this.elements
      .modalOfSearchBar(inputsPlaceholders.filter)
      .find('h2')
      .last()
      .invoke('text')
      .then((headerText) => {
        beforeSearchText = headerText;
      });

    return gameCardHelper.elements
      .gameCard(urlText.eGames)
      .last()
      .find('div')
      .last()
      .invoke('text')
      .then((gameTitle) => {
        const gameTitleForSearch = gameTitle.trim().slice(0, -5);
        return cy.wrap(gameTitleForSearch).then(() => {
          return this.elements
            .modalOfSearchBar(inputsPlaceholders.filter)
            .each(($modal) => {
              cy.wrap($modal).within(() => {
                searchBarHelper.elements.searchInput().type(gameTitleForSearch);
              });
            })
            .then(() => {
              // Wait for the modal to update
              cy.wait(1000);
              // Refactor later within cypress custom command
              this.elements
                .modalOfSearchBar(inputsPlaceholders.filter)
                .find('h2')
                .last()
                .invoke('text')
                .then((afterSearchText) => {
                  // Check if the text changes after search
                  expect(afterSearchText).not.to.equal(beforeSearchText);
                });
              this.searchResultsContain(
                inputsPlaceholders.filter,
                gameTitle,
                urlText.eGames
              );
            });
        });
      });
  }

  clickFilterModalBtn(nameOfBtn: string) {
    // method is used for apply and unapply filter
    return this.elements
      .sectionInLobbyFilterBtn(nameOfBtn)
      .filter(':visible')
      .click({ timeout: 5000, waitForAnimations: true });
  }

  checkApplyingFilterInModal(nameOfBtn: string) {
    let beforeSearchText: string;

    // Refactor later within cypress custom command
    this.elements
      .modalOfSearchBar(inputsPlaceholders.filter)
      .find('h2')
      .last()
      .invoke('text')
      .then((headerText) => {
        beforeSearchText = headerText;
      });

    this.clickFilterModalBtn(nameOfBtn).then(() => {
      // Wait for the modal to update
      cy.wait(1000);

      // Refactor later within cypress custom command
      this.elements
        .modalOfSearchBar(inputsPlaceholders.filter)
        .find('h2')
        .last()
        .invoke('text')
        .then((afterSearchText) => {
          // Check if the text changes after search
          expect(afterSearchText).not.to.equal(beforeSearchText);
        });
    });
  }

  loadMoreGamesUntilBtnDisappearInModal(
    nameOfCard: string,
    numberOfCardsInLobby: number
  ) {
    eGamesLobbyHelper.elements.gamesTable().each(($modal) => {
      cy.wrap($modal).within(() => {
        eGamesLobbyHelper.loadMoreGamesUntilBtnDisappear(
          inputsPlaceholders.filter,
          nameOfCard,
          numberOfCardsInLobby
        );
      });
    });
  }
}

export const filterModalHelper = new FilterModalHelper();
