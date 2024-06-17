import { CarBlockButton } from "../../utilits/car-block-base-button";

export class RemoveButton extends CarBlockButton {
    drawRemoveButton() {
        const buttonInstance = this.draw("REMOVE");
        const buttonNode = buttonInstance.getNode();
        buttonNode.classList.add("remove-button");
        return buttonNode;
    }
}
