import { gamesTableText } from '../enums/body-text-enums';
import { commonBtn, slotsBtnsTitles } from '../enums/btn-names-enums';
import { sortDropdown } from '../enums/dropdowns-data-enums';
import { randomNumber } from '../common-functions/generate-number';
import { gameCardHelper } from './gamecard-helper';

export class SearchBarHelper {
  elements = {
    sectionInLobbyFilterBtn: (nameOfSection: string) => {
      return cy.getByTestId(`${nameOfSection.toLowerCase()}-filter-btn`);
    },
    searchBar: () => cy.getByTestId('search-bar'),
    favsBtn: () => cy.getByTestId('favs-btn'),
    searchInput: () => cy.getByTestId('search-input'),
    modalOfSearchBar: (nameOfModal: string) => {
      return cy.getByTestId(`${nameOfModal.toLowerCase()}-modal`);
    },
    closeModalBtn: () => cy.getByTestId('close-modal-btn'),
    filterSortingModalBtn: () => cy.getByTestId('filter-sort-btn'),
    sortingDropdown: () => cy.getByTestId('sort-dropdown'),
    //below buttons in live slots search bar
    turnOnClassicViewBtn: () => cy.getByTestId('classic-view-btn'),
    jackpotsDropdown: () => cy.getByTestId('jackpots-dropdown'),
    providerDropdown: () => cy.getByTestId('provider-dropdown'),
    vacancyCheckbox: () => cy.getByTestId('vacancy-checkbox')
  };

  checkSearchBar(text: string) {
    this.elements.searchBar().should('contain.text', text);
  }

  checkSearchBarVisible() {
    this.elements.searchBar().should('be.visible');
  }

  checkSearchBarNotExist() {
    this.elements.searchBar().should('not.exist');
  }

  inputDataSearchInput(searchData: any) {
    this.elements.searchInput().type(searchData);
  }

  closeSearch() {
    this.elements.closeModalBtn().click({ timeout: 12000 });
  }

  searchResultsContain(
    nameOfModal: string,
    searchData: string,
    gameCardType: string
  ) {
    this.elements.modalOfSearchBar(nameOfModal).each(($modal) => {
      cy.wrap($modal).within(() => {
        gameCardHelper.elements
          .gameCard(gameCardType)
          .should('contain.text', searchData);
      });
    });
  }

  searchWithNoResults(nameOfModal: string) {
    this.inputDataSearchInput(randomNumber);
    this.elements
      .modalOfSearchBar(nameOfModal)
      .should('contain.text', gamesTableText.noMoreGamesSearchResult);
  }

  clickFavsBtn() {
    this.elements.favsBtn().contains(commonBtn.favs).click({ timeout: 12000 });
  }

  clickFilterSortingModalBtn() {
    this.elements.filterSortingModalBtn().click({ timeout: 12000 });
  }

  openSortingDropdown() {
    cy.scrollTo('top', { duration: 1000 });
    this.elements
      .sortingDropdown()
      .first()
      .contains(commonBtn.sortBy)
      .click({ timeout: 12000 });
    this.elements
      .sortingDropdown()
      .find('ul')
      .find('li')
      .should(($li) => {
        expect($li.eq(0)).to.have.text(sortDropdown.asc);
        expect($li.eq(1)).to.have.text(sortDropdown.desc);
        // waiting API implementation
        //expect($li.eq(2)).to.have.text(sortDropdown.newest);
        //expect($li.eq(3)).to.have.text(sortDropdown.topRated);
      });
  }

  applySorting(typeOfSort: string) {
    this.openSortingDropdown();
    this.elements
      .sortingDropdown()
      .contains(typeOfSort)
      .click({ timeout: 12000 });
  }

  openJackpotsDropdown() {
    this.elements
      .jackpotsDropdown()
      .contains(slotsBtnsTitles.jackpots)
      .click({ timeout: 12000 });
  }

  openProviderDropdown() {
    this.elements
      .providerDropdown()
      .contains(slotsBtnsTitles.provider)
      .click({ timeout: 12000 });
  }

  applyInLobbyFilter(nameOfFilterBtn: string) {
    this.elements
      .sectionInLobbyFilterBtn(nameOfFilterBtn)
      .contains(nameOfFilterBtn)
      .click({ timeout: 5000 }),
      this.checkInLobbyFilterButton(nameOfFilterBtn);
  }

  checkInLobbyFilterButton(nameOfFilterBtn: string) {
    this.elements
      .sectionInLobbyFilterBtn(nameOfFilterBtn)
      .should('have.class', 'text-yellow-1');
  }
}
export const searchBarHelper = new SearchBarHelper();
