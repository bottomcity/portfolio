import {
  validPIN,
  validNames,
  invalidZIP
} from '../enums/testing-data-for-inputs';
import { BasePageHelper } from './baseform-helper';
import { inputsPlaceholders, profileBodyText } from '../enums/body-text-enums';
import { pinValidationMessages } from '../enums/validation-enums';
import { navBarHelper } from '../moduls-helpers/navbar-helper';
import { sideBarHelper } from '../moduls-helpers/sidebar-helper';
import {
  genderDropdown,
  natureOfWorkDropdown,
  sourceOfFundsDropdown
} from '../enums/dropdowns-data-enums';
import { loginPageHelper } from './login-helper';
import { submitBtn } from '../enums/btn-names-enums';
import { errorToastBarText } from '../enums/toast-bar-enums';
import { getDictionary } from '../common-functions/locale-functions';
import { profile } from 'console';

class ProfileInfoPageHelper extends BasePageHelper {
  profileInfoElements = {
    ...this.elements,
    patronNameInput: () => cy.getByTestId('patron-name'),
    verifyBtn: () => cy.getByTestId('verify-btn'),
    checkBoxPermanentAddress: () =>
      cy.getByTestId('permanent-address-checkbox'),
    birthDateInput: () => cy.getByTestId('birth-date-input'),
    birthPlaceDropdown: () => cy.getByTestId('birth-place-dropdown'),
    natureOfWorkDropdown: () => cy.getByTestId('nature-dropdown'),
    sourceOfFundDropdown: () => cy.getByTestId('source-dropdown'),
    nationalityDropdown: () => cy.getByTestId('nationality-dropdown'),
    genderDropdown: () => cy.getByTestId('gender-dropdown'),
    streetInput: () => cy.getByTestId('street-input'),
    barangayDropdown: () => cy.getByTestId('barangay-dropdown'),
    countryDropdown: () => cy.getByTestId('country-dropdown'),
    cityDropdown: () => cy.getByTestId('city-dropdown'),
    stateDropdown: () => cy.getByTestId('state-dropdown'),
    zipInput: () => cy.getByTestId('zip-input'),
    currentPINInput: () => cy.getByTestId('pin-current-input'),
    permanentStreetInput: () => cy.getByTestId('permanent-street-input'),
    permanentBarangayDropdown: () =>
      cy.getByTestId('permanent-barangay-dropdown'),
    permanentCountryDropdown: () =>
      cy.getByTestId('permanent-country-dropdown'),
    permanentCityDropdown: () => cy.getByTestId('permanent-city-dropdown'),
    permanentStateDropdown: () => cy.getByTestId('permanent-state-dropdown'),
    permanentZIPInput: () => cy.getByTestId('permanent-zip-input'),
    editWarningPopUp: () => cy.getByTestId('edit-warning-pop-up'),
    editWarningPopupBtnsSection: () => cy.getByTestId('btns_block_large'),
    confirmEditBtn: () => cy.getByTestId('submit-btn'),
    backToEditBtn: () => cy.getByTestId('back-to-edit-btn')
  };

  urlProfile() {
    cy.url().should('contain', 'profile');
  }

  editWarningPopUpAppearingAndConfirm() {
    this.profileInfoElements
      .editWarningPopUp()
      .should('be.visible')
      .contains(profileBodyText.warning);
    this.profileInfoElements
      .editWarningPopupBtnsSection()
      .should('be.visible')
      .within(() => {
        this.profileInfoElements.confirmEditBtn().click();
      });
  }

  defaultStateProfile(
    phone: any,
    enabledOrDisabled: string,
    notContain: string
  ) {
    const assertion = notContain ? 'not.contain.html' : 'contain.html';

    this.urlProfile();
    this.defaultPrefix();
    this.elements.emailInput().should(`be.${enabledOrDisabled}`);
    // .invoke('attr', 'value')
    // .should('contain', validEmails[index]);
    // waiting for an API to compare email in input and new email user approach
    this.elements
      .phoneInput()
      .should('be.disabled')
      .invoke('attr', 'value')
      .and('contain', phone);
    this.defaultPrefix();
    this.elements.prefixDropdown().should('contain.html', 'disabled');
    this.profileInfoElements
      .patronNameInput()
      .should('be.disabled')
      .and(($div) => {
        expect($div.attr('value')).not.to.be.empty;
      });
    this.profileInfoElements
      .patronNumberInput()
      .should('be.disabled')
      .and(($div) => {
        expect($div.attr('value')).not.to.be.empty;
      });
    this.elements.firstNameInput().should(`be.${enabledOrDisabled}`);
    this.elements.lastNameInput().should(`be.${enabledOrDisabled}`);
    this.profileInfoElements
      .birthDateInput()
      //.should('contain.html', enabledOrDisabled)
      .and(($div) => {
        expect($div.attr('value')).not.to.be.empty;
      })
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include('DD/MM/YYYY');
      });
    this.profileInfoElements.nationalityDropdown().should(assertion);
    this.profileInfoElements.birthPlaceDropdown().should(assertion);
    this.profileInfoElements.genderDropdown().should(($div) => {
      expect($div.text('value')).not.to.be.empty;
    });
    this.profileInfoElements
      .streetInput()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .barangayDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .countryDropdown()
      .should('not.contain.html', 'disabled')
      .invoke('attr', 'placeholder')
      .contains(inputsPlaceholders.dropdown);
    this.profileInfoElements
      .cityDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .stateDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .zipInput()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .natureOfWorkDropdown()
      .should('contain.html', inputsPlaceholders.dropdown);
    this.profileInfoElements
      .sourceOfFundDropdown()
      .should('contain.html', inputsPlaceholders.dropdown);
    this.profileInfoElements
      .pinInput()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.PIN);
      });
  }

  permanentAddressStateProfile() {
    this.clickCheckBoxPermanentAddress();
    this.profileInfoElements
      .permanentBarangayDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .permanentStreetInput()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .permanentZIPInput()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .permanentStateDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .permanentCityDropdown()
      .should('be.enabled')
      .and('be.empty')
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
    this.profileInfoElements
      .permanentCountryDropdown()
      .should('not.contain.html', 'disabled')
      .invoke('attr', 'placeholder')
      .contains(inputsPlaceholders.dropdown);
  }

  typeBirthPlaceDropdown(inputData: string) {
    this.profileInfoElements.birthPlaceDropdown().type(inputData);
  }

  chooseBirthPlaceDropdown(searchData: string) {
    this.typeBirthPlaceDropdown(searchData);
    this.profileInfoElements
      .birthPlaceDropdown()
      .find('[role="option"]', { timeout: 3000 })
      .first()
      .click({ timeout: 3000 });
  }

  typeNationalityDropdown(inputData: string) {
    this.profileInfoElements.nationalityDropdown().type(inputData);
  }

  chooseNationalityDropdown(searchData: string) {
    this.typeNationalityDropdown(searchData);
    this.profileInfoElements
      .nationalityDropdown()
      .find('[role="option"]')
      .first()
      .click({ timeout: 3000 });
  }

  typeZIP(inputData: string) {
    this.profileInfoElements.zipInput().clear().type(inputData);
  }

  typeStreetInput(inputData: string) {
    this.profileInfoElements.streetInput().clear().type(inputData);
  }

  typeBarangayDropdown(searchData: string) {
    this.profileInfoElements.barangayDropdown().clear().type(searchData);
  }
  typeCountryDropdown(inputData: string) {
    this.profileInfoElements.countryDropdown().type(inputData);
  }
  chooseCountryDropdown(searchData: string) {
    this.typeCountryDropdown(searchData);
    this.profileInfoElements
      .countryDropdown()
      .find('[role="option"]')
      .first()
      .click({ timeout: 3000 });
  }

  typeCityDropdown(inputData: string) {
    this.profileInfoElements.cityDropdown().clear().type(inputData);
  }

  typeStateDropdown(inputData: string) {
    this.profileInfoElements.stateDropdown().clear().type(inputData);
  }

  chooseFemaleGenderDropdown() {
    this.profileInfoElements
      .genderDropdown()
      .click({ timeout: 5000 })
      .find('[role="option"]')
      .then(($gender) => {
        expect($gender).to.have.length(2);
        expect($gender).to.contain(genderDropdown.male);
        expect($gender).to.contain(genderDropdown.female);
      })
      .last()
      .click();
    this.profileInfoElements.genderDropdown().contains(genderDropdown.female);
  }

  chooseMaleGenderDropdown() {
    this.profileInfoElements
      .genderDropdown()
      .click({ timeout: 5000 })
      .find('[role="option"]')
      .then(($gender) => {
        expect($gender).to.have.length(2);
        expect($gender).to.contain(genderDropdown.male);
        expect($gender).to.contain(genderDropdown.female);
      })
      .first()
      .click();
    this.profileInfoElements.genderDropdown().contains(genderDropdown.male);
  }

  chooseNatureOfWorkDropdown() {
    this.profileInfoElements
      .natureOfWorkDropdown()
      .click({ timeout: 5000 })
      .find('[role="option"]')
      .then(($nature) => {
        expect($nature).to.have.length(26);
        expect($nature).to.contain(natureOfWorkDropdown.others);
        expect($nature).to.contain(natureOfWorkDropdown.bpo);
        expect($nature).to.contain(natureOfWorkDropdown.admin);
        expect($nature).to.contain(natureOfWorkDropdown.it);
        expect($nature).to.contain(natureOfWorkDropdown.travel);
      })
      .first()
      .click();
    this.profileInfoElements
      .natureOfWorkDropdown()
      .contains(natureOfWorkDropdown.admin);
  }

  chooseSourceOfFundsDropdown() {
    this.profileInfoElements
      .sourceOfFundDropdown()
      .click()
      .find('[role="option"]')
      .then(($gender) => {
        expect($gender).to.have.length(8);
        expect($gender).to.contain(sourceOfFundsDropdown.employment);
        expect($gender).to.contain(sourceOfFundsDropdown.business);
        expect($gender).to.contain(sourceOfFundsDropdown.investments);
        expect($gender).to.contain(sourceOfFundsDropdown.rentals);
        expect($gender).to.contain(sourceOfFundsDropdown.others);
        expect($gender).to.contain(sourceOfFundsDropdown.sponsors);
        expect($gender).to.contain(sourceOfFundsDropdown.annuities);
      })
      .first()
      .click();
    this.profileInfoElements
      .sourceOfFundDropdown()
      .contains(sourceOfFundsDropdown.employment);
  }

  typePermanentZIP(inputData: string) {
    this.profileInfoElements
      .permanentZIPInput()
      .clear({ force: true })
      .type(inputData);
  }

  typePermanentStreet(inputData: string) {
    this.profileInfoElements
      .permanentStreetInput()
      .clear({ force: true })
      .type(inputData);
  }

  typePermanentBarangayDropdown(inputData: string) {
    this.profileInfoElements
      .permanentBarangayDropdown()
      .clear({ force: true })
      .type(inputData);
  }

  typePermanentCountryDropdown(inputData: string) {
    this.profileInfoElements.permanentCountryDropdown().type(inputData);
  }

  choosePermanentCountryDropdown(searchData: string) {
    this.typePermanentCountryDropdown(searchData);
    this.profileInfoElements
      .permanentCountryDropdown()
      .find('[role="option"]')
      .first()
      .click({ timeout: 3000 });
  }

  typePermanentCityDropdown(inputData: string) {
    this.profileInfoElements
      .permanentCityDropdown()
      .clear({ force: true })
      .type(inputData);
  }

  typePermanentStateDropdown(inputData: string) {
    this.profileInfoElements
      .permanentStateDropdown()
      .clear({ force: true })
      .type(inputData);
  }

  typeCurrentPIN(inputData: string) {
    this.profileInfoElements
      .currentPINInput()
      .clear({ force: true })
      .type(inputData, { force: true });
  }

  clickCheckBoxPermanentAddress() {
    this.profileInfoElements
      .checkBoxPermanentAddress()
      .check({ waitForAnimations: true });
  }

  invalidCurrentPINChecking(
    indexOfCurrentPIN: number,
    indexOfNewPIN: number,
    submitBtnName: string
  ) {
    this.typeCurrentPIN(validPIN[indexOfCurrentPIN]);
    this.typeNewPIN(validPIN[indexOfNewPIN]);
    this.typeConfirmPIN(validPIN[indexOfNewPIN]);
    this.clickContinueBtn(submitBtnName);
    this.checkToastMessage(errorToastBarText.notSecurePIN);
    this.checkToastMessage(inputsPlaceholders.PIN);
  }

  sameNewAndCurrentPIN(indexOfCurrentPIN: number, submitBtnName: string) {
    this.typeCurrentPIN(validPIN[indexOfCurrentPIN]);
    this.typeNewPIN(validPIN[indexOfCurrentPIN]);
    this.typeConfirmPIN(validPIN[indexOfCurrentPIN]);
    this.clickContinueBtn(submitBtnName);
    this.checkValidationMessage(pinValidationMessages.mustBeDifferent);
  }

  validDataAllFields(
    email: string,
    dateOfBirth: string,
    indexOfNames: number,
    indexOfZIP: number,
    indexOfStreet: number,
    indexOfBarangay: number,
    indexOfCountry: number,
    indexOfPIN: number,
    submitBtnName: string,
    permanentAdressCheckboxChecekd?: boolean,
    locale?: string
  ) {
    if (locale === undefined) {
      locale = 'en';
    }

    cy.log(`Locale: ${locale}`);
    let successToastMessage = getDictionary(locale).profile.profileInfoUpdated;
    cy.log(`Message: ${successToastMessage}`);
    this.typeEmail(email);
    this.typeValidDateOfBirth(dateOfBirth);
    this.regWithValidNames(indexOfNames);
    this.chooseBirthPlaceDropdown(validNames[indexOfCountry]);
    this.chooseNationalityDropdown(validNames[indexOfCountry]);
    this.typeZIP(validPIN[indexOfZIP]);
    this.typeStreetInput(validNames[indexOfStreet]);
    this.typeBarangayDropdown(validNames[indexOfBarangay]);
    this.chooseCountryDropdown(validNames[indexOfCountry]);
    this.typeCityDropdown(validNames[indexOfBarangay]);
    this.typeStateDropdown('Camarines norte');
    this.chooseMaleGenderDropdown();
    this.chooseNatureOfWorkDropdown();
    this.chooseSourceOfFundsDropdown();
    if (permanentAdressCheckboxChecekd) {
      cy.log('Permanent address checkbox is checked');
      this.clickCheckBoxPermanentAddress();
      this.typePermanentZIP(validPIN[indexOfZIP]);
      this.typePermanentStreet(validNames[indexOfStreet]);
      this.typePermanentBarangayDropdown(validNames[indexOfBarangay]);
      this.typePermanentStateDropdown('Camarines norte');
      this.typePermanentCityDropdown(validNames[indexOfBarangay]);
      this.choosePermanentCountryDropdown(validNames[indexOfCountry]);
    }
    loginPageHelper.loginWithValidPIN(indexOfPIN);
    this.clickContinueBtn(submitBtnName);
    this.editWarningPopUpAppearingAndConfirm();
    cy.log(`Message: ${successToastMessage}`);
    this.checkToastMessage(successToastMessage);
  }

  stateProfileInfoAfterEditing(
    phone: any,
    email: string,
    dateOfBirth: string,
    enabledOrDisabled: string
  ) {
    this.urlProfile();
    this.defaultPrefix();
    this.elements
      .emailInput()
      .should(`be.${enabledOrDisabled}`)
      .invoke('attr', 'value')
      .should('contain', email.toUpperCase());
    this.elements
      .phoneInput()
      .should('be.disabled')
      .invoke('attr', 'value')
      .and('contain', phone);
    this.defaultPrefix();
    this.elements.prefixDropdown().should('contain.html', 'disabled');
    this.profileInfoElements
      .patronNameInput()
      .should('be.disabled')
      .and(($div) => {
        expect($div.attr('value')).not.to.be.empty;
      });
    this.profileInfoElements
      .patronNumberInput()
      .should('be.disabled')
      .and(($div) => {
        expect($div.attr('value')).not.to.be.empty;
      });
    this.elements.firstNameInput().should('be.disabled');
    this.elements.lastNameInput().should('be.disabled');
    this.profileInfoElements
      .birthDateInput()
      .should('be.disabled')
      .invoke('attr', 'value')
      .and('contain', dateOfBirth);
    this.profileInfoElements
      .nationalityDropdown()
      .should('contain.html', 'disabled')
      .and('contain.text', 'Ph');
    this.profileInfoElements
      .birthPlaceDropdown()
      .should('contain.html', 'disabled')
      .and('contain.text', 'Ph');
    this.profileInfoElements.genderDropdown().should(($div) => {
      expect($div.text('value')).not.to.be.empty;
    });
    this.profileInfoElements.streetInput().should('be.enabled');
    this.profileInfoElements.barangayDropdown().should('be.enabled');
    this.profileInfoElements
      .countryDropdown()
      .should('not.contain.html', 'disabled')
      .and('not.be.empty');
    this.profileInfoElements.cityDropdown().should('be.enabled');
    this.profileInfoElements.stateDropdown().should('be.enabled');
    this.profileInfoElements.zipInput().should('be.enabled');
    this.profileInfoElements
      .natureOfWorkDropdown()
      .should('not.contain.html', 'disabled')
      .and('not.be.empty');
    this.profileInfoElements
      .sourceOfFundDropdown()
      .should('not.contain.html', 'disabled')
      .and('not.be.empty');
    this.profileInfoElements.pinInput().should('be.enabled').and('be.empty');
  }

  redirectToVerify() {
    this.profileInfoElements.verifyBtn().contains('Verify').click();
    // verification URL loginPageHelper.urlLogin();
  }

  changeWithValidPIN(
    indexOfCurrentPIN: number,
    indexOfNewPIN: number,
    // expectedMessage: string,
    submitBtnName: string
  ) {
    this.typeCurrentPIN(validPIN[indexOfCurrentPIN]);
    this.validNewPIN(indexOfNewPIN, submitBtnName);
  }

  invalidZIPChecking(submitBtnName: string, expectedMessage: string) {
    invalidZIP.forEach((ZIP: string) => {
      this.typeZIP(ZIP);
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

  invalidPermanentZIPChecking(submitBtnName: string, expectedMessage: string) {
    invalidZIP.forEach((ZIP: string) => {
      this.typePermanentZIP(ZIP);
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

  patronNumberChecking() {
    this.profileInfoElements
      .patronNumberInput()
      .should(($input) => {
        expect($input).to.have.prop('value').and.not.to.be.empty;
      })
      .invoke('attr', 'value')
      .then((value) => {
        navBarHelper.elements.memberInfo().should('contain', value);
        sideBarHelper.elements.profileMembershipInfo().should('contain', value);
      });
  }

  expandDropdowns(dropdown: Cypress.Chainable<JQuery<HTMLElement>>) {
    dropdown.click({ timeout: 5000 });
    dropdown.find('[role="option"]').should('be.visible');
  }

  collapseDropdowns(dropdown: Cypress.Chainable<JQuery<HTMLElement>>) {
    dropdown.click({ timeout: 5000 });
  }

  checkTranslations(locale: string) {
    cy.log('Checking Profile deposit page translations...');
    const profileInfo = getDictionary(locale).profile.info;
    const profileInfoTab = profileInfo.profileInfoTab;
    const changePINForm = profileInfoTab.changePasswordForm;

    // cy.wait(30000);

    this.elements
      .profileContent()
      .find('h1')
      .click({ force: true })
      .invoke('text')
      .then((text) => {
        expect(text).contain(profileInfo.myProfile);
      });

    this.expandDropdowns(this.profileInfoElements.natureOfWorkDropdown());

    this.profileInfoElements
      .natureOfWorkDropdown()
      .find('[role="option"]')
      .then(($nature) => {
        const optionTexts = $nature
          .map((index, element) => Cypress.$(element).text())
          .get();
        const expectedValues = profileInfoTab.natureOfWork.options.map(
          (option) => option.description
        );

        expect(optionTexts).to.deep.eq(expectedValues);
      });

    this.collapseDropdowns(this.profileInfoElements.natureOfWorkDropdown());

    this.expandDropdowns(this.profileInfoElements.sourceOfFundDropdown());

    this.profileInfoElements
      .sourceOfFundDropdown()
      .find('[role="option"]')
      .then(($source) => {
        const optionTexts = $source
          .map((index, element) => Cypress.$(element).text())
          .get();
        const expectedValues = profileInfoTab.sourceOfFund.options.map(
          (option) => option.description
        );

        expect(optionTexts).to.deep.eq(expectedValues);
      });
    this.collapseDropdowns(this.profileInfoElements.sourceOfFundDropdown());

    this.profileInfoElements.checkBoxPermanentAddress().click();
    this.profileInfoElements.confirmEditBtn().click({ multiple: true });
    this.profileInfoElements.confirmPINInput().click();

    this.profileInfoElements
      .emailInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.emailInput.placeholder
      );

    this.profileInfoElements
      .streetInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.houseStreetInput.placeholder
      );

    this.profileInfoElements
      .barangayDropdown()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.barangayInput.placeholder
      );

    this.profileInfoElements
      .cityDropdown()
      .should('have.attr', 'placeholder', profileInfoTab.cityInput.placeholder);

    this.profileInfoElements
      .stateDropdown()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.stateInput.placeholder
      );

    this.profileInfoElements
      .zipInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.zipCodeInput.placeholder
      );

    this.profileInfoElements
      .currentPINInput()
      .should(
        'have.attr',
        'placeholder',
        changePINForm.currentPasswordInput.placeholder
      );

    this.profileInfoElements
      .newPINInput()
      .should(
        'have.attr',
        'placeholder',
        changePINForm.newPasswordInput.placeholder
      );

    this.profileInfoElements
      .confirmPINInput()
      .should(
        'have.attr',
        'placeholder',
        changePINForm.confirmPasswordInput.placeholder
      );

    this.profileInfoElements
      .permanentStreetInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.houseStreetInput.placeholder
      );

    this.profileInfoElements
      .permanentBarangayDropdown()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.barangayInput.placeholder
      );

    this.profileInfoElements
      .permanentCityDropdown()
      .should('have.attr', 'placeholder', profileInfoTab.cityInput.placeholder);

    this.profileInfoElements
      .permanentStateDropdown()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.stateInput.placeholder
      );

    this.profileInfoElements
      .permanentZIPInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab.zipCodeInput.placeholder
      );

    this.profileInfoElements
      .pinInput()
      .should(
        'have.attr',
        'placeholder',
        profileInfoTab['4digitPIN'].placeholder
      );

    cy.wait(500);

    this.elements
      .profileContent()
      .find('div')
      .invoke('text')
      .then((text) => {
        expect(text).contain(
          profileInfo.accountVerificationTab.accountVerification
        );
        expect(text).contain(profileInfoTab.profileInfo);
        expect(text).contain(profileInfoTab.permanentAddress);
        expect(text).contain(profileInfoTab.currentAddress);
        expect(text).contain(profileInfoTab.patronNumberInput.title);
        expect(text).contain(profileInfoTab.patronNameInput.title);
        expect(text).contain(profileInfoTab.emailInput.title);
        expect(text).contain(profileInfoTab.firstNameInput.title);
        expect(text).contain(profileInfoTab.lastNameInput.title);
        expect(text).contain(profileInfoTab.dateOfBirthInput.title);
        expect(text).contain(profileInfoTab.placeOfBirthInput.title);
        expect(text).contain(profileInfoTab.nationalityInput.title);
        expect(text).contain(profileInfoTab.genderSelect.title);
        expect(text).contain(profileInfoTab.houseStreetInput.title);
        expect(text).contain(profileInfoTab.barangayInput.title);
        expect(text).contain(profileInfoTab.countryInput.title);
        expect(text).contain(profileInfoTab.cityInput.title);
        expect(text).contain(profileInfoTab.stateInput.title);
        expect(text).contain(
          profileInfoTab.myPermanentAddressIsDifferentThanPresentAddress
        );
        expect(text).contain(profileInfoTab.natureOfWork.label);
        expect(text).contain(profileInfoTab.sourceOfFund.label);
        expect(text).contain(profileInfoTab['4digitPIN'].title);
        expect(text).contain(profileInfoTab.update);
        expect(text).contain(profileInfoTab.doneEditingYourProfilePlease);
        expect(text).contain(changePINForm.changeLogin);
        expect(text).contain(changePINForm.currentPasswordInput.title);
        expect(text).contain(changePINForm.newPasswordInput.title);
        expect(text).contain(changePINForm.confirmPasswordInput.title);
        expect(text).contain(changePINForm.change);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking Profile withdraw page locale...');
    this.checkTranslations(locale);
  }
}

export const profileInfoPageHelper = new ProfileInfoPageHelper();
