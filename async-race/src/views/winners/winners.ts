import { Pagination } from "../../components/pagination/pagination";
import { WinnerBlock } from "../../components/winner-block/winner-block";
import { WinnersAmount } from "../../components/winners-amount/winners-amount";
import { WinnersHeader } from "../../components/winners-header/winners-header";
import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement, isInstanceOf } from "../../utilits/common";
import { printPageName } from "../../utilits/print-page-name";
import { OrderTypes, SortTypes } from "../../utilits/types";

export class WinnersPage {
    private _parentNode: HTMLElement;

    private _currentPage: number = 1;

    constructor(parent: HTMLElement, currentWinnersPage: number) {
        this._parentNode = parent;
        this._currentPage = currentWinnersPage;
    }

    private _winnerItemsBlock?: HTMLElement;

    public async draw() {
        const winnersPage = new Component({
            tag: "div",
            className: "winners-page",
        });
        const winnersPageNode = winnersPage.getNode();
        this._parentNode.appendChild(winnersPageNode);

        const pageName = printPageName("WINNERS");
        const winnersAmountBlock = new WinnersAmount().draw();
        const pagination = new Pagination();
        const paginationCounter = pagination.drawCounter('winners-pagination-counter');
        paginationCounter
            .getNode()
            .classList.add("winners-pagination-couneter");
        winnersPage.appendChildren([
            pageName,
            winnersAmountBlock,
            paginationCounter,
        ]);
        this.addWinnersBlock(winnersPage);
        const prevButton = pagination.drawPrevButton();
        prevButton.getNode().classList.add("winners-prev-button");
        prevButton.addListener("click", this.prevButtonClickListener);
        const nextButton = await pagination.drawNextButton(10);
        nextButton.getNode().classList.add("winners-next-button");
        nextButton.addListener("click", this.nextButtonClickListener);
        pagination.drawPaginationButtonsBlock(winnersPage, [
            prevButton,
            nextButton,
        ]);
    }

    private prevButtonClickListener = (): void => {
      this.cleanSortSettings();
        this._currentPage -= 1;
        this.cleanWinnerItemsBlock();
        if (isHTMLElement(this._winnerItemsBlock)) {
            this.addWinners(this._currentPage, this._winnerItemsBlock);
        }
        this.updatePaginatinCounter();
        const prevButton = document.querySelector(".winners-prev-button");
        if (
            this._currentPage === 1 &&
            isInstanceOf(HTMLButtonElement, prevButton)
        ) {
            prevButton.disabled = true;
        }
        const nextButton = document.querySelector(".winners-next-button");
        if (isInstanceOf(HTMLButtonElement, nextButton)) {
            nextButton.disabled = false;
        }
    };

    public reloadWinnersBlock = async (
        sortType: SortTypes = "id",
        order: OrderTypes = "DESC"
    ) => {
        this.cleanWinnerItemsBlock();
        await new WinnersAmount().updateWinnersAmount();
        if (isHTMLElement(this._winnerItemsBlock)) {
            this.addWinners(
                this._currentPage,
                this._winnerItemsBlock,
                sortType,
                order
            );
        }
        const isLast = await this.isLastCarPage();
        if (isLast) {
            const nextButton = document.querySelector(".winners-next-button");
            if (isInstanceOf(HTMLButtonElement, nextButton)) {
                nextButton.disabled = true;
            }
        }
    };

    private nextButtonClickListener = async (): Promise<void> => {
      this.cleanSortSettings();
        this._currentPage += 1;
        this.cleanWinnerItemsBlock();
        if (isHTMLElement(this._winnerItemsBlock)) {
            this.addWinners(this._currentPage, this._winnerItemsBlock);
        }
        this.updatePaginatinCounter();
        const prevButton = document.querySelector(".winners-prev-button");
        if (
            this._currentPage !== 1 &&
            isInstanceOf(HTMLButtonElement, prevButton)
        ) {
            prevButton.disabled = false;
        }
        const isLast = await this.isLastCarPage();
        if (isLast) {
            const nextButton = document.querySelector(".winners-next-button");
            if (isInstanceOf(HTMLButtonElement, nextButton)) {
                nextButton.disabled = true;
            }
        }
    };

    private addWinnersBlock = async (parent: Component) => {
        const winnersBlock = new Component({
            tag: "div",
            className: "winners-block",
        });
        const winnersHeaderInstance = new WinnersHeader();
        const winnersHeader = winnersHeaderInstance.draw();
        winnersBlock.append(winnersHeader);
        const headerWinsBlock = winnersHeaderInstance.addWinsBlock();
        const headerWinsBlockNode = headerWinsBlock.getNode();
        const headerTimesBlock = winnersHeaderInstance.addTimesBlock();
        const headerTimesBlockNode = headerTimesBlock.getNode();
        const winnerItemsBlock = this.addWinnerItemsBlock();
        winnersHeader.appendChildren([headerWinsBlock, headerTimesBlock]);

        headerTimesBlock.addListener("click", () =>
            this.sortByTimeslistener(headerTimesBlockNode, headerWinsBlockNode)
        );
        headerWinsBlock.addListener("click", () =>
            this.sortByWinnerslistener(
                headerWinsBlockNode,
                headerTimesBlockNode
            )
        );
        winnersBlock.append(winnerItemsBlock);
        parent.append(winnersBlock);
    };

    private sortByWinnerslistener = (
        headerWinsBlock: HTMLElement,
        headerTimesBlock: HTMLElement
    ) => {
        headerTimesBlock.classList.remove("sort-arrow-up");
        headerTimesBlock.classList.remove("sort-arrow-down");
        headerWinsBlock.classList.toggle("wins-desc");
        if (headerWinsBlock.classList.contains("wins-desc")) {
            this.reloadWinnersBlock("wins", "DESC");
            headerWinsBlock.classList.add("sort-arrow-down");
            headerWinsBlock.classList.remove("sort-arrow-up");
        } else {
            this.reloadWinnersBlock("wins", "ASC");
            headerWinsBlock.classList.add("sort-arrow-up");
            headerWinsBlock.classList.remove("sort-arrow-down");
        }
    };

    private sortByTimeslistener = (
        headerTimesBlock: HTMLElement,
        headerWinsBlock: HTMLElement
    ) => {
        headerTimesBlock.classList.toggle("time-desc");
        headerWinsBlock.classList.remove("sort-arrow-up");
        headerWinsBlock.classList.remove("sort-arrow-down");
        if (headerTimesBlock.classList.contains("time-desc")) {
            this.reloadWinnersBlock("time", "DESC");
            headerTimesBlock.classList.add("sort-arrow-down");
            headerTimesBlock.classList.remove("sort-arrow-up");
        } else {
            this.reloadWinnersBlock("time", "ASC");
            headerTimesBlock.classList.add("sort-arrow-up");
            headerTimesBlock.classList.remove("sort-arrow-down");
        }
    };

    private cleanSortSettings() {
      document
          .querySelector(".sort-arrow-up")
          ?.classList.remove("sort-arrow-up");
      document
          .querySelector(".sort-arrow-down")
          ?.classList.remove("sort-arrow-down");
    }

    private addWinnerItemsBlock = () => {
        const winnerItemsBlock = new Component({
            tag: "div",
            className: "winner-items-block",
        });
        const winnerItemsBlockNode = winnerItemsBlock.getNode();
        this._winnerItemsBlock = winnerItemsBlockNode;
        this.addWinners(this._currentPage, winnerItemsBlockNode);
        return winnerItemsBlock;
    };

    public addWinners = async (
        page: number,
        parent?: HTMLElement,
        sortType: SortTypes = "id",
        order: OrderTypes = "ASC"
    ) => {
        const api = new Api();
        const winnersData = await api.getWinners(page, sortType, order);
        for (let index = 0; index < winnersData.length; index++) {
            const car = winnersData[index];
            if (isHTMLElement(parent)) {
                const winnerBlockInstance = new WinnerBlock(car, index);
                const winnerBlock = await winnerBlockInstance.draw();
                const winnerBlockNode = await winnerBlock.getNode();
                parent.appendChild(winnerBlockNode);
            }
        }
    };

    public cleanWinnerItemsBlock() {
        if (isHTMLElement(this._winnerItemsBlock)) {
            while (this._winnerItemsBlock.firstChild) {
                this._winnerItemsBlock.removeChild(
                    this._winnerItemsBlock.firstChild
                );
            }
        }
    }

    private updatePaginatinCounter() {
        const paginationCounter = document.querySelector(
            ".winners-pagination-couneter"
        );
        if (isHTMLElement(paginationCounter)) {
            paginationCounter.textContent = `Page #${this._currentPage}`;
        }
    }

    private async isLastCarPage() {
        const api = new Api();
        const carAmountArr = await api.getAllWinners();
        const carAmount = carAmountArr.length;
        const maxCarsShowed = this._currentPage * 10;
        const carsLeft = carAmount - maxCarsShowed;
        if (carsLeft > 0) {
            return false;
        }
        return true;
    }
}