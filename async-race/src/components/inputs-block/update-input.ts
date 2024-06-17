import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement, isNotNullable } from "../../utilits/common";
import { LoсalStorageManager } from "../../utilits/local-storage-manager";
import { CarData } from "../../utilits/types";
import { CarBlockController } from "../car-block/car-block-controller";
import { CreateBlock } from "./create-input";

export class UpdateBlock {

    public _removeCarBlockFromArr: (id: number) => void;
    private _getCarBlockArr: () => CarBlockController[];

    constructor(
        removeCarBlockFromArr: (id: number) => void,
        getCarBlockArr: () => CarBlockController[]
    ) {
        this._removeCarBlockFromArr = removeCarBlockFromArr;
        this._getCarBlockArr = getCarBlockArr
    }

    public draw(): Component {
        const updateBlock = new Component({
            tag: "div",
            className: "update-block",
        });
        const createBlockInstance = new CreateBlock(
            this._removeCarBlockFromArr,
            this._getCarBlockArr
        );
        const newInput = createBlockInstance.drawInput("update-input");
        newInput.setAttribute("disabled", "");
        updateBlock.append(newInput);
        const newPalette =
            createBlockInstance.drawPalette("update-color-input");
        updateBlock.append(newPalette);
        updateBlock.append(this.drawUpdateButton());
        return updateBlock;
    }

    private drawUpdateButton() {
        const button = new Component({
            tag: "div",
            className: "update-button",
            text: "UPDATE",
        });
        this.updateCar(button);
        return button;
    }

    public updateCar(button: Component) {
        const buttonNode = button.getNode();
        buttonNode.addEventListener("click", async () => {
            const updateInput = document.querySelector(".update-input");
            const colorInput = document.querySelector(".update-color-input");
            if (
                updateInput instanceof HTMLInputElement &&
                colorInput instanceof HTMLInputElement
            ) {
                const name = updateInput.value;
                const color = colorInput.value;
                if (!updateInput.disabled) {
                    if (name.length >= 1) {
                        const localStorageManager = new LoсalStorageManager();
                        const carId = localStorageManager.getUpdatingCar();
                        const api = new Api();
                        await api.updateCar({
                            name: name,
                            color: color,
                            id: carId,
                        });
                        updateInput.style.outline = "";
                        updateInput.value = "";
                        updateInput.disabled = true;
                        await this.getNewCarBlock(carId);
                    } else {
                        updateInput.style.outline = "1px solid red";
                    }
                }
            }
        });
    }

    public async getNewCarBlock(id: number) {
        const api = new Api();
        const updatedCarData = await api.getCar(id);
        const currentCarBlock = document.querySelector(".updating-block");
        if (isHTMLElement(currentCarBlock)) {
            const carSvg = currentCarBlock.querySelector(".car");
            const name = currentCarBlock.querySelector(".car-block__name");
            if (isNotNullable(carSvg) && isHTMLElement(name)) {
                carSvg.setAttribute("style", `fill: ${updatedCarData.color};`);
                name.textContent = updatedCarData.name;
            }
            currentCarBlock.classList.remove("updating-block");
            this.updateCarInBlocksArr(updatedCarData);
        }
    }

    private updateCarInBlocksArr = (newCar: CarData) => {
      const carBlock = this._getCarBlockArr();
        carBlock.map((carBlock) => {
            if (carBlock._id === newCar.id) {
                carBlock._name = newCar.name;
                carBlock._color = newCar.color;
            }
            return carBlock;
        });
        return carBlock;
    };
}
