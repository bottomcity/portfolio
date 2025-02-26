import {
  invalidEmails,
  validEmails,
  validPhones,
  validPIN
} from '../enums/testing-data-for-inputs';
import { BasePageHelper } from './baseform-helper';
import { emailPhoneEmailValidationMessages } from '../enums/validation-enums';
import { loginPageHelper } from './login-helper';
import { scenariosHelper } from '../scenarios-helpers/scenarios-helper';
import { profileInfoPageHelper } from './profile-info-helper';
import { inputsPlaceholders } from '../enums/body-text-enums';
import { submitBtn } from '../enums/btn-names-enums';
import { getDictionary } from '../common-functions/locale-functions';

class RegistrationPageHelper extends BasePageHelper {
  registrationElements = {
    ...this.elements,
    prefixDropdown: () => cy.getByTestId('prefix-dropdown'),
    phoneInput: () => cy.getByTestId('mobile-number-input'),
    emailInput: () => cy.getByTestId('email-input'),
    loginHereBtn: () => cy.getByTestId('have-acc-btn'),
    firstNameInput: () => cy.getByTestId('first-name-input'),
    lastNameInput: () => cy.getByTestId('last-name-input'),
    checkBoxConfirm: () => cy.getByTestId('terms1-checkbox'),
    checkBoxTerms: () => cy.getByTestId('terms2-checkbox'),
    checkboxPep: () => cy.getByTestId('terms3-checkbox'),
    checkboxPepLable: () => cy.getByTestId('pep-text'),
    learnMorePep: () => cy.getByTestId('pep-learn-more')
  };

  urlRegister() {
    this.checkUrlText('register');
  }

  defaultPrefix() {
    this.registrationElements.prefixDropdown().contains('+63');
  }

  clickCheckBoxConfirm() {
    this.registrationElements.checkBoxConfirm().check();
  }

  clickCheckBoxTerms() {
    this.registrationElements.checkBoxTerms().check();
  }

  redirectToLogin() {
    this.registrationElements.loginHereBtn().click({ force: true });
    loginPageHelper.urlLogin();
  }

  regWithValidPIN(indexOfPIN: number) {
    this.typeNewPIN(validPIN[indexOfPIN]);
    this.typeConfirmPIN(validPIN[indexOfPIN]);
  }

  invalidEmailChecking(submitBtnName: string) {
    Object.values(invalidEmails).forEach((email: string) => {
      this.typeEmail(email);
      this.clickContinueBtn(submitBtnName);
      this.checkValidationMessage(
        emailPhoneEmailValidationMessages.invalidEmail
      );
    });
  }

  validEmailChecking(submitBtnName: string) {
    validEmails.forEach((Phone: string) => {
      this.typeEmail(Phone);
      this.clickContinueBtn(submitBtnName);
      this.validationMessageNotContainText('email');
      cy.reload().then(() => {
        cy.url()
          .should('contain', 'login')
          .then((isLoginUrl) => {
            if (isLoginUrl) {
              scenariosHelper.loginByPhone(validPhones[1], 1);
            }
          });
      });
    });
  }

  checkTranslations(locale: string) {
    cy.log('Checking Login page translations...');
    const regForm = getDictionary(locale).forms.registerOrUpdateForm;
    const seoText = getDictionary(locale).heroTextSection;

    cy.get('main')
      .find('div')
      .invoke('text')
      .then((text) => {
        // registration form
        expect(text).contain(regForm.registerAnAccount);
        expect(text).contain(regForm.mobile);
        expect(text).contain(regForm.emailInput.title);
        expect(text).contain(regForm.firstNameInput.title);
        expect(text).contain(regForm.lastNameInput.title);
        expect(text).contain(regForm.dateOfBirthInput.title);
        expect(text).contain(regForm.createNewPasswordInput.title);
        expect(text).contain(regForm.confirmPasswordInput.title);
        // expect(text).contain(regForm.confirm21Years);
        expect(text).contain(regForm.confirmNotPem);
        expect(text).contain(regForm.acceptTerms.title);
        expect(text).contain(regForm.acceptTerms.link);
        expect(text).contain(regForm.privacyPolicy);
        expect(text).contain(regForm.responsibleGaming);
        expect(text).contain(regForm.and);
        expect(text).contain(regForm.register);
        expect(text).contain(regForm.alreadyHaveAnAccount);
        expect(text).contain(regForm.logInHere);
        expect(text).contain(seoText.register.title);
        expect(text).contain(seoText.register.text);
      });

    this.elements
      .emailInput()
      .should('have.attr', 'placeholder', regForm.emailInput.placeholder);

    this.elements
      .newPINInput()
      .should(
        'have.attr',
        'placeholder',
        regForm.createNewPasswordInput.placeholder
      );

    this.elements
      .confirmPINInput()
      .should(
        'have.attr',
        'placeholder',
        regForm.confirmPasswordInput.placeholder
      );

    this.elements
      .firstNameInput()
      .should('have.attr', 'placeholder', regForm.firstNameInput.placeholder);

    this.elements
      .lastNameInput()
      .should('have.attr', 'placeholder', regForm.lastNameInput.placeholder);
  }

  checkLocale(locale: string) {
    cy.log('Checking Login page locale...');
    this.checkTranslations(locale);
    cy.checkLinksLocale(locale, cy.get('main'));
  }

  clickCheckboxPep() {
    this.registrationElements.checkboxPep().check();
  }

  checkPepLearnMorePopup() {
    cy.wait(600);
    this.registrationElements
      .learnMorePep()
      .click({ force: true, multiple: true, waitForAnimations: true });
    profileInfoPageHelper.profileInfoElements
      .editWarningPopUp()
      .should('be.visible')
      .and('contain.text', 'Politically Exposed Person (PEP)');
  }

  checkManualSignupPopup() {
    profileInfoPageHelper.profileInfoElements
      .editWarningPopUp()
      .should('be.visible')
      .and('contain.text', 'Manual signup needed');
    this.elements
      .submitBtn()
      .should('be.visible')
      .then(($submitBtn) => {
        cy.log('submitBtn length ' + $submitBtn.eq(1));
        cy.wrap($submitBtn.eq(1)).should(
          'have.attr',
          'href',
          'https://secure.na2.echosign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhD5_j24BAPD8jKs3ssSumTGSNlk1n6XXVx_O8LAd6Sq54-KZExgLnkUPze1DUGMjvI*%22'
        );
      });
    profileInfoPageHelper.profileInfoElements
      .backToEditBtn()
      .should('be.visible');
  }
}

export const registrationPageHelper = new RegistrationPageHelper();
