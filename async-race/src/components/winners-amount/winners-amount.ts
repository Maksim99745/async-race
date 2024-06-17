import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement } from "../../utilits/common";

export class WinnersAmount {
    public draw() {
        const amountBlock = new Component({
            tag: "div",
            className: "winners-amount",
        });
        this.updateWinnersAmount();
        return amountBlock;
    }

    public async updateWinnersAmount() {
        const api = new Api();
        const winnersArr = await api.getAllWinners();
        const winnersAmount = winnersArr.length;
        const amountBlock = document.querySelector(".winners-amount");
        if (isHTMLElement(amountBlock)) {
            amountBlock.textContent = `Winners (${winnersAmount})`;
        }
    }
}
