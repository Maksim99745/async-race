import { Component } from "../../utilits/base-components";

export class RaceButton {
    public draw() {
        const button = new Component({
            tag: "button",
            className: "race-button",
            text: "RACE",
        });
        this.disableButton(button.getNode());
        return button;
    }

    private disableButton(startButton: HTMLElement) {
        startButton.addEventListener("click", async () => {
            if (startButton instanceof HTMLButtonElement) {
                startButton.disabled = true;
            }
        });
    }
}
