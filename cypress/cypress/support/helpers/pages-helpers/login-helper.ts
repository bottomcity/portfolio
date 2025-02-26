import {
  invalidEmails,
  validEmails,
  validPhones,
  validPIN
} from '../enums/testing-data-for-inputs';
import { BasePageHelper } from './baseform-helper';
import { submitBtn } from '../enums/btn-names-enums';
import { emailPhoneEmailValidationMessages } from '../enums/validation-enums';
import { registrationPageHelper } from './registration-helper';
import { inputsPlaceholders } from '../enums/body-text-enums';
import { errorToastBarText } from '../enums/toast-bar-enums';
import { getDictionary } from '../common-functions/locale-functions';
import { otpPageHelper } from './OTP-helper';

class LoginPageHelper extends BasePageHelper {
  loginElements = {
    ...this.elements,
    checkBoxRememberMe: () => cy.getByTestId('remember-me-checkbox'),
    termsCheckBox: () => cy.getByTestId('terms-checkbox'),
    forgotPINBtn: () => cy.getByTestId('forgot-pin-btn'),
    registrationBtn: () => cy.getByTestId('register-here-btn'),
    infoSection: () => cy.getByTestId('info-section')
  };

  urlLogin() {
    this.checkUrlText('login');
  }

  invalidEmailChecking() {
    Object.values(invalidEmails).forEach((email) => {
      this.typeEmail(email);
      this.clickContinueBtn(submitBtn.continue);
      this.checkValidationMessage(
        emailPhoneEmailValidationMessages.invalidEmail.slice(0, 6)
      );
    });
  }

  validEmailChecking() {
    validEmails.forEach((email) => {
      this.typeEmail(email);
      this.clickContinueBtn(submitBtn.continue);
      this.validationMessageNotExist();
    });
  }

  validPhonesCheckingLogin() {
    validPhones.forEach((phone) => {
      this.typePhone(phone);
      this.typePIN(validPIN[1]);
      this.clickContinueBtn(submitBtn.sendOTP);
      this.validationMessageNotExist();
      // no toast message for now
      // loginPageHelper.checkToastMessage(errorToastBarText.support);
    });
  }

  loginWithValidPhone(phone: string) {
    cy.get('body').click({ force: true });
    this.typePhone(phone);
    this.typePIN(validPIN[1]);
    // this.typePhone(phone, inputsPlaceholders.enter);
    this.clickTermsCheckbox();
    // this.clickContinueBtn(submitBtn.sendOTP);
    this.elements.submitBtn().click();
    otpPageHelper.validDataOTPInput();
    this.elements.submitBtn().click();
    cy.wait(1000);
    cy.get('body').click({ force: true });
    this.elements.warningPopup().should('not.exist', { timeout: 30000 });
  }

  clickForgotPINBtn() {
    this.loginElements
      .forgotPINBtn()
      // .contains(`Forgot ${inputsPlaceholders.PIN}`)
      .dblclick({ timeout: 5000, waitForAnimations: true, force: true });
  }

  clickTermsCheckbox() {
    this.loginElements.termsCheckBox().click({ timeout: 5000, force: true });
  }

  redirectToRegistration() {
    this.loginElements
      .registrationBtn()
      .contains('Register here')
      .click({ timeout: 5000 });
    registrationPageHelper.urlRegister();
  }

  loginWithValidPIN(indexOfPIN: number) {
    this.typePIN(validPIN[indexOfPIN]);
  }

  checkTranslations(locale: string) {
    cy.log('Checking Login page translations...');
    const login = getDictionary(locale).forms.loginForm;

    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        // login form
        expect(text).contain(login.login);
        expect(text).contain(login.emailOrPhoneInput.title);
        expect(text).contain(login.pinInput.title);
        expect(text).contain(login.forgotPIN);
        // expect(text).contain(login.rememberMe);
        expect(text).contain(login.privacyPolicy);
        expect(text).contain(login.and);
        expect(text).contain(login.responsibleGaming);
        expect(text).contain(login.terms.title);
        expect(text).contain(login.terms.link);
        expect(text).contain(login.sendOTP);
        expect(text).contain(login.registerHere);
        expect(text).contain(login.WellSendCode);
      });

    // issue SOC-1167
    // this.elements
    //   .phoneInput()
    //   .should('have.attr', 'placeholder', login.emailOrPhoneInput.placeholder);

    this.elements
      .pinInput()
      .should('have.attr', 'placeholder', login.pinInput.placeholder);
  }

  checkLocale(locale: string) {
    cy.log('Checking Login page locale...');
    this.checkTranslations(locale);
    cy.checkLinksLocale(locale, cy.get('main'));
  }

  clickGoToMyProfileBtn() {
    this.loginElements
      .infoSection()
      .find('button')
      .click({ waitForAnimations: true });
  }
}

export const loginPageHelper = new LoginPageHelper();
