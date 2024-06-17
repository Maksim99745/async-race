import { Component } from "../../utilits/base-components";
import { LoсalStorageManager } from "../../utilits/local-storage-manager";

export class StartButton {

    public drawStartButton() {
        const buttonInstance = new Component({
            tag: "button",
            className: "car-block__button",
            text: "A",
        });
        const buttonNode = buttonInstance.getNode();
        this.disableButton(buttonNode);
        buttonNode.classList.add("start-button");

        return buttonInstance;
    }

    private disableButton(startButton: HTMLElement) {
        startButton.addEventListener("click", () => {
            if (startButton instanceof HTMLButtonElement) {
                if (startButton.disabled === false) {
                    const brake = startButton.nextElementSibling;
                    if (brake instanceof HTMLButtonElement) {
                        const storageManager = new LoсalStorageManager();
                        if (!storageManager.isRace()) {
                            brake.disabled = false;
                        }
                        brake.disabled = false;
                        startButton.disabled = true;
                    }
                }
            }
        });
    }
}
