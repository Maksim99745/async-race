import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement } from "../../utilits/common";

export class CarAmount {
    public draw() {
        const amountBlock = new Component({
            tag: "div",
            className: "cars-amount",
        });
        this.updateCarAmount();
        return amountBlock;
    }

    public async updateCarAmount() {
        const api = new Api();
        const carsArr = await api.getAllCars();
        const carsAmount = carsArr.length;
        const amountBlock = document.querySelector(".cars-amount");
        if (isHTMLElement(amountBlock)) {
            amountBlock.textContent = `Garage (${carsAmount})`;
        }
    }
}
