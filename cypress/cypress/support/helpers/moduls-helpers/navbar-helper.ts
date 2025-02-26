import { NavBarVars } from '../enums/navbar-enums';
import { submitBtn } from '../enums/btn-names-enums';
import { loginPageHelper } from '../pages-helpers/login-helper';
import { depositPageHelper } from '../pages-helpers/deposit-helper';
import { urlText } from '../enums/url-enum';
import { getDictionary } from '../common-functions/locale-functions';

class NavBarHelper {
  elements = {
    navBar: () => cy.getByTestId(NavBarVars.navBar),
    logoBtn: () => cy.getByTestId(NavBarVars.logoBtn),
    liveSlotsBtn: () => cy.getByTestId(NavBarVars.liveSlotsBtn),
    liveCasinoBtn: () => cy.getByTestId(NavBarVars.liveCasinoBtn),
    eGamesBtn: () => cy.getByTestId(NavBarVars.eGamesBtn),
    offersBtn: () => cy.getByTestId(NavBarVars.offers),
    rewardsBtn: () => cy.getByTestId(NavBarVars.rewardsBtn),
    regBtn: () => cy.getByTestId(NavBarVars.regBtn),
    loginBtn: () => cy.getByTestId(NavBarVars.loginBtn),
    langBtn: () => cy.getByTestId(NavBarVars.langBtn),
    langDropdown: () => cy.getByTestId(NavBarVars.langDropdown),
    engOption: () => cy.getByTestId(NavBarVars.engOption),
    chinaOption: () => cy.getByTestId(NavBarVars.chinaOption),
    koreanOption: () => cy.getByTestId(NavBarVars.koreanOption),
    cashBtn: () => cy.getByTestId('cash-btn'),
    memberInfo: () => cy.getByTestId('member-info'),
    dotsBtn: () => cy.getByTestId('dots-btn')
  };

  defaultNavBarState() {
    this.elements.navBar().shouldExist(NavBarVars.navBar);
    this.elements.logoBtn().shouldExist(NavBarVars.logoBtn);
    this.elements
      .liveSlotsBtn()
      .shouldExist(NavBarVars.liveSlotsBtn)
      .contains('Live Slots');
    this.elements
      .liveCasinoBtn()
      .shouldExist(NavBarVars.liveCasinoBtn)
      .contains('Live Casino');
    this.elements
      .eGamesBtn()
      .shouldExist(NavBarVars.eGamesBtn)
      .contains('e-Games');
    // this.elements.offersBtn().shouldExist(NavBarVars.offers).contains('Offers');
    // rewards is hidden for now
    // this.elements
    //   .rewardsBtn()
    //   .shouldExist(NavBarVars.rewardsBtn)
    //   .contains('Rewards');
    this.elements
      .regBtn()
      .shouldExist(NavBarVars.regBtn)
      .contains(submitBtn.register);
    this.elements
      .loginBtn()
      .shouldExist(NavBarVars.loginBtn)
      .contains(submitBtn.login);
    this.elements
      .langBtn()
      .shouldExist(NavBarVars.langBtn)
      .should('contain', NavBarVars.engOption);
  }
  loggedInNavBarState() {
    this.elements.navBar().shouldExist(NavBarVars.navBar);
    this.elements.logoBtn().shouldExist(NavBarVars.logoBtn);
    this.elements
      .liveSlotsBtn()
      .shouldExist(NavBarVars.liveSlotsBtn)
      .contains('Live Slots');
    this.elements
      .liveCasinoBtn()
      .shouldExist(NavBarVars.liveCasinoBtn)
      .contains('Live Casino');
    this.elements
      .eGamesBtn()
      .shouldExist(NavBarVars.eGamesBtn)
      .contains('e-Games');
    // rewards is hidden for now
    // this.elements
    //   .rewardsBtn()
    //   .shouldNotExist(NavBarVars.rewardsBtn)
    //   .contains('Rewards');
    this.elements.regBtn().should('not.exist');
    this.elements.loginBtn().should('not.exist');
    this.elements
      .langBtn()
      .shouldExist(NavBarVars.langBtn)
      .should('contain', NavBarVars.engOption);
    this.elements.cashBtn().should('be.visible');
    this.elements.memberInfo().should('be.visible').and('not.be.empty');
  }

  clickCashBtn() {
    this.elements.cashBtn().click({ timeout: 5000, force: true });
  }

  clickLogoBtn() {
    this.elements.logoBtn().click({ timeout: 5000, force: true });
  }

  clickRegBtn() {
    this.elements.regBtn().dblclick({ timeout: 10000 });
  }
  clickLoginBtn() {
    this.elements.loginBtn().dblclick({ timeout: 5000 });
    cy.wait(1000);
  }
  clickDotsBtn() {
    this.elements.memberInfo().should('be.visible');
    this.elements.dotsBtn().dblclick({ timeout: 5000, force: true });
  }
  openLangBtn() {
    this.elements
      .langBtn()
      .dblclick({ timeout: 5000, waitForAnimations: true });
    this.elements
      .langDropdown()
      .should('be.visible')
      .find('a')
      .should(($a) => {
        expect($a).to.have.length(3);
        expect($a.eq(0)).to.have.text(NavBarVars.engOption);
        expect($a.eq(1)).to.have.text(NavBarVars.koreanOption);
        expect($a.eq(2)).to.have.text(NavBarVars.chinaOption);
        expect($a.eq(0)).to.have.attr('href').contain(`/${urlText.en}`);
        expect($a.eq(1)).to.have.attr('href').contain(`/${urlText.kr}`);
        expect($a.eq(2)).to.have.attr('href').contain(`/${urlText.cn}`);
      })
      .first()
      .click({ timeout: 5000 });
  }

  openEgameLanding(force?: boolean) {
    navBarHelper.elements
      .eGamesBtn()
      .dblclick({ timeout: 5000, waitForAnimations: force });
    // loginPageHelper.checkLoaderAppearing();
  }

  openLiveSlotsLanding() {
    navBarHelper.elements.liveSlotsBtn().dblclick({ timeout: 5000 });
    loginPageHelper.checkLoaderAppearing();
  }

  openLiveCasinoLanding() {
    navBarHelper.elements.liveCasinoBtn().dblclick({ timeout: 5000 });
    loginPageHelper.checkLoaderAppearing();
  }

  openDepositPageThroughNavbar() {
    this.clickCashBtn();
    depositPageHelper.checkUrlText(urlText.depo);
  }

  checkNavBarExists() {
    this.elements.navBar().shouldExist(NavBarVars.navBar);
  }

  checkTranslations(locale: string) {
    cy.log('Checking navBar translations...');
    const navBar = getDictionary(locale).nav;

    this.elements
      .navBar()
      .find('div')
      .invoke('text')
      .then((text) => {
        // nav bar
        expect(text).contain(navBar.slots);
        expect(text).contain(navBar.casino);
        expect(text).contain(navBar.eGames);
        expect(text).contain(navBar.promotions);
        // expect(text).contain(navBar.rewards);
        // expect(text).contain(navBar.sportsbook);
        expect(text).contain(navBar.login);
        expect(text).contain(navBar.register);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking navBar locale...');
    cy.checkLinksLocale(locale, this.elements.navBar());
    this.openLangBtn();
    this.checkTranslations(locale);
  }
}

export const navBarHelper = new NavBarHelper();
