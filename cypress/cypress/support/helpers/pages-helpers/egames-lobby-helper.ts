import { LobbyPagesHelper } from './lobby-pages-helper';
import { backLobbyBtn } from '../enums/btn-names-enums';
import { searchBarHelper } from '../moduls-helpers/search-bar-helper';
import { eGamesHelper } from './egames-helper';
import { gameCardHelper } from '../moduls-helpers/gamecard-helper';
import { urlText } from '../enums/url-enum';

class EgamesLobbyHelper extends LobbyPagesHelper {
  eGamesLobbyElements = {
    ...this.elements
  };

  searchBareGamesLobby() {
    // this.elements.backBtn().contains(backLobbyBtn.eGames);
    eGamesHelper.searchBarEgamesLoggedOut();
    searchBarHelper.elements.sortingDropdown().should('be.visible');
  }

  openeGamesLobbyPageByClickMoreBtn(nameOfSection: string) {
    eGamesHelper.openLobbyPageByClickMoreBtn(nameOfSection.split(' ')[0]);
    // eGamesHelper.elements.loader().click();
    this.searchBareGamesLobby();
    eGamesHelper.urlEgames();
    gameCardHelper.elements.gameCard(urlText.eGames).then(($cards) => {
      if ($cards.length >= 18) {
        this.loadMoreGamesUntilBtnDisappear(urlText.eGames, urlText.eGames, 18);
      }
    });
  }

  clickBackToEgamesBtn() {
    this.clickBackBtn(backLobbyBtn.eGames);
  }
}

export const eGamesLobbyHelper = new EgamesLobbyHelper();
