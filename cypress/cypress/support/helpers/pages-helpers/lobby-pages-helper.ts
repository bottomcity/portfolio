import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { allOtherPageBtns } from '../enums/btn-names-enums';

export class LobbyPagesHelper {
  elements = {
    loadMoreBtn: (nameOfBtn: string) => {
      return cy.getByTestId(`${nameOfBtn}-load-more-btn`);
    },
    backBtn: () => cy.getByTestId('back-btn'),
    gamesTable: () => cy.getByTestId('games-table')
  };

  clickBackBtn(nameOfBtn: string) {
    this.elements.backBtn().contains(nameOfBtn).click({ timeout: 4000 });
  }

  loadMoreGamesUntilBtnDisappear(
    nameOfBtn: string,
    nameOfCard: string,
    numberOfCardsInLobby: number
  ) {
    const clickLoadMoreBtn = () => {
      gameCardHelper.elements
        .gameCard(nameOfCard)
        .its('length')
        .then((currentCardCount) => {
          if (currentCardCount % numberOfCardsInLobby === 0) {
            this.elements
              .loadMoreBtn(nameOfBtn.toLowerCase())
              .contains(allOtherPageBtns.loadMore)
              .then(($btn) => {
                if ($btn.length > 0) {
                  cy.wrap($btn)
                    .click({
                      timeout: 5000,
                      waitForAnimations: true,
                      force: true
                    })
                    .wait(1000)
                    .then(() => {
                      gameCardHelper.elements
                        .gameCard(nameOfCard)
                        .its('length')
                        .then((newCardCount) => {
                          expect(newCardCount).to.be.greaterThan(
                            currentCardCount
                          );
                          if (newCardCount > currentCardCount) {
                            clickLoadMoreBtn();
                          } else {
                            cy.log('No more game cards are being loaded');
                          }
                        });
                    });
                } else {
                  cy.shouldNotExist(`${nameOfBtn.toLowerCase()}-load-more-btn`);
                }
              });
          } else {
            cy.log(
              `The number of game cards is not a multiple of ${numberOfCardsInLobby}`
            );
          }
        });
    };

    // Initial check to start the process
    gameCardHelper.elements
      .gameCard(nameOfCard)
      .its('length')
      .then((initialCardCount) => {
        if (initialCardCount % numberOfCardsInLobby === 0) {
          clickLoadMoreBtn();
        } else {
          cy.log('Initial number of game cards is not a multiple of 9');
        }
      });
  }

  checkTextGamesTable(nameOfFilterBtn: string, notContain: string) {
    const assertion = notContain ? 'not.contain.text' : 'contain.text';
    this.elements.gamesTable().should(assertion, nameOfFilterBtn);
  }

  sortingApplied(typeOfSort: string) {
    searchBarHelper.elements.sortingDropdown().contains(typeOfSort);
    this.elements.gamesTable().then(($titles) => {
      const gameTitles = [...$titles].map((el) => el.innerText.trim());
      const sortedGameTitles = [...gameTitles].sort((a, b) =>
        a.localeCompare(b)
      );
      expect(gameTitles).to.deep.equal(sortedGameTitles);
    });
  }
}
