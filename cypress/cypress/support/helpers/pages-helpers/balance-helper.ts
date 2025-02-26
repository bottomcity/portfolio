import { BasePageHelper } from './baseform-helper';
import { depositBtns } from '../enums/btn-names-enums';
import { inputsPlaceholders, profileBodyText } from '../enums/body-text-enums';
import { paymentTitles } from '../enums/values-for-assertions';
import { depositWithdrawValidationMessages } from '../enums/validation-enums';
import { getDictionary } from '../common-functions/locale-functions';
import { enumKeys } from '../common-functions/enum-keys';
import { urlProfile } from '../enums/url-enum';
import {
  sortDropdown,
  jackpotsDropdown,
  transactionshistoryTableFilters,
  transactionshistoryTableTimeframe
} from '../enums/dropdowns-data-enums';
import { Pagination } from 'swiper/modules';

class BalancePageHelper extends BasePageHelper {
  balalnceElements = {
    ...this.elements,
    infoSection: () => cy.getByTestId('info-section'),
    balanceTable: () => cy.getByTestId('balance-table'),
    typeFilters: () =>
      cy.getByTestId('transaction-history-table-types-filters'),
    timeframeFilters: () =>
      cy.getByTestId('transaction-history-table-timeframe-filters'),
    dataRangeBtn: () => cy.getByTestId('date-range-btn'),
    datePicker: () => cy.getByTestId('date-picker'),
    datePickerDropdowns: () => cy.getByTestId('date-picker-dropdown'),
    pagination: () => cy.getByTestId('pagination')
  };

  checkTranslations(locale: string) {
    cy.log('Checking Profile deposit page translations...');
    const balance = getDictionary(locale).profile.balance;
    const types = getDictionary(locale).profile.balance.filter.type;
    const table = getDictionary(locale).profile.balance.table;

    this.elements
      .profileContent()
      .find('h1')
      .invoke('text')
      .then((text) => {
        expect(text).contain(balance.balanceHistory);
      });
    this.elements
      .profileContent()
      .find('h3')
      .then((text) => {
        expect(text).contain(balance.balanceHistoryShowsOnlyOnlineFundsBalance);
      });

    this.elements
      .profileContent()
      .find('div')
      .invoke('text')
      .then((text) => {
        expect(text).contain(types.all);
        expect(text).contain(types.deposit);
        expect(text).contain(types.withdrawal);
        expect(text).contain(types.liveSlots);
        expect(text).contain(types.eGames);
        expect(text).contain(table.pagination.page);
        expect(text).contain(table.pagination.of);
        expect(text).contain(table.columns.time);
        expect(text).contain(table.columns.type);
        expect(text).contain(table.columns.description);
        expect(text).contain(table.columns.amount);
        expect(text).contain(table.columns.balance);
        expect(text).contain(table.columns.status);
        // expect(text).contain(table.noResults);
      });
  }

  checkLocale(locale: string) {
    cy.log('Checking Profile Balance page locale...');
    this.checkTranslations(locale);
  }

  clickTypeFilterButton(filter: string) {
    this.balalnceElements
      .typeFilters()
      .find('a')
      .contains(filter)
      .click({ waitForAnimations: true });
  }

  clickTimeframeFilterButton(filter: string) {
    this.balalnceElements
      .timeframeFilters()
      .find('a')
      .contains(filter)
      .click({ waitForAnimations: true });
  }

  checkTableWithAppliedFilters() {
    const filters = enumKeys(transactionshistoryTableFilters);
    for (const filter of filters) {
      this.clickTypeFilterButton(transactionshistoryTableFilters[filter]);
      this.checkTable();
    }
  }

  checkTypeFilterButton() {
    const types = getDictionary('en').profile.balance.filter.type;

    this.balalnceElements
      .typeFilters()
      .find('a')
      .should(($a) => {
        expect($a).to.have.length(8);
        expect($a.eq(0)).to.have.text(types.all);
        expect($a.eq(0)).to.have.attr('href').contain(`filter=all`);
        expect($a.eq(1)).to.have.text(types.deposit);
        expect($a.eq(1)).to.have.attr('href').contain(`filter=deposit`);
        expect($a.eq(2)).to.have.text(types.withdrawal);
        expect($a.eq(2)).to.have.attr('href').contain(`filter=withdrawal`);
        expect($a.eq(3)).to.have.text(types.allGames);
        expect($a.eq(3)).to.have.attr('href').contain(`filter=allGames`);
        expect($a.eq(4)).to.have.text(types.liveSlots);
        expect($a.eq(4)).to.have.attr('href').contain(`filter=liveSlots`);
        expect($a.eq(5)).to.have.text(types.liveCasino);
        expect($a.eq(5)).to.have.attr('href').contain(`filter=liveCasino`);
        expect($a.eq(6)).to.have.text(types.sportsbook);
        expect($a.eq(6)).to.have.attr('href').contain(`filter=sportsbook`);
        expect($a.eq(7)).to.have.text(types.eGames);
        expect($a.eq(7)).to.have.attr('href').contain(`filter=eGames`);
      });
  }

  checkTimeframeFilterButton() {
    const dates = getDictionary('en').profile.balance.filter.date;
    const datesRange = getDictionary('en').profile.balance.filter.dateRange;

    this.balalnceElements
      .timeframeFilters()
      .find('a')
      .should(($a) => {
        expect($a).to.have.length(3);
        expect($a.eq(0)).to.have.text(dates.all);
        expect($a.eq(0)).to.have.attr('href').contain(`dateRange=all`);
        expect($a.eq(1)).to.have.text(dates.month);
        expect($a.eq(1)).to.have.attr('href').contain(`dateRange=month`);
        expect($a.eq(2)).to.have.text(dates.week);
        expect($a.eq(2)).to.have.attr('href').contain(`dateRange=week`);
      });
    this.balalnceElements.dataRangeBtn().should('be.visible');
    this.balalnceElements.dataRangeBtn().should('have.text', datesRange);
  }

  checkTable() {
    const table = getDictionary('en').profile.balance.table;

    this.balalnceElements
      .balanceTable()
      .find('thead')
      .find('th')
      .should(($th) => {
        expect($th).to.have.length(6);
        // cy.wrap($th)
        //   .eq(0)
        //   .find('button')
        //   .find('div')
        //   .should('contain', table.columns.time);
        // expect($th.eq(0)).to.contain(table.columns.time);
        expect($th.eq(1)).to.contain(table.columns.type);
        expect($th.eq(2)).to.contain(table.columns.description);
        expect($th.eq(3)).to.contain(table.columns.amount);
        expect($th.eq(4)).to.contain(table.columns.balance);
        expect($th.eq(5)).to.contain(table.columns.status);
      });
    this.balalnceElements
      .balanceTable()
      .find('tbody')
      .find('tr')
      .should('be.visible');
  }

  openDatepicker() {
    this.balalnceElements.dataRangeBtn().click();
    this.balalnceElements.datePicker().should('be.visible');
  }

  selectDate(dayStart: string, dayEnd: string, month: string, year: string) {
    this.openDatepicker();
    this.balalnceElements
      .datePickerDropdowns()
      .eq(0)
      .click({ waitForAnimations: true });
    this.balalnceElements
      .datePicker()
      .siblings()
      .eq(0)
      .find('[role="option"]')
      .each((el) => {
        if (el.text() === month) {
          cy.wrap(el).click({ waitForAnimations: true });
        }
      });
    this.balalnceElements
      .datePickerDropdowns()
      .eq(1)
      .click({ waitForAnimations: true });
    this.balalnceElements
      .datePicker()
      .siblings()
      .eq(0)
      .find('[role="option"]')
      .each((el) => {
        if (el.text() === year) {
          cy.wrap(el).click({ waitForAnimations: true });
        }
      });
    this.balalnceElements
      .datePicker()
      .find('[role="gridcell"]')
      .each((el) => {
        if (el.text() === dayStart.toString()) {
          cy.wrap(el).click({ waitForAnimations: true });
        }
        if (el.text() === dayEnd.toString()) {
          cy.wrap(el).click({ waitForAnimations: true });
        }
      });
    cy.url().should(
      'contain',
      `dateRange=${year}-${month}-0${dayStart}%2C${year}-${month}-0${dayEnd}`
    );
  }

  checkTableContent(
    // date format: m-d-yyyy
    rowsNumber: number,
    cellsInRow: number,
    dateTop: string,
    dateBottom: string
  ) {
    this.balalnceElements
      .balanceTable()
      .find('table')
      .find('tbody')
      .find('tr')
      .then((tr) => {
        expect(tr).to.have.length(rowsNumber);
        cy.wrap(tr.first())
          // .should('be.visible')
          .find('td')
          .then((td) => {
            expect(td).to.have.length(cellsInRow);
            expect(td.first()).to.contain(`${dateTop}`);
          });
        cy.wrap(tr.last())
          // .should('be.visible')
          .find('td')
          .then((td) => {
            expect(td).to.have.length(cellsInRow);
            expect(td.first()).to.contain(`${dateBottom}`);
          });
      });
  }

  selectDateRangeInURL(startDate: string, endDate: string) {
    // date format: yyyy-mm-dd
    cy.visit(
      `${urlProfile.profile}/${urlProfile.balance}?dateRange=${startDate}%2C${endDate}`
    );
  }

  clickPaginationButton(btnType: string) {
    switch (btnType) {
      case 'first':
        this.balalnceElements
          .pagination()
          .scrollIntoView()
          .find('button')
          .eq(0)
          .click({ waitForAnimations: true, force: true });
        break;
      case 'prev':
        this.balalnceElements
          .pagination()
          .scrollIntoView()
          .find('button')
          .eq(1)
          .click({ waitForAnimations: true, force: true });
        break;
      case 'next':
        this.balalnceElements
          .pagination()
          .scrollIntoView()
          .find('button')
          .eq(2)
          .click({ waitForAnimations: true, force: true });
        break;
      case 'last':
        this.balalnceElements
          .pagination()
          .scrollIntoView()
          .find('button')
          .eq(3)
          .click({ waitForAnimations: true, force: true });
        break;
    }
  }
}

export const balancePageHelper = new BalancePageHelper();
