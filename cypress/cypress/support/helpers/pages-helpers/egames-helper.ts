import { LandingPagesHelper } from './landing-pages-helper';
import { registrationPageHelper } from './registration-helper';
import { commonBtn, eGamesBtns } from '../enums/btn-names-enums';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { eGamesBodyTitle, inputsPlaceholders } from '../enums/body-text-enums';
import { urlText } from '../enums/url-enum';
import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { getDictionary } from '../common-functions/locale-functions';

class EgamesHelper extends LandingPagesHelper {
  eGamesElements = {
    ...this.elements,
    recentWinsSection: () => cy.getByTestId('recent-wins-carousel-0'), // post-MVP
    topGamesSection: () => cy.getByTestId('top-carousel-top5')
  };

  urlEgames() {
    registrationPageHelper.checkUrlText(urlText.eGames);
  }

  searchBarEgamesLoggedOut() {
    searchBarHelper.elements.favsBtn().should('not.exist'),
      // searchBarHelper.elements
      //   .sectionInLobbyFilterBtn(eGamesBodyTitle.allGamesSection.split(' ')[0])
      //   .should('be.visible'),
      searchBarHelper.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.newGamesSection.split(' ')[0])
        .should('be.visible'),
      searchBarHelper.elements
        .sectionInLobbyFilterBtn(
          eGamesBodyTitle.classicStyleSection.replace(/\s/g, '-')
        )
        .should('be.visible'),
      searchBarHelper.elements
        .sectionInLobbyFilterBtn(eGamesBodyTitle.megawaysSection)
        .should('be.visible'),
      searchBarHelper.elements
        .sectionInLobbyFilterBtn(
          eGamesBodyTitle.ancientCivilizationsSection.replace(/\s/g, '-')
        )
        .should('be.visible'),
      searchBarHelper.elements.sectionInLobbyFilterBtn(
        eGamesBodyTitle.tableSection
      );
    searchBarHelper.elements.searchInput().should('be.visible').and('be.empty');
  }

  // post MVP implementation
  loggedInRecentWins() {
    this.eGamesElements
      .recentWinsSection()
      .contains(eGamesBodyTitle.recentWinsSection);
    this.defaultStateFavs();
  }

  // post MVP implementation
  loggedOutRecentWins() {
    this.eGamesElements.recentWinsSection().should('not.exist');
  }

  defaulteGamesSection(sectionTitle: string) {
    this.eGamesElements
      .sectionOfLanding(sectionTitle.split(' ')[0])
      .should('exist')
      .and('contain', sectionTitle);
    this.eGamesElements
      .sectionOfLanding(sectionTitle.split(' ')[0])
      .should('contain', commonBtn.moreGame);
  }

  defaultTopGamesSection() {
    this.eGamesElements
      .topGamesSection()
      .should('exist')
      .and('contain', eGamesBodyTitle.topGamesSection);
    this.eGamesElements
      .topGamesSection()
      .should('not.contain', commonBtn.moreGame);
  }

  defaultEgamesStateLoggedOutState() {
    this.loggedOutFavs();
    this.loggedOutRecentWins();
    this.defaultTopGamesSection();
    this.defaulteGamesSection(eGamesBodyTitle.newGamesSection);
    this.defaulteGamesSection(eGamesBodyTitle.ancientCivilizationsSection);
    this.defaulteGamesSection(eGamesBodyTitle.tableSection);
    this.defaulteGamesSection(eGamesBodyTitle.megawaysSection);
    this.defaulteGamesSection(eGamesBodyTitle.classicStyleSection);
  }

  gameCardLoggedOutState() {
    gameCardHelper.elements
      .gameCard(urlText.eGames)
      .first()
      .find('div.hidden')
      .invoke('removeClass', 'hidden')
      .then(() => {
        gameCardHelper.elements.favsIcon().should('not.exist');
        gameCardHelper.elements.gameCardBtn().contains(eGamesBtns.demo);
      });
  }

  gameCardLoggedInState() {
    gameCardHelper.elements
      .gameCard(urlText.eGames)
      .first()
      .find('div.hidden')
      .invoke('removeClass', 'hidden')
      .then(() => {
        gameCardHelper.elements.gameCardBtn().contains(eGamesBtns.play);
        gameCardHelper.defaultFavsIconFocusedGameCard();
      });
  }

  searchWithResultsEgames() {
    gameCardHelper.elements
      .gameCard(urlText.eGames)
      .last()
      .find('div')
      .last()
      .invoke('text')
      .then((gameTitle) => {
        const gameTitleForSearch = gameTitle.slice(0, -5);
        cy.wrap(gameTitleForSearch).then((gameTitleForSearch) => {
          searchBarHelper.elements.searchInput().type(gameTitleForSearch);
          searchBarHelper.searchResultsContain(
            inputsPlaceholders.search,
            gameTitle,
            urlText.eGames
          );
          searchBarHelper.elements
            .modalOfSearchBar(inputsPlaceholders.search)
            .each(($card) => {
              cy.wrap($card).within(() => {
                gameCardHelper.elements
                  .gameCard(urlText.eGames)
                  .should('contain.text', gameTitleForSearch);
              });
            });
        });
      });
  }

  checkCategoryMaintenance(category: string, title: string, text: string) {
    this.elements.sectionOfLanding(category).siblings().contains(title);
    this.elements.sectionOfLanding(category).siblings().contains(text);
  }

  checkTranslations(locale: string) {
    const dict = getDictionary(locale);
    const searchBar = dict.searchBar;
    const heroTextSectionEGames = dict.heroTextSectionEGames;
    const eGamesPage = dict.eGamesPage;
    const banners = eGamesPage.banners;
    const sliderNames = eGamesPage.sliderNames;

    searchBarHelper.elements
      .searchInput()
      .should('have.attr', 'placeholder', searchBar.typeToSearch);

    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        //SEO text
        expect(text).contain(heroTextSectionEGames.title);
        expect(text).contain(heroTextSectionEGames.text);

        //eGames banners
        expect(text).contain(banners.mainBanner1.title);
        expect(text).contain(banners.mainBanner1.action);
        expect(text).contain(banners.mainBanner2.title);
        expect(text).contain(banners.mainBanner2.title2);
        expect(text).contain(banners.mainBanner2.action);

        // slider names
        // expect(text).contain(sliderNames.favourites);
        // expect(text).contain(sliderNames.recentWins);
        expect(text).contain(sliderNames.topGames);
        expect(text).contain(sliderNames.allGames);
        expect(text).contain(sliderNames.newGames);
        // expect(text).contain(sliderNames.asian);
        expect(text).contain(sliderNames.table);
        expect(text).contain(sliderNames.ancient);
        expect(text).contain(sliderNames.megaways);
        expect(text).contain(sliderNames.classic);
        // expect(text).contain(sliderNames.popularAtTheResort);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking locale for Live Slots page...');
    cy.checkLinksLocale(locale, cy.get('main'));
    this.checkTranslations(locale);
  }
}

export const eGamesHelper = new EgamesHelper();
