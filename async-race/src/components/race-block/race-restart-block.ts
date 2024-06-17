import { Component } from "../../utilits/base-components";
import { isHTMLElement, isInstanceOf, isNotNullable } from "../../utilits/common";
import { disableButton } from "../../utilits/disable-button";
import { enableButton } from "../../utilits/enable-button";
import { LoсalStorageManager } from "../../utilits/local-storage-manager";
import { CarBlockController } from "../car-block/car-block-controller";
import { RaceButton } from "./race-button";
import { RestartButton } from "./restart-button";

export class RaceBlock {
    private _getCarBlockArr: () => CarBlockController[];

    constructor(getCarBlockArr: () => CarBlockController[]) {
        this._getCarBlockArr = getCarBlockArr
    }

    private _restartButton?: HTMLButtonElement;
    private _winnnerResultBlock?: HTMLElement;

    public draw() {
        const raceBlock = new Component({
            tag: "div",
            className: "race-block",
        });
        const raceButton = new RaceButton().draw();
        const raceButtonNode = raceButton.getNode();
        raceButtonNode.addEventListener("click", async () => {
          await this.raceButtonListener()
        });
        const restartButton = new RestartButton().draw();
        const restartButtonNode = restartButton.getNode();
        if (restartButtonNode instanceof HTMLButtonElement) {
            this._restartButton = restartButtonNode;
        }
        const winnerBlock = this.drawWinnerBlock();
        restartButtonNode.addEventListener("click", async () => {
            this.restartGame();
            this.cleanWinnerMessageBlock();
        });
        raceBlock.appendChildren([raceButton, restartButton, winnerBlock]);
        return raceBlock;
    }

    private raceButtonListener = async () => {
      const carBlockArr = await this._getCarBlockArr();
                  if (isInstanceOf(HTMLButtonElement, this._restartButton)) {
                      this._restartButton.disabled = true;
                  }
                  const promiseArray = carBlockArr.map( async (carBlock) =>
                      await carBlock.stopCarMovement(carBlock._id, carBlock._car)
                  );
                  Promise.allSettled(promiseArray).then(() => {
                      this.startRace(carBlockArr);
                  });
                  this.disablePagination();
                  setTimeout(() => {
                      if (isNotNullable(this._restartButton)) {
                          this._restartButton.disabled = false;
                      }
                  }, 11000);
                  this.disableToWinners();
    }

    private disablePagination () {
      const nextButton = document.querySelector(".next-button");
      const prevButton = document.querySelector(".prev-button");
      if (isInstanceOf(HTMLButtonElement, nextButton) && isInstanceOf(HTMLButtonElement, prevButton)) {
        const nextButtonState = nextButton.disabled;
        const prevButtonState = prevButton.disabled;
        nextButton.disabled = true;
        prevButton.disabled = true;
        setTimeout(() => {
          nextButton.disabled = nextButtonState;
          prevButton.disabled = prevButtonState;
        }, 11000)
      }
    }

    private disableToWinners(): void {
      const winnersButton = document.querySelector(".winners-button");
      if (isHTMLElement(winnersButton)) {
        disableButton(winnersButton);
        setTimeout(() => enableButton(winnersButton), 11000)
      }
    }

    private async restartGame() {
      const carBlocks = this._getCarBlockArr();
        carBlocks.forEach(async (carBlock) => {
            await carBlock.stopCarMovement(carBlock._id, carBlock._car);
        });

        const storageManager = new LoсalStorageManager();
        storageManager.endRace();
    }

    private async startRace(carBlocks: Array<CarBlockController>) {
        const storageManager = new LoсalStorageManager();
        storageManager.startRace();
        storageManager.removeFinishers();
        carBlocks.forEach(async (carBlock) => {
            if (isNotNullable(carBlock._carSectionNode)) {
                await carBlock.startCarMovement(
                    carBlock._id,
                    carBlock._carSectionNode
                );
            }
        });
    }

    private drawWinnerBlock() {
        const winnerBlock = new Component({
            tag: "div",
            className: "winner-block",
        });
        this._winnnerResultBlock = winnerBlock.getNode();
        return winnerBlock;
    }

    public cleanWinnerMessageBlock() {
      if (this._winnnerResultBlock) {
        if (this._winnnerResultBlock.textContent !== "") {
          this._winnnerResultBlock.innerText = "";
        }
      }
    }
}
