import { invalidEmails, validPIN } from '../enums/testing-data-for-inputs';
import { BasePageHelper } from './baseform-helper';
import {
  inputsPlaceholders,
  regLoginFlowsBodyText
} from '../enums/body-text-enums';
import { allOtherPageBtns, submitBtn } from '../enums/btn-names-enums';
import { errorToastBarText } from '../enums/toast-bar-enums';

class OTPPageHelper extends BasePageHelper {
  otpElements = {
    ...this.elements,
    otpInput: () => cy.getByTestId('otp-input'),
    resendBtn: () => cy.getByTestId('resend-btn'),
    counter: () => cy.getByTestId('counter')
  };

  verifyOTPBody(inputData: string) {
    this.checkBodyText(regLoginFlowsBodyText.otpBody);
    if (inputData.includes('@')) {
      this.elements.body().contains(inputData.slice(0, 3));
    } else {
      this.elements.body().contains(inputData.slice(-3));
    }
    //otpPageHelper.otpElements.counter().should('exist').and('be.visible');
    this.elements
      .submitBtn()
      .should('contain.text', submitBtn.confirm)
      .and('be.disabled');
    this.otpElements
      .resendBtn()
      .should('contain.text', allOtherPageBtns.resend)
      .and('be.disabled');
  }

  clickResendBtn() {
    cy.wait(120000);
    this.otpElements.resendBtn().contains('Resend code').click();
    this.otpElements.counter().should('exist').and('be.visible');
  }

  invalidDataOTPInput() {
    this.otpElements.otpInput().type(invalidEmails[0]);
  }

  validDataOTPInput() {
    this.otpElements
      .otpInput()
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
        expect(placeholder).to.include(inputsPlaceholders.OTP);
      });
    this.otpElements.otpInput().type(validPIN[0], { force: true });
  }

  incorrectOTPInput() {
    this.otpElements.otpInput().type(validPIN[2]);
    this.clickContinueBtn(submitBtn.confirm);
    this.checkToastMessage(inputsPlaceholders.OTP);
    this.checkToastMessage(errorToastBarText.incorrect);
  }
}

export const otpPageHelper = new OTPPageHelper();
