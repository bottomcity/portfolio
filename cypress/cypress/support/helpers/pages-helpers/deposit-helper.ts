import { BasePageHelper } from './baseform-helper';
import { depositBtns } from '../enums/btn-names-enums';
import { inputsPlaceholders, profileBodyText } from '../enums/body-text-enums';
import { paymentTitles } from '../enums/values-for-assertions';
import { depositWithdrawValidationMessages } from '../enums/validation-enums';
import { getDictionary } from '../common-functions/locale-functions';

class DepositPageHelper extends BasePageHelper {
  depositElements = {
    ...this.elements,
    partnerCategory: () => cy.getByTestId('partner-category'),
    instapayCategory: () => cy.getByTestId('instapay-category'),
    paygateCategory: () => cy.getByTestId('paygate-category'),
    digitalWalletCategory: () => cy.getByTestId('digital-category'),
    moneyAmountInput: () => cy.getByTestId('amount-input'),
    preseletedAmount5000Btn: () => cy.getByTestId('amount-5000'),
    preseletedAmount10000Btn: () => cy.getByTestId('amount-10000'),
    preseletedAmount25000Btn: () => cy.getByTestId('amount-25000'),
    backBtn: () => cy.getByTestId('back-btn'),
    paymentInfo: () => cy.getByTestId('payment-info'),
    successPayment: () => cy.getByTestId('payment-success'),
    failedPayment: () => cy.getByTestId('payment-failed'),
    amountAndTime: () => cy.getByTestId('amount-time')
  };

  defaultStateDeposit() {
    this.depositElements
      .partnerCategory()
      .find('figure')
      .then(($figures) => {
        expect($figures.eq(0)).to.have.attr('title', paymentTitles.union);
        expect($figures.eq(1)).to.have.attr('title', paymentTitles.BDO);
      });
    this.depositElements
      .instapayCategory()
      .find('figure')
      .then(($figures) => {
        expect($figures.filter(':visible')).to.have.length(9);
        expect($figures.eq(0)).to.have.attr(
          'title',
          paymentTitles.developmentBank
        );
        expect($figures.eq(1)).to.have.attr('title', paymentTitles.BDO);
        expect($figures.eq(2)).to.have.attr('title', paymentTitles.RCBC);
        expect($figures.eq(3)).to.have.attr('title', paymentTitles.landBank);
        expect($figures.eq(4)).to.have.attr(
          'title',
          paymentTitles.philippineIslands
        );
        expect($figures.eq(5)).to.have.attr('title', paymentTitles.metrobank);
        expect($figures.eq(6)).to.have.attr('title', paymentTitles.chinaBank);
        expect($figures.eq(7)).to.have.attr('title', paymentTitles.PNB);
        expect($figures.eq(8)).to.have.attr(
          'title',
          paymentTitles.securityBank
        );
      });
    this.depositElements
      .paygateCategory()
      .find('figure')
      .then(($figures) => {
        expect($figures.filter(':visible')).to.have.length(5);
        expect($figures.eq(0)).to.have.attr('title', paymentTitles.robinsons);
        expect($figures.eq(1)).to.have.attr(
          'title',
          paymentTitles.philippineIslands
        );
        expect($figures.eq(2)).to.have.attr('title', paymentTitles.landBank);
        expect($figures.eq(3)).to.have.attr('title', paymentTitles.PSBank);
        expect($figures.eq(4)).to.have.attr('title', paymentTitles.RCBC);
      });
    this.depositElements
      .digitalWalletCategory()
      .find('figure')
      .then(($figures) => {
        expect($figures.filter(':visible')).to.have.length(2);
        expect($figures.eq(0)).to.have.attr('title', paymentTitles.GCash);
        expect($figures.eq(1)).to.have.attr('title', paymentTitles.Maya);
      });
    this.depositElements
      .moneyAmountInput()
      .invoke('attr', 'placeholder')
      .then((placeholder) => {
        expect(placeholder).to.include(inputsPlaceholders.enter);
      });
  }

  clickPreselectedAmount5000Btn() {
    this.depositElements
      .preseletedAmount5000Btn()
      .contains(depositBtns.amount5000)
      .click({ timeout: 5000 });
    this.checkDataMoneyAmountInput(depositBtns.amount5000);
  }

  clickPreselectedAmount10000Btn() {
    this.depositElements
      .preseletedAmount10000Btn()
      .contains(depositBtns.amount10000)
      .click({ timeout: 5000 });
    this.checkDataMoneyAmountInput(depositBtns.amount10000);
  }

  clickPreselectedAmount25000Btn() {
    this.depositElements
      .preseletedAmount25000Btn()
      .contains(depositBtns.amount25000)
      .click({ timeout: 5000 });
    this.checkDataMoneyAmountInput(depositBtns.amount25000);
  }

  checkDataMoneyAmountInput(amount: string) {
    this.depositElements
      .moneyAmountInput()
      .invoke('attr', 'value')
      .and('contain', amount);
  }

  inputMoneyAmount(amount: string) {
    this.depositElements.moneyAmountInput().clear().type(amount);
  }

  invalidAmount() {
    this.inputMoneyAmount('0');
    this.checkValidationMessage(
      depositWithdrawValidationMessages.incorrectAmount
    );
  }

  chooseFirstPaymentMethod() {
    this.depositElements.instapayCategory().find('figure').first().click();
  }

  clickBackBtn() {
    this.depositElements
      .backBtn()
      .contains(depositBtns.back)
      .click({ timeout: 5000, waitForAnimations: true });
  }

  verifyPaymentInfo(amount: string, phoneNumber: string) {
    this.depositElements.paymentInfo().then(($paymentInfo) => {
      expect($paymentInfo).to.contain.text(amount);
      expect($paymentInfo).to.contain.text(phoneNumber);
    });
  }

  successStep3() {
    this.depositElements.successPayment().should('be.visible');
    this.depositElements
      .successPayment()
      .should('contain.text', profileBodyText.created);
  }

  failedStep3() {
    this.depositElements.failedPayment().should('be.visible');
    this.depositElements
      .failedPayment()
      .should('contain.text', profileBodyText.failed);
  }

  checkTranslations(locale: string) {
    cy.log('Checking Profile deposit page translations...');
    const profileDeposit = getDictionary(locale).profile.withdrawAndDeposit;
    const depositForm = profileDeposit.depositForm;
    const verification = getDictionary(locale).profile.verification;

    this.depositElements
      .paygateCategory()
      .click({ force: true, waitForAnimations: true, timeout: 5000 })
      .find('figure', { timeout: 10000 })
      .should('be.visible')
      .then((fig) => {
        cy.wrap(fig[0]).click({
          waitForAnimations: true,
          timeout: 5000,
          force: true
        });
        this.depositElements
          .amountAndTime()
          .find('div')
          .invoke('text')
          .then((text) => {
            expect(text).contain(depositForm.methodForm.time);
            expect(text).contain(depositForm.methodForm.payGateTime);
          });
      });

    this.depositElements
      .instapayCategory()
      .find('figure')
      .then((fig) => {
        cy.wrap(fig[0]).click({
          waitForAnimations: true,
          timeout: 5000,
          force: true
        });
        this.depositElements
          .amountAndTime()
          .find('div')
          .invoke('text')
          .then((text) => {
            expect(text).contain(depositForm.methodForm.time);
            expect(text).contain(depositForm.methodForm.instant);
          });
      });

    this.elements.toastBar().then((text) => {
      expect(text).contain(profileDeposit.warning);
    });

    this.elements
      .profileContent()
      .find('h1')
      .invoke('text')
      .then((text) => {
        expect(text).contain(profileDeposit.deposit);
      });
    this.depositElements
      .profileContent()
      .find('div')
      .invoke('text')
      .then((text) => {
        // expect(text).contain(profileDeposit.deposit);
        expect(text).contain(profileDeposit.hereYouCanAddFundsToYourBalance);
        expect(text).contain(depositForm.methodForm.selectMethod);
        expect(text).contain(
          depositForm.methodForm
            .pleaseSelectFromTheFollowingSecurePaymentMethods
        );
        // expect(text).contain(depositForm.methodForm.banks);
        // expect(text).contain(depositForm.methodForm.min);
        expect(text).contain(depositForm.methodForm.max);
        expect(text).contain(depositForm.methodForm.time);
        // expect(text).contain(depositForm.methodForm.instant);
        // expect(text).contain(depositForm.methodForm.payGateTime);
        expect(text).contain(depositForm.methodForm.digitalWallets);
        // expect(text).contain(depositForm.methodForm.creditCards);
        expect(text).contain(depositForm.methodForm.preferredBankInstant);
        expect(text).contain(depositForm.methodForm.preferredBankPaygate);
        expect(text).contain(depositForm.methodForm.partners);
        // expect(text).contain(depositForm.methodForm.preferred);
        expect(text).contain(depositForm.amountForm.chooseAmount);
        expect(text).contain(depositForm.amountForm.amountInput.title);
        expect(text).contain(depositForm.amountForm.commision);
        expect(text).contain(depositForm.amountForm.max);
        expect(text).contain(depositForm.continue);
      });

    this.depositElements
      .moneyAmountInput()
      .should(
        'have.attr',
        'placeholder',
        depositForm.amountForm.amountInput.placeholder
      );
  }
  checkLocale(locale: string) {
    cy.log('Checking Profile Info page locale...');
    this.checkTranslations(locale);
    // cy.checkLinksLocale(locale, this.elements.profileContent());
  }
}

export const depositPageHelper = new DepositPageHelper();
