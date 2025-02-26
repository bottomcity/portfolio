import { getDictionary } from '../common-functions/locale-functions';

class FAQHelper {
  elements = {
    questionsTable: () => cy.getByTestId('faq-table'),
    // get expand icons for all questions
    questionsExpand: () => this.elements.questionsTable().find('i')
  };

  expandAllQuestions() {
    return this.elements.questionsExpand().click({ multiple: true });
  }

  checkLocale(locale: string) {
    cy.log('Checking FAQ page translations...');
    const faq = getDictionary(locale).faqPage;
    this.expandAllQuestions().then(() => {
      cy.get('main')
        .find('div')
        .invoke('text')
        .then((text) => {
          expect(text).contain(faq.title);
          expect(text).contain(faq.description);
          // expect(text).contain(faq.secondaryText);
          // expect(text).contain(faq.customerSupport);
          // expect(text).contain(faq.backLinkText);
          // expect(text).contain(faq.allTopics);
          expect(text).contain(faq.frequentlyAskedQuestions);
        });
    });
  }
}

export const faqHelper = new FAQHelper();
