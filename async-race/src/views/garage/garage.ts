import { CarAmount } from "../../components/car-amount/car-amount";
import { CarBlockController } from "../../components/car-block/car-block-controller";
import { GenerateButton } from "../../components/generate-button/generate-button";
import { InputsBlock } from "../../components/inputs-block/inputs-block";
import { Pagination } from "../../components/pagination/pagination";
import { RaceBlock } from "../../components/race-block/race-restart-block";
import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import {
    isHTMLElement,
    isInstanceOf,
    isNotNullable,
} from "../../utilits/common";

import { generateColor } from "../../utilits/generate-color";
import { generateName } from "../../utilits/generate-name";
import { isLastCarPage } from "../../utilits/isLastCarPage";
import { printPageName } from "../../utilits/print-page-name";
import { CarData } from "../../utilits/types";
export class GaragePage {
    private _parentNode: HTMLElement;

    constructor(parent: HTMLElement) {
        this._parentNode = parent;
    }

    private _carBlocksArr: Array<CarBlockController> = [];

    private _currentPage: number = 1;

    private _carsBlock?: HTMLElement;

    public async draw() {
        const garagePage = new Component({
            tag: "div",
            className: "garage-page",
        });
        const pageName = printPageName("GARAGE");
        garagePage.append(pageName);
        const inputBlock = new InputsBlock(
            this.removeCarBlockFromArr,
            this.getCarBlockArr
        ).draw();
        const generateButton = new GenerateButton().draw();
        generateButton.addListener("click", this.generateButtonListener);
        garagePage.append(generateButton);
        const raceBlockInstance = new RaceBlock(this.getCarBlockArr);
        const raceBlock = raceBlockInstance.draw();
        const carAmountBlock = new CarAmount().draw();
        const pagination = new Pagination();
        const paginationCounter = pagination.drawCounter("pagination-counter");
        garagePage.appendChildren([
            inputBlock,
            raceBlock,
            carAmountBlock,
            paginationCounter,
        ]);
        const garagePageNode = garagePage.getNode();
        this.addCarsBlock(garagePageNode);
        this._parentNode.appendChild(garagePageNode);
        const prevButton = pagination.drawPrevButton();
        prevButton.getNode().classList.add("prev-button");
        prevButton.addListener("click", () =>
            this.prevButtonClickListener(raceBlockInstance)
        );
        const nextButton = await pagination.drawNextButton(7);
        nextButton.addListener("click", () =>
            this.nextButtonClickListener(raceBlockInstance)
        );
        nextButton.getNode().classList.add("next-button");
        pagination.drawPaginationButtonsBlock(garagePage, [
            prevButton,
            nextButton,
        ]);
    }

    private prevButtonClickListener = async (raceBlockInstance: RaceBlock): Promise<void> => {
        this._currentPage -= 1;
        this.cleanCarBlocks();
        this.addCars(this._currentPage, this._carsBlock);
        this.updatePaginatinCounter();
        const prevButton = document.querySelector(".prev-button");
        if (
            this._currentPage === 1 &&
            isInstanceOf(HTMLButtonElement, prevButton)
        ) {
            prevButton.disabled = true;
        }
        const nextButton = document.querySelector(".next-button");
        if (isInstanceOf(HTMLButtonElement, nextButton)) {
            nextButton.disabled = false;
        }
                const isLast = await isLastCarPage(this._currentPage);
                if (isLast) {
                    const nextButton = document.querySelector(".next-button");
                    if (isInstanceOf(HTMLButtonElement, nextButton)) {
                        nextButton.disabled = true;
                    }
                }
        const raceButton = document.querySelector(".race-button");
        if (isInstanceOf(HTMLButtonElement, raceButton)) {
            raceButton.disabled = false;
        }
        raceBlockInstance.cleanWinnerMessageBlock();
    };

    private nextButtonClickListener = async (
        raceBlockInstance: RaceBlock
    ): Promise<void> => {
        this._currentPage += 1;
        this.cleanCarBlocks();
        this.addCars(this._currentPage, this._carsBlock);
        this.updatePaginatinCounter();
        const prevButton = document.querySelector(".prev-button");
        if (isInstanceOf(HTMLButtonElement, prevButton)) {
            prevButton.disabled = false;
        }
        const isLast = await isLastCarPage(this._currentPage);
        if (isLast) {
            const nextButton = document.querySelector(".next-button");
            if (isInstanceOf(HTMLButtonElement, nextButton)) {
                nextButton.disabled = true;
            }
        }
        const raceButton = document.querySelector(".race-button");
        if (isInstanceOf(HTMLButtonElement, raceButton)) {
            raceButton.disabled = false;
        }
        raceBlockInstance.cleanWinnerMessageBlock();
    };

    private generateButtonListener = async () => {
        for (let i = 0; i < 100; i += 1) {
            const name = generateName();
            const color = generateColor();
            await this.generateCarData(name, color);
        }
        const nextButton = document.querySelector(".next-button");
        if (isInstanceOf(HTMLButtonElement, nextButton)) {
            nextButton.disabled = false;
        }
        const updateCarAmount = new CarAmount();
        await updateCarAmount.updateCarAmount();
    };

    private generateCarData = async (name: string, color: string) => {
        const api = new Api();
        await api.createCar(name, color);
        const cars = await api.getAllCars();
        const newCar = cars[cars.length - 1];
        this.addNewCarBlock(newCar);
    };

    private addNewCarBlock(newCar: CarData) {
        const pageCapacity = this._carsBlock?.children.length;
        if (isNotNullable(pageCapacity) && pageCapacity < 7) {
            const carBlockController = new CarBlockController(
                newCar,
                this.removeCarBlockFromArr,
                this.getCarBlockArr
            );
            this._carBlocksArr.push(carBlockController);
            const newCarBlock = carBlockController.draw();
            this._carsBlock?.appendChild(newCarBlock);
        }
    }

    private updatePaginatinCounter() {
        const paginationCounter = document.querySelector(".pagination-counter");
        if (isHTMLElement(paginationCounter)) {
            paginationCounter.textContent = `Page #${this._currentPage}`;
        }
    }

    private cleanCarBlocks() {
        this._carBlocksArr.length = 0;
        while (this._carsBlock?.firstChild) {
            this._carsBlock.removeChild(this._carsBlock.firstChild);
        }
    }

    private async addCarsBlock(parent: HTMLElement) {
        const carsBlock = new Component({
            tag: "div",
            className: "cars-block",
        });
        const carsBlockNode = carsBlock.getNode();
        this._carsBlock = carsBlockNode;
        this?.addCars(this._currentPage, carsBlockNode);
        parent.appendChild(carsBlockNode);
    }

    private addCars = async (page: number, parent?: HTMLElement) => {
        const api = new Api();
        const carsData = await api.getCars(page);
        carsData.forEach((car: CarData) => {
            const carBlockController = new CarBlockController(
                car,
                this.removeCarBlockFromArr,
                this.getCarBlockArr
            );
            const carBlock = carBlockController.draw();
            this._carBlocksArr.push(carBlockController);
            parent?.appendChild(carBlock);
        });
    };

    public removeCarBlockFromArr = (id: number) => {
        this._carBlocksArr = this._carBlocksArr.filter(
            (carBlock) => carBlock._id !== id
        );
    };

    public getCarBlockArr = (): CarBlockController[] => {
        return this._carBlocksArr;
    };
}
