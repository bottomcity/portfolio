class ChatHelper {
  elements = {
    iframeOfChat: () => cy.getIframe('#launcher')
  };

  openChatIframe() {
    return this.elements
      .iframeOfChat()
      .should('be.visible')
      .within(() => {
        cy.getByTestId('launcher').click({
          timeout: 5000,
          waitForAnimations: true
        });
        cy.getByTestId('drop-container').should('not.be.empty');
      });
  }

  gameIframeLoaded() {
    return this.elements
      .iframeOfChat()
      .its('0.contentDocument.body')
      .should('not.be.empty');
  }

  findElementInIframe(selector: string, content?: string) {
    this.elements
      .iframeOfChat()
      .its('0.contentDocument.body')
      .find(selector, { timeout: 60000, includeShadowDom: true })
      .should('contain', content)
      .and('be.visible');
  }

  clickElementInIframe(selector: string, text: string) {
    this.elements
      .iframeOfChat()
      .its('0.document.body')
      .find(selector)
      .contains(text)
      .click();
  }
}
export const chatHelper = new ChatHelper();
