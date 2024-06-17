import { Component } from "../../utilits/base-components";

export class WinnersHeader {
    draw() {
        const winnersHeader = new Component({
            tag: "div",
            className: "winners-header",
        });
        const numberBlock = this.addNumberBlock();
        const carBlock = this.addCarBlock();
        const nameBlock = this.addNameBlock();
        winnersHeader.appendChildren([numberBlock, carBlock, nameBlock]);
        return winnersHeader;
    }

    private addNumberBlock() {
        const numberBlock = new Component({
            tag: "div",
            className: "winners-header__item",
            text: "Number",
        });
        return numberBlock;
    }

    private addCarBlock() {
        const carBlock = new Component({
            tag: "div",
            className: "winners-header__item",
            text: "Car",
        });
        return carBlock;
    }

    private addNameBlock() {
        const nameBlock = new Component({
            tag: "div",
            className: "winners-header__item",
            text: "Name",
        });
        return nameBlock;
    }

    public addWinsBlock() {
        const winsBlock = new Component({
            tag: "div",
            className: "winners-header__item",
            text: "Wins",
        });
        return winsBlock;
    }

    public addTimesBlock() {
        const timeBlock = new Component({
            tag: "div",
            className: "winners-header__item",
            text: "Best time (secounds)",
        });
        timeBlock.getNode().classList.add("winners-header__time");
        return timeBlock;
    }
}
