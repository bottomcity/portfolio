import { BasePageHelper } from './baseform-helper';
import { getDictionary } from '../common-functions/locale-functions';

class MainPageHelper extends BasePageHelper {
  mainPageElements = {
    howToStartSection: () => cy.getByTestId('how-to-start-section'),
    howToStartSectionRegBtn: () =>
      cy.getByTestId('how-to-start-section-reg-btn'),
    whySolaire: () => cy.getByTestId('why-solaire'),
    seoSection: () => cy.getByTestId('seo-section'),
    whyShowMoreLessBtn: () => cy.getByTestId('why-show-more-less-btn'),
    seoShowMoreLessBtn: () => cy.getByTestId('seo-show-more-less-btn')
  };

  clickHowToStartSectionRegBtn() {
    this.mainPageElements.howToStartSectionRegBtn().click();
  }

  verifyingHowToStartSection() {
    this.mainPageElements
      .howToStartSection()
      .find('div[class="flex"]')
      .should(($div) => {
        expect($div).to.have.length(3);
        expect($div.eq(0)).to.deep.include.text('Step 1');
        expect($div.eq(1)).to.deep.include.text('Step 2');
        expect($div.eq(2)).to.deep.include.text('Step 3');
      });
  }

  verifyingWhySolaire() {
    this.mainPageElements.whySolaire().should(($div) => {
      expect($div.eq(0)).to.deep.include.text('Winning Starts with Trust');
      expect($div.eq(0)).to.deep.include.text(
        'Solaire Experience in Your Pocket'
      );
      expect($div.eq(0)).to.deep.include.text(
        'Effortless Deposits and Withdrawals'
      );
      expect($div.eq(0)).to.deep.include.text('Excellent 5 Star Service');
    });
  }

  verifyingSEOSection(expectedSEOText: string) {
    this.mainPageElements.seoSection().should('contain', expectedSEOText);
  }

  checkTranslations(locale: string) {
    const dict = getDictionary(locale);
    let homepage, mainBanner, howTostart, whySolaire;

    homepage = dict.homePage;
    mainBanner = homepage.mainBanner;
    howTostart = homepage.howToStartSection;
    whySolaire = homepage.WhySolaireSection;

    cy.get('div')
      .invoke('text')
      .then((text) => {
        // expect(text).contain(dictKr.login);
        // expect(text).contain(dictKr.nav.casino);

        // banner
        // expect(text).contain(mainBanner.firstBannerItem.buttonLabel.play);
        expect(text).contain(mainBanner.firstBannerItem.buttonLabel.register);
        expect(text).contain(mainBanner.firstBannerItem.title);
        expect(text).contain(mainBanner.firstBannerItem.subtitle);
        expect(text).contain(
          mainBanner.firstBannerItem.cards.firstCard.longTitle
        );
        expect(text).contain(
          mainBanner.firstBannerItem.cards.firstCard.extraRow
        );
        expect(text).contain(
          mainBanner.firstBannerItem.cards.secondCard.longTitle
        );
        expect(text).contain(
          mainBanner.firstBannerItem.cards.secondCard.extraRow
        );
        expect(text).contain(
          mainBanner.firstBannerItem.cards.thirdCard.longTitle
        );
        expect(text).contain(
          mainBanner.firstBannerItem.cards.thirdCard.extraRow
        );

        expect(text).contain(mainBanner.secondBannerItem.buttonLabel);
        expect(text).contain(mainBanner.secondBannerItem.title);
        expect(text).contain(mainBanner.secondBannerItem.subtitle);
        // expect(text).contain(
        //   mainBanner.secondBannerItem.cards.firstCard.longTitle
        // );
        // expect(text).contain(
        //   mainBanner.secondBannerItem.cards.firstCard.extraRow
        // );
        expect(text).contain(
          mainBanner.secondBannerItem.cards.secondCard.longTitle
        );
        expect(text).contain(
          mainBanner.secondBannerItem.cards.secondCard.extraRow
        );
        expect(text).contain(
          mainBanner.secondBannerItem.cards.thirdCard.longTitle
        );
        expect(text).contain(
          mainBanner.secondBannerItem.cards.thirdCard.extraRow
        );

        expect(text).contain(mainBanner.thirdBannerItem.buttonLabel);
        expect(text).contain(mainBanner.thirdBannerItem.title);
        expect(text).contain(mainBanner.thirdBannerItem.subtitle);
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.firstCard.longTitle
        );
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.firstCard.extraRow
        );
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.secondCard.longTitle
        );
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.secondCard.extraRow
        );
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.thirdCard.longTitle
        );
        expect(text).contain(
          mainBanner.thirdBannerItem.cards.thirdCard.extraRow
        );

        //how to start sections
        expect(text).contain(howTostart.title);
        expect(text).contain(howTostart.firstStep.title);
        expect(text).contain(howTostart.firstStep.step);
        expect(text).contain(howTostart.firstStep.text);
        expect(text).contain(howTostart.firstStep.buttonLabel);

        expect(text).contain(howTostart.secondStep.title);
        expect(text).contain(howTostart.secondStep.step);
        expect(text).contain(howTostart.secondStep.text);

        expect(text).contain(howTostart.thirdStep.title);
        expect(text).contain(howTostart.thirdStep.step);
        expect(text).contain(howTostart.thirdStep.text);

        //why solaire section
        expect(text).contain(whySolaire.title);
        expect(text).contain(whySolaire.cards.firstCard.title);
        expect(text).contain(whySolaire.cards.firstCard.description);
        expect(text).contain(whySolaire.cards.secondCard.title);
        expect(text).contain(whySolaire.cards.secondCard.description);
        expect(text).contain(whySolaire.cards.thirdCard.title);
        expect(text).contain(whySolaire.cards.thirdCard.description);
        expect(text).contain(whySolaire.cards.fourthCard.title);
        expect(text).contain(whySolaire.cards.fourthCard.description);
        expect(text).contain(whySolaire.showMore);
        // expect(text).contain(whySolaire.showLess);
        expect(text).contain(whySolaire.banner.title);
        expect(text).contain(whySolaire.banner.subtitle);
        expect(text).contain(whySolaire.banner.buttonLabel);

        // expect(text).contain(form[formText])
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking locale for Live Slots page...');
    cy.checkLinksLocale(locale, cy.get('main'));
    this.checkTranslations(locale);
  }
}

export const mainPageHelper = new MainPageHelper();
