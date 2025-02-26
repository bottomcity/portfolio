import { BasePageHelper } from './baseform-helper';
import { loginPageHelper } from './login-helper';
import {
  invalidPhones,
  validPatronNumbers,
  validPhones
} from '../enums/testing-data-for-inputs';
import { emailPhoneEmailValidationMessages } from '../enums/validation-enums';
import { formattedBirthdateBasedOnTodayDate } from '../common-functions/generate-today-date';
import { getDictionary } from '../common-functions/locale-functions';

class ForgotPINPageHelper extends BasePageHelper {
  forgotPINElements = {
    ...this.elements,
    backToLoginBtn: () => cy.getByTestId('back-login-btn')
  };

  typePatronNumber(inputData: any, inputPlaceholders: string) {
    this.elements
      .patronNumberInput()
      .clear()
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputPlaceholders); // Assuming the format is consistent
      });
    this.elements.patronNumberInput().type(inputData);
  }

  clickBackToLoginBtn() {
    this.forgotPINElements
      .backToLoginBtn()
      .contains('Back to Login')
      .click({ timeout: 5000 });
    loginPageHelper.loginElements.forgotPINBtn().should('be.visible');
  }

  invalidPatronNumberChecking(
    submitBtnName: string,
    validationMessageText: string,
    inputPlaceholders: string
  ) {
    invalidPhones.forEach((patronNumber: string) => {
      this.typePatronNumber(patronNumber, inputPlaceholders);
      this.clickContinueBtn(submitBtnName);
      this.checkValidationMessage(validationMessageText);
    });
    this.typePatronNumber('phone', inputPlaceholders);
    this.clickContinueBtn(submitBtnName);
    this.checkValidationMessage(
      emailPhoneEmailValidationMessages.invalidPatronNumber
    );
  }

  validDataAllForgotPIN(
    indexOfPatronNumber: number,
    indexOfNames: number,
    submitBtnName: string,
    dateOfBirth: string,
    inputPlaceholders: string
  ) {
    this.typePatronNumber(
      validPatronNumbers[indexOfPatronNumber],
      inputPlaceholders
    );
    this.regWithValidNames(indexOfNames);
    this.regWithValidPhone(validPhones[3]);
    this.typeValidDateOfBirth(dateOfBirth);
    this.clickContinueBtn(submitBtnName);
  }

  checkTranslations(locale: string) {
    cy.log('Checking Reset pin form translations...');

    const forgotPIN = getDictionary(locale).forms.resetPinForm;

    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        // reset pin form
        expect(text).contain(forgotPIN.pinReset);
        expect(text).contain(forgotPIN.provideTheFollowingDetails);
        // expect(text).contain(forgotPIN.newPinInput.title);
        // expect(text).contain(forgotPIN.pinConfirmInput.title);
        expect(text).contain(forgotPIN.dateOfBirthInput.title);
        expect(text).contain(forgotPIN.firstNameInput.title);
        expect(text).contain(forgotPIN.lastNameInput.title);
        expect(text).contain(forgotPIN.phoneInput.title);
        expect(text).contain(forgotPIN.patronNumber.title);
        expect(text).contain(forgotPIN.backToLogin);
        expect(text).contain(forgotPIN.dontHaveAnAccount);
        expect(text).contain(forgotPIN.registerHere);
        expect(text).contain(forgotPIN.submit);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking Reset pin form locale...');
    this.checkTranslations(locale);
    cy.checkLinksLocale(locale, cy.get('main'));
  }
}

export const forgotPINPageHelper = new ForgotPINPageHelper();
