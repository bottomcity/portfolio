import { getDictionary } from '../common-functions/locale-functions';

class FooterHelper {
  elements = {
    footer: () => cy.getByTestId('footer'),
    facebookBtn: () => cy.getByTestId('FACEBOOK'),
    instagramBtn: () => cy.getByTestId('INSTAGRAM'),
    twitterBtn: () => cy.getByTestId('TWITTER'),
    youtubeBtn: () => cy.getByTestId('YOUTUBE'),
    linkedInBtn: () => cy.getByTestId('LINKEDIN'),
    FAQBtn: () => cy.getByTestId('FAQ')
  };

  defaultFooterState() {
    this.elements.footer().should('be.visible');
    this.elements.facebookBtn().should('be.visible');
    this.elements.instagramBtn().should('be.visible');
    this.elements.youtubeBtn().should('be.visible');
    this.elements.linkedInBtn().should('be.visible');
  }

  checkTranslations(locale: string) {
    cy.log('Checking footer locale...');
    const footer = getDictionary(locale).footer;
    const faq = getDictionary(locale).faqPage;

    cy.get('footer')
      .find('div')
      .invoke('text')
      .then((text) => {
        // footer
        expect(text).contain(footer.copyright);
        expect(text).contain(footer.solaireResortAllRightsReserved);
        expect(text).contain(footer.aboutList.title);
        // about us temporarily removed
        // expect(text).contain(footer.aboutList.aboutUs);
        expect(text).contain(footer.aboutList.rewards);
        expect(text).contain(footer.aboutList.responsibleGaming);
        expect(text).contain(footer.aboutList.privacyPolicy);
        expect(text).contain(footer.aboutList.termsAndConditions);

        expect(text).contain(footer.gamesList.title);
        expect(text).contain(footer.gamesList.liveSlots);
        expect(text).contain(footer.gamesList.liveCasino);
        expect(text).contain(footer.gamesList.eGames);
        expect(text).contain(footer.gamesList.rewards);
        expect(text).contain(footer.gamesList.paymentMethods);

        expect(text).contain(footer.supportList.title);
        expect(text).contain(footer.supportList.subtitle);
        expect(text).contain(footer.supportList.faq);
        // expect(text).contain(footer.supportList.liveChat);
        expect(text).contain(footer.supportList.tel);
        expect(text).contain(footer.supportList.email);
        expect(text).contain(faq.customerSupport);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking footer locale...');
    cy.checkLinksLocale(locale, cy.get('footer'));
    this.checkTranslations(locale);
  }
}

export const footerHelper = new FooterHelper();
