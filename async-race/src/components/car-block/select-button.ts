import { CarBlockButton } from "../../utilits/car-block-base-button";
import { isNotNullable } from "../../utilits/common";
import { LoсalStorageManager } from "../../utilits/local-storage-manager";

export class SelectButton extends CarBlockButton {
    private _id;

    constructor(id: number) {
        super();
        this._id = id;
    }

    public drawSelecetButton() {
        const buttonInstance = this.draw("SELECT");
        const buttonNode = buttonInstance.getNode();
        this.selectCar(buttonNode);
        buttonNode.classList.add("select-button");
        return buttonNode;
    }

    private selectCar(button: HTMLElement) {
        button.addEventListener("click", () => {
            const updateInput = document.querySelector(".update-input");
            if (updateInput instanceof HTMLInputElement) {
                updateInput.disabled = false;
                const localStorageManager = new LoсalStorageManager();
                localStorageManager.setUpdatingCar(this._id);
                this.selectCurentBlock(button, "updating-block");
            }
        });
    }

    private selectCurentBlock(button: HTMLElement, className: string) {
        const carBlocks = document.querySelectorAll(".car-block");
        carBlocks.forEach((carBlock) => {
            carBlock.classList.remove(className);
        });
        const currentCarBlock = button.closest(`.car-block`);
        if (isNotNullable(currentCarBlock)) {
            currentCarBlock.classList.add(className);
        }
    }
}
