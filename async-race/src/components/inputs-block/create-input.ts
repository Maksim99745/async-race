import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement } from "../../utilits/common";
import { enableButton } from "../../utilits/enable-button";
import { CarData } from "../../utilits/types";
import { CarAmount } from "../car-amount/car-amount";
import { CarBlockController } from "../car-block/car-block-controller";

export class CreateBlock {
    public _removeCarBlockFromArr: (id: number) => void;
    private _getCarBlockArr: () => CarBlockController[];

    constructor(
        removeCarBlockFromArr: (id: number) => void,
        getCarBlockArr: () => CarBlockController[]
    ) {
        this._removeCarBlockFromArr = removeCarBlockFromArr;
        this._getCarBlockArr = getCarBlockArr;
    }

    public draw(): Component {
        const createBlock = new Component({
            tag: "div",
            className: "create-block",
        });
        createBlock.append(this.drawInput("create-input"));
        createBlock.append(this.drawPalette("create-color-input"));
        createBlock.append(this.drawCreateButton());
        return createBlock;
    }

    public drawInput(className: string) {
        const createInput = new Component({
            tag: "input",
            className: className,
        });
        createInput.setAttribute("type", "text");
        createInput.setAttribute("required", "");
        createInput.setAttribute("minlength", "1");
        createInput.setAttribute("maxlength", "20");
        return createInput;
    }

    public drawPalette(className: string) {
        const colorInput = new Component({
            tag: "input",
            className: className,
        });
        colorInput.setAttribute("type", "color");
        colorInput.setAttribute("value", "#ffffff");
        return colorInput;
    }

    private drawCreateButton() {
        const button = new Component({
            tag: "div",
            className: "create-button",
            text: "CREATE",
        });
        this.createCar(button);
        return button;
    }

    private createCar(button: Component) {
        const buttonNode = button.getNode();
        buttonNode.addEventListener("click", async () => {
            const createInput = document.querySelector(".create-input");
            const colorInput = document.querySelector(".create-color-input");
            if (
                createInput instanceof HTMLInputElement &&
                colorInput instanceof HTMLInputElement
            ) {
                const name = createInput.value;
                const color = colorInput.value;
                if (name.length >= 1) {
                    const api = new Api();
                    await api.createCar(name, color);
                    const updateCarAmount = new CarAmount();
                    await updateCarAmount.updateCarAmount();
                    const cars = await api.getAllCars();
                    const newCar = cars[cars.length - 1];
                    this.addNewCarBlock(newCar);
                    createInput.style.outline = "";
                    createInput.value = "";
                } else {
                    createInput.style.outline = "1px solid red";
                }
            }
        });
    }

    private async addNewCarBlock(newCar: CarData) {
        const carsBlock = document.querySelector(".cars-block");
        if (isHTMLElement(carsBlock)) {
            const pageCapacity = carsBlock.children.length;
            if (pageCapacity < 7) {
                const carBlockController = new CarBlockController(
                    newCar,
                    this._removeCarBlockFromArr,
                    this._getCarBlockArr
                );
                const carBlockArr = this._getCarBlockArr();
                carBlockArr.push(carBlockController);
                const newCarBlock = carBlockController.draw();
                carsBlock.appendChild(newCarBlock);
            } else {
                this.nextPaginationButtonManager();
            }
        }
    }
    private nextPaginationButtonManager = async () => {
        const nextButton = document.querySelector(".next-button");
        enableButton(nextButton);
    };
}
