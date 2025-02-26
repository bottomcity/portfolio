import { navBarHelper } from '../moduls-helpers/navbar-helper';
import { loginPageHelper } from '../pages-helpers/login-helper';
import { submitBtn } from '../enums/btn-names-enums';
import { otpPageHelper } from '../pages-helpers/OTP-helper';
import { registrationPageHelper } from '../pages-helpers/registration-helper';
import { profileInfoPageHelper } from '../pages-helpers/profile-info-helper';
import { sideBarHelper } from '../moduls-helpers/sidebar-helper';
import { assertionValues } from '../enums/values-for-assertions';
import { formattedBirthdateBasedOnTodayDate } from '../common-functions/generate-today-date';
import { errorPagesHelper } from '../pages-helpers/error-pages-helper';
import {
  errorPageBodyText,
  errorPageBodyTitle
} from '../enums/body-text-enums';

class ScenariosHelper {
  loginByPhone(phoneNumber: string, indexOfPIN: number) {
    // navBarHelper.clickLoginBtn();
    // cy.wait(3000);
    cy.visit('/login', { failOnStatusCode: false });
    loginPageHelper.loginWithValidPhone(phoneNumber);
    cy.visit('/');
    // loginPageHelper.loginWithValidPIN(indexOfPIN);
    // loginPageHelper.clickTermsCheckbox();
    // loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
    // otpPageHelper.verifyOTPBody(phoneNumber);
    // scenariosHelper.enterValidOTP();
    navBarHelper.loggedInNavBarState();
  }

  loginByPhoneAfterReg(
    phone: any,
    indexOfPIN: number,
    inputPlaceholders: string
  ) {
    loginPageHelper.regWithValidPhone(phone);
    loginPageHelper.loginWithValidPIN(indexOfPIN);
    loginPageHelper.clickTermsCheckbox();
    loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
    otpPageHelper.verifyOTPBody(phone);
    scenariosHelper.enterValidOTP();
  }

  registerWithValidData(
    indexOfPIN: number,
    email: string,
    randomName: { firstName: string; lastName: string },
    submitBtnName: string,
    phoneNumber: any
  ) {
    registrationPageHelper.regWithValidPhone(phoneNumber);
    registrationPageHelper.regWithValidEmail(email);
    registrationPageHelper.regWithValidPIN(indexOfPIN);
    registrationPageHelper.regWithRandomNames(randomName);
    registrationPageHelper.typeValidDateOfBirth(
      formattedBirthdateBasedOnTodayDate
    );
    registrationPageHelper.clickCheckboxPep();
    registrationPageHelper.clickCheckBoxTerms();
    registrationPageHelper.clickContinueBtn(submitBtnName);
  }

  registerWithPepCheckboxUnchecked(
    indexOfPIN: number,
    email: string,
    randomName: { firstName: string; lastName: string },
    submitBtnName: string,
    inputPlaceholders: string,
    phoneNumber: any
  ) {
    registrationPageHelper.regWithValidPhone(phoneNumber);
    registrationPageHelper.regWithValidEmail(email);
    registrationPageHelper.regWithValidPIN(indexOfPIN);
    registrationPageHelper.regWithRandomNames(randomName);
    registrationPageHelper.typeValidDateOfBirth(
      formattedBirthdateBasedOnTodayDate
    );
    registrationPageHelper.clickCheckBoxTerms();
    registrationPageHelper.clickContinueBtn(submitBtnName);
  }

  registrationFlow(
    indexOfPIN: number,
    email: string,
    randomName: { firstName: string; lastName: string },
    submitBtnName: string,
    inputPlaceholders: string,
    phoneNumber: any
  ) {
    this.registerWithValidData(
      indexOfPIN,
      email,
      randomName,
      submitBtnName,
      phoneNumber
    );
    otpPageHelper.verifyOTPBody(phoneNumber);
    this.enterValidOTP();
    navBarHelper.loggedInNavBarState();
  }

  enterValidOTP() {
    otpPageHelper.validDataOTPInput();
    otpPageHelper.clickContinueBtn(submitBtn.confirm);
    cy.wait(4000);
  }

  logoutFromAnyPage() {
    navBarHelper.openLangBtn();
    sideBarHelper.openSideBarDropdown();
    sideBarHelper.loggingOut();
    navBarHelper.defaultNavBarState();
  }

  updateProfileInfoWithValidData(
    phone: number,
    indexOfNames: number,
    submitBtnName: string
  ) {
    navBarHelper.loggedInNavBarState();
    sideBarHelper.openSideBarDropdown();
    sideBarHelper.openProfileInfo();
    profileInfoPageHelper.defaultStateProfile(
      phone,
      assertionValues.enabled,
      '.not'
    );
    registrationPageHelper.regWithValidNames(indexOfNames);
    registrationPageHelper.clickContinueBtn(submitBtnName);
  }

  updateProfileInfoWithValidPIN(
    indexOfCurrentPIN: number,
    indexOfNames: number,
    indexOfNewPIN: number,
    expectedMessage: string,
    submitBtnName: string
  ) {
    navBarHelper.loggedInNavBarState();
    profileInfoPageHelper.changeWithValidPIN(
      indexOfCurrentPIN,
      indexOfNewPIN,
      expectedMessage
      // submitBtnName
    );
    registrationPageHelper.regWithValidPIN(indexOfNames);
    registrationPageHelper.clickContinueBtn(submitBtnName);
  }

  maintananceLogin(phoneNumber: string, indexOfPIN: number) {
    navBarHelper.clickLoginBtn();
    loginPageHelper.loginWithValidPhone(phoneNumber);
    loginPageHelper.loginWithValidPIN(indexOfPIN);
    loginPageHelper.clickTermsCheckbox();
    loginPageHelper.clickContinueBtn(submitBtn.sendOTP);
    errorPagesHelper.checkTextMaintenance(
      errorPageBodyText.maintenanceLogin,
      errorPageBodyTitle.maintenanceGeneral
    );
  }

  maintenanceReg(
    indexOfPIN: number,
    email: string,
    indexOfNames: number,
    submitBtnName: string,
    inputPlaceholders: string,
    phone: any
  ) {
    registrationPageHelper.regWithValidPhone(phone);
    registrationPageHelper.regWithValidEmail(email);
    registrationPageHelper.regWithValidPIN(indexOfPIN);
    registrationPageHelper.regWithValidNames(indexOfNames);
    registrationPageHelper.typeValidDateOfBirth(
      formattedBirthdateBasedOnTodayDate
    );
    registrationPageHelper.clickCheckBoxConfirm();
    registrationPageHelper.clickCheckBoxTerms();
    registrationPageHelper.clickContinueBtn(submitBtnName);
    errorPagesHelper.checkTextMaintenance(
      errorPageBodyText.maintenanceLogin,
      errorPageBodyTitle.maintenanceGeneral
    );
  }
  checkMaintenanceToastMessage(url: string, message: string) {
    cy.visit(url);
    registrationPageHelper.checkToastMessage(message);
  }
}

export const scenariosHelper = new ScenariosHelper();
