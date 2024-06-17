import { Component } from "../../utilits/base-components";

export class GenerateButton {
    draw() {
        const button = new Component({
            tag: "button",
            className: "generate-button",
            text: "GENERATE 100 CARS",
        });
        return button;
    }
}
