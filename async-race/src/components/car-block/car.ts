import { Component } from "../../utilits/base-components";

export class Car {
    private _color;

    constructor(color: string) {
        this._color = color;
    }

    public drawCar(): Component {
        const carСontainer = new Component({
            tag: "div",
            className: "car-container",
        });
        carСontainer.getNode().appendChild(this.createSvg());
        return carСontainer;
    }

    private createSvg() {
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        const use = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "use"
        );
        use.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            "./car.svg#car"
        );
        svg.classList.add("car");
        svg.style.fill = this._color;
        svg.append(use);
        return svg;
    }
}
