import { bannerBtns, submitBtn } from '../enums/btn-names-enums';
import { registrationPageHelper } from '../pages-helpers/registration-helper';
import { mainPageHelper } from '../pages-helpers/main-page-helper';
import { urlText } from '../enums/url-enum';
import { liveCasinoHelper } from '../pages-helpers/live-casino-helper';
import { liveSlotsHelper } from '../pages-helpers/live-slots-helper';
import { urlNewTab, windowStub } from '../common-functions/window-stub';

class MainBannerHelper {
  elements = {
    playNowBtn: () => cy.getByTestId('play-now-btn'),
    swipeRightBtn: () => cy.getByTestId('main-banner-arrow-next'),
    swipeLeftBtn: () => cy.getByTestId('main-banner-arrow-prev')
  };

  clickSwipeRightBtn() {
    this.elements.swipeRightBtn().click({ timeout: 4000 });
  }

  clickSwipeLeftBtn() {
    this.elements.swipeLeftBtn().click({ timeout: 4000 });
  }

  clickBannerBtn(
    bannerBtnName: string,
    urlText: string,
    target?: string,
    force?: boolean
  ) {
    // Check if the window.open method needs to be stubbed
    if (target === '_blank') {
      // Stub the window.open method before clicking the button
      windowStub();
    }

    // Click the button
    this.elements
      .playNowBtn()
      .contains(bannerBtnName)
      .click({ timeout: 15000, force: force });

    // Check if the URL opens in a new tab based on the target parameter
    urlNewTab(urlText);
  }

  ckeckMainBannerBtnsNotExist() {
    this.elements.swipeRightBtn().should('not.be.exist');
    this.elements.swipeLeftBtn().should('not.be.exist');
  }

  checkMainBannerPlayBtn() {
    this.elements
      .playNowBtn()
      .should('have.attr', 'href', `/${urlText.liveSlots}/${urlText.jinJi50m}`);
  }

  checkMainBannerPlayBtnNotExist() {
    this.elements.playNowBtn().should('not.exist');
  }

  clickBannerRegBtn() {
    this.clickBannerBtn(submitBtn.register, urlText.register, '', true);
    registrationPageHelper.checkBodyText(submitBtn.register);
  }

  clickBannerPlayNowBtnCasino(bannerBtnName: string, urlText: string) {
    this.clickBannerBtn(bannerBtnName, urlText, '', true);
    liveCasinoHelper.loggedOutStateLiveCasino();
  }

  clickBannerPlayNowBtnSlots(
    bannerBtnName: string,
    urlText: string,
    target?: string,
    force?: boolean
  ) {
    this.clickBannerBtn(bannerBtnName, urlText, target, force);
    liveSlotsHelper.loggedOutFavs();
  }

  clickRewardsBtn() {
    this.clickBannerBtn(bannerBtns.rewardsSolaire, urlText.rewards);
    mainPageHelper.closeNewWindow();
    mainPageHelper.checkDefaultUrl();
  }

  clickBookNowBtn() {
    this.clickBannerBtn(bannerBtns.bookNow, urlText.solaireResort, '', true);
    mainPageHelper.checkDefaultUrl();
  }

  swipingCycleMainBanner() {
    const clickSwipeLeftUntilSameNameOfBtn = () => {
      mainBannerHelper.elements.swipeLeftBtn().then(($nameOfBannerBtn) => {
        if ($nameOfBannerBtn.is(bannerBtns.playLive)) {
          mainBannerHelper.clickSwipeLeftBtn();
          mainBannerHelper.elements
            .playNowBtn()
            .should('be.visible')
            .should(($btn) => {
              const buttonText = $btn.text();
              expect(buttonText).to.include(submitBtn.register) ||
                expect(buttonText).to.include(bannerBtns.rewardsSolaire) ||
                expect(buttonText).to.include(bannerBtns.playLive);
            });
          clickSwipeLeftUntilSameNameOfBtn(); // Recursive call for left swipe
        }
      });
    };

    const clickSwipeRightUntilSameNameOfBtn = () => {
      mainBannerHelper.elements.swipeRightBtn().then(($nameOfBannerBtn) => {
        if ($nameOfBannerBtn.is(bannerBtns.playLive)) {
          mainBannerHelper.clickSwipeRightBtn();
          mainBannerHelper.elements
            .playNowBtn()
            .should('be.visible')
            .should(($btn) => {
              const buttonText = $btn.text();
              expect(buttonText).to.include(submitBtn.register) ||
                expect(buttonText).to.include(bannerBtns.rewardsSolaire) ||
                expect(buttonText).to.include(bannerBtns.playLive);
            });
          clickSwipeRightUntilSameNameOfBtn(); // Recursive call for right swipe
        } else {
          clickSwipeLeftUntilSameNameOfBtn(); // Start swiping left once right is disabled
        }
      });
    };
    // Start the swiping cycle with right swipe
    clickSwipeRightUntilSameNameOfBtn();
  }
}

export const mainBannerHelper = new MainBannerHelper();
