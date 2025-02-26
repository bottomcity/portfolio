import { navBarHelper } from './navbar-helper';
import { sideBar } from '../enums/dropdowns-data-enums';
import { getDictionary } from '../common-functions/locale-functions';

class SideBarHelper {
  elements = {
    sideBar: () => cy.getByTestId('sidebar'),
    profileMembershipInfo: () => cy.getByTestId('profile-member-info'),
    depositBtn: () => cy.getByTestId('profile-deposit-btn'),
    withdrawBtn: () => cy.getByTestId('profile-withdraw-btn'),
    balanceBtn: () => cy.getByTestId('profile-balance-btn'),
    profileInfoBtn: () => cy.getByTestId('profile-info-btn'),
    gamingBtn: () => cy.getByTestId('profile-gaming-btn'),
    supportBtn: () => cy.getByTestId('support-btn'),
    faqBtn: () => cy.getByTestId('faq-btn'),
    responsibleGamingBtn: () => cy.getByTestId('responsible-btn'),
    logoutBtn: () => cy.getByTestId('logout-btn')
  };

  defaultStateSideBar() {
    const profileNavigation = getDictionary('en').profileNavigation;
    this.elements.sideBar().should('be.visible');
    this.elements
      .sideBar()
      .find('a')
      .should(($a) => {
        expect($a).to.have.length(7);
        expect($a.eq(0)).to.have.text(profileNavigation.deposit);
        expect($a.eq(0)).to.have.attr('href').contain(`/profile/deposit`);
        // expect($a.eq(1)).to.have.text(sideBar.transfer);
        expect($a.eq(1)).to.have.text(profileNavigation.withdraw);
        expect($a.eq(1)).to.have.attr('href').contain(`/profile/withdraw`);
        expect($a.eq(2)).to.have.text(profileNavigation.myProfile);
        expect($a.eq(2)).to.have.attr('href').contain(`/profile`);
        expect($a.eq(3)).to.have.text(profileNavigation.transactionHistory);
        expect($a.eq(3)).to.have.attr('href').contain(`/profile/balance`);
        // expect($a.eq(6)).to.have.text(sideBar.gaming);
        expect($a.eq(4)).to.have.text(profileNavigation.faq);
        expect($a.eq(4)).to.have.attr('href').contain(`/profile/faq`);
        expect($a.eq(5)).to.have.text(profileNavigation.responsibleGaming);
        expect($a.eq(5))
          .to.have.attr('href')
          .contain(`/profile/responsible-gaming`);
      });
    this.elements.logoutBtn().should('be.visible');
  }
  openSideBarDropdown() {
    navBarHelper.loggedInNavBarState();
    navBarHelper.clickDotsBtn();
    this.defaultStateSideBar();
  }

  openProfileInfo() {
    this.elements
      .profileInfoBtn()
      .filter(':visible')
      .dblclick({ timeout: 5000 });
    this.elements.sideBar().should('be.visible');
  }

  openDepositPageThroughSidebar() {
    this.elements.depositBtn().click({ timeout: 5000 });
    this.elements.sideBar().should('be.visible');
  }

  loggingOut() {
    this.elements.logoutBtn().last().click({ timeout: 5000 });
    navBarHelper.defaultNavBarState();
  }

  checkTranslations(locale: string) {
    cy.log('Checking profile sidebar translations...');
    const profileNavigation = getDictionary(locale).profileNavigation;

    this.elements
      .sideBar()
      .find('div')
      .invoke('text')
      .then((text) => {
        // side bar
        expect(text).contain(profileNavigation.bonus);
        expect(text).contain(profileNavigation.solaire);
        expect(text).contain(profileNavigation.deposit);
        // expect(text).contain(profileNavigation.transferFromSolaire);
        expect(text).contain(profileNavigation.withdraw);
        expect(text).contain(profileNavigation.transactionHistory);
        expect(text).contain(profileNavigation.myProfile);
        // expect(text).contain(profileNavigation.gamingHistory);
        expect(text).contain(profileNavigation.faq);
        // expect(text).contain(profileNavigation.support);
        expect(text).contain(profileNavigation.responsibleGaming);
        expect(text).contain(profileNavigation.logout);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking profile sidebar locale...');
    cy.checkLinksLocale(locale, this.elements.sideBar());
    this.checkTranslations(locale);
  }
}

export const sideBarHelper = new SideBarHelper();
