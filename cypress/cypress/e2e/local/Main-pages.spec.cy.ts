import { qase } from 'cypress-qase-reporter/dist/mocha';
import { navBarHelper } from '../../support/helpers/moduls-helpers/navbar-helper';
import { mainPageHelper } from '../../support/helpers/pages-helpers/main-page-helper';
import { mainBannerHelper } from '../../support/helpers/moduls-helpers/main-banner-helper';
import { liveCasinoHelper } from '../../support/helpers/pages-helpers/live-casino-helper';
import { liveSlotsHelper } from '../../support/helpers/pages-helpers/live-slots-helper';
import { footerHelper } from '../../support/helpers/moduls-helpers/footer-helper';
import { eGamesHelper } from '../../support/helpers/pages-helpers/egames-helper';
import { loginPageHelper } from '../../support/helpers/pages-helpers/login-helper';
import { otpPageHelper } from '../../support/helpers/pages-helpers/OTP-helper';
import {
  invalidPhones,
  validEmails,
  validNames,
  validPatronNumbers,
  validPhones
} from '../../support/helpers/enums/testing-data-for-inputs';
import {
  commonMessages,
  depositWithdrawValidationMessages,
  emailPhoneEmailValidationMessages,
  namesValidationMessages,
  pinValidationMessages
} from '../../support/helpers/enums/validation-enums';
import {
  allOtherPageBtns,
  bannerBtns,
  depositBtns,
  eGamesBtns,
  slotsBtnsTitles,
  submitBtn
} from '../../support/helpers/enums/btn-names-enums';
import { registrationPageHelper } from '../../support/helpers/pages-helpers/registration-helper';
import { errorPagesHelper } from '../../support/helpers/pages-helpers/error-pages-helper';
import {
  errorPageBodyText,
  errorPageBodyTitle,
  gamesTableText,
  inputsPlaceholders,
  regLoginFlowsBodyText,
  eGamesBodyTitle,
  sectionSEOText,
  gameTitles
} from '../../support/helpers/enums/body-text-enums';
import { scenariosHelper } from '../../support/helpers/scenarios-helpers/scenarios-helper';
import { liveCasinoLobbyPageHelper } from '../../support/helpers/pages-helpers/live-casino-lobby-page-helper';
import { searchBarHelper } from '../../support/helpers/moduls-helpers/search-bar-helper';
import { liveSlotsLobbyPageHelper } from '../../support/helpers/pages-helpers/live-slots-lobby-page-helper';
import { sideBarHelper } from '../../support/helpers/moduls-helpers/sidebar-helper';
import { profileInfoPageHelper } from '../../support/helpers/pages-helpers/profile-info-helper';
import { sortDropdown } from '../../support/helpers/enums/dropdowns-data-enums';
import {
  generateRandomNumber,
  randomNumber
} from '../../support/helpers/common-functions/generate-number';
import { urlText } from '../../support/helpers/enums/url-enum';
import { gameExperienceHelper } from '../../support/helpers/pages-helpers/game-experience-helper';
import {
  formattedBirthdateBasedOnTodayDate,
  formattedDayAfterBirthdateBasedOnTodayDate,
  formattedDayBeforeBirthdateBasedOnTodayDate,
  getDateForMaintenanceRequest
} from '../../support/helpers/common-functions/generate-today-date';
import { assertionValues } from '../../support/helpers/enums/values-for-assertions';
import {
  generateRandomEmail,
  randomEmail
} from '../../support/helpers/common-functions/generate-email';
import { depositPageHelper } from '../../support/helpers/pages-helpers/deposit-helper';
import { eGamesLobbyHelper } from '../../support/helpers/pages-helpers/egames-lobby-helper';
import { filterModalHelper } from '../../support/helpers/moduls-helpers/filter-modal-helper';
import { forgotPINPageHelper } from '../../support/helpers/pages-helpers/forgot-PIN-helper';
import { chatHelper } from '../../support/helpers/pages-helpers/chat-helper';
import { errorToastBarText } from '../../support/helpers/enums/toast-bar-enums';
import { generateRandomName } from '../../support/helpers/common-functions/generate-name';

/* all integers in the e2e tests use as an indexes for arrays to data in tests
other values such as name buttons put in the enums
*/

describe.only('Sprint suite', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.window().then((window) => {
      window.localStorage.setItem('privacypolicyagree', '1');
    });
    cy.visit('/', { failOnStatusCode: false });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("(reading 'preview')\n");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #329;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #418;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #423;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("Failed to construct 'WebSocket'");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Internal Server Error');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes(
        'Hydration failed because the initial UI does not match what was rendered on the server.'
      );
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('URL.canParse is not a function');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes(
        "Cannot read properties of null (reading 'startsWith')"
      );
    });
  });
});

describe('Main pages', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.window().then((window) => {
      window.localStorage.setItem('privacypolicyagree', '1');
    });
    cy.visit('/', { failOnStatusCode: false });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("(reading 'preview')\n");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #329;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #418;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #423;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("Failed to construct 'WebSocket'");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Internal Server Error');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes(
        'Hydration failed because the initial UI does not match what was rendered on the server.'
      );
    });
  });
  qase(
    1,
    it.skip('Main landing page', () => {
      // mainPageHelper.closeCookieNotice();
      mainPageHelper.checkDefaultUrl();
      navBarHelper.defaultNavBarState();
      mainBannerHelper.swipingCycleMainBanner();
      mainBannerHelper.clickBannerRegBtn();
      navBarHelper.clickLogoBtn();
      mainBannerHelper.clickBannerPlayNowBtnCasino(
        bannerBtns.playLive,
        urlText.liveCasino
      );
      navBarHelper.clickLogoBtn();
      mainBannerHelper.clickRewardsBtn();
      mainBannerHelper.clickBookNowBtn();
      mainPageHelper.verifyingHowToStartSection();
      mainPageHelper.verifyingWhySolaire();
      navBarHelper.openLangBtn();
      cy.scrollTo('bottom');
      mainPageHelper.verifyingSEOSection(sectionSEOText.mainLanding);
      footerHelper.defaultFooterState();
      mainPageHelper.mainPageElements
        .whyShowMoreLessBtn()
        .contains('Show More')
        .click({ waitForAnimations: true, timeout: 5000 });
      mainPageHelper.mainPageElements
        .whyShowMoreLessBtn()
        .contains('Show Less')
        .click({ waitForAnimations: true });
      mainPageHelper.mainPageElements
        .whyShowMoreLessBtn()
        .contains('Show More');
      mainPageHelper.mainPageElements
        .seoShowMoreLessBtn()
        .contains('Show More')
        .click({ waitForAnimations: true, timeout: 5000 });
      mainPageHelper.mainPageElements
        .seoShowMoreLessBtn()
        .contains('Show Less')
        .click({ waitForAnimations: true });
      mainPageHelper.mainPageElements
        .seoShowMoreLessBtn()
        .contains('Show More');
    })
  );
  qase(
    5,
    it('live-casino landing page', () => {
      navBarHelper.openLiveCasinoLanding();
      loginPageHelper.checkLoaderAppearing();
      liveCasinoHelper.urlCasino();
      navBarHelper.elements.liveCasinoBtn().should('contain.html', 'yellow');
      liveCasinoHelper.searchBarLiveCasino();
      liveCasinoHelper.loggedOutFavs();
      liveCasinoHelper.loggedOutStateLiveCasino();
      cy.scrollTo('bottom');
      mainPageHelper.verifyingSEOSection(sectionSEOText.casino);
      footerHelper.defaultFooterState();
      mainBannerHelper.clickBannerPlayNowBtnCasino(
        eGamesBtns.play,
        urlText.liveCasino
      );
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gameTitles.faceUp,

        gamesTableText.baccarat,
        gamesTableText.roulette,
        gamesTableText.sicbo
      );
      cy.scrollTo('center');
    })
  );
  qase(
    8,
    it('live-casino lobby page', () => {
      navBarHelper.openLiveCasinoLanding();
      loginPageHelper.checkLoaderAppearing();
      cy.scrollTo('center');
      searchBarHelper.applyInLobbyFilter(gamesTableText.sicbo);
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.sicbo,
        gamesTableText.sicbo,
        gamesTableText.baccarat,
        gamesTableText.roulette
      );
      liveCasinoLobbyPageHelper.urlCasinoLobby(gamesTableText.sicbo);
      liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      liveCasinoHelper.loggedOutFavs();
      liveCasinoHelper.loggedOutStateLiveCasino();
      searchBarHelper.applyInLobbyFilter(gamesTableText.baccarat);
      liveCasinoLobbyPageHelper.loadMoreGamesUntilBtnDisappear(
        urlText.liveCasino,
        urlText.liveCasino,
        9
      );
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gameTitles.faceUp,
        gamesTableText.baccarat,
        gamesTableText.roulette,
        gamesTableText.sicbo
      );
      liveCasinoLobbyPageHelper.urlCasinoLobby(gamesTableText.baccarat);
      liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      liveCasinoHelper.loggedOutFavs();
      liveCasinoHelper.loggedOutStateLiveCasino();
      searchBarHelper.applyInLobbyFilter(gamesTableText.roulette);
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.roulette,
        gamesTableText.roulette,
        gamesTableText.sicbo,
        gamesTableText.baccarat
      );
      liveCasinoLobbyPageHelper.urlCasinoLobby(gamesTableText.roulette);
      liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      liveCasinoHelper.loggedOutFavs();
      liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
        gamesTableText.roulette,
        gamesTableText.roulette,
        gamesTableText.sicbo,
        gamesTableText.baccarat
      );
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
        gameTitles.faceUp,
        gamesTableText.baccarat,
        gamesTableText.roulette,
        gamesTableText.sicbo
      );
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
        gamesTableText.sicbo,
        gamesTableText.sicbo,
        gamesTableText.baccarat,
        gamesTableText.roulette
      );
      searchBarHelper.applySorting(sortDropdown.asc);
      liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.asc);
      searchBarHelper.applyInLobbyFilter(gamesTableText.sicbo);
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.sicbo,
        gamesTableText.sicbo,
        gamesTableText.baccarat,
        gamesTableText.roulette
      );
      searchBarHelper.applyInLobbyFilter(gamesTableText.baccarat);
      liveCasinoLobbyPageHelper.loadMoreGamesUntilBtnDisappear(
        urlText.liveCasino,
        urlText.liveCasino,
        9
      );
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gameTitles.faceUp,
        gamesTableText.baccarat,
        gamesTableText.roulette,
        gamesTableText.sicbo
      );
      searchBarHelper.applyInLobbyFilter(gamesTableText.roulette);
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.roulette,
        gamesTableText.roulette,
        gamesTableText.sicbo,
        gamesTableText.baccarat
      );
      searchBarHelper.applyInLobbyFilter(gamesTableText.stadium);
      searchBarHelper.applySorting(sortDropdown.desc);
      liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.desc);
      // waiting adding 2 more types of sorting
      //searchBarHelper.applySorting(sortDropdown.newest);
      //liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.newest);
      //searchBarHelper.applySorting(sortDropdown.topRated);
      //liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.topRated);
      navBarHelper.elements.liveCasinoBtn().should('contain.html', 'yellow');
      mainBannerHelper.elements.swipeLeftBtn().should('not.exist');
      liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
      cy.scrollTo('center');
      mainPageHelper.verifyingSEOSection(sectionSEOText.casino);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    111,
    it.skip('live casino gaming experience', () => {
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('Permissions check failed');
      });

      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLiveCasinoLanding();
      gameExperienceHelper.openeGame(urlText.liveCasino, eGamesBtns.play);
      gameExperienceHelper.gameIframeOpened();
      gameExperienceHelper.gameIframeLoaded();
      // gameExperienceHelper.clickFullScreenIframeBtn();
      // gameExperienceHelper.fullScreenIframeOpened();
      gameExperienceHelper.openExitLobbyPopup();
      gameExperienceHelper.closeExitLobbyPopup();
      gameExperienceHelper.closeGameIframe();
    })
  );
  qase(
    6,
    it('live-slots landing page ', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      liveSlotsHelper.urlSlots();
      navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
      mainBannerHelper.clickBannerPlayNowBtnSlots(
        eGamesBtns.play,
        urlText.jinJi.toLowerCase(),
        '',
        true
      );
      navBarHelper.elements.liveSlotsBtn().click({ timeout: 5000 });
      liveSlotsHelper.defaultOrderForSlots();
      liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.classicView);
      liveSlotsHelper.loggedOutFavs();
      cy.scrollTo('center');
      mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
      footerHelper.defaultFooterState();
    })
  );
  qase(
    9,
    it('live-slots (slots) lobby page (modern view)', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      cy.scrollTo('center');
      liveSlotsLobbyPageHelper.openSlotsLobbyPage();
      liveSlotsHelper.urlSlots();
      // waiting implementing of actual searchbar
      liveSlotsLobbyPageHelper.searchBarLiveSlotsLobby();
      // liveSlotsLobbyPageHelper.uncheckVacancyCheckbox();
      // liveSlotsLobbyPageHelper.checkVacancyCheckbox();
      // waiting implementing of sorting
      // searchBarHelper.applySorting(sortDropdown.asc);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.asc);
      // searchBarHelper.applySorting(sortDropdown.desc);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.desc);
      // waiting implementing of sorting
      //searchBarHelper.applySorting(sortDropdown.newest);
      //liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.newest);
      //searchBarHelper.applySorting(sortDropdown.topRated);
      //liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.topRated);
      navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
      mainBannerHelper.elements.swipeLeftBtn().should('not.exist');
      liveSlotsLobbyPageHelper.clickBackToLiveSlotsBtn();
      liveSlotsLobbyPageHelper.openSlotsLobbyPage();
      liveSlotsHelper.loggedOutRedirectToLoginSlots();
      cy.scrollTo('center');
      footerHelper.defaultFooterState();
    })
  );

  qase(
    83,
    it('live-slots (jackpots) lobby page (modern view)', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      cy.scrollTo('center');
      liveSlotsLobbyPageHelper.openJackpotsLobbyPage();
      liveSlotsHelper.urlSlots();
      liveSlotsLobbyPageHelper.searchBarJackpotsLobby();
      // searchBarHelper.applySorting(sortDropdown.asc);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.asc);
      // searchBarHelper.applySorting(sortDropdown.desc);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.desc);
      // waiting adding 2 more types of sorting
      // searchBarHelper.applySorting(sortDropdown.newest);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.newest);
      // searchBarHelper.applySorting(sortDropdown.topRated);
      // liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.topRated);
      // liveSlotsLobbyPageHelper.applyJackpotsFilter(slotsBtns.jackpots);
      // liveSlotsLobbyPageHelper.applyProviderFilter(slotsBtns.provider);
      navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
      mainBannerHelper.elements.swipeLeftBtn().should('not.exist');
      liveSlotsLobbyPageHelper.clickBackToLiveSlotsBtn();
      liveSlotsLobbyPageHelper.openJackpotsLobbyPage();
      liveSlotsHelper.clickPlayNowJackpotsCard();
      liveSlotsLobbyPageHelper.searchBarLiveSlotsLobby();
      liveSlotsLobbyPageHelper.elements.gamesTable().should('be.visible');
      cy.scrollTo('center');
      mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    12,
    it('live-slots lobby page (classic view) from slots landing', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      cy.scrollTo('center');
      liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.classicView);
      liveSlotsHelper.switchSlotsView(slotsBtnsTitles.classicView);
      liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.modernView);
      mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
      footerHelper.defaultFooterState();
      cy.scrollTo('top');
      liveSlotsLobbyPageHelper.searchWithResultsSlotsClassicView(
        inputsPlaceholders.search
      );
      searchBarHelper.closeSearch();
      searchBarHelper.searchWithNoResults(inputsPlaceholders.search);
      searchBarHelper.closeSearch();
      liveSlotsLobbyPageHelper.swipingCycleClassicLobbySlots();
      liveSlotsLobbyPageHelper.loggedOutRedirectToLoginClassicView();
      // liveSlotsLobbyPageHelper.uncheckVacancyCheckbox();
      // liveSlotsLobbyPageHelper.checkingTextClassicView(gamesTableText.occupied);
    })
  );

  qase(
    121,
    it('live-slots lobby page (classic view) from slots lobby', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      cy.scrollTo('center');
      liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.classicView);
      liveSlotsHelper.switchSlotsView(slotsBtnsTitles.classicView);
      liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.modernView);
      mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
      footerHelper.defaultFooterState();
      liveSlotsLobbyPageHelper.swipingCycleClassicLobbySlots();
      // liveSlotsLobbyPageHelper.uncheckVacancyCheckbox();
      liveSlotsLobbyPageHelper.checkingTextClassicView(gamesTableText.awaiting);
    })
  );

  qase(
    11,
    it.skip('404 not found', () => {
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('NEXT_NOT_FOUND');
      });
      cy.visit('/404', { failOnStatusCode: false, timeout: 4000 });
      navBarHelper.defaultNavBarState();
      errorPagesHelper.checkTextPageBody(
        errorPageBodyText.p404,
        errorPageBodyTitle.p404
      );
      footerHelper.defaultFooterState();
      errorPagesHelper.clickReloadPageBtn(allOtherPageBtns.home);
      cy.url().should('not.contain', 'qwerty');
    })
  );

  qase(
    40,
    it.skip('500 internal server problem', () => {
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('Internal Server Error');
      });
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('Minified React error');
      });
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('There was an error while hydrating');
      });
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openEgameLanding();
      gameExperienceHelper.openeGame(urlText.eGames, eGamesBtns.play);
      loginPageHelper.checkLoaderAppearing();
      errorPagesHelper.checkTextPageBody(
        errorPageBodyText.p500,
        errorPageBodyTitle.p500
      );
    })
  );

  describe('Maintenance', () => {
    describe('Check maintenance screen', () => {
      before(() => {
        cy.setMaintenance('start', {
          providers: [
            'LIVE_SLOTS',
            'LIVE_STADIUM',
            'NETENT',
            'REDTIGER',
            'EVOPLAY'
          ],
          start_date: `${getDateForMaintenanceRequest().startDate}`,
          end_date: `${getDateForMaintenanceRequest().endDate}`,
          disable_login: true,
          info_bar: `${errorPageBodyText.maintenanceGeneral}`,
          text: `${errorPageBodyTitle.maintenanceGeneral}`
        });
      });
      qase(
        320,
        it('Down for maintenance eGames lobby page', () => {
          cy.visit(`/${urlText.eGames}/${urlText.megaways}`);
          navBarHelper.checkNavBarExists();
          errorPagesHelper.checkTextMaintenance(
            errorPageBodyText.maintenanceLobby,
            errorPageBodyTitle.maintenanceGeneral
          );
          footerHelper.defaultFooterState();
        })
      );

      qase(
        321,
        it('Down for maintenance Live Casino lobby page', () => {
          cy.visit(`/${urlText.liveCasino}/${urlText.stadium}`);
          navBarHelper.checkNavBarExists();
          errorPagesHelper.checkTextMaintenance(
            errorPageBodyText.maintenanceLobby,
            errorPageBodyTitle.maintenanceGeneral
          );
          footerHelper.defaultFooterState();
        })
      );

      qase(
        322,
        it('Down for maintenance Live Slots lobby page', () => {
          cy.visit(`/${urlText.liveSlots}/${urlText.jinJi50m}`, {
            failOnStatusCode: false
          });
          navBarHelper.checkNavBarExists();
          errorPagesHelper.checkTextMaintenance(
            errorPageBodyText.maintenanceLobby,
            errorPageBodyTitle.maintenanceGeneral
          );
          footerHelper.defaultFooterState();
        })
      );

      qase(
        323,
        it('Down for maintenance login flow', () => {
          scenariosHelper.maintananceLogin(validPhones[1], 1);
        })
      );

      qase(
        324,
        it('Down for maintenance registration flow', () => {
          navBarHelper.clickRegBtn();
          scenariosHelper.maintenanceReg(
            5,
            randomEmail,
            2,
            submitBtn.register,
            inputsPlaceholders.star,
            randomNumber
          );
        })
      );

      qase(
        325,
        it(`Check toast message about maintenance live slots page`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.liveSlots,
            errorPageBodyText.maintenanceGeneral
          );
        })
      );

      qase(
        326,
        it(`Check toast message about maintenance eGames page`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.eGames,
            errorPageBodyText.maintenanceGeneral
          );
        })
      );

      qase(
        327,
        it(`Check toast message about maintenance registration page`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.register,
            errorPageBodyText.maintenanceLogin
          );
        })
      );

      qase(
        328,
        it(`Check toast message about maintenance login page`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.login,
            errorPageBodyText.maintenanceLogin
          );
        })
      );

      qase(
        329,
        it(`Check toast message about maintenance terms  page`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.terms,
            errorPageBodyText.maintenanceLogin
          );
        })
      );

      qase(
        330,
        it(`Check toast message about maintenance live casino`, () => {
          scenariosHelper.checkMaintenanceToastMessage(
            urlText.liveCasino,
            errorPageBodyText.maintenanceGeneral
          );
        })
      );

      // wording for login page appears in the toast message
      // qase(
      //   335,
      //   it(`Try#${k} Check toast message about maintenance live casino lobby`, () => {
      //     scenariosHelper.checkMaintenanceToastMessage(
      //       `${urlText.liveCasino}/${urlText.stadium}`,
      //       errorPageBodyText.maintenanceGeneral
      //     );
      //   })
      // );

      // qase(
      //   336,
      //   it(`Try#${k} Check toast message about maintenance live slots lobby`, () => {
      //     scenariosHelper.checkMaintenanceToastMessage(
      //       `${urlText.liveSlots}/${urlText.jinJi50m}`,
      //       errorPageBodyText.maintenanceGeneral
      //     );
      //   })
      // );

      // qase(
      //   337,
      //   it(`Try#${k} Check toast message about maintenance eGames lobby`, () => {
      //     scenariosHelper.checkMaintenanceToastMessage(
      //       `${urlText.eGames}/${urlText.megaways}`,
      //       errorPageBodyText.maintenanceGeneral
      //     );
      //   })
      // );

      qase(
        331,
        it('Check Live Casino category maintenance', () => {
          cy.visit(`/${urlText.liveCasino}`);
          liveCasinoHelper.checkCategoryMaintenance(
            gamesTableText.stadium,
            errorPageBodyTitle.maintenanceGeneral,
            errorPageBodyText.maintenanceCategorySubtitle
          );
        })
      );

      qase(
        332,
        it('Check eGames category maintenance', () => {
          cy.visit(`/${urlText.eGames}`);
          eGamesHelper.checkCategoryMaintenance(
            eGamesBodyTitle.megawaysSection,
            errorPageBodyTitle.maintenanceGeneral,
            errorPageBodyText.maintenanceCategorySubtitle
          );
        })
      );

      // waiting or fix SOC-1132
      // qase(
      //   334,
      //   it('Check Forgot pin maintenance', () => {

      //   })
      // );

      after(() => {
        cy.setMaintenance('stop', {
          providers: [
            'LIVE_SLOTS',
            'LIVE_STADIUM',
            'NETENT',
            'REDTIGER',
            'EVOPLAY'
          ]
        });
      });
    });

    describe('Check login enabled', () => {
      before(() => {
        cy.setMaintenance('start', {
          providers: [
            'LIVE_SLOTS',
            'LIVE_STADIUM',
            'NETENT',
            'REDTIGER',
            'EVOPLAY'
          ],
          start_date: `${getDateForMaintenanceRequest().startDate}`,
          end_date: `${getDateForMaintenanceRequest().endDate}`,
          disable_login: false,
          info_bar: `${errorPageBodyText.maintenanceGeneral}`,
          text: `${errorPageBodyTitle.maintenanceGeneral}`
        });
      });
      qase(
        333,
        it('Check login during maintenance', () => {
          scenariosHelper.loginByPhone(validPhones[5], 1);
        })
      );
      after(() => {
        cy.setMaintenance('stop', {
          providers: [
            'LIVE_SLOTS',
            'LIVE_STADIUM',
            'NETENT',
            'REDTIGER',
            'EVOPLAY'
          ]
        });
      });
    });
  });

  qase(
    7,
    it.skip('e-games landing page', () => {
      navBarHelper.openEgameLanding();
      eGamesHelper.urlEgames();
      navBarHelper.elements.eGamesBtn().should('contain.html', 'yellow');
      eGamesHelper.searchBarEgamesLoggedOut();
      eGamesHelper.defaultEgamesStateLoggedOutState();
      eGamesHelper.searchWithResultsEgames();
      searchBarHelper.closeSearch();
      searchBarHelper.searchWithNoResults(inputsPlaceholders.search);
      searchBarHelper.closeSearch();
      eGamesHelper.gameCardLoggedOutState();
      cy.scrollTo('bottom');
      mainPageHelper.verifyingSEOSection(sectionSEOText.eGames);
      footerHelper.defaultFooterState();
      cy.scrollTo('center');
    })
  );

  qase(
    10,
    it('e-games lobby page', () => {
      navBarHelper.openEgameLanding();
      cy.scrollTo('center');
      eGamesLobbyHelper.openeGamesLobbyPageByClickMoreBtn(
        eGamesBodyTitle.newGamesSection
      );
      navBarHelper.elements.eGamesBtn().should('contain.html', 'yellow');
      eGamesLobbyHelper.searchBareGamesLobby();
      mainBannerHelper.elements.swipeLeftBtn().should('not.exist');
      searchBarHelper.applySorting(sortDropdown.asc);
      eGamesLobbyHelper.sortingApplied(sortDropdown.asc);
      eGamesHelper.searchWithResultsEgames();
      searchBarHelper.closeSearch();
      searchBarHelper.searchWithNoResults(inputsPlaceholders.search);
      searchBarHelper.closeSearch();
      cy.scrollTo('bottom');
      mainPageHelper.verifyingSEOSection(sectionSEOText.eGames);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    52,
    it.skip('e-games demo gaming experience', () => {
      cy.on('uncaught:exception', (err) => {
        return !err.message.includes('Permissions check failed');
      });

      navBarHelper.openEgameLanding();
      gameExperienceHelper.openeGame(urlText.eGames, eGamesBtns.demo, '.not');
      gameExperienceHelper.gameIframeOpened();
      gameExperienceHelper.gameIframeLoaded();
      // gameExperienceHelper.clickFullScreenIframeBtn();
      // gameExperienceHelper.fullScreenIframeOpened();
      gameExperienceHelper.openExitLobbyPopup();
      gameExperienceHelper.closeExitLobbyPopup();
      gameExperienceHelper.closeGameIframe();
    })
  );

  qase(
    28,
    it('Filter games (e-games)', () => {
      cy.visit('/egames');
      cy.window().then((window) => {
        window.localStorage.setItem('privacypolicyagree', '1');
      });
      eGamesHelper.elements.loader().click({ force: true, timeout: 5000 });
      filterModalHelper.openFilterSortingModalBtn();
      filterModalHelper.defaultFilterModalState();
      filterModalHelper.checkApplyingFilterInModal(eGamesBodyTitle.evolution);
      filterModalHelper.clickFilterModalBtn(eGamesBodyTitle.evolution);
      filterModalHelper.checkApplyingFilterInModal(eGamesBodyTitle.evoplay);
      filterModalHelper.clickFilterModalBtn(eGamesBodyTitle.evoplay);
      filterModalHelper.checkApplyingFilterInModal(eGamesBodyTitle.netent);
      filterModalHelper.clickFilterModalBtn(eGamesBodyTitle.netent);
      filterModalHelper.checkApplyingFilterInModal(
        eGamesBodyTitle.noLimitCity.replace(/\s/g, '')
      );
      filterModalHelper.clickFilterModalBtn(
        eGamesBodyTitle.noLimitCity.replace(/\s/g, '')
      );
      filterModalHelper.checkApplyingFilterInModal(eGamesBodyTitle.redtiger);
      filterModalHelper.clickFilterModalBtn(eGamesBodyTitle.redtiger);
      filterModalHelper.searchWithResultsFilterModal();
      filterModalHelper.searchWithNoResultsFilterModal(
        inputsPlaceholders.filter
      );
      filterModalHelper.loadMoreGamesUntilBtnDisappearInModal(
        urlText.eGames,
        20
      );
    })
  );

  qase(
    123,
    it('e-games real gaming experience', () => {
      scenariosHelper.loginByPhone(validPhones[3], 1);
      cy.visit('/egames');
      searchBarHelper.applyInLobbyFilter(
        eGamesBodyTitle.newGamesSection.split(' ')[0]
      );
      gameExperienceHelper.openeGame(
        urlText.eGames,
        eGamesBtns.play,
        gameTitles.shadowOfLuxor
      );
      gameExperienceHelper.openExitLobbyPopup();
      gameExperienceHelper.closeExitLobbyPopup();
      gameExperienceHelper.closeGameIframe();
    })
  );

  qase(
    2,
    it('Login page invalid Phone', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.urlLogin();
      loginPageHelper.checkBodyText(submitBtn.login);
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      loginPageHelper.checkValidationMessage(
        emailPhoneEmailValidationMessages.invalidPhone
      );
      loginPageHelper.checkToastMessage(errorToastBarText.support);
      loginPageHelper.elements
        .phoneInput()
        .should('be.empty')
        .and('have.attr', 'placeholder', inputsPlaceholders.mobile);
      loginPageHelper.invalidPhonesChecking(
        submitBtn.sendOTP,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.mobile
      );
      loginPageHelper.loginElements.phoneInput().clear();
      footerHelper.defaultFooterState();
    })
  );

  qase(
    84,
    it.skip('Login page valid Phone', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.checkToastMessage(errorToastBarText.support);
      loginPageHelper.validPhonesCheckingLogin(inputsPlaceholders.enter);
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    85,
    it('Login page invalid PIN', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.loginWithValidPhone(validPhones[1]);
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      loginPageHelper.checkValidationMessage(pinValidationMessages.emptyInput);
      profileInfoPageHelper.invalidPINChecking(
        submitBtn.sendOTP,
        pinValidationMessages.mustBe4digits
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    86,
    it('Login page valid PIN', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      loginPageHelper.loginWithValidPhone(validPhones[1]);
      loginPageHelper.loginWithValidPIN(1);
      loginPageHelper.clickTermsCheckbox();
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      otpPageHelper.verifyOTPBody(validPhones[1]);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    87,
    it.skip('Login page redirect to Registration page', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.redirectToRegistration();
    })
  );

  qase(
    44,
    it('Forgot PIN invalid Phone', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.clickContinueBtn(submitBtn.submit);
      forgotPINPageHelper.checkValidationMessage(commonMessages.requiredField);
      registrationPageHelper.invalidPhonesChecking(
        submitBtn.submit,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.mobile
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    145,
    it('Forgot PIN invalid Patron, Names & Date', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.invalidNamesChecking(3, submitBtn.submit);
      forgotPINPageHelper.invalidBirthDate(
        formattedDayAfterBirthdateBasedOnTodayDate,
        submitBtn.submit,
        namesValidationMessages.mustBe21yearsOld
      );
      forgotPINPageHelper.invalidBirthDate(
        validPhones[1],
        submitBtn.submit,
        namesValidationMessages.invalidDate
      );
      forgotPINPageHelper.invalidPatronNumberChecking(
        submitBtn.submit,
        emailPhoneEmailValidationMessages.invalidPatronNumber,
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.validDataAllForgotPIN(
        1,
        2,
        submitBtn.submit,
        formattedBirthdateBasedOnTodayDate,
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.checkToastMessage(errorToastBarText.patronNotFound);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    146,
    it('Forgot page redirect to Login page', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.clickBackToLoginBtn();
    })
  );

  qase(
    147,
    it('Forgot PIN mismatching of Data', () => {
      cy.visit('/login', { failOnStatusCode: false });
      // navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.validDataAllForgotPIN(
        0,
        2,
        submitBtn.submit,
        formattedBirthdateBasedOnTodayDate,
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.checkToastMessage(errorToastBarText.mismatchDetails); // change to mismatchDetails after fix
      forgotPINPageHelper.validDataAllForgotPIN(
        0,
        2,
        submitBtn.submit,
        '04/12/1900', //matching date of birth
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.checkToastMessage(errorToastBarText.mismatchDetails); // change to mismatchDetails after fix
      footerHelper.defaultFooterState();
    })
  );

  qase(
    148,
    it('Forgot PIN invalid PINs', () => {
      cy.visit('/login', { failOnStatusCode: false });
      // navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.typePhone(validPhones[3]);
      forgotPINPageHelper.typePatronNumber(
        validPatronNumbers[0],
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.typeValidDateOfBirth('04/12/1900');
      forgotPINPageHelper.typeFirstName(validNames[10]);
      forgotPINPageHelper.typeLastName(validNames[11]);
      forgotPINPageHelper.clickContinueBtn(submitBtn.submit);
      otpPageHelper.verifyOTPBody(validPhones[3]);
      scenariosHelper.enterValidOTP();
      forgotPINPageHelper.invalidNewPINChecking(
        submitBtn.submit,
        pinValidationMessages.mustBe4digits
      );
      forgotPINPageHelper.invalidConfirmPINChecking(0, 2, submitBtn.submit);
      profileInfoPageHelper.validNewPIN(
        4,
        errorToastBarText.tooEasyPIN,
        submitBtn.submit
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    33,
    it('OTP page', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.loginWithValidPhone(validPhones[1]);
      loginPageHelper.loginWithValidPIN(1);
      loginPageHelper.clickTermsCheckbox();
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      otpPageHelper.checkBodyText(submitBtn.sendOTP.slice(5));
      otpPageHelper.elements
        .submitBtn()
        .should('contain.text', submitBtn.confirm)
        .and('be.disabled');
      otpPageHelper.verifyOTPBody(validPhones[1]);
      otpPageHelper.invalidDataOTPInput();
      otpPageHelper.otpElements.otpInput().should('be.empty');
      otpPageHelper.incorrectOTPInput();
      cy.scrollTo('center');
      footerHelper.defaultFooterState();
      otpPageHelper.clickResendBtn();
    })
  );

  qase(
    3,
    it('Registration page invalid email', () => {
      navBarHelper.clickRegBtn();
      registrationPageHelper.urlRegister();
      registrationPageHelper.checkBodyText(submitBtn.register);
      registrationPageHelper.defaultPrefix();
      registrationPageHelper.clickContinueBtn(submitBtn.register);
      registrationPageHelper.checkValidationMessage(
        commonMessages.requiredField
      );
      registrationPageHelper.invalidEmailChecking(submitBtn.register);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    88,
    it.skip('Registration page invalid Phone', () => {
      navBarHelper.clickRegBtn();
      registrationPageHelper.invalidPhonesChecking(
        submitBtn.register,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.star
      );
    })
  );

  qase(
    89,
    it('Registration page invalid PIN', () => {
      const randonmName = generateRandomName();

      cy.visit('/register');
      registrationPageHelper.invalidNewPINChecking(
        submitBtn.register,
        pinValidationMessages.mustBe4digits
      );
      registrationPageHelper.invalidConfirmPINChecking(
        0,
        2,
        submitBtn.register
      );
      scenariosHelper.registerWithValidData(
        5,
        randomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        randomNumber
      );
      registrationPageHelper.tooEasyPINChecking();
      footerHelper.defaultFooterState();
    })
  );

  qase(
    110,
    it('Registration page invalid Names & Date', () => {
      cy.visit('/register');
      registrationPageHelper.invalidNamesChecking(3, submitBtn.register);
      registrationPageHelper.invalidBirthDate(
        formattedDayAfterBirthdateBasedOnTodayDate,
        submitBtn.register,
        namesValidationMessages.mustBe21yearsOld
      );
      registrationPageHelper.invalidBirthDate(
        validPhones[1],
        submitBtn.register,
        namesValidationMessages.invalidDate
      );
    })
  );

  qase(
    113,
    it('Registration page valid Phone', () => {
      navBarHelper.clickRegBtn();
      registrationPageHelper.validPhonesCheckingReg(
        submitBtn.register,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.star
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    90,
    it('Registration page valid data', () => {
      const randonmName = generateRandomName();

      cy.visit('/register');
      scenariosHelper.registerWithValidData(
        1,
        randomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        randomNumber
      );
      otpPageHelper.verifyOTPBody(randomNumber);
    })
  );

  qase(
    91,
    it('Registration page redirect to login page', () => {
      navBarHelper.clickRegBtn();
      registrationPageHelper.redirectToLogin();
    })
  );

  qase(
    34,
    it.skip('Update account page invalid email', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      registrationPageHelper.defaultPrefix();
      registrationPageHelper.clickContinueBtn(submitBtn.sendOTP);
      registrationPageHelper.checkValidationMessage(
        commonMessages.requiredField
      );
      registrationPageHelper.invalidEmailChecking(submitBtn.update);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    136,
    it.skip('Update account page invalid Phone', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      registrationPageHelper.invalidPhonesChecking(
        submitBtn.update,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.star
      );
    })
  );

  qase(
    137,
    it.skip('Update account page invalid Password', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      registrationPageHelper.invalidPINChecking(
        submitBtn.register,
        pinValidationMessages.mustBe4digits
      );
      registrationPageHelper.invalidConfirmPINChecking(
        0,
        2,
        submitBtn.register
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    138,
    it.skip('Update account page valid data', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      scenariosHelper.loginByPhone(validPhones[1], 1);
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
    })
  );
  qase(
    4,
    it('Profile info page invalid data', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      cy.visit('/register');
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      registrationPageHelper.checkBodyText(
        regLoginFlowsBodyText.registerSuccessBody
      );
      navBarHelper.loggedInNavBarState();
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.defaultStateProfile(
        newRandomNumber,
        assertionValues.enabled,
        '.not'
      );
      profileInfoPageHelper.permanentAddressStateProfile();
      profileInfoPageHelper.clickContinueBtn(submitBtn.update);
      registrationPageHelper.checkValidationMessage(
        commonMessages.requiredField
      );
      profileInfoPageHelper.invalidPINChecking(
        submitBtn.update,
        pinValidationMessages.mustBe4digits
      );
      profileInfoPageHelper.invalidBirthDate(
        formattedDayAfterBirthdateBasedOnTodayDate,
        submitBtn.update,
        namesValidationMessages.mustBe21yearsOld
      );
      profileInfoPageHelper.invalidBirthDate(
        invalidPhones[0],
        submitBtn.update,
        namesValidationMessages.invalidDate
      );
      profileInfoPageHelper.invalidZIPChecking(
        submitBtn.update,
        namesValidationMessages.ZIP
      );
      profileInfoPageHelper.invalidNamesChecking(3, submitBtn.update);
      profileInfoPageHelper.invalidPermanentZIPChecking(
        submitBtn.update,
        namesValidationMessages.ZIP
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    105,
    it('Profile info page invalid PIN changing', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.invalidCurrentPINChecking(3, 4, submitBtn.change);
      profileInfoPageHelper.invalidNewPINChecking(
        submitBtn.change,
        pinValidationMessages.mustBe4digits
      );
      profileInfoPageHelper.invalidConfirmPINChecking(0, 2, submitBtn.change);
      profileInfoPageHelper.sameNewAndCurrentPIN(0, submitBtn.change);
      profileInfoPageHelper.changeWithValidPIN(
        1,
        5,
        errorToastBarText.tooEasyPIN,
        submitBtn.change
      );
      footerHelper.defaultFooterState();
    })
  );
  qase(
    37,
    it.skip('Deposit page', () => {
      // add tests of max amount on the page
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openDepositPageThroughNavbar();
      depositPageHelper.defaultStateDeposit();
      depositPageHelper.clickContinueBtn(submitBtn.continue);
      depositPageHelper.checkValidationMessage(
        depositWithdrawValidationMessages.minAmount
      );
      depositPageHelper.inputMoneyAmount('5,000,001');
      depositPageHelper.checkValidationMessage(
        depositWithdrawValidationMessages.maxAmount
      );
      depositPageHelper.clickPreselectedAmount5000Btn();
      depositPageHelper.clickPreselectedAmount10000Btn();
      depositPageHelper.clickPreselectedAmount25000Btn();
      depositPageHelper.invalidAmount();
      depositPageHelper.clickPreselectedAmount5000Btn();
      depositPageHelper.clickContinueBtn(submitBtn.continue);
      depositPageHelper.checkToastMessage(errorToastBarText.noDepositMethod);
      depositPageHelper.chooseFirstPaymentMethod();
      depositPageHelper.clickContinueBtn(submitBtn.continue);
      depositPageHelper.clickBackBtn();
      depositPageHelper.defaultStateDeposit();
      depositPageHelper.checkDataMoneyAmountInput(depositBtns.amount5000);
      depositPageHelper.clickContinueBtn(submitBtn.continue);
      depositPageHelper.verifyPaymentInfo(
        depositBtns.amount5000,
        validPhones[1]
      );
      depositPageHelper.clickContinueBtn(submitBtn.confirm);
      mainPageHelper.closeNewWindow();
      depositPageHelper.successStep3();
    })
  );
  qase(
    139,
    it.skip('Deposit page failed transaction', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openDepositPageThroughSidebar();
      depositPageHelper.defaultStateDeposit();
      depositPageHelper.inputMoneyAmount(
        '25,000,000,000,000,000,000,000,000.00'
      );
      depositPageHelper.chooseFirstPaymentMethod();
      depositPageHelper.clickContinueBtn(submitBtn.continue);
      depositPageHelper.clickContinueBtn(submitBtn.confirm);
      mainPageHelper.closeNewWindow();
      depositPageHelper.failedStep3();
    })
  );
});

describe('Scenarios Suit', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.visit('/', { failOnStatusCode: false });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("(reading 'preview')\n");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #329;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #418;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes('Minified React error #423;');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes("Failed to construct 'WebSocket'");
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes(
        'Variable "$platformId" of required type "Float!" was not provided.'
      );
    });
  });

  qase(
    16,
    it('Registration flow', () => {
      const randonmName = generateRandomName();

      mainPageHelper.closeCookieNotice();
      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        randomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        randomNumber
      );
      otpPageHelper.verifyOTPBody(randomNumber);
      scenariosHelper.enterValidOTP();
      registrationPageHelper.checkBodyText(
        regLoginFlowsBodyText.registerSuccessBody
      );
      navBarHelper.loggedInNavBarState();
    })
  );

  qase(
    114,
    it.skip('Registration with already registered number', () => {
      /* in this case const randomNumber uses in purpose
      to reuse registered in caseID 16 phone number*/
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        randomNumber
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.numberTaken);
    })
  );

  qase(
    131,
    it.skip('Registration with already registered email', () => {
      /* in this case const randomEmail uses in purpose
      to reuse registered in caseID 16 email*/
      const newRandomNumber = generateRandomNumber();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        randomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.emailTaken);
    })
  );

  qase(
    125,
    it.skip('Redirect to login from logged out live slots classic view', () => {
      navBarHelper.openLiveSlotsLanding();
      loginPageHelper.checkLoaderAppearing();
      liveSlotsHelper.defaultOrderForSlots();
      liveSlotsHelper.switchSlotsView(slotsBtnsTitles.classicView);
      liveSlotsLobbyPageHelper.swipingCycleClassicLobbySlots();
      liveSlotsLobbyPageHelper.openSlotsGameByClickClassicSlotsCardBtn();
      loginPageHelper.urlLogin();
    })
  );

  qase(
    45,
    it('Login by phone after registration flow', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.loggingOut();
      scenariosHelper.loginByPhone(newRandomNumber, 0);
      mainPageHelper.verifyingWhySolaire();
    })
  );

  qase(
    117,
    it('Profile info page valid data with incorrect PIN updating', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.validDataAllFields(
        randomEmail,
        formattedBirthdateBasedOnTodayDate,
        2,
        2,
        6,
        4,
        5,
        3,
        submitBtn.update
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.incorrect);
      profileInfoPageHelper.checkToastMessage(inputsPlaceholders.PIN);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    118,
    it('Profile info page valid data with correct PIN updating', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.validDataAllFields(
        newRandomEmail,
        formattedBirthdateBasedOnTodayDate,
        2,
        2,
        6,
        4,
        5,
        0,
        submitBtn.update
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.updated);
      profileInfoPageHelper.checkToastMessage(errorToastBarText.profileInfo);
      footerHelper.defaultFooterState();
    })
  );

  qase(
    133,
    it('Profile info page unable edit fields after once editing', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.validDataAllFields(
        'a' + newRandomEmail,
        formattedDayBeforeBirthdateBasedOnTodayDate,
        7,
        2,
        6,
        8,
        5,
        0,
        submitBtn.update
      );
      sideBarHelper.loggingOut();
      scenariosHelper.loginByPhone(newRandomNumber, 0);
      navBarHelper.openDepositPageThroughNavbar();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.stateProfileInfoAfterEditing(
        newRandomNumber,
        'a' + newRandomEmail,
        formattedDayBeforeBirthdateBasedOnTodayDate,
        assertionValues.disabled
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    132,
    it('Profile info page update with already registered email', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        1,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.loggedInNavBarState();
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.validDataAllFields(
        validEmails[0],
        formattedBirthdateBasedOnTodayDate,
        2,
        5,
        7,
        4,
        5,
        1,
        submitBtn.update
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.emailTaken);
    })
  );
  qase(
    149,
    it('Profile info page update with invalid residential country', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        1,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      navBarHelper.loggedInNavBarState();
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.validDataAllFields(
        newRandomEmail,
        formattedBirthdateBasedOnTodayDate,
        2,
        5,
        7,
        4,
        12,
        1,
        submitBtn.update
      );
      profileInfoPageHelper.checkToastMessage(
        errorToastBarText.invalidResidentialCountry
      );
    })
  );

  qase(
    119,
    it.skip('Profile info page valid PIN changing, login with new PIN', () => {
      scenariosHelper.loginByPhone(validPhones[3], 1);
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.changeWithValidPIN(
        1,
        4,
        errorToastBarText.updated,
        submitBtn.change
      );
      sideBarHelper.loggingOut();
      scenariosHelper.loginByPhone(validPhones[3], 4);
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.changeWithValidPIN(
        4,
        1,
        errorToastBarText.updated,
        submitBtn.change
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    126,
    it.skip('User can launch the slot game after login, before launch user was logged out', () => {
      navBarHelper.openLiveSlotsLanding();
      liveSlotsHelper.urlSlots();
      liveSlotsHelper.defaultOrderForSlots();
      liveSlotsHelper.loggedOutRedirectToLoginSlots();
      scenariosHelper.loginByPhone(validPhones[1], 1);
      liveSlotsHelper.urlSlots();
      navBarHelper.loggedInNavBarState();
      gameExperienceHelper.gameIframeOpened();
      gameExperienceHelper.gameIframeLoaded();
    })
  );

  qase(
    127,
    it.skip('User can launch the slot game after registration, before launch user had no account', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.openLiveSlotsLanding();
      liveSlotsHelper.urlSlots();
      liveSlotsHelper.defaultOrderForSlots();
      liveSlotsHelper.loggedOutRedirectToLoginSlots();
      loginPageHelper.redirectToRegistration();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      registrationPageHelper.checkBodyText(
        regLoginFlowsBodyText.registerSuccessBody
      );
      navBarHelper.loggedInNavBarState();
      gameExperienceHelper.gameIframeOpened();
    })
  );

  qase(
    124,
    it.skip('User can launch the casino game after login, before launch user was logged out', () => {
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedOutStateLiveCasino();
      liveCasinoHelper.loggedOutRedirectToLoginCasino();
      scenariosHelper.loginByPhone(validPhones[1], 1);
      liveCasinoHelper.urlCasino();
      gameExperienceHelper.gameIframeOpened();
    })
  );

  qase(
    135,
    it.skip('User can launch the casino game after registration, before launch user had no account', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedOutStateLiveCasino();
      liveCasinoHelper.loggedOutRedirectToLoginCasino();
      loginPageHelper.redirectToRegistration();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      registrationPageHelper.checkBodyText(
        regLoginFlowsBodyText.registerSuccessBody
      );
      navBarHelper.loggedInNavBarState();
      gameExperienceHelper.gameIframeOpened();
    })
  );

  qase(
    95,
    it('Add to favorites live casino', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedInFavs();

      // Call addToFavsGame to get the game title
      liveCasinoHelper.addToFavsGame(urlText.liveCasino, 14);
    })
  );

  qase(
    99,
    it('Remove from favorites live casino', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedInFavs();

      // Call addToFavsGame to get the game title
      liveCasinoHelper.removeFromFavsGame(urlText.liveCasino);
    })
  );

  qase(
    145,
    it('Open last visited page after login again', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedInFavs();
      searchBarHelper.applyInLobbyFilter(gamesTableText.sicbo);
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.sicbo,
        gamesTableText.sicbo,
        gamesTableText.baccarat,
        gamesTableText.roulette
      );
      scenariosHelper.logoutFromAnyPage();
      scenariosHelper.loginByPhone(validPhones[1], 1);
      liveCasinoHelper.urlCasino();
      liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
        gamesTableText.sicbo,
        gamesTableText.sicbo,
        gamesTableText.baccarat,
        gamesTableText.roulette
      );
    })
  );
  qase(
    142,
    it('Open support chat through all the pages', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registrationFlow(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        newRandomNumber
      );
      chatHelper.openChatIframe();
      navBarHelper.openLangBtn();
      sideBarHelper.openSideBarDropdown();
      navBarHelper.openEgameLanding(true);
      searchBarHelper.applyInLobbyFilter(
        eGamesBodyTitle.newGamesSection.split(' ')[0]
      );
      gameExperienceHelper.openeGame(
        urlText.eGames,
        eGamesBtns.play,
        gameTitles.bonanza
      );
      gameExperienceHelper.closeGameIframe();
      navBarHelper.openLiveCasinoLanding();
      gameExperienceHelper.openCasinoGame(
        urlText.liveCasino,
        eGamesBtns.play,
        gameTitles.faceUp
      );
      gameExperienceHelper.gameIframeOpened();
      gameExperienceHelper.gameIframeLoaded();
      liveCasinoHelper.urlCasino();
      gameExperienceHelper.closeGameIframe();
    })
  );

  qase(
    144,
    it('Forgot PIN successful flow', () => {
      navBarHelper.clickLoginBtn();
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.typePhone(validPhones[3], inputsPlaceholders.enter);
      forgotPINPageHelper.typePatronNumber(
        validPatronNumbers[0],
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.typeValidDateOfBirth('04/12/1900');
      forgotPINPageHelper.typeFirstName(validNames[10]);
      forgotPINPageHelper.typeLastName(validNames[11]);
      forgotPINPageHelper.clickContinueBtn(submitBtn.submit);
      otpPageHelper.verifyOTPBody(validPhones[3]);
      scenariosHelper.enterValidOTP();
      forgotPINPageHelper.validNewPIN(
        1,
        errorToastBarText.updated,
        submitBtn.submit
      );
      footerHelper.defaultFooterState();
    })
  );

  qase(
    151,
    it('Registration flow with PEP checkbox unchecked', () => {
      const randonmName = generateRandomName();

      cy.visit('/register');
      scenariosHelper.registerWithPepCheckboxUnchecked(
        0,
        randomEmail,
        randonmName,
        submitBtn.register,
        inputsPlaceholders.star,
        randomNumber
      );
      registrationPageHelper.checkManualSignupPopup();
    })
  );

  qase(
    150,
    it('PEP learn more popup', () => {
      cy.visit('/register');
      registrationPageHelper.checkPepLearnMorePopup();
    })
  );
});
