import { Api } from "../../utilits/api";
import { Component } from "../../utilits/base-components";
import { isHTMLElement } from "../../utilits/common";
import { disableButton } from "../../utilits/disable-button";
import { enableButton } from "../../utilits/enable-button";
import { LoсalStorageManager } from "../../utilits/local-storage-manager";
import {
    CarData,
    CarEngine,
    FinisherData,
    NewWinnerData,
} from "../../utilits/types";
import { CarAmount } from "../car-amount/car-amount";
import { Car } from "./car";
import { RemoveButton } from "./remove-button";
import { SelectButton } from "./select-button";
import { StartButton } from "./start-button";
import { StopButton } from "./stop-button";

//переименовать класс
export class CarBlockController {
    public _name: string;

    public _color: string;

    public _id: number;

    public _car?: Component;

    public _carSectionNode?: HTMLElement;

    public _parentCarBlock: Component;

    public _removeCarBlockFromArr: (id: number) => void;

    private _getCarBlockArr: () => CarBlockController[];

    constructor(carData: CarData, removeCarBlockFromArr: (id: number) => void, getCarBlockArr: () => CarBlockController[]) {
        this._name = carData.name;
        this._color = carData.color;
        this._id = carData.id;

        this._parentCarBlock = new Component({
            tag: "div",
            className: "car-block",
        });
        this._removeCarBlockFromArr = removeCarBlockFromArr;
        this._getCarBlockArr = getCarBlockArr;
    }

    public draw() {
        const carBlock = this._parentCarBlock;
        const carBlockNode = carBlock.getNode();
        this.addButtonsBlock(carBlock);
        this.addCarSection(carBlock);
        return carBlockNode;
    }

    private addButtonsBlock(parent: Component) {
        const buttonBlock = new Component({
            tag: "div",
            className: "car-block__buttons",
        });
        const buttonBlockNode = buttonBlock.getNode();
        const nameBlock = new Component({
            tag: "div",
            className: "car-block__name",
            text: this._name,
        });
        const selectButton = new SelectButton(this._id).drawSelecetButton();
        const removeButton = new RemoveButton().drawRemoveButton();
        removeButton.addEventListener("click", this.removeButtonClickListener);
        buttonBlockNode.appendChild(selectButton);
        buttonBlockNode.appendChild(removeButton);
        buttonBlockNode.appendChild(nameBlock.getNode());
        parent.append(buttonBlock);
    }

    private addCarSection(parent: Component) {
        const carSection = new Component({
            tag: "div",
            className: "car-section",
        });
        const carSectionNode = carSection.getNode();
        this._carSectionNode = carSectionNode;
        const startButton = new StartButton().drawStartButton();
        const startButtonNode = startButton.getNode();
        startButtonNode.addEventListener("click", () => {
            this.startCarMovement(this._id, carSectionNode);
        });
        const stopButtonInstance = new StopButton();
        const stopButton = stopButtonInstance.drawStopButton();
        const stopButtonNode = stopButton.getNode();
        stopButtonNode.addEventListener("click", () => {
            stopButtonInstance.disableButton(startButtonNode);
            this.stopCarMovement(this._id, this._car);
        });
        carSection.append(startButton);
        carSection.append(stopButton);
        this._car = new Car(this._color).drawCar();
        carSection.append(this._car);
        carSectionNode.appendChild(this.addFlag());
        parent.append(carSection);
    }

    public startCarMovement = async (
        id: number,
        carSectionNode: HTMLElement
    ) => {
        const api = new Api();
        const carEngine = await api.startStopEngine({
            id: id,
            status: "started",
        });
        await this.driveAnimation(carEngine, carSectionNode, this._car);
    };

    private async driveAnimation(
        carEngine: CarEngine,
        trace: HTMLElement,
        car?: Component
    ) {
        try {
            const speed = carEngine.distance / carEngine.velocity / 1000;
            const traceDistance = trace.offsetWidth - 80;
            const carNode = car?.getNode();
            if (isHTMLElement(carNode)) {
                carNode.style.left = `${traceDistance}px`;
                carNode.style.transition = `left ${speed}s linear`;
            }
            const api = new Api();
            const responsePromise = await api.drive(this._id);
            const result = await responsePromise;
            if (result) {
                const data: FinisherData = {
                    finisher: this._id,
                    time: speed.toFixed(2),
                    color: this._color,
                };
                const localStorageManager = new LoсalStorageManager();
                if (localStorageManager.isRace()) {
                    localStorageManager.addFinisher(data);
                    await this.showWinner(data);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (
                    error.message === "API Error: Error: Internal Server Error"
                ) {
                    const carNode = car?.getNode();
                    if (isHTMLElement(carNode)) {
                        const currentLeft = window
                            .getComputedStyle(carNode)
                            .getPropertyValue("left");
                        carNode.style.left = currentLeft;
                        carNode.style.filter = "blur(5px)";
                        carNode.style.transition = `left ${0}s linear`;
                    }
                }
            }
        }
    }

    private isCarEverWon = async () => {
        try {
            const api = new Api();
            await api.getWinner(this._id);
            return true;
        } catch (error) {
            if (error === "Not Found") {
                return false;
            }
        }
    };

    private recordWin = async (carDate: NewWinnerData) => {
        const isCarWon = await this.isCarEverWon();
        const api = new Api();
        if (isCarWon) {
            const winnerOldDate = await api.getWinner(this._id);
            const newWinsNumber = winnerOldDate.wins + 1;
            const oldTime = winnerOldDate.time;
            const newTime = carDate.time;
            if (oldTime > newTime) {
                await api.updateWinner(
                    { wins: newWinsNumber, time: newTime },
                    this._id
                );
            } else {
                await api.updateWinner(
                    { wins: newWinsNumber, time: oldTime },
                    this._id
                );
            }
        } else {
            const newWinner = {
                id: this._id,
                wins: 1,
                time: carDate.time,
            };
            await api.createWinner(newWinner);
        }
    };

    public async stopCarMovement(id: number, car?: Component) {
        const api = new Api();
        await api.startStopEngine({
            id: id,
            status: "stopped",
        });
        const carNode = car?.getNode();
        if (isHTMLElement(carNode)) {
            setTimeout(() => (carNode.style.filter = "blur(0px)"), 1500);
            carNode.style.left = "80px";
            carNode.style.transition = `left 0s linear`;
        }
    }

    private addFlag() {
        const img = new Image();
        img.src = "./red-flag.png";
        img.classList.add("car-block__flag");
        return img;
    }

    private removeButtonClickListener = (): void => {
        this.removeThisBlock();
    };

    private async removeThisBlock() {
        const api = new Api();
        await api.deleteCar(this._id);
        await api.deleteWinner(this._id);
        this._parentCarBlock.destroy();
        this._removeCarBlockFromArr(this._id);
        const updateCarAmount = new CarAmount();
        updateCarAmount.updateCarAmount();
        this.isRacePossible();
    }

    private isRacePossible() {
      const carBlocks = this._getCarBlockArr();
      if (carBlocks.length === 0) {
              const raceButton = document.querySelector(".race-button");
              disableButton(raceButton);
      }
      
    }

    private async showWinner(finisher: FinisherData) {
        const winnerBlock = document.querySelector(".winner-block");
        if (isHTMLElement(winnerBlock)) {
            if (!winnerBlock.textContent) {
                const api = new Api();
                const newWinnerData = {
                    id: this._id,
                    time: Number(finisher.time),
                };
                const winnerData = await api.getCar(finisher.finisher);
                const name = winnerData.name;
                const message = `Winner: ${name} (${finisher.time}s)!`;
                winnerBlock.textContent = message;
                await this.recordWin(newWinnerData);
                this.enableToWinners();
            }
        }
    }

    private enableToWinners(): void {
        const winnersButton = document.querySelector(".winners-button");
        if (isHTMLElement(winnersButton)) {
            enableButton(winnersButton);
        }
    }
}
