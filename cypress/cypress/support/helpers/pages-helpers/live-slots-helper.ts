import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { LandingPagesHelper } from './landing-pages-helper';
import {
  commonBtn,
  eGamesBtns,
  slotsBtnsTitles
} from '../enums/btn-names-enums';
import { registrationPageHelper } from './registration-helper';
import { loginPageHelper } from './login-helper';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { urlText } from '../enums/url-enum';
import { gamesTableText } from '../enums/body-text-enums';
import { getDictionary } from '../common-functions/locale-functions';

class LiveSlotsHelper extends LandingPagesHelper {
  liveSlotsLandingElements = {
    ...this.elements,
    jackpotCard: () => cy.getByTestId('jackpots-card'),
    newSlotsSection: () => cy.getByTestId('Carousel-new'),
    jackpotsCarousel: () => cy.getByTestId('Carousel-jackpots'),
    jackpotsCarouselClassic: () => cy.getByTestId('classic-slots-carousel'),
    jinJiBaoXi60MSection: () => cy.getByTestId('Carousel-3'),
    lightningLinkSection: () => cy.getByTestId('Carousel-4'),
    jinJiBaoXi50MSection: () => cy.getByTestId('Carousel-3'),
    liveSlotsCard: () => cy.getByTestId('live-slots-card')
  };

  urlSlots() {
    registrationPageHelper.checkUrlText(urlText.liveSlots);
  }

  checkJackpotClassicCarouselVisible() {
    this.liveSlotsLandingElements
      .jackpotsCarouselClassic()
      .should('be.visible');
  }

  checkJackpotCarouselVisible() {
    this.liveSlotsLandingElements.jackpotsCarousel().should('be.visible');
  }

  checkJackpotCarouselNotExist() {
    this.liveSlotsLandingElements.jackpotsCarousel().should('be.not.exist');
  }

  clickPlayNowSlotsCardToOpenWorkableGame() {
    this.elements
      .sectionOfLanding(slotsBtnsTitles.standalone)
      .first()
      .within(() => {
        gameCardHelper.elements
          .gameCard(urlText.liveSlots)
          .first()
          .find('div.hidden')
          .invoke('removeClass', 'hidden')
          .then(() => {
            gameCardHelper.elements.favsIcon().should('not.exist');
            gameCardHelper.elements
              .gameCard(urlText.liveSlots)
              .contains(gamesTableText.available);
            gameCardHelper.elements
              .gameCardBtn()
              .contains(eGamesBtns.play)
              .click({ timeout: 15000, force: true });
          });
      });
  }

  clickPlayNowJackpotsCard() {
    gameCardHelper.elements
      .gameCard(slotsBtnsTitles.jackpots.toLowerCase())
      .first()
      .contains(eGamesBtns.play)
      .click({ timeout: 15000 });
  }

  loggedOutRedirectToLoginSlots() {
    this.clickPlayNowSlotsCardToOpenWorkableGame();
    loginPageHelper.urlLogin();
  }

  searchWithResultsSlots(nameOfModal: string) {
    gameCardHelper.elements
      .gameCard(urlText.liveSlots)
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
            urlText.liveSlots
          );
          searchBarHelper.searchResultsContain(
            nameOfModal,
            machineID,
            urlText.liveSlots
          );
        });
      });
  }

  defaultOrderForSlots() {
    this.elements
      .sectionOfLanding(slotsBtnsTitles.jackpots)
      .should('contain', commonBtn.moreJackpot)
      .and('contain', slotsBtnsTitles.jackpots);
    // this.liveSlotsLandingElements
    //   .newSlotsSection()
    //   .should('contain', commonBtn.moreGame);
    // this.liveSlotsLandingElements
    //   .jinJiBaoXi60MSection()
    //   .should('contain', commonBtn.moreGame);
    // this.liveSlotsLandingElements
    //   .lightningLinkSection()
    //   .should('contain', commonBtn.moreGame);
    // this.liveSlotsLandingElements
    //   .jinJiBaoXi50MSection()
    //   .should('contain', commonBtn.moreGame);
    this.elements
      .sectionOfLanding(slotsBtnsTitles.standalone)
      .should('contain', commonBtn.moreGame)
      .and('contain', slotsBtnsTitles.standalone);
  }

  checkJackpotSection() {
    liveSlotsHelper.elements.sectionOfLanding(
      slotsBtnsTitles.jackpots.toLowerCase()
    );
  }

  searchBarLiveSlots(nameOfBtn: string) {
    // for MVP no buttons below
    searchBarHelper.elements.jackpotsDropdown().should('be.visible'),
      // searchBarHelper.elements.providerDropdown().should('be.visible'),
      // searchBarHelper.elements.vacancyCheckbox().should('be.visible'),
      this.checkNameOfSlotsViewBtn(nameOfBtn);
    searchBarHelper.elements.searchInput().should('be.visible').and('be.empty');
  }

  searchBarLiveSlotsClassic(nameOfBtn: string) {
    // for MVP no buttons below
    searchBarHelper.elements.jackpotsDropdown().should('be.not.exist'),
      // searchBarHelper.elements.providerDropdown().should('be.visible'),
      // searchBarHelper.elements.vacancyCheckbox().should('be.visible'),
      this.checkNameOfSlotsViewBtn(nameOfBtn);
    searchBarHelper.elements.searchInput().should('be.visible').and('be.empty');
  }

  checkNameOfSlotsViewBtn(nameOfBtn: string) {
    return searchBarHelper.elements.turnOnClassicViewBtn().contains(nameOfBtn);
  }

  getClassicViewUrl(pageURL: string) {
    const convertedURL = pageURL.replace(/_/g, '-');
    return `/${urlText.classicLiveSlots}?prevPath=/${convertedURL}`;
  }

  checkClassicViewBtn(pageURL: string) {
    searchBarHelper.elements
      .turnOnClassicViewBtn()
      .should(
        'have.attr',
        'href',
        `/${urlText.classicLiveSlots}?prevPath=/${pageURL}`
      );
  }

  checkModernViewBtn(pageURL: string) {
    searchBarHelper.elements
      .turnOnClassicViewBtn()
      .should('have.attr', 'href', `/${pageURL}`);
  }

  switchSlotsView(nameOfBtn: string) {
    this.checkNameOfSlotsViewBtn(nameOfBtn).click({
      force: true,
      timeout: 12000
    });
  }

  checkTranslations(locale: string) {
    const dict = getDictionary(locale);
    const searchBar = dict.searchBar;
    const heroTextSectionLiveSlots = dict.heroTextSectionLiveSlots;
    const liveSlotsPage = dict.liveSlotsPage;
    const banners = liveSlotsPage.banners;
    const availableStatus = liveSlotsPage.availableStatus;
    // const sliderNames = liveSlotsPage.sliderNames;

    searchBarHelper.elements
      .searchInput()
      .should('have.attr', 'placeholder', searchBar.typeToSearch);

    // if (locale === 'en') {
    //   cy.intercept('GET', `/${locale}/live-slots/standalone?_rsc=xm0td`).as( // 1hozr // 12vfh
    //     'getCards'
    //   );
    // }

    // else if (locale === 'kr') {
    //   cy.intercept('GET', `/${locale}/live-slots/standalone?_rsc=12vfh`).as(
    //     'getCards'
    //   );
    // }

    // else if (locale === 'cn') {
    //   cy.intercept('GET', `/${locale}/live-slots/standalone?_rsc=1hozr`).as(
    //     'getCards'
    //   );
    // }

    cy.get('footer').scrollIntoView({ duration: 5000 });
    cy.scrollTo('top', { duration: 5000 });
    // cy.wait('@getCards', { timeout: 90000 });
    // this.liveSlotsLandingElements.liveSlotsCard().then(($card) => {
    //   // available status
    //   expect($card[1]).contain(availableStatus.hardwareError);
    //   expect($card[$card.length - 1]).contain(availableStatus.available);
    // });

    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        //search bar
        expect(text).contain(searchBar.turnOnClassicView);
        expect(text).contain(searchBar.jackpotsSelect.title);

        //SEO text
        expect(text).contain(heroTextSectionLiveSlots.title);
        expect(text).contain(heroTextSectionLiveSlots.text);

        //live slots banners
        expect(text).contain(banners.first.title1);
        // expect(text).contain(banners.first.title2);
        expect(text).contain(banners.first.action);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking locale for Live Slots page...');
    // cy.checkLinksLocale(locale, cy.get('main'));
    this.checkTranslations(locale);
  }
}
export const liveSlotsHelper = new LiveSlotsHelper();
