import { errorPageBodyText } from '../enums/body-text-enums';

class ErrorPagesHelper {
  elements = {
    Btn: () => cy.getByTestId('reload-page-btn'),
    errorBody: () => cy.getByTestId('error-information-body'),
    maintenanceBlock: () => cy.getByTestId('maintenance-block'),
    maintenanceTitle: () => cy.getByTestId('maintenance-title'),
    maintenanceSubtitle: () => cy.getByTestId('maintenance-subtitle'),
    maintenanceIcon: () => cy.getByTestId('maintenance-icon')
  };

  clickReloadPageBtn(nameOfBtn: string) {
    this.elements.Btn().contains(nameOfBtn).click();
  }

  checkTextPageBody(text: string, title: string) {
    this.elements
      .errorBody()
      .next()
      .should('have.text', title)
      .next()
      .should('contain.text', text);
  }

  checkTextMaintenance(text: string, title: string) {
    this.elements
      .maintenanceIcon()
      .next()
      .should('have.text', title)
      .next()
      .should('contain.text', text);
  }

  checkCategoryMaintenance() {}
}

export const errorPagesHelper = new ErrorPagesHelper();
