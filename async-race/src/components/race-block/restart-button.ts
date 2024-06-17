import { Component } from "../../utilits/base-components";

export class RestartButton {
    public draw() {
        const button = new Component({
            tag: "button",
            className: "restart-button",
            text: "RESTART",
        });
        this.restart(button.getNode());
        return button;
    }

    private restart(restartButton: HTMLElement) {
        restartButton.addEventListener("click", () => {
            const raceButton = document.querySelector(".race-button");
            if (raceButton instanceof HTMLButtonElement) {
                raceButton.disabled = false;
            }
            if (restartButton instanceof HTMLButtonElement) {
                restartButton.disabled = true;
            }
        });
    }
}
