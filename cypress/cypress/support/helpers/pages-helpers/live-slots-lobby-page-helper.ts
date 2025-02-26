import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { LobbyPagesHelper } from './lobby-pages-helper';
import {
  backLobbyBtn,
  commonBtn,
  eGamesBtns,
  slotsBtnsTitles
} from '../enums/btn-names-enums';
import { liveSlotsHelper } from './live-slots-helper';
import { loginPageHelper } from './login-helper';
import { gamesTableText } from '../enums/body-text-enums';
import { urlText } from '../enums/url-enum';

class LiveSlotsLobbyPageHelper extends LobbyPagesHelper {
  liveSlotsLobbyElements = {
    ...this.elements,
    classicSlotsCarousel: () => cy.getByTestId('classic-slots-carousel'),
    swipeSlotsRightBtn: () => cy.getByTestId('slots-carousel-arrow-next'),
    swipeSlotsLeftBtn: () => cy.getByTestId('slots-carousel-arrow-prev'),
    classicSlotsCard: () => cy.getByTestId('classic-live-slots-card')
  };

  clickSwipeSlotsRightBtn() {
    this.liveSlotsLobbyElements.swipeSlotsRightBtn().click({ timeout: 5000 });
  }

  clickSwipeSlotsLeftBtn() {
    this.liveSlotsLobbyElements.swipeSlotsLeftBtn().click({ timeout: 5000 });
  }

  openSlotsGameByClickClassicSlotsCardBtn() {
    this.liveSlotsLobbyElements
      .classicSlotsCard()
      .contains(eGamesBtns.play)
      .should('not.contain', gamesTableText.hardwareError)
      .click({ timeout: 5000 });
  }

  searchBarLiveSlotsLobby() {
    this.elements.backBtn().contains(backLobbyBtn.liveSlots);
    liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.classicView);
    searchBarHelper.elements.searchInput().should('be.visible').and('be.empty');
    searchBarHelper.elements.jackpotsDropdown().should('be.visible'),
      //   searchBarHelper.elements.providerDropdown().should('be.visible'),
      //   searchBarHelper.elements.vacancyCheckbox().should('be.visible'),
      searchBarHelper.elements.sortingDropdown().should('be.visible');
  }

  searchBarLiveSlotsLobbyClassic() {
    // this.elements.backBtn().contains(backLobbyBtn.liveSlots);
    liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.modernView);
    searchBarHelper.elements.searchInput().should('be.visible').and('be.empty');
    // searchBarHelper.elements.jackpotsDropdown().should('be.visible'),
    //   searchBarHelper.elements.providerDropdown().should('be.visible'),
    //   searchBarHelper.elements.vacancyCheckbox().should('be.visible'),
    // searchBarHelper.elements.sortingDropdown().should('be.visible');
  }

  searchBarJackpotsLobby() {
    this.elements.backBtn().contains(backLobbyBtn.liveSlots);
    // searchBarHelper.elements.jackpotsDropdown().should('be.visible'),
    //   searchBarHelper.elements.providerDropdown().should('be.visible'),
    //   searchBarHelper.elements.sortingDropdown().should('be.visible');
  }

  backBtnNotexists() {
    this.elements.backBtn().should('not.exist');
  }

  openSlotsLobbyPage() {
    liveSlotsHelper.elements
      .sectionOfLanding(slotsBtnsTitles.standalone.toLowerCase())
      .contains(commonBtn.moreGame)
      .click({ timeout: 5000 });
  }

  openJackpotsLobbyPage() {
    liveSlotsHelper.elements
      .sectionOfLanding(slotsBtnsTitles.jackpots.toLowerCase())
      .contains(commonBtn.moreJackpot)
      .click({ timeout: 5000 });
  }

  clickBackToLiveSlotsBtn() {
    this.clickBackBtn(backLobbyBtn.liveSlots);
    liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.classicView);
  }

  uncheckVacancyCheckbox() {
    searchBarHelper.elements
      .vacancyCheckbox()
      .contains(slotsBtnsTitles.vacancy)
      .click();
  }

  checkingTextClassicView(textInPage: string) {
    this.liveSlotsLobbyElements
      .classicSlotsCarousel()
      .should('not.include.text', textInPage);
  }

  checkVacancyCheckbox() {
    searchBarHelper.elements
      .vacancyCheckbox()
      .contains(slotsBtnsTitles.vacancy)
      .click();
  }

  applyProviderFilter(nameOfFilterBtn: string) {
    searchBarHelper.elements
      .providerDropdown()
      .contains(nameOfFilterBtn)
      .click()
      .next()
      .find('li')
      .last()
      .invoke('text') // Use invoke('text') to get the text content
      .then((ContainData: string) => {
        cy.wrap(ContainData);
        searchBarHelper.elements
          .providerDropdown()
          .find('li')
          .first()
          .invoke('text')
          .then((notContainData: string) => {
            cy.wrap(notContainData);
            searchBarHelper.elements
              .providerDropdown()
              .find('li')
              .last()
              .click();
            searchBarHelper.elements.providerDropdown().contains(ContainData);
            this.elements
              .gamesTable()
              .should('contain', ContainData)
              .and('not.contain', notContainData);
          });
      });
  }

  applyJackpotsFilter(nameOfFilterBtn: string) {
    searchBarHelper.elements
      .jackpotsDropdown()
      .contains(nameOfFilterBtn)
      .click()
      .next()
      .find('li')
      .last()
      .invoke('text') // Use invoke('text') to get the text content
      .then((ContainData: string) => {
        cy.wrap(ContainData);
        searchBarHelper.elements
          .jackpotsDropdown()
          .find('li')
          .first()
          .invoke('text')
          .then((notContainData: string) => {
            cy.wrap(notContainData);
            searchBarHelper.elements
              .jackpotsDropdown()
              .find('li')
              .last()
              .click();
            searchBarHelper.elements.jackpotsDropdown().contains(ContainData);
            this.elements
              .gamesTable()
              .should('contain', ContainData)
              .and('not.contain', notContainData);
          });
      });
  }

  swipingCycleClassicLobbySlots() {
    const clickSwipeSlotsLeftUntilDisabled = () => {
      this.liveSlotsLobbyElements.swipeSlotsLeftBtn().then(($leftBtn) => {
        if ($leftBtn.is(':enabled')) {
          liveSlotsLobbyPageHelper.clickSwipeSlotsLeftBtn();
          clickSwipeSlotsLeftUntilDisabled(); // Recursive call for left swipe
        }
      });
    };

    const clickSwipeSlotsRightUntilDisabled = () => {
      this.liveSlotsLobbyElements.swipeSlotsRightBtn().then(($rightBtn) => {
        if ($rightBtn.is(':enabled')) {
          liveSlotsLobbyPageHelper.clickSwipeSlotsRightBtn();
          clickSwipeSlotsRightUntilDisabled(); // Recursive call for right swipe
        } else {
          clickSwipeSlotsLeftUntilDisabled(); // Start swiping left once right is disabled
        }
      });
    };
    // Start the swiping cycle with right swipe
    clickSwipeSlotsRightUntilDisabled();
  }

  searchWithResultsSlotsClassicView(nameOfModal: string) {
    this.liveSlotsLobbyElements
      .classicSlotsCard()
      .first()
      .find('div')
      .first()
      .invoke('text')
      .then((machineID) => {
        expect(machineID).to.match(/^\d+$/);
        const machineIDForSearch = machineID.slice(0, -2);
        cy.wrap(machineIDForSearch).then((machineIDForSearch) => {
          searchBarHelper.elements.searchInput().type(machineIDForSearch);
          searchBarHelper.searchResultsContain(
            nameOfModal,
            machineIDForSearch,
            urlText.classicLiveSlots
          );
          searchBarHelper.searchResultsContain(
            nameOfModal,
            machineIDForSearch,
            urlText.classicLiveSlots
          );
        });
      });
  }

  clickPlayNowSlotsCardClassicView() {
    this.liveSlotsLobbyElements
      .classicSlotsCard()
      .first()
      .contains(eGamesBtns.play)
      .click({ timeout: 15000 });
  }

  loggedOutRedirectToLoginClassicView() {
    this.clickPlayNowSlotsCardClassicView();
    loginPageHelper.urlLogin();
  }
}

export const liveSlotsLobbyPageHelper = new LiveSlotsLobbyPageHelper();
