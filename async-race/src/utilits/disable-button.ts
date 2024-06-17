import { isInstanceOf } from "./common";

export const disableButton = (buttonNode: unknown): buttonNode is HTMLElement => {
    if (isInstanceOf(HTMLButtonElement, buttonNode)) {
        buttonNode.disabled = true;
    }
        return true;
};