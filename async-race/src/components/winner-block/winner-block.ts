import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { WinnerData } from "../../utilits/types";
import { Car } from "../car-block/car";

export class WinnerBlock {
    private _winnerData: WinnerData;

    private _currentNumber: number;

    constructor(
        winnerData: WinnerData,
        currentNumber: number
    ) {
        this._winnerData = winnerData;
        this._currentNumber = currentNumber;
    }

    public draw = async () => {
        const winnerBlock = new Component({
            tag: "div",
            className: "winner__block",
        });
        const numberBlock = this.addNumberBlock();
        const carBlock = await this.addCarBlock();
        const nameBlock = await this.addNameBlock();
        const winsBlock = this.addWinsBlock();
        const timeBlock = this.addTimeBlock();
        winnerBlock.appendChildren([
            numberBlock,
            carBlock,
            nameBlock,
            winsBlock,
            timeBlock,
        ]);
        return winnerBlock;
    };

    private addNumberBlock() {
        const numberBlock = new Component({
            tag: "div",
            className: "winner__item",
        });
        numberBlock.getNode().textContent = String(this._currentNumber + 1);
        return numberBlock;
    }

    private addCarBlock = async () => {
        const carBlock = new Component({
            tag: "div",
            className: "winner__item",
        });
        const api = new Api();
        const carData = await api.getCar(this._winnerData.id);
        const carSVG = new Car(carData.color).drawCar();
        carSVG.getNode().style.position = "relative";
        carSVG.getNode().style.left = "0";
        carBlock.append(carSVG);
        return carBlock;
    };

    private addNameBlock = async () => {
        const nameBlock = new Component({
            tag: "div",
            className: "winner__item",
        });
        const api = new Api();
        const carData = await api.getCar(this._winnerData.id);
        nameBlock.getNode().textContent = carData.name;
        return nameBlock;
    };

    private addWinsBlock = () => {
        const winsBlock = new Component({
            tag: "div",
            className: "winner__item",
        });
        winsBlock.getNode().textContent = String(this._winnerData.wins);
        return winsBlock;
    };

    private addTimeBlock = () => {
        const timeBlock = new Component({
            tag: "div",
            className: "winner__item",
        });
        const timeBlockNode = timeBlock.getNode();
        timeBlockNode.textContent = String(this._winnerData.time);
        timeBlockNode.style.width = "32%";
        return timeBlock;
    };
}
