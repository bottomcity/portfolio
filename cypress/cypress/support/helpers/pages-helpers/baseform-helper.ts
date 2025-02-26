import {
  invalidEmails,
  invalidNames,
  invalidPhones,
  invalidPIN,
  validNames,
  validPhones,
  validPIN
} from '../enums/testing-data-for-inputs';
import {
  emailPhoneEmailValidationMessages,
  namesValidationMessages,
  pinValidationMessages
} from '../enums/validation-enums';
import { inputsPlaceholders } from '../enums/body-text-enums';
import { urlText } from '../enums/url-enum';
import { allOtherPageBtns, submitBtn } from '../enums/btn-names-enums';
import { errorToastBarText } from '../enums/toast-bar-enums';
import { getDictionary } from '../common-functions/locale-functions';

export class BasePageHelper {
  elements = {
    cookieNotice: () => cy.getByTestId('cookie-notice'),
    cookieNoticeBtn: () => cy.getByTestId('cookie-btn'),
    smarticoBtn: () => cy.getByTestId('my-solaire-btn'),
    chatWindow: () => cy.getByTestId('drop-container'),
    chatBtn: () => cy.getByTestId('launcher'),
    prefixDropdown: () => cy.getByTestId('prefix-dropdown'),
    prefixDropdownSearch: () => cy.getByTestId('mobile-select'),
    patronNumberInput: () => cy.getByTestId('patron-number'),
    phoneInput: () => cy.getByTestId('mobile-number-input'),
    emailInput: () => cy.getByTestId('email-input'),
    newPINInput: () => cy.getByTestId('pin-new-input'),
    confirmPINInput: () => cy.getByTestId('pin-confirm-input'),
    submitBtn: () => cy.getByTestId('submit-btn'),
    firstNameInput: () => cy.getByTestId('first-name-input'),
    lastNameInput: () => cy.getByTestId('last-name-input'),
    birthDateInput: () => cy.getByTestId('birth-date-input'),
    validationErrorMsg: () => cy.getByTestId('error-msg'),
    loader: () => cy.getByTestId('loader'),
    body: () => cy.getByTestId('body', { timeout: 5000 }),
    toastBar: () => cy.getByTestId('error'),
    pinInput: () => cy.getByTestId('pin-input'),
    profileContent: () => cy.getByTestId('profile-content'),
    warningPopup: () => cy.getByTestId('edit-warning-pop-up'),
    closeWarningPopup: () => cy.getByTestId('close-modal-btn')
  };

  clickSmarticoBtn() {
    this.elements
      .smarticoBtn()
      .click({ timeout: 5000, waitForAnimations: true });
  }

  openSmarticoModal() {
    this.clickSmarticoBtn();
    this.elements.chatWindow().should('be.visible');
  }

  checkUrlText(expectedText: string) {
    cy.url().should('contain', expectedText);
  }

  checkDefaultUrl() {
    cy.url()
      .should('not.contain', urlText.register)
      .and('not.contain', urlText.login)
      .and('not.contain', urlText.liveCasino)
      .and('not.contain', urlText.liveSlots)
      .and('not.contain', urlText.eGames);
  }

  closeCookieNotice() {
    this.elements.cookieNotice().should('be.visible');
    this.elements
      .cookieNoticeBtn()
      .filter(':visible')
      .contains(allOtherPageBtns.cookieBtn)
      .dblclick({ timeout: 5000 });
    this.elements.cookieNotice().should('not.be.visible');
  }

  checkBodyText(expectedText: string) {
    this.elements
      .body()
      .contains(expectedText)
      .should('be.visible', { timeout: 5000 })
      .click({ force: true, timeout: 5000, waitForAnimations: true });
  }

  checkLoaderAppearing() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="loader"]').length > 0) {
        this.elements
          .loader()
          .should('be.visible')
          .click({ force: true, multiple: true });
      }
    });
  }

  openPrefix() {
    this.elements.prefixDropdown().click();
  }

  typePrefix(inputData: string) {
    this.elements.prefixDropdown().click().type(inputData);
  }

  typeEmail(inputData: string) {
    this.elements.emailInput().should('be.enabled').clear({ force: true });
    // .invoke('attr', 'placeholder')
    // .then((placeholder) => {
    //   expect(placeholder).to.include(inputsPlaceholders.enter);
    // });
    this.elements.emailInput().type(inputData, { force: true });
  }

  typePhone(inputData: any) {
    this.elements
      .phoneInput()
      .should('be.enabled', { timeout: 5000 })
      .clear({ force: true });
    // .invoke('attr', 'placeholder')
    // .then((placeholder) => {
    //   if (placeholder !== 'Enter') {
    //     expect(placeholder).to.include(inputPlaceholders); // Assuming the format is consistent
    //   }
    // });

    this.elements.phoneInput().type(inputData, { force: true });
  }

  typePIN(inputData: string) {
    // PIN input used for current PIN
    this.elements.pinInput().clear({ force: true });
    // .invoke('attr', 'placeholder')
    // .then((placeholder) => {
    //   expect(placeholder).to.include(inputsPlaceholders.PIN);
    // });
    this.elements.pinInput().type(inputData, { force: true });
  }

  typeNewPIN(inputData: string) {
    this.elements
      .newPINInput()
      .clear({ force: true })
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.PIN);
      });
    this.elements.newPINInput().type(inputData, { force: true });
  }

  typeConfirmPIN(inputData: string) {
    this.elements
      .confirmPINInput()
      .clear({ force: true })
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.PIN);
      });
    this.elements.confirmPINInput().type(inputData, { force: true });
  }

  typeFirstName(inputData: string) {
    this.elements
      .firstNameInput()
      .clear({ force: true })
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.elements.firstNameInput().type(inputData, { force: true });
  }

  typeLastName(inputData: string) {
    this.elements
      .lastNameInput()
      .clear({ force: true })
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.elements.lastNameInput().type(inputData, { force: true });
  }

  clickContinueBtn(nameOfBtn: string, multipleCondition?: boolean) {
    // btn click
    cy.get('body').click({ force: true, timeout: 45000 });
    this.elements
      .submitBtn()
      .contains(nameOfBtn)
      .should('be.enabled', { timeout: 5000 })
      .click({
        timeout: 45000,
        multiple: multipleCondition,
        force: true,
        waitForAnimations: true
      });
    cy.scrollTo('top');
  }

  defaultPrefix() {
    this.elements.prefixDropdown().contains('+63');
  }

  checkValidationMessage(expectedMessage: string) {
    this.elements
      .validationErrorMsg()
      .should('be.visible', { timeout: 5000 })
      .and('contain.text', expectedMessage, { timeout: 5000 });
  }

  checkToastMessage(expectedMessage: string) {
    this.elements
      .toastBar()
      .should('be.visible', { timeout: 5000 })
      .and('contain.text', expectedMessage);
  }

  validationMessageNotExist() {
    this.elements.validationErrorMsg().should('not.exist');
  }

  validationMessageNotContainText(text: string) {
    this.elements.validationErrorMsg().should('not.contain.text', text);
  }
  regWithValidPhone(phone: any) {
    this.typePhone(phone);
  }

  regWithValidEmail(email: string) {
    this.typeEmail(email);
  }

  typeValidDateOfBirth(dateOfBirth: string) {
    this.elements.birthDateInput().clear().type(dateOfBirth);
  }

  typeInvalidDateOfBirth(invalidBirthDate: string) {
    this.elements.birthDateInput().clear().type(invalidBirthDate);
  }

  regWithValidNames(indexOfNames: number) {
    this.typeFirstName('TEST ' + validNames[indexOfNames]);
    this.typeLastName(validNames[indexOfNames]);
  }

  regWithRandomNames(randomName: { firstName: string; lastName: string }) {
    this.typeFirstName('TEST ' + randomName.firstName);
    this.typeLastName(randomName.lastName);
  }

  invalidPhonesChecking(
    submitBtnName: string,
    validationMessageText: string,
    inputPlaceholders: string
  ) {
    invalidPhones.forEach((Phone: string) => {
      this.typePhone(Phone);
      this.clickContinueBtn(submitBtnName);
      this.checkValidationMessage(validationMessageText);
    });
  }

  checkInvalidPhoneMessage() {
    invalidPhones.forEach((Phone: string) => {
      this.elements.phoneInput().type(Phone);
      this.elements.submitBtn().click();
      this.checkValidationMessage(
        emailPhoneEmailValidationMessages.invalidPhone
      );
    });
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

  invalidConfirmPINChecking(
    indexOfNewPIN: number,
    indexOfWrongNewPIN: number,
    submitBtnName: string
  ) {
    this.typeNewPIN(validPIN[indexOfNewPIN]);
    this.typeConfirmPIN(validPIN[indexOfWrongNewPIN]);
    this.clickContinueBtn(submitBtnName);
    this.checkValidationMessage(pinValidationMessages.mustMatch);
  }

  tooEasyPINChecking() {
    this.checkToastMessage(errorToastBarText.beSecureAnd4DigitsPIN);
  }

  validNewPIN(
    indexOfNewPIN: number,
    // expectedMessage: string,
    submitBtnName: string
  ) {
    this.typeNewPIN(validPIN[indexOfNewPIN]);
    this.typeConfirmPIN(validPIN[indexOfNewPIN]);
    this.clickContinueBtn(submitBtnName);
    this.checkToastMessage(inputsPlaceholders.PIN);
    // this.checkToastMessage(expectedMessage);
  }

  validPhonesCheckingReg(
    submitBtnName: string,
    expectedMessage: string
    // inputPlaceholders: string
  ) {
    validPhones.forEach((phone: string) => {
      this.typePhone(phone);
      this.clickContinueBtn(submitBtnName);
      this.validationMessageNotContainText(expectedMessage);
    });
  }

  invalidPINChecking(submitBtnName: string, expectedMessage: string) {
    invalidPIN.forEach((PIN: string) => {
      this.typePIN(PIN);
      this.clickContinueBtn(submitBtnName);
      this.elements
        .validationErrorMsg()
        .should('be.visible')
        .then(($msg) => {
          // Check for minimum length validation message
          expect($msg).to.contains.text(expectedMessage);
        });
    });
  }

  invalidNewPINChecking(submitBtnName: string, expectedMessage: string) {
    invalidPIN.forEach((PIN: string) => {
      this.typeNewPIN(PIN);
      this.clickContinueBtn(submitBtnName);
      this.elements
        .validationErrorMsg()
        .should('be.visible')
        .then(($msg) => {
          // Check for minimum length validation message
          expect($msg).to.contains.text(expectedMessage);
        });
    });
  }

  invalidNamesChecking(indexOfNames: number, submitBtnName: string) {
    this.typeFirstName(invalidNames[indexOfNames]);
    this.typeLastName(invalidNames[indexOfNames]);
    this.clickContinueBtn(submitBtnName);
    this.checkValidationMessage(namesValidationMessages.mustBeMax128characters);
  }

  invalidBirthDate(
    invalidBirthDate: string,
    submitBtnName: string,
    expectedMessage: string
  ) {
    this.typeInvalidDateOfBirth(invalidBirthDate);
    this.clickContinueBtn(submitBtnName);
    this.checkValidationMessage(expectedMessage);
  }

  searchMobilePrefix(dataForSearch: string) {
    this.openPrefix();
    this.typePrefix(dataForSearch);
    this.elements.prefixDropdownSearch().should('be.visible');
    this.elements.prefixDropdown().then((dropdown) => {
      expect(dropdown).to.include(dataForSearch);
    });
  }

  closeNewWindow() {
    cy.window().then((newWin) => {
      // Close the newly opened window
      newWin.close();
    });
  }

  checkCookieNoticetranslations(locale: string) {
    const policyCookie = getDictionary(locale).cookieNotice;

    // cookie notice
    this.elements
      .cookieNotice()
      .find('div')
      .invoke('text')
      .then((text) => {
        expect(text).contain(policyCookie.title);
        expect(text).contain(policyCookie.content1);
        expect(text).contain(policyCookie.privacyLink);
        expect(text).contain(policyCookie.content2);
        expect(text).contain(policyCookie.cta);
      });
  }

  checkCookieNoticeLocale(locale: string) {
    cy.log('Checking cookie notice...');
    cy.checkLinksLocale(locale, this.elements.cookieNotice());
    this.checkCookieNoticetranslations(locale);
  }

  checkLoaderLocale(locale: string) {
    cy.log('Checking loader locale...');
    const verification = getDictionary(locale).profile.verification;

    this.elements.loader().should('contain', verification.loading);
    this.elements.loader().should('contain', verification.retrieving);
    this.elements.loader().click();
  }

  checkBtnDisabled(nameOfBtn: string) {
    this.elements.submitBtn().contains(nameOfBtn).should('be.disabled');
  }

  closeModalWindow() {
    this.elements.warningPopup().should('be.visible', { timeout: 30000 });
    this.elements.closeWarningPopup().click();
    this.elements.warningPopup().should('not.exist');
  }
}
