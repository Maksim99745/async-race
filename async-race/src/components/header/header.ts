import { Component } from "../../utilits/base-components";
import { isHTMLElement, isInstanceOf } from "../../utilits/common";
import { WinnersPage } from "../../views/winners/winners";

export class Header {
    private _parentNode: HTMLElement;
    private _winnersPage: WinnersPage;

    constructor(parent: HTMLElement, winnersPage: WinnersPage) {
        this._parentNode = parent;
        this._winnersPage = winnersPage;
    }

    public draw() {
        const header = new Component({ tag: "header" });

        const garageButton = this.drawGarageButton();
        const winnersButton = this.drawWinnersButton();
        winnersButton.addListener("click", () =>
            this.disableManager(winnersButton, garageButton)
        );
        garageButton.addListener("click", () =>
            this.disableManager(garageButton, winnersButton)
        );
        header.appendChildren([garageButton, winnersButton]);
        const headerNode = header.getNode();
        this._parentNode.appendChild(headerNode);
        return headerNode;
    }

    private drawGarageButton() {
        const garageButton = new Component({
            tag: "button",
            className: "garage-button",
            text: "TO GARAGE",
        });
        garageButton.setAttribute("disabled", "");
        garageButton.addListener("click", () => this.goToGarage());
        return garageButton;
    }

    private drawWinnersButton() {
        const winnersButton = new Component({
            tag: "button",
            className: "winners-button",
            text: "TO WINNERS",
        });
        winnersButton.addListener("click", () => this.goToWinners());
        return winnersButton;
    }

    private disableManager(currentButton: Component, nextButton: Component) {
        const currentButtonNode = currentButton.getNode();
        if (isInstanceOf(HTMLButtonElement, currentButtonNode)) {
            currentButtonNode.disabled = true;
        }
        const nextButtonNode = nextButton.getNode();
        if (isInstanceOf(HTMLButtonElement, nextButtonNode)) {
            nextButtonNode.disabled = false;
        }
    }

    private goToGarage = () => {
        const winnersPage = document.querySelector(".winners-page");
        if (isHTMLElement(winnersPage)) {
            winnersPage.style.position = "absolute";
            winnersPage.style.zIndex = "-2";
        }
        const garagePage = document.querySelector(".garage-page");
        if (isHTMLElement(garagePage)) {
            garagePage.style.position = "relative";
            garagePage.style.zIndex = "0";
        }
    };

    private goToWinners = async () => {
        await this._winnersPage.reloadWinnersBlock();
        const garagePage = document.querySelector(".garage-page");
        if (isHTMLElement(garagePage)) {
            garagePage.style.position = "absolute";
            garagePage.style.zIndex = "-2";
        }
        const winnersPage = document.querySelector(".winners-page");
        if (isHTMLElement(winnersPage)) {
            winnersPage.style.zIndex = "0";
        }
    };
}
