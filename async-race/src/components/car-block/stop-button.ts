import { Component } from "../../utilits/base-components";

export class StopButton {
    drawStopButton() {
        const buttonInstance = new Component({
            tag: "button",
            className: "car-block__button",
            text: "B",
        });
        const buttonNode = buttonInstance.getNode();
        buttonNode.setAttribute("disabled", "");
        buttonNode.classList.add("stop-button");
        this.disableButton(buttonNode);
        return buttonInstance;
    }

    public disableButton(stopButton: HTMLElement) {
        stopButton.addEventListener("click", () => {
            if (stopButton instanceof HTMLButtonElement) {
                const start = stopButton.previousElementSibling;
                if (start instanceof HTMLButtonElement) {
                    start.disabled = false;
                    stopButton.disabled = true;
                }
            }
        });
    }
}
