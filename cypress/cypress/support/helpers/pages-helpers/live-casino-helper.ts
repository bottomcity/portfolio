import { LandingPagesHelper } from './landing-pages-helper';
import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { gamesTableText, gameTitles } from '../enums/body-text-enums';
import { registrationPageHelper } from './registration-helper';
import { commonBtn, eGamesBtns } from '../enums/btn-names-enums';
import { loginPageHelper } from './login-helper';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { urlText, urlLiveCasino } from '../enums/url-enum';
import { gameExperienceHelper } from './game-experience-helper';
import { getDictionary } from '../common-functions/locale-functions';

class LiveCasinoHelper extends LandingPagesHelper {
  liveCasinoLandingElements = {
    ...this.elements,
    liveCasinoTopRatedSection: () => cy.getByTestId('Carousel-1')
  };

  urlCasino() {
    registrationPageHelper.checkUrlText(urlText.liveCasino);
  }

  loggedOutRedirectToLoginCasino() {
    gameExperienceHelper.openeGame(
      urlText.liveCasino,
      eGamesBtns.play,
      gameTitles.faceUp,
      '.not'
    );
    loginPageHelper.urlLogin();
  }

  loggedOutTopRated() {
    this.liveCasinoLandingElements
      .liveCasinoTopRatedSection()
      .should('not.exist');
  }

  loggedInTopRated() {
    this.liveCasinoLandingElements
      .liveCasinoTopRatedSection()
      .contains('Top Rated');
    this.liveCasinoLandingElements
      .liveCasinoTopRatedSection()
      .should('contain', commonBtn.moreGame);
  }

  searchBarLiveCasino() {
    searchBarHelper.elements.filterSortingModalBtn().should('not.exist'),
      searchBarHelper.elements
        .sectionInLobbyFilterBtn(gamesTableText.baccarat)
        .should(($a) => {
          expect($a)
            .to.have.attr('href')
            .equal(`/${urlText.liveCasino}/${urlLiveCasino.baccarat}`);
          expect($a).to.be.visible;
        });
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.stadium)
      .should(($a) => {
        expect($a).to.have.attr('href').equal(`/${urlText.liveCasino}/stadium`); // to be changed after stadium will be fixed in stage
        expect($a).to.be.visible;
      });
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.sicbo)
      .should(($a) => {
        expect($a)
          .to.have.attr('href')
          .equal(`/${urlText.liveCasino}/${urlLiveCasino.sicbo}`);
        expect($a).to.be.visible;
      });
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.roulette)
      .should(($a) => {
        expect($a)
          .to.have.attr('href')
          .equal(`/${urlText.liveCasino}/${urlLiveCasino.roulette}`);
        expect($a).to.be.visible;
      });
  }

  loggedOutStateLiveCasino() {
    this.loggedOutTopRated();
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.roulette)
      .should('exist')
      .and('contain.text', gamesTableText.roulette);
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.baccarat)
      .should('exist')
      .and('contain.text', gamesTableText.baccarat);
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.stadium)
      .should('exist')
      .and('contain.text', gamesTableText.stadium);
    searchBarHelper.elements
      .sectionInLobbyFilterBtn(gamesTableText.sicbo)
      .should('exist')
      .and('contain.text', gamesTableText.sicbo);
  }

  checkCategoryMaintenance(category: string, title: string, text: string) {
    this.elements.sectionOfLanding(category).contains(title);
    this.elements.sectionOfLanding(category).contains(text);
  }

  checkTranslations(locale: string) {
    cy.log('Checking translations for Casino page...');
    const dict = getDictionary(locale);
    const searchBar = dict.searchBar;
    const heroTextSectionLiveCasino = dict.heroTextSectionLiveCasino;
    const liveCasinoPage = dict.liveCasinoPage;
    const banners = liveCasinoPage.banners;
    const sliderNames = liveCasinoPage.sliderNames;

    // cy.intercept('GET', `/${locale}/live-casino/roulette?_rsc=1w20q`).as(
    //   'pageLoaded'
    // );
    cy.scrollTo('bottom');
    searchBarHelper.elements
      .searchInput()
      .scrollIntoView()
      .should('have.attr', 'placeholder', searchBar.typeToSearch);

    // cy.wait('@pageLoaded', { timeout: 10000 });
    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        // slider names
        expect(text).contain(sliderNames.baccarat);
        expect(text).contain(sliderNames.stadium);
        expect(text).contain(sliderNames.roulette);
        expect(text).contain(sliderNames.sicbo);

        //SEO text
        expect(text).contain(heroTextSectionLiveCasino.title);
        expect(text).contain(heroTextSectionLiveCasino.text);

        //live casino banners can be edited throu CMS now!
        // expect(text).contain(banners.mainBanner1.title);
        // expect(text).contain(banners.mainBanner1.title2);
        // expect(text).contain(banners.mainBanner1.action);
        // expect(text).contain(banners.mainBanner2.title);
        // expect(text).contain(banners.mainBanner2.title2);
        // expect(text).contain(banners.mainBanner2.action);

        // other wordings
        expect(text).contain(liveCasinoPage.moreGames);
        // expect(text).contain(liveCasinoPage.noGames);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking locale for Casino page...');
    cy.checkLinksLocale(locale, cy.get('main'));
    this.checkTranslations(locale);
  }
}

export const liveCasinoHelper = new LiveCasinoHelper();
