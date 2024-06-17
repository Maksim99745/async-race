import { Component } from "./base-components";

export class CarBlockButton {
    draw(text: string) {
        const button = new Component({
            tag: "div",
            className: "car-block__button",
            text: text,
        });
        return button;
    }
}
