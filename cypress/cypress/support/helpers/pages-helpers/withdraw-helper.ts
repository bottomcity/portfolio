import { BasePageHelper } from './baseform-helper';
import { depositBtns } from '../enums/btn-names-enums';
import { inputsPlaceholders, profileBodyText } from '../enums/body-text-enums';
import { paymentTitles } from '../enums/values-for-assertions';
import { depositWithdrawValidationMessages } from '../enums/validation-enums';
import { getDictionary } from '../common-functions/locale-functions';

class WithdrawPageHelper extends BasePageHelper {
  withdrawElements = {
    ...this.elements,
    infoSection: () => cy.getByTestId('info-section')
  };

  checkTranslations(locale: string) {
    cy.log('Checking Profile deposit page translations...');
    const profileWithdraw = getDictionary(locale).profile.withdrawAndDeposit;
    const verification = getDictionary(locale).profile.verification;

    this.elements
      .profileContent()
      .find('h1')
      .invoke('text')
      .then((text) => {
        expect(text).contain(profileWithdraw.withdraw);
      });

    this.elements
      .profileContent()
      .find('div')
      .invoke('text')
      .then((text) => {
        expect(text).contain(profileWithdraw.hereYouCanPayOutYourWinnings);
      });

    // for not verified accounts
    // this.withdrawElements
    //   .infoSection()
    //   .find('div')
    //   .invoke('text')
    //   .then((text) => {
    //     expect(text).contain(verification.fillAndVerify.header);
    //     expect(text).contain(verification.fillAndVerify.withdraw);
    //     expect(text).contain(verification.fillAndVerify.button);
    //   });
  }

  checkLocale(locale: string) {
    cy.log('Checking Profile withdraw page locale...');
    this.checkTranslations(locale);
  }
}

export const withdrawPageHelper = new WithdrawPageHelper();
