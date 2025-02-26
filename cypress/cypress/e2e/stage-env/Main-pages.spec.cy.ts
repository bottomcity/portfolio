import { qase } from 'cypress-qase-reporter/mocha';
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
  validPhones,
  validPIN,
  validNames,
  validPatronNumbers
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
  sectionSEOText,
  regLoginFlowsBodyText,
  eGamesBodyTitle,
  gameTitles
} from '../../support/helpers/enums/body-text-enums';
import { scenariosHelper } from '../../support/helpers/scenarios-helpers/scenarios-helper';
import { liveCasinoLobbyPageHelper } from '../../support/helpers/pages-helpers/live-casino-lobby-page-helper';
import { searchBarHelper } from '../../support/helpers/moduls-helpers/search-bar-helper';
import { liveSlotsLobbyPageHelper } from '../../support/helpers/pages-helpers/live-slots-lobby-page-helper';
import { sideBarHelper } from '../../support/helpers/moduls-helpers/sidebar-helper';
import { profileInfoPageHelper } from '../../support/helpers/pages-helpers/profile-info-helper';
import {
  sortDropdown,
  jackpotsDropdown,
  transactionshistoryTableFilters,
  transactionshistoryTableTimeframe
} from '../../support/helpers/enums/dropdowns-data-enums';
import {
  urlText,
  urlLiveCasino,
  urleGames
} from '../../support/helpers/enums/url-enum';
import {
  generateRandomNumber,
  randomNumber
} from '../../support/helpers/common-functions/generate-number';
import { enumKeys } from '../../support/helpers/common-functions/enum-keys';
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
import { errorToastBarText } from '../../support/helpers/enums/toast-bar-enums';
import { generateRandomName } from '../../support/helpers/common-functions/generate-name';
import { forgotPINPageHelper } from '../../support/helpers/pages-helpers/forgot-PIN-helper';
import {
  getLocales,
  getQaseID
} from '../../support/helpers/common-functions/locale-functions';
import { faqHelper } from '../../support/helpers/pages-helpers/faq-helper';
import { withdrawPageHelper } from '../../support/helpers/pages-helpers/withdraw-helper';
import { balancePageHelper } from '../../support/helpers/pages-helpers/balance-helper';

/* all integers in the e2e tests use as an indexes for arrays to data in tests
other values such as name buttons put in the enums
*/

describe('Main pages', () => {
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
      return !err.message.includes('Internal Server Error');
    });
    cy.on('uncaught:exception', (err) => {
      return !err.message.includes(
        'Hydration failed because the initial UI does not match what was rendered on the server.'
      );
    });
    cy.window().then((window) => {
      window.localStorage.setItem('privacypolicyagree', '1');
      window.sessionStorage.setItem('ineligibilityNotice', '1');
    });
  });

  describe(
    'Main landing page',
    { tags: ['@regression', '@smoke', '@setQaseId'] },
    () => {
      beforeEach(() => {
        cy.visit('/');
      });
      qase(
        207,

        it('checking default state of navbar', () => {
          navBarHelper.defaultNavBarState();
        })
      );
      qase(
        208,

        it('checking swiping main Banner', () => {
          mainBannerHelper.swipingCycleMainBanner();
        })
      );
      qase(
        209,

        it('checking languages in dropdown', () => {
          navBarHelper.openLangBtn();
        })
      );
      qase(
        210,

        it('checking How to start section', () => {
          mainPageHelper.verifyingHowToStartSection();
        })
      );
      qase(
        211,

        it('checking footer', () => {
          footerHelper.defaultFooterState();
        })
      );

      qase(
        212,

        it('verifying Why Solaire section', () => {
          mainPageHelper.verifyingWhySolaire();
        })
      );
      qase(
        213,

        it('vealing/revealing Why Solaire section text', () => {
          // Wordings in stage are not relevant, so the test will fail
          mainPageHelper.mainPageElements
            .whyShowMoreLessBtn()
            .scrollIntoView()
            .should('contain.text', 'Show More')
            .click({ force: true, waitForAnimations: true });
          mainPageHelper.mainPageElements
            .whyShowMoreLessBtn()
            .should('contain.text', 'Show Less')
            .click({ force: true, waitForAnimations: true });
          mainPageHelper.mainPageElements
            .whyShowMoreLessBtn()
            .should('contain.text', 'Show More');
        })
      );
      qase(
        214,

        it('vealing/revealing SEO section text', () => {
          // Wordings in stage are not relevant, so the test will fail
          mainPageHelper.mainPageElements
            .seoShowMoreLessBtn()
            .scrollIntoView()
            .should('contain.text', 'Show More')
            .click({ force: true, waitForAnimations: true });
          mainPageHelper.mainPageElements
            .seoShowMoreLessBtn()
            .should('contain.text', 'Show Less')
            .click({ force: true, waitForAnimations: true });
          mainPageHelper.mainPageElements
            .seoShowMoreLessBtn()
            .should('contain.text', 'Show More');
        })
      );
    }
  );

  describe(
    'live-casino landing page',
    { tags: ['@regression', '@smoke'] },
    () => {
      beforeEach(() => {
        cy.visit(`/${urlText.liveCasino}`);
        mainPageHelper.checkLoaderAppearing();
      });
      qase(
        215,
        it('Checking live casino button in navigation menu', () => {
          navBarHelper.elements
            .liveCasinoBtn()
            .should('contain.html', 'yellow');
        })
      );
      qase(
        216,
        it('Checking swiping main banner on Live Casino page', () => {
          mainBannerHelper.swipingCycleMainBanner();
        })
      );
      qase(
        217,
        it('Checking search bar on Live Casino page', () => {
          // locator for SicBo btn is not correct in Stage. TEST WILL FAIL
          liveCasinoHelper.searchBarLiveCasino();
        })
      );
      qase(
        218,
        it.skip('Checking favourite section default state on Live Casino page', () => {
          // locator for Carousel-favourites is not correct in Stage. TEST WILL FAIL
          liveCasinoHelper.defaultStateFavs();
        })
      );
      qase(
        219,
        it('Checking Top Rated section on Live Casino page', () => {
          liveCasinoHelper.loggedOutTopRated();
        })
      );
      qase(
        220,
        it('Checking SEO text on Live Casino page', () => {
          // SEO text is not correct in Stage. TEST WILL FAIL
          cy.scrollTo('bottom');
          mainPageHelper.verifyingSEOSection(sectionSEOText.casino);
        })
      );
      qase(
        221,
        it('Checking footer on Live Casino page', () => {
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
      qase(
        222,
        it('Checking casino buttons', () => {
          liveCasinoHelper.searchBarLiveCasino();
        })
      );
      qase(
        223,
        it.skip('Open roulette lobby with show more', () => {
          // Invalid locators in Stage. TEST WILL FAIL!
          navBarHelper.elements.liveCasinoBtn().click({ timeout: 5000 });
          cy.scrollTo('center');
          liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
            gamesTableText.roulette,
            gamesTableText.sicbo,
            gamesTableText.baccarat
          );
          liveCasinoHelper.urlCasino();
          liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
        })
      );
      qase(
        224,
        it.skip('Open sicbo lobby with show more', () => {
          // Invalid locators in Stage. TEST WILL FAIL!
          navBarHelper.elements.liveCasinoBtn().click({ timeout: 5000 });
          cy.scrollTo('center');
          liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
            gamesTableText.sicbo,
            gamesTableText.roulette,
            gamesTableText.baccarat
          );
          liveCasinoHelper.urlCasino();
          liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
        })
      );
      qase(
        225,
        it.skip('Open baccarat lobby with show more', () => {
          // Invalid locators in Stage. TEST WILL FAIL!
          navBarHelper.elements.liveCasinoBtn().click({ timeout: 5000 });
          cy.scrollTo('center');
          liveCasinoLobbyPageHelper.openCasinoLobbyPageByClickMoreBtn(
            gamesTableText.baccarat,
            gamesTableText.sicbo,
            gamesTableText.roulette
          );
          liveCasinoHelper.urlCasino();
          liveCasinoLobbyPageHelper.searchBarLiveCasinoLobby();
        })
      );
    }
  );

  describe(
    'live-casino lobby page',
    { tags: ['@regression', '@smoke'] },
    () => {
      beforeEach(() => {
        cy.on('uncaught:exception', (err) => {
          return !err.message.includes("Failed to construct 'WebSocket'");
        });
      });
      for (const casino in urlLiveCasino) {
        // breadcramps instead of back button
        qase(
          229,
          it.skip(`Checking back button on ${casino} lobby page`, () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            liveCasinoLobbyPageHelper.clickBackToLiveCasinoBtn();
            liveCasinoHelper.urlCasino();
          })
        );
      }
      for (const casino in urlLiveCasino) {
        qase(
          233,
          it(`Checking ${casino} lobby page filtered correctly`, () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            const filteredCasinos: string[] = [];
            Object.values(urlLiveCasino).forEach((element) => {
              if (element != casino) {
                filteredCasinos.push(element);
              }
            });
            liveCasinoLobbyPageHelper.checkFilterAppliedCorrectly(
              casino,
              filteredCasinos[0],
              filteredCasinos[1]
            );
          })
        );
      }
      for (const casino in urlLiveCasino) {
        qase(
          245,
          it(`Checking filter button highlight on lobby page`, () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            searchBarHelper.checkInLobbyFilterButton(casino);
          })
        );
      }
      for (const casino in urlLiveCasino) {
        qase(
          248,
          it('Checking casino buttons', () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            liveCasinoHelper.searchBarLiveCasino();
          })
        );
      }
      for (const casino in urlLiveCasino) {
        qase(
          249,
          it(`Checking A-Z sorting on on ${casino} lobby page`, () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            searchBarHelper.applySorting(sortDropdown.asc);
            liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.asc);
          })
        );
        qase(
          250,
          it(`Checking Z-A sorting on on ${casino} lobby page`, () => {
            cy.visit(`/${urlText.liveCasino}/${casino}`);
            mainPageHelper.checkLoaderAppearing();
            searchBarHelper.applySorting(sortDropdown.desc);
            liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.desc);
          })
        );
        // waiting adding 2 more types of sorting
        searchBarHelper.applySorting(sortDropdown.newest);
        liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.newest);
        searchBarHelper.applySorting(sortDropdown.topRated);
        liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.topRated);
      }
    }
  );
  /**
   * qase(
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
   */
  describe(
    'live-slots landing page modern view',
    { tags: ['@regression', '@smoke'] },
    () => {
      beforeEach(() => {
        cy.visit(`/${urlText.liveSlots}`);
        mainPageHelper.checkLoaderAppearing();
      });
      qaseId = 3000;
      qase(
        251,
        it('Checking live-slots button highlighted in navigation menu', () => {
          navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
        })
      );
      qase(
        252,
        it('Checking main banner on Live-slots page', () => {
          mainBannerHelper.checkMainBannerPlayBtn();
        })
      );
      qase(
        253,
        it('Checking search bar Live-slots page', () => {
          liveSlotsHelper.searchBarLiveSlots(slotsBtnsTitles.classicView);
        })
      );
      qase(
        254,
        it('Checking SEO section on Live-slots page', () => {
          cy.scrollTo('bottom');
          mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
        })
      );
      qase(
        255,
        it('Checking footer on Live-slots page', () => {
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
      qase(
        256,
        it('Checking Classic view button on Live-slots page', () => {
          liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.classicView);
          liveSlotsHelper.checkClassicViewBtn(urlText.liveSlots);
        })
      );
    }
  );
  // No valid lobby pages for now!
  describe.skip('live-slots slots lobby page modern view', () => {
    { tags: ['@smoke'] },
    beforeEach(() => {
      cy.window().then((window) => {
        window.sessionStorage.setItem('ineligibilityNotice', '1');
      });
    });
    const jackpotsDropdown = { standalone: 'standalone' };
    for (const jackpot in jackpotsDropdown) {
      qase(
        257,
        it(`Checking live-slots button highlighted in navigation menu in lobby`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        258,
        it.skip(`Checking main banner buttons not visible in lobby`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          liveSlotsHelper.checkJackpotCarouselVisible();
          mainBannerHelper.ckeckMainBannerBtnsNotExist();
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        259,
        it.skip(`Checking search bar in lobby`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsLobbyPageHelper.searchBarLiveSlotsLobby();
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        260,
        it(`Checking back button on lobby page`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsLobbyPageHelper.clickBackToLiveSlotsBtn();
          liveSlotsHelper.urlSlots();
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        261,
        it(`Checking SEO section on lobby page`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsHelper.defaultStateFavs();
          cy.scrollTo('bottom');
          mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        262,
        it(`Checking footer on lobby page`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          mainPageHelper.checkLoaderAppearing();
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
    }

    for (const jackpot in jackpotsDropdown) {
      qase(
        263,
        it.skip(`Checking "Turn on Classic view" button on lobby page`, () => {
          cy.visit(`/${urlText.liveSlots}/${jackpot}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.classicView);
          liveSlotsHelper.checkClassicViewBtn(
            `${urlText.liveSlots}/${jackpot}`
          );
        })
      );
    }
    // No content tosort for now!
    searchBarHelper.applySorting(sortDropdown.asc);
          liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.asc);
          searchBarHelper.applySorting(sortDropdown.desc);
          liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.desc);
          searchBarHelper.applySorting(sortDropdown.newest);
          liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.newest);
          searchBarHelper.applySorting(sortDropdown.topRated);
          liveSlotsLobbyPageHelper.sortingApplied(sortDropdown.topRated);
  });

  // NO Live-Slots in stage
  describe.skip('live-slots jackpots lobby page modern view', () => {
    beforeEach(() => {
      cy.visit(`/${urlText.jackpots}`);
    });
    qase(
      264,
      it('Checking live-slots button highlighted in navigation menu on jackpots lobby page', () => {
        navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
      })
    );
    qase(
      265,
      it(`Checking main banner buttons not visible in jackpots lobby`, () => {
        mainBannerHelper.ckeckMainBannerBtnsNotExist();
      })
    );
    qase(
      266,
      it(`Checking search bar is absent in jackpots lobby`, () => {
        searchBarHelper.checkSearchBarNotExist();
      })
    );
    qase(
      267,
      it(`Checking back button on jackpots lobby page`, () => {
        liveSlotsHelper.elements.seoSection().click({ timeout: 5000 });
        liveSlotsHelper.liveSlotsLandingElements
          .jackpotCard()
          .should('be.visible');
        liveSlotsLobbyPageHelper.clickBackToLiveSlotsBtn();
        liveSlotsHelper.urlSlots();
      })
    );
    qase(
      // waiting for SEO text update
      268,
      it.skip(`Checking SEO section on jackpots lobby page`, () => {
        cy.scrollTo('bottom');
        mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
      })
    );
    qase(
      269,
      it(`Checking footer on jackpots lobby page`, () => {
        cy.scrollTo('bottom');
        footerHelper.defaultFooterState();
      })
    );
  });

  // NO Live-Slots in stage
  describe('live-slots slots lobby page classic view', () => {
    for (const jackpot in jackpotsDropdown) {
      qase(
        270,
        it(`Checking live-slots button highlighted in navigation menu in lobby classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        271,
        it(`Checking main banner buttons not visible in lobby classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsHelper.checkJackpotClassicCarouselVisible();
          mainBannerHelper.ckeckMainBannerBtnsNotExist();
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        272,
        it(`Checking search bar in lobby classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsLobbyPageHelper.searchBarLiveSlotsLobbyClassic();
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        273,
        it(`Checking back button not exist on lobby page classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsHelper.elements
            .loader()
            .should('not.exist', { timeout: 5000 });
          liveSlotsHelper.checkJackpotClassicCarouselVisible();
          liveSlotsLobbyPageHelper.backBtnNotexists();
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        274,
        it(`Checking SEO section on lobby page classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          // liveSlotsHelper.defaultStateFavs();
          cy.scrollTo('bottom');
          mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        275,
        it(`Checking footer on lobby page classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
    }
    for (const jackpot in jackpotsDropdown) {
      qase(
        276,
        it.skip(`Checking "Turn on Modern view" button on lobby page classic view`, () => {
          cy.visit(`${liveSlotsHelper.getClassicViewUrl(jackpot)}`);
          mainPageHelper.checkLoaderAppearing();
          liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.modernView);
          liveSlotsHelper.checkModernViewBtn(`${jackpot}`);
        })
      );
    }
  });

  // NO Live-Slots in stage
  describe(
    'live-slots landing page classic view',
    { tags: ['@regression', '@smoke'] },
    () => {
      beforeEach(() => {
        cy.visit(`${liveSlotsHelper.getClassicViewUrl(urlText.liveSlots)}`);
        cy.window().then((window) => {
          window.localStorage.setItem('privacypolicyagree', '1');
        });
      });
      qaseId = 5000;
      qase(
        277,
        it('Checking live-slots button highlighted in navigation menu classic view', () => {
          navBarHelper.elements.liveSlotsBtn().should('contain.html', 'yellow');
        })
      );
      qase(
        278,
        it.skip('Checking main banner on Live-slots page classic view', () => {
          mainPageHelper.checkLoaderAppearing();
          mainBannerHelper.checkMainBannerPlayBtn();
        })
      );
      qase(
        279,
        it('Checking search bar Live-slots page classic view', () => {
          liveSlotsHelper.searchBarLiveSlotsClassic(slotsBtnsTitles.modernView);
        })
      );
      qase(
        280,
        it('Checking SEO section on Live-slots page classic view', () => {
          liveSlotsHelper.defaultStateFavs();
          cy.scrollTo('bottom');
          mainPageHelper.verifyingSEOSection(sectionSEOText.slots);
        })
      );
      qase(
        281,
        it('Checking footer on Live-slots page classic view', () => {
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
      qase(
        282,
        it('Checking Classic view button on Live-slots page classic view', () => {
          liveSlotsHelper.checkNameOfSlotsViewBtn(slotsBtnsTitles.modernView);
          liveSlotsHelper.checkModernViewBtn(`${urlText.liveSlots}`);
        })
      );
    }
  );

  describe('Error pages', { tags: ['@regression'] }, () => {
    qase(
      283,
      it('404 not found', () => {
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
      284,
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
        scenariosHelper.loginByPhone(validPhones[3], 1);
        navBarHelper.openEgameLanding();
        gameExperienceHelper.openeGame(
          urlText.eGames,
          eGamesBtns.play,
          eGamesBtns.demo
        );
        loginPageHelper.checkLoaderAppearing();
        errorPagesHelper.checkTextPageBody(
          errorPageBodyText.p500,
          errorPageBodyTitle.p500
        );
      })
    );
    qase(
      285,
      it.skip('Down for maintenance page', () => {
        navBarHelper.defaultNavBarState();
        errorPagesHelper.checkTextPageBody(
          errorPageBodyText.maintenance,
          errorPageBodyTitle.maintenance
        );
        footerHelper.defaultFooterState();
        errorPagesHelper.clickReloadPageBtn(allOtherPageBtns.reload);
      })
    );
  });

  describe('e-games landing page', { tags: ['@regression', '@smoke'] }, () => {
    beforeEach(() => {
      cy.visit(`/${urlText.eGames}`);
      mainPageHelper.checkLoaderAppearing();
    });
    qase(
      286,
      it('Checking live-casino button highlighted in navigation menu', () => {
        navBarHelper.elements.eGamesBtn().should('contain.html', 'yellow');
      })
    );
    qase(
      287,
      it('Checking search bar on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        eGamesHelper.searchBarEgamesLoggedOut();
      })
    );
    qase(
      288,
      it('Checking SEO section on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        cy.scrollTo('bottom');
        mainPageHelper.verifyingSEOSection(sectionSEOText.eGames);
      })
    );
    qase(
      289,
      it('Checking footer on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        cy.scrollTo('bottom');
        footerHelper.defaultFooterState();
      })
    );
    qase(
      290,
      it('Checking game cards on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        eGamesHelper.gameCardLoggedOutState();
      })
    );
    qase(
      291,
      it('Checking search with results on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        eGamesHelper.searchWithResultsEgames();
        searchBarHelper.closeSearch();
      })
    );
    qase(
      292,
      it('Checking search with no results on e-games landing page', () => {
        mainPageHelper.checkLoaderAppearing();
        searchBarHelper.searchWithNoResults(inputsPlaceholders.search);
        searchBarHelper.closeSearch();
      })
    );
  });

  describe('e-games lobby page', { tags: ['@regression', '@smoke'] }, () => {
    const eGameUrls = ['table'];
    beforeEach(() => {
      cy.window().then((window) => {
        window.sessionStorage.setItem('ineligibilityNotice', '1');
      });
    });
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        293,
        it(`Checking live-casino button highlighted in navigation menu on ${urleGames[eGameUrl]} lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          navBarHelper.elements.eGamesBtn().should('contain.html', 'yellow');
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        294,
        it(`Checking search bar on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          eGamesLobbyHelper.searchBareGamesLobby();
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        295,
        it(`Checking SEO section on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          loginPageHelper.checkLoaderAppearing();
          cy.get('body').then(($body) => {
            if (!$body.text().includes('Welcome to Solaire Online!')) {
              cy.getByTestId('loader').click({ force: true });
              cy.getByTestId('loader').should('not.exist', { timeout: 5000 });
              cy.scrollTo('bottom');
              mainPageHelper.verifyingSEOSection(sectionSEOText.eGames);
            } else {
              cy.scrollTo('bottom');
              mainPageHelper.verifyingSEOSection(sectionSEOText.eGames);
            }
          });
          // mainPageHelper.elements
          //   .loader()
          //   .should('not.exist', { timeout: 5000 });
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        296,
        it(`Checking footer on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          cy.scrollTo('bottom');
          footerHelper.defaultFooterState();
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        297,
        it(`Checking game cards on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          eGamesHelper.gameCardLoggedOutState();
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        298,
        it(`Checking search with results on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          eGamesHelper.searchWithResultsEgames();
          searchBarHelper.closeSearch();
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        299,
        it(`Checking search with no results on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          searchBarHelper.searchWithNoResults(inputsPlaceholders.search);
          searchBarHelper.closeSearch();
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        300,
        it(`Checking asc sorting on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          searchBarHelper.applySorting(sortDropdown.asc);
          liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.asc);
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      qase(
        301,
        it(`Checking desc sorting on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          searchBarHelper.applySorting(sortDropdown.desc);
          liveCasinoLobbyPageHelper.sortingApplied(sortDropdown.desc);
        })
      );
    }
    for (const eGameUrl of enumKeys(urleGames)) {
      // breadcrumbs instead of back button
      qase(
        302,
        it.skip(`Checking back button on lobby page`, () => {
          cy.visit(`/${urlText.eGames}/${urleGames[eGameUrl]}`);
          mainPageHelper.checkLoaderAppearing();
          eGamesLobbyHelper.clickBackToEgamesBtn();
          eGamesHelper.urlEgames();
        })
      );
    }

    qase(
      28,
      it('Filter games (e-games)', { tags: ['@smoke'] }, () => {
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
  });

  describe('login form', { tags: ['@regression', '@login', '@smoke'] }, () => {
    beforeEach(() => {
      cy.window().then((window) => {
        window.sessionStorage.setItem('ineligibilityNotice', '1');
      });
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
      loginPageHelper.closeModalWindow();
    });
    qase(
      303,
      it('Login page invalid Phone message', () => {
        loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
        loginPageHelper.checkValidationMessage(
          emailPhoneEmailValidationMessages.invalidPhone
        );
        // no toast message for now
        loginPageHelper.checkToastMessage(errorToastBarText.support);
        loginPageHelper.checkInvalidPhoneMessage();
        loginPageHelper.loginElements.phoneInput().clear();
      })
    );

    qase(
      304,
      it('Login page valid Phone', () => {
        // no toast message for now
        loginPageHelper.validPhonesCheckingLogin();
        loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
      })
    );

    qase(
      305,
      it('Login page invalid PIN', () => {
        loginPageHelper.elements
          .phoneInput()
          .should('be.enabled', { timeout: 5000 })
          .type(validPhones[3], { force: true });
        loginPageHelper.clickTermsCheckbox();
        loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
        loginPageHelper.checkValidationMessage(
          pinValidationMessages.emptyInput
        );
        profileInfoPageHelper.invalidPINChecking(
          submitBtn.sendOTP,
          pinValidationMessages.mustBe4digits
        );
      })
    );

    // issue with navbar SOC-2068
    qase(
      306,
      it.skip('Login page valid PIN', () => {
        loginPageHelper.loginWithValidPhone(validPhones[3]);
        // loginPageHelper.clickGoToMyProfileBtn();
        navBarHelper.loggedInNavBarState();
      })
    );

    qase(
      307,
      it('Login page redirect to Registration page', () => {
        navBarHelper.clickLoginBtn();
        loginPageHelper.redirectToRegistration();
      })
    );

    after(() => {
      cy.logout();
    });
  });

  describe('OTP form', { tags: ['@regression', '@smoke'] }, () => {
    /**
     * qase(
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
    */
    beforeEach(() => {
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.typePhone(validPhones[3]);
      loginPageHelper.typePIN(validPIN[1]);
      loginPageHelper.clickTermsCheckbox();
      loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
    });
    qase(
      308,
      it('OTP page', () => {
        otpPageHelper.checkBodyText(submitBtn.sendOTP.slice(5));
        otpPageHelper.elements
          .submitBtn()
          .should('contain.text', submitBtn.confirm)
          .and('be.disabled');
        otpPageHelper.verifyOTPBody(validPhones[3]);
      })
    );

    qase(
      309,
      it('OTP page resend button', () => {
        otpPageHelper.invalidDataOTPInput();
        otpPageHelper.otpElements.otpInput().should('be.empty');
        otpPageHelper.clickResendBtn();
      })
    );
  });

  describe(
    'Registration form',
    { tags: ['@regform', '@regression', '@smoke'] },
    () => {
      /**
       *   qase(
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
      it('Registration page invalid Phone', () => {
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
        navBarHelper.clickRegBtn();
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
      110,
      it('Registration page invalid Names & Date', () => {
        navBarHelper.clickRegBtn();
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
        registrationPageHelper.validPhonesCheckingReg();
        footerHelper.defaultFooterState();
      })
    );

    qase(
      90,
      it('Registration page valid data', () => {
        navBarHelper.clickRegBtn();
        scenariosHelper.registerWithValidData(
          1,
          randomEmail,
          2,
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
       */
      beforeEach(() => {
        cy.window().then((window) => {
          window.sessionStorage.setItem('ineligibilityNotice', '1');
          window.localStorage.setItem('privacypolicyagree', '1');
        });
      });
      qase(
        169,
        it('Registration page invalid email', () => {
          cy.visit('/register', { failOnStatusCode: false });
          registrationPageHelper.checkBodyText(submitBtn.register);
          registrationPageHelper.defaultPrefix();
          registrationPageHelper.clickContinueBtn(submitBtn.register);
          registrationPageHelper.checkValidationMessage(
            commonMessages.requiredField
          );
          registrationPageHelper.invalidEmailChecking(submitBtn.register);
        })
      );

      qase(
        170,
        it('Registration page invalid Phone', () => {
          cy.visit('/register', { failOnStatusCode: false });
          registrationPageHelper.invalidPhonesChecking(
            submitBtn.register,
            emailPhoneEmailValidationMessages.invalidPhone,
            inputsPlaceholders.star
          );
        })
      );

      qase(
        171,
        it('Registration page invalid PIN', () => {
          cy.visit('/register', { failOnStatusCode: false });
          // cy.wait(2000);
          registrationPageHelper.invalidNewPINChecking(
            submitBtn.register,
            pinValidationMessages.mustBe4digits
          );
          registrationPageHelper.invalidConfirmPINChecking(
            0,
            2,
            submitBtn.register
          );
        })
      );

      qase(
        174,
        it('Registration page invalid Names & Date', () => {
          cy.visit('/register', { failOnStatusCode: false });
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
        175,
        it('Registration page valid Phone', () => {
          cy.visit('/register', { failOnStatusCode: false });
          registrationPageHelper.validPhonesCheckingReg(
            submitBtn.register,
            emailPhoneEmailValidationMessages.invalidPhone
          );
        })
      );

      // issue SOC-2026
      qase(
        172,
        it.skip('Registration page valid data', () => {
          const randonmName = generateRandomName();
          cy.visit('/register', { failOnStatusCode: false });
          scenariosHelper.registerWithValidData(
            1,
            randomEmail,
            randonmName,
            submitBtn.register,
            randomNumber
          );
          otpPageHelper.verifyOTPBody(randomNumber);
        })
      );

      qase(
        173,
        it('Registration page redirect to login page', () => {
          cy.visit('/register', { failOnStatusCode: false });
          registrationPageHelper.redirectToLogin();
        })
      );
    }
  );
});

describe('Forgot PIN', { tags: ['@regression', '@resetpin', '@smoke'] }, () => {
  beforeEach(() => {
    cy.window().then((window) => {
      window.sessionStorage.setItem('ineligibilityNotice', '1');
    });
    cy.visit('/login', { failOnStatusCode: false });
    loginPageHelper.checkBodyText(submitBtn.login);
    loginPageHelper.clickForgotPINBtn();
  });
  qase(
    44,
    it('Forgot PIN invalid Phone', () => {
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
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
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
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
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.clickBackToLoginBtn();
    })
  );

  qase(
    147,
    it('Forgot PIN mismatching of Data', () => {
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
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
    it.skip('Forgot PIN invalid PINs', () => {
      cy.visit('/login', { failOnStatusCode: false });
      loginPageHelper.checkBodyText(submitBtn.login);
      loginPageHelper.clickForgotPINBtn();
      forgotPINPageHelper.typePhone(validPhones[3]);
      forgotPINPageHelper.typePatronNumber(
        validPatronNumbers[0],
        inputsPlaceholders.enter
      );
      forgotPINPageHelper.typeValidDateOfBirth('04/12/2000');
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
});

describe('Profile info form', { tags: ['@regression', '@profile'] }, () => {
  const newRandomNumber = generateRandomNumber();
  const newRandomEmail = generateRandomEmail();
  const randonmName = generateRandomName();
  beforeEach(() => {
    cy.session([newRandomNumber], () => {
      cy.window().then((window) => {
        window.sessionStorage.setItem('ineligibilityNotice', '1');
        window.localStorage.setItem('privacypolicyagree', '1');
      });
      cy.visit('/register', { failOnStatusCode: false });
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      scenariosHelper.enterValidOTP();
      cacheAcrossSpecs: true;
    });
    cy.visit('/profile', { failOnStatusCode: false });
    cy.get('body').click({ force: true });
  });

  qase(
    34,
    it('Update account page invalid email', () => {
      registrationPageHelper.invalidEmailChecking(submitBtn.update);
    })
  );

  // phone number is disabled
  qase(
    136,
    it.skip('Update account page invalid Phone', () => {
      registrationPageHelper.invalidPhonesChecking(
        submitBtn.update,
        emailPhoneEmailValidationMessages.invalidPhone,
        inputsPlaceholders.star
      );
    })
  );

  // profile update not working for not veryfied accounts!
  qase(
    138,
    it.skip('Update account page valid data', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      profileInfoPageHelper.validDataAllFields(
        newRandomEmail,
        formattedBirthdateBasedOnTodayDate,
        2,
        2,
        6,
        4,
        5,
        0,
        submitBtn.update,
        true
      );
    })
  );

  qase(
    149,
    it.skip('Profile info page update with invalid residential country', () => {
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
    4,
    it.skip('Profile info page invalid data', () => {
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
    })
  );

  qase(
    105,
    it('Profile info page invalid PIN changing', () => {
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
    })
  );

  qase(
    37,
    it('Deposit page', () => {
      // add tests of max amount on the page
      cy.visit('/profile/deposit');
      cy.get('body').click({ force: true });
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
        newRandomNumber
      );
      depositPageHelper.clickContinueBtn(submitBtn.confirm);

      // not possible to test because of 3rd party payment page
      // mainPageHelper.closeNewWindow();
      // depositPageHelper.successStep3();
    })
  );

  qase(
    139,
    it('Deposit page failed transaction', () => {
      cy.visit('/profile/deposit');
      cy.get('body').click({ force: true });
      depositPageHelper.defaultStateDeposit();
      depositPageHelper.inputMoneyAmount(
        '25,000,000,000,000,000,000,000,000.00'
      );
      depositPageHelper.chooseFirstPaymentMethod();
      depositPageHelper.checkBtnDisabled(submitBtn.continue);
    })
  );

  after(() => {
    cy.logout();
    Cypress.session.clearAllSavedSessions();
  });
});

describe('Switch languages', { tags: ['@regression'] }, () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.window().then((window) => {
      window.localStorage.setItem('privacypolicyagree', '1');
    });
    cy.window().then((window) => {
      window.sessionStorage.setItem('ineligibilityNotice', '1');
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
      return !err.message.includes('Loading chunk 996 failed.');
    });
  });

  // Use getLocales() to test all locales
  // Use [<locale>] to test only one locale
  // Example: const locales = ['cn']; - only test for Chinese
  const locales = getLocales(); // ['en'];
  Cypress._.times(locales.length, (k) => {
    const locale = locales[k];
    let qaseID = getQaseID(locale, 1500, 20);
    describe(`${locale} locale`, () => {
      describe('Main page', () => {
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on main page when logged out`, () => {
            cy.visit(`/${locale}`);
            cy.checkLocaleCookie(locale);
            mainPageHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on main page URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/`);
            cy.url().should('include', `/${locale}`);
          })
        );
      });

      describe.skip('Live-slots page', () => {
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on live-slots page modern view when logged out`, () => {
            cy.visit(`/${locale}/${urlText.liveSlots}`);
            liveSlotsHelper.checkLoader(locale).click({ force: true });
            cy.checkLocaleCookie(locale);
            liveSlotsHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on live-slots page modern view URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/${urlText.liveSlots}`);
            cy.url().should('include', `/${locale}/${urlText.liveSlots}`);
          })
        );
      });

      describe('Live Casino page', () => {
        beforeEach(() => {
          cy.window().then((window) => {
            window.sessionStorage.setItem('ineligibilityNotice', '1');
          });
        });
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on Live Casino page when logged out`, () => {
            cy.visit(`/${locale}/${urlText.liveCasino}`);
            liveCasinoHelper.checkLoader(locale).click({timeout: 5000});
            cy.checkLocaleCookie(locale);
            liveCasinoHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on Live Casino page URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/${urlText.liveCasino}`);
            // cy.url().should('include', `/${locale}/${urlText.liveCasino}`);
          })
        );
      });

      describe.skip('eGames page', () => {
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on eGames page when logged out`, () => {
            cy.visit(`/${locale}/${urlText.eGames}`);
            cy.checkLocaleCookie(locale);
            eGamesHelper.checkLoader(locale).click();
            eGamesHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on eGames page URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/${urlText.eGames}`);
            cy.url().should('include', `/${locale}/${urlText.eGames}`);
          })
        );
      });

      describe('Navigation bar, footer and cookie notice', () => {
        beforeEach(() => {
          cy.visit(`/${locale}`);
        });
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on navigation bar`, () => {
            navBarHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on footer`, () => {
            footerHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it.skip(`Check "${locale.toUpperCase()}" locale in cookie notice`, () => {
            mainPageHelper.checkCookieNoticeLocale(locale);
          })
        );
      });

      describe('Login and Forgot pin page', () => {
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on login page`, () => {
            cy.visit(`/${locale}/login`, { failOnStatusCode: false });
            loginPageHelper.elements.body().click();
            loginPageHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on Login URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/login`, { failOnStatusCode: false });
            cy.url().should('include', `/${locale}`);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on Forgot PIN page`, () => {
            cy.visit(`/${locale}/login`, { failOnStatusCode: false });
            loginPageHelper.elements.body().click();
            loginPageHelper.clickForgotPINBtn();
            forgotPINPageHelper.checkLocale(locale);
          })
        );
      });

      describe('Registration page', () => {
        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on Registration page`, () => {
            cy.visit(`/${locale}/register`, { failOnStatusCode: false });
            registrationPageHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on Registration URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/register`, { failOnStatusCode: false });
            // cy.url().should('include', `/${locale}/register`);
          })
        );
      });

      describe('FAQ page', () => {
        // skip this until branch merged with development
        qase(
          qaseID++,
          it.skip(`Check "${locale.toUpperCase()}" locale on FAQ page`, () => {
            cy.visit(`${locale}/faq`);
            faqHelper.checkLocale(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" added to on FAQ URL from locale Cookie`, () => {
            cy.setCookie('NEXT_LOCALE', locale);
            cy.visit(`/faq`);
            cy.url().should('include', `/${locale}/faq`);
          })
        );

        describe.skip('Terms and conditions page', () => {
          // wordings hardcoded to the HTML
          qase(
            qaseID++,
            it.skip(`Check "${locale.toUpperCase()}" locale on Terms and conditions page`, () => {
              cy.visit(`/${locale}/terms`);
              termsHelper.checkLocale(locale);
            })
          );

          qase(
            qaseID++,
            it(`Check "${locale.toUpperCase()}" added to on Terms and conditions URL from locale Cookie`, () => {
              cy.setCookie('NEXT_LOCALE', locale);
              cy.visit(`/terms`);
              cy.url().should('include', `/${locale}/terms`);
            })
          );
        });
      });

      describe('Logged in user', () => {
        // let locale = 'en';
        let qaseID = 800;
        const login = (name: string, phone: string, locale: string) => {
          cy.login(name, phone, locale);
        };
        beforeEach(() => {
          cy.clearAllCookies();
          cy.clearAllLocalStorage();
          // cy.logout();
          cy.log('Current locale: ' + locale);
          login('user7', validPhones[7], locale);
          cy.window().then((window) => {
            window.localStorage.setItem('privacypolicyagree', '1');
          });
        });

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on main page when logged in`, () => {
            login('user7', validPhones[7], locale);
            cy.visit(`/${locale}`);
            cy.checkLinksLocale(locale, cy.get('main'));
            cy.checkLinksLocale(locale, navBarHelper.elements.navBar());
            cy.checkLinksLocale(locale, footerHelper.elements.footer());
            cy.checkLocaleCookie(locale);
          })
        );

        qase(
          qaseID++,
          it(`Check "${locale.toUpperCase()}" locale on profile menu in navbar when logged in`, () => {
            login('user7', validPhones[7], locale);
            cy.visit(`/${locale}`);
            navBarHelper.clickDotsBtn();
            cy.wait(2000);
            sideBarHelper.checkLocale(locale);
          })
        );

        // unskip when branch merged with development
        describe.skip('Logged in profile', () => {
          beforeEach(() => {
            login('user7', validPhones[7], locale);
          });
          qase(
            qaseID++,
            it(`Check "${locale.toUpperCase()}" locale profile sidebar page when logged in`, () => {
              cy.visit(`/profile`);
              sideBarHelper.checkLocale(locale);
            })
          );

          qase(
            qaseID++,
            it(`Check "${locale.toUpperCase()}" locale profile deposit page when logged in`, () => {
              cy.visit(`/profile/deposit`);
              depositPageHelper.checkLocale(locale);
            })
          );

          qase(
            qaseID++,
            it.skip(`Check "${locale.toUpperCase()}" locale profile withdraw page when logged in`, () => {
              cy.visit(`/profile/withdraw`);
              withdrawPageHelper.checkLoaderLocale(locale);
              withdrawPageHelper.checkLocale(locale);
            })
          );

          qase(
            qaseID++,
            it.skip(`Check "${locale.toUpperCase()}" locale profile balance page when logged in`, () => {
              cy.visit(`/profile/balance`);
              cy.wait(2000);
              // balancePageHelper.checkLoaderLocale(locale);
              balancePageHelper.checkLocale(locale);
            })
          );

          qase(
            qaseID++,
            it(`Check "${locale.toUpperCase()}" locale profile page when logged in`, () => {
              cy.visit(`/profile`);
              profileInfoPageHelper.checkLocale(locale);
            })
          );
        });

        afterEach(() => {
          cy.log('Clearing all cookies');
          cy.clearAllCookies();
          cy.log('Clearing all local storage');
          cy.clearAllLocalStorage();
          cy.logout();
          Cypress.session.clearAllSavedSessions();
        });
      });
    });
  });
});

describe('Scenarios Suit', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.window().then((window) => {
      window.sessionStorage.setItem('ineligibilityNotice', '1');
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
  });

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    16,
    it.skip('Registration flow', () => {
      const randonmName = generateRandomName();

      // mainPageHelper.closeCookieNotice();
      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        randomEmail,
        randonmName,
        submitBtn.register,
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

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    114,
    it.skip('Registration with already registered number', () => {
      /* in this case const randomNumber uses in purpose
      to reuse registered in caseID 16 phone number*/

      const randonmName = generateRandomName();
      const newRandomEmail = generateRandomEmail();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        randomNumber
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.numberTaken);
    })
  );

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    131,
    it.skip('Registration with already registered email', () => {
      // in this case const randomEmail uses in purpose
      // to reuse registered in caseID 16 email
      const newRandomNumber = generateRandomNumber();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        randomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.emailTaken);
    })
  );

  // Error: 200202, The recipient is invalid. SOC-2026.
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
    it.skip('Login by phone after registration flow', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      navBarHelper.openDepositPageThroughNavbar();
      sideBarHelper.loggingOut();
      scenariosHelper.loginByPhone(newRandomNumber, 0);
      mainPageHelper.verifyingWhySolaire();
    })
  );

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    117,
    it.skip('Profile info page valid data with incorrect PIN updating', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      navBarHelper.loggedInNavBarState();
      navBarHelper.openDepositPageThroughNavbar();
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

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    118,
    it.skip('Profile info page valid data with correct PIN updating', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      navBarHelper.loggedInNavBarState();
      navBarHelper.openDepositPageThroughNavbar();
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
    it.skip('Profile info page unable edit fields after once editing', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      navBarHelper.loggedInNavBarState();
      navBarHelper.openDepositPageThroughNavbar();
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

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    132,
    it.skip('Profile info page update with already registered email', () => {
      const newRandomNumber = generateRandomNumber();
      const newRandomEmail = generateRandomEmail();
      const randonmName = generateRandomName();

      navBarHelper.clickRegBtn();
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      navBarHelper.loggedInNavBarState();
      navBarHelper.openDepositPageThroughNavbar();
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
        0,
        submitBtn.update
      );
      profileInfoPageHelper.checkToastMessage(errorToastBarText.emailTaken);
    })
  );

  // Error: 200202, The recipient is invalid. SOC-2026.
  qase(
    119,
    it.skip('Profile info page valid PIN changing, login with new PIN', () => {
      scenariosHelper.loginByPhone(validPhones[3], 1);
      navBarHelper.openDepositPageThroughNavbar();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.patronNumberChecking();
      profileInfoPageHelper.changeWithValidPIN(1, 4, submitBtn.change);
      sideBarHelper.loggingOut();
      scenariosHelper.loginByPhone(validPhones[3], 4);
      sideBarHelper.openSideBarDropdown();
      sideBarHelper.openProfileInfo();
      profileInfoPageHelper.changeWithValidPIN(4, 1, submitBtn.change);
      footerHelper.defaultFooterState();
    })
  );

  // can be added to smoke suite
  qase(
    126,
    it.skip('User can launch the slot game after login, before launch user was logged out', () => {
      navBarHelper.openLiveSlotsLanding();
      liveSlotsHelper.urlSlots();
      liveSlotsHelper.defaultOrderForSlots();
      liveSlotsHelper.loggedOutRedirectToLoginSlots();
      scenariosHelper.loginByPhoneAfterReg(
        validPhones[1],
        1,
        inputsPlaceholders.enter
      );
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
      scenariosHelper.registerWithValidData(
        0,
        newRandomEmail,
        randonmName,
        submitBtn.register,
        newRandomNumber
      );
      otpPageHelper.verifyOTPBody(newRandomNumber);
      scenariosHelper.enterValidOTP();
      registrationPageHelper.checkBodyText(
        regLoginFlowsBodyText.registerSuccessBody
      );
      navBarHelper.loggedInNavBarState();
      gameExperienceHelper.gameIframeOpened();
    })
  );

  qase(
    124,
    it('User can launch the casino game after login, before launch user was logged out', () => {
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedOutStateLiveCasino();
      liveCasinoHelper.loggedOutRedirectToLoginCasino();
      scenariosHelper.loginByPhoneAfterReg(
        validPhones[7],
        1,
        inputsPlaceholders.enter
      );
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      gameExperienceHelper.openeGame(
        urlText.liveCasino,
        eGamesBtns.play,
        gameTitles.faceUp
      );
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
    it.skip('Add to favorites live casino', () => {
      scenariosHelper.loginByPhone(validPhones[1], 1);
      navBarHelper.openLiveCasinoLanding();
      liveCasinoHelper.urlCasino();
      liveCasinoHelper.loggedInFavs();

      // Call addToFavsGame to get the game title
      liveCasinoHelper.addToFavsGame(
        gamesTableText.roulette,
        urlText.liveCasino
      );
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
      gameExperienceHelper.openExitLobbyPopup();
      gameExperienceHelper.closeExitLobbyPopup();
      gameExperienceHelper.closeGameIframe();
    })
  );

  qase(
    123,
    it.skip('e-games real gaming experience', () => {
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
});

describe('Logged in user', () => {
  const login = (name: string, phone: string, locale: string) => {
    cy.login(name, phone, locale);
  };
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
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
    login('user7', validPhones[7], 'en');
  });

  qase(
    310,
    it('Check sidebar when logged in', () => {
      cy.visit('/');
      sideBarHelper.openSideBarDropdown();
    })
  );

  describe('Transaction history', () => {
    beforeEach(() => {
      cy.visit('/profile/balance');
    });

    qase(
      901,
      it('Check filters buttons', () => {
        balancePageHelper.checkTypeFilterButton();
        balancePageHelper.checkTimeframeFilterButton();
      })
    );

    qase(
      902,
      it('Check table is rendered if filter applied', () => {
        balancePageHelper.checkTableWithAppliedFilters();
      })
    );

    qase(
      903,
      it('Check transaction table conetent', () => {
        balancePageHelper.balalnceElements
          .balanceTable()
          .find('tr')
          .should(($tr) => {
            expect($tr).to.have.length(11);
          });
        balancePageHelper.selectDate('4', '4', '11', '2024');
        balancePageHelper.checkTableContent(1, 6, '11/4/2024', '11/4/2024');
      })
    );

    qase(
      904,
      it('Check date range in url', () => {
        balancePageHelper.selectDateRangeInURL('2024-08-01', '2024-10-31');
        balancePageHelper.checkTableContent(10, 6, '9/27/2024', '9/6/2024');
      })
    );

    // pagination is not working because of an issue
    qase(
      905,
      it.skip('Check pagination', () => {
        balancePageHelper.clickPaginationButton('first');
        balancePageHelper.checkTableContent(10, 6, '11/4/2024', '9/6/2024');
      })
    );
  });
});

describe.skip('Maintenance', () => {
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
